import fs from 'fs';
import ai from "../config/gemini.js";
import { db } from '../config/firebaseAdmin.js';
import { sessions } from '../Socket/sessionManager.js';

export const generateSummary = async (req, res) => {
    try {
        const { lastAnswer, interviewId } = req.body;

        // Clean up the session from the Map and close ElevenLabs STT
        const session = sessions.get(interviewId);
        if (session) {
            if (session.deepgramSTT) {
                try {
                    session.deepgramSTT.close();
                } catch (e) {
                    console.error("Error closing Deepgram STT in finalizeSummary:", e);
                }
            }

            sessions.delete(interviewId);
        }

        const docRef = await db.collection('interviews').doc(interviewId).get();
        const interview = docRef.data();

        const conversation = interview.conversation;

        conversation[conversation.length - 1].candidateAnswer = lastAnswer;

        await db.collection('interviews').doc(interviewId).update({
            conversation
        });

        const projectId = interview.projectId;

        const projectDoc = await db.collection('projects').doc(projectId).get();

        const project = projectDoc.data();

        const step1prompt = `
        You are an experienced ${project.judgeType} judge.

        Your task is NOT to evaluate the candidate.

        Your only goal is to deeply understand the submitted project so future interview answers can be evaluated accurately.

        ## Here is project information:

        Title: ${project.Title}
        Problem Statement: ${project.ProblemStatement}
        Description: ${project.Description}
        Features: ${project.Feature}
        Tech Stack: ${project.TechStack}
        And a project document (pdf or ppt format) .Analyze that too to understand the project.

        Analyze the project and identify:

        1. The problem the project solves.
        2. The intended users.
        3. The core solution.
        4. The project's unique or innovative aspects.
        5. The expected technical implementation.
        6. The key evaluation criteria that should be used when judging this project.

        Produce a concise summary that captures all of the above. The summary will be used as context for evaluating the interview in later stages.
        `

        let fileUri = project.fileUri || null;
        if (project.DeckUrl && !fileUri) {
            const fileResponse = await fetch(project.DeckUrl);
            const buffer = await fileResponse.arrayBuffer();

            fs.writeFileSync("temp.pdf", Buffer.from(buffer));

            //Upload file to gemini
            const uploadedFile = await ai.files.upload({
                file: "temp.pdf",
                config: {
                    mimeType: "application/pdf",
                },
            });

            fileUri = uploadedFile.uri;

            await db.collection('projects').doc(projectId).update({
                fileUri: uploadedFile.uri
            });
        }

        const contents = [
            {
                text: step1prompt,
            }
        ];

        if (fileUri) {
            contents.push({
                fileData: {
                    fileUri: fileUri,
                    mimeType: "application/pdf",
                },
            });
        }

        const step1result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        summary: { type: "STRING" },
                    },
                    required: ["summary"]
                }
            },
        });

        const response1 = JSON.parse(step1result.text)
        console.log("Summary in backend: ", response1);

        const step2Prompt = `
            You are an experienced ${project.judgeType} judge.

            Your task is to evaluate each interview question independently.

            You will receive:
            - A summary of the submitted project.
            - The complete interview conversation.

            Project Summary:
            ${response1.summary}

            Interview Conversation:
            ${JSON.stringify(conversation, null, 2)}

            For each question-answer pair:

            - Understand the intent of the judge's question.
            - Evaluate the candidate's answer in the context of the project.
            - Assign a fair score out of 10.
            - Do not penalize the candidate for information that was never requested.
            - Do not invent facts that the candidate did not mention.
            - Provide constructive, specific, and actionable feedback that explains the score.
            - Generate a concise model answer (2–5 sentences) that demonstrates how an excellent hackathon participant would answer the same question for this specific project.
            - Evaluate each question independently without considering scores from other questions.
        `

        const step2result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: step2Prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        questions: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    questionNumber: { type: "INTEGER" },
                                    question: { type: "STRING" },
                                    score: { type: "INTEGER" },
                                    feedback: { type: "STRING" },
                                    modelAnswer: { type: "STRING" }
                                },
                                required: ["questionNumber", "question", "score", "feedback", "modelAnswer"]
                            }
                        }
                    },
                    required: ["questions"]
                }
            },
        });

        const response2 = JSON.parse(step2result.text)
        console.log("response 2: ", response2);

        const step3Prompt = `
           You are an experienced hackathon judge.

            Your task is to evaluate the candidate's overall performance across the entire interview.

            You will receive:

            1. Project details.
            2. Complete interview conversation.

            Project Details: ${response1.summary}

            Interview Conversation: ${JSON.stringify(conversation, null, 2)}

            Evaluate the interview as a whole.

            Do NOT evaluate individual questions.

            Instead, identify recurring patterns throughout the conversation.

            Evaluate the candidate in the following categories:

            1. Problem Understanding
            - Did the candidate clearly explain the problem?
            - Did they demonstrate understanding of the target users and why the problem matters?

            2. Solution Clarity
            - Did they clearly explain how their solution works?
            - Was the implementation easy to understand?

            3. Innovation
            - Did they communicate what makes the project unique?
            - Did they justify why their approach is better than existing solutions?

            Scoring Guidelines

            9-10 : Outstanding
            7-8  : Strong
            5-6  : Average
            3-4  : Weak
            0-2  : Very Poor

            For every category provide:

            - score out of 10
            - exactly two strengths
            - exactly two weaknesses

            Analyze the whole conversation and also provide a summary of it. How the user answered.
            Provide the final summary in few words.
        `

        const step3result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: step3Prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        categoryScores: {
                            type: "OBJECT",
                            properties: {
                                problemUnderstanding: {
                                    type: "OBJECT",
                                    properties: {
                                        score: { type: "INTEGER" },
                                        strengths: { type: "ARRAY", items: { type: "STRING" } },
                                        weaknesses: { type: "ARRAY", items: { type: "STRING" } }
                                    },
                                    required: ["score", "strengths", "weaknesses"]
                                },
                                solutionClarity: {
                                    type: "OBJECT",
                                    properties: {
                                        score: { type: "INTEGER" },
                                        strengths: { type: "ARRAY", items: { type: "STRING" } },
                                        weaknesses: { type: "ARRAY", items: { type: "STRING" } }
                                    },
                                    required: ["score", "strengths", "weaknesses"]
                                },
                                innovation: {
                                    type: "OBJECT",
                                    properties: {
                                        score: { type: "INTEGER" },
                                        strengths: { type: "ARRAY", items: { type: "STRING" } },
                                        weaknesses: { type: "ARRAY", items: { type: "STRING" } }
                                    },
                                    required: ["score", "strengths", "weaknesses"]
                                }
                            },
                            required: ["problemUnderstanding", "solutionClarity", "innovation"]
                        },
                        conversationSummary: {
                            type: "OBJECT",
                            properties: {
                                convosummary: { type: "STRING" },
                            },
                            required: ["convosummary"]
                        }
                    },
                    required: ["categoryScores", "conversationSummary"]
                }
            },
        });

        const response3 = JSON.parse(step3result.text)

        console.log("Feedback: ", response3);

        const categoryfeedback = {
            problem: {
                score: response3.categoryScores?.problemUnderstanding?.score || 0,
                strength: (response3.categoryScores?.problemUnderstanding?.strengths || []).join(", "),
                weakness: (response3.categoryScores?.problemUnderstanding?.weaknesses || []).join(", ")
            },
            solution: {
                score: response3.categoryScores?.solutionClarity?.score || 0,
                strength: (response3.categoryScores?.solutionClarity?.strengths || []).join(", "),
                weakness: (response3.categoryScores?.solutionClarity?.weaknesses || []).join(", ")
            },
            innovation: {
                score: response3.categoryScores?.innovation?.score || 0,
                strength: (response3.categoryScores?.innovation?.strengths || []).join(", "),
                weakness: (response3.categoryScores?.innovation?.weaknesses || []).join(", ")
            }
        };

        const convofeedback = (response2.questions || []).map(q => ({
            no: q.questionNumber,
            feedback: q.feedback,
            modelanswer: q.modelAnswer
        }));

        await db.collection("feedback").add({
            interviewId: interviewId,
            projectId: projectId,
            userId: interview.userId,
            convosummary: response3.conversationSummary?.convosummary || "",
            categoryfeedback: categoryfeedback,
            convofeedback: convofeedback,
            createdAt: new Date()
        });

        res.status(200).json({
            message: "The summary is generated successfully",
            userId: interview.userId
        })

    } catch (err) {
        console.log("Summary error: ", err);
        res.status(500).json({
            message: "Error in generating summary"
        })
    }
}


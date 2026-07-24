import ai from "../config/gemini.js";
import fs from "fs";
import { db } from "../config/firebaseAdmin.js";
import { judgeConfig } from "../config/judgeConfig.js";
import generateAudio from "../Socket/generatingAudio.js";

export const startInterview = async (req, res) => {
    try {

        const projectId = req.params.projectId;

        const doc = await db.collection('projects').doc(projectId).get();

        const project = doc.data();

        const judge = project.judgeType;

        const config = judgeConfig[judge];

        const prompt = `
           ## Role

            You are an experienced Hackathon Judge.

            Your judging focus:
            ${config.roleFocus}

            Your questioning style:
            ${config.questionStyle}

            ## Task
            Analyze the supporting document to gather additional technical insights such as architecture, workflows, design decisions, implementation details, diagrams, and future enhancements as the permanent knowledge for the judging session. 

            Ask the questions on these criteria and also follow this evaluation priority in order:

            * Innovation (Highest priority)
            * Impact & Benefits (Real-world value and usefulness)
            * Feasibility (Practicality, complexity, and ability to build)
            * Implementation (engineering, architecture, technical decisions) (Technical Depth)
            * Design & User Experience

            Begin with the judging criterion that you believe is the most important based on the project details.
            
            ## QUESTION STYLE RULES (VERY IMPORTANT)

            - Ask questions in simple, spoken English (like a real interviewer)
            - Keep each question SHORT (max 1–2 sentences)
            - Use simple words (avoid complex vocabulary or academic tone)
            - Do NOT combine multiple questions into one
            - Do NOT explain context before asking the question
            - Do NOT use long introductions or background descriptions
            - Do NOT write essay-style or paragraph-style questions

            ## Instructions

            * Behave like a professional hackathon judge.
            * Ask only one question at a time.
            * Focus on only ONE criterion per question.
            * Do not ask multiple questions simultaneously.
            * Do not provide feedback, hints, or scores.
            
            Start by greeting the candidate briefly and then ask the first question as a ${judge} judge.
        `;

        const contents = [
            {
                text: prompt,
            }
        ]

        // Uploading file in the gemini
        if (project.DeckUrl) {
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

            await db.collection('projects').doc(projectId).update({
                fileUri: uploadedFile.uri   // Helps to access same file again without reuploading to gemini
            });

            contents.push({
                fileData: {
                    fileUri: uploadedFile.uri,
                    mimeType: "application/pdf",
                },
            })
        }



        // Generating content
        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents,
        });

        const question = result.text;

        console.log("Questions: ", question);

        if (!question) {
            console.log("Question is undefined");
            return res.status(500).json({
                message: "can't generate interview right now try after some time."
            })
        }

        const startTime = Date.now();

        let audio = null;
        try {
            console.log("Generating audio for the first question...");
            audio = await generateAudio(question);
        } catch (audioErr) {
            console.error("Failed to generate audio for the first question: ", audioErr);
        }

        console.log("sending duration: ", project.InterviewDuration);
        const interviewRef = await db.collection('interviews').add({
            projectId: projectId,
            userId: project.UserId,
            conversation: [
                {
                    judgeQuestion: question,
                    candidateAnswer: ""
                }
            ],
            startTime,
            duration: project.InterviewDuration,
            createdAt: new Date()
        });

        console.log("question 1 asked");
        res.status(200).json({
            question,
            audio,
            interviewId: interviewRef.id,
            projectId,
            duration: project.InterviewDuration,
            startTime,
        })

    } catch (err) {
        console.error("Generating first quesiton error: ", err);
        return res.status(500).json({
            message: "can't generate interview right now try after some time."
        })
    }
}
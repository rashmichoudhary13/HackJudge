import ai from "../config/gemini.js";
import fs from "fs";
import { db } from '../config/firebaseAdmin.js';

export const generateQuestions = async (req, res) => {
    try {

        const projectId = req.params.id;

        const { interviewId, answer } = req.body;

        console.log("id: ", projectId);

        if (!projectId) {
            return res.status(400).json({
                message: "Project doesn't exist"
            });
        }

        const doc = await db.collection('projects').doc(projectId).get();

        const project = doc.data();

        const interviewDoc = await db.collection('interviews').doc(interviewId).get();

        const interview = interviewDoc.data();

        const conversation = interview.conversation;

        conversation[conversation.length - 1].candidateAnswer = answer;


        const prompt = `
            ## Role

            You are an experienced Hackathon Judge conducting an ongoing hackathon interview.

            ## Task

            You will be provided with:

            * Project Title: ${project.Title}
            * Problem Statement: ${project.ProblemStatement}
            * Project Description: ${project.Description}
            * Tech Stack: ${project.TechStack}
            * Features: ${project.Feature}
            * Supporting Documents: ${project.DeckUrl}
            * Conversation History: ${JSON.stringify(conversation, null, 2)}

            Use the project details and conversation history to continue the interview.

            Judge the project using these criteria:

            * Innovation
            * Feasibility
            * Impact & Benefits
            * Implementation (engineering, architecture, technical decisions)
            * Design & User Experience

            Evaluate the candidate's **most recent answer**.

            * If the answer is technically sound, complete, and well justified, move to another judging criterion by asking one new question.
            * If the answer is vague, incomplete, incorrect, or lacks justification, ask one follow-up question on the same topic to better evaluate the candidate.

            ## Instructions

            * Behave like a professional hackathon judge.
            * Use the conversation history to avoid repeating questions.
            * Base every question on the project details, supporting documents, and previous responses.
            * Ask only one question.
            * Do not provide feedback, hints, scores, or an evaluation summary.
        `;

        const contents = [
            {
                text: prompt,
            }
        ];

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

            contents.push({
                fileData: {
                    fileUri: uploadedFile.uri,
                    mimeType: "application/pdf",
                },
            });
        }

        // Generating content
        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents,
        });

        console.log("Questions: ", result.text);

        conversation.push({
            judgeQuestion: result.text,
            candidateAnswer: ""
        });

        await db.collection('interviews').doc(interviewId).update({
            conversation
        });

        res.status(200).json({
            question: result.text
        })

    } catch (err) {
        console.error("Generating question error: ", err);

        res.status(500).json({
            message: "Error generating questions. Please Try again later"
        })
    }
}


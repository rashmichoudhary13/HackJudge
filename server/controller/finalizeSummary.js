import ai from "../config/gemini.js";
import { db } from '../config/firebaseAdmin.js';

export const generateSummary = async (req, res) => {
    try {
        const { lastAnswer, interviewId } = req.body;

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

        const prompt = `
            ## Role

            You are an experienced Hackathon Judge. Your task is to evaluate a candidate's performance during a mock hackathon interview.

            ## Task

            You will be provided with:

            * Project Title: ${project.Title}
            * Problem Statement: ${project.ProblemStatement}
            * Project Description: ${project.Description}
            * Tech Stack: ${project.TechStack}
            * Features: ${project.Feature}
            * Complete Conversation History between the Judge and the Candidate: ${JSON.stringify(conversation, null, 2)}

            Analyze the entire conversation along with the project details.

            Evaluate how well the candidate answered the judge's questions based on:

            * Technical understanding
            * Clarity of explanation
            * Justification of design and engineering decisions
            * Communication skills
            * Ability to defend their project
            * Consistency across answers

            Then generate feedback directly addressed to the candidate.

            1. **summary** – Write a short summary (3–5 sentences) using second-person language ("you", "your"). Speak as if you are giving feedback to the candidate after the interview. Highlight what they did well and where they struggled in a constructive and encouraging tone.

            2. **improvement** – Actionable suggestions that would help the candidate perform better in future hackathon presentations. Focus on specific areas such as technical explanations, communication, confidence, justification of decisions, or presentation skills. Write this as advice directly to the candidate using second-person language.

            3. **score** - Give the candidate a score out of 10.
        `

        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        summary: { type: "STRING" },
                        improvement: { type: "STRING" },
                        score: { type: "STRING" }
                    },
                    required: ["summary", "improvement", "score"]
                }
            },
        });

        const data = JSON.parse(result.text)
        console.log("Summary in backend: ", data);

        await db.collection("feedback").add({
            summary: data.summary,
            improvement: data.improvement,
            score: data.score,
            interviewId: interviewId,
            projectId: projectId,
            userId: interview.userId,
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

export const getAllProject = async (req, res) => {
    try {

        const userId = req.params.userId;

        const projectSnapshot = await db.collection("projects").where("UserId", "==", userId).get();

        const result = await Promise.all(
            projectSnapshot.docs.map(async (doc) => {
                const projectId = doc.id;
                const project = doc.data();

                const feedbackSnapshot = await db.collection('feedback').where("projectId", "==", projectId).get();

                const feedback = feedbackSnapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        feedbackId: doc.id,
                        score: data.score,
                        summary: data.summary,
                        improvement: data.improvement
                    }
                })

                return {
                    projectId,
                    feedback,
                    project
                };
            })
        );

        res.status(200).json(result);

    } catch (err) {
        console.log("Fetching summary error: ", err);
        res.status(500).json({
            messaging: "Facing Difficulties in fetching summary"
        })
    }
}
import ai from "../config/gemini.js";
import { judgeConfig } from "../config/judgeConfig.js";
import { db } from '../config/firebaseAdmin.js';

const MAX_RETRY = 3;

export const processInterview_ws = async (event) => {

    try {
        const { interviewId, projectId, answer } = event;

        const projectDoc = await db.collection('projects').doc(projectId).get();
        const project = projectDoc.data();

        const interviewDoc = await db.collection('interviews').doc(interviewId).get();
        const interview = interviewDoc.data();

        const conversation = interview.conversation;

        conversation[conversation.length - 1].candidateAnswer = answer;

        const judge = project.judgeType;

        const config = judgeConfig[judge];

        const prompt = `
        ## Role

        You are an experienced Hackathon Judge conducting an ongoing hackathon interview.

        Your judging focus:
        ${config.roleFocus}

        Your questioning style:
        ${config.questionStyle}

        ## Task

        You will be provided with:

        * Project Title: ${project.Title}
        * Problem Statement: ${project.ProblemStatement}
        * Project Description: ${project.Description}
        * Tech Stack: ${project.TechStack}
        * Features: ${project.Feature}
        * Conversation History: ${JSON.stringify(conversation, null, 2)}

        - Use the structured project information as the primary context. 
        - Analyze the supporting document to gather additional technical insights such as architecture, workflows, design decisions, implementation details, diagrams, and future enhancements. 
        - Use conversation history to analyze the candidate answer.
        Use all three sources together to generate relevant judging questions. Do not ask questions based on assumptions or invent details that are not present.

        Ask the questions on these criteria and also follow this evaluation priority in order:

        * Innovation (Highest priority)
        * Impact & Benefits (Real-world value and usefulness)
        * Feasibility (Practicality, complexity, and ability to build)
        * Implementation (engineering, architecture, technical decisions) (Technical Depth)
        * Design & User Experience

        Your objective is to evaluate the candidate across ALL judging criteria within the available interview time.

        Do not spend too much time on a single criterion.

        For each criterion:
        - Ask one primary question.
        - Ask at most two follow-up questions only if they are likely to reveal additional understanding.
        - If the candidate still cannot answer adequately after two attempts, accept that the criterion has been sufficiently assessed and continue to the next criterion.

It is more important to cover all judging criteria than to fully explore one topic.
        
        ## QUESTION STYLE RULES (VERY IMPORTANT)

        - Ask questions in simple, spoken English (like a real interviewer)
        - Use simple words (avoid complex vocabulary or academic tone)
        - Do NOT combine multiple questions into one
        - Do NOT use long introductions or background descriptions

        ## GOOD EXAMPLES:
        - "How did you decide to use LGBMRanker for this problem?"
        - "What happens if your API data is outdated?"
        - "How does your system find new business opportunities?"

        ## Instructions

        * Behave like a professional hackathon judge.
        * Use the conversation history to avoid repeating questions.
        * Ask only one question at a time.
    `;

        const contents = [
            {
                text: prompt,
            }
        ]

        if (project.fileUri) {
            contents.push({
                fileData: {
                    fileUri: project.fileUri,
                    mimeType: "application/pdf",
                },
            })
        }

        let result;
        // Generating content
        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
            try {
                result = await ai.models.generateContent({
                    model: process.env.GEMINI_MODEL,
                    contents,
                });

                break;
            } catch (err) {

                const code = err.error?.code;

                const retryable = code === 503 || code === 429;

                if (!retryable || attempt === MAX_RETRY) {
                    throw err;
                }

                // Exponential delay
                const delay = Math.pow(2, attempt - 1) * 1000;

                console.log(`Attempt ${attempt} failed. Retrying in ${delay} ms`);

                await new Promise(resolve => setTimeout(resolve, delay));

            }
        }

        console.log("Questions: ", result.text);

        conversation.push({
            judgeQuestion: result.text,
            candidateAnswer: ""
        });

        await db.collection('interviews').doc(interviewId).update({
            conversation
        });

        return result.text;

    } catch (err) {
        console.log("Generating next question: ", err);
    }
}
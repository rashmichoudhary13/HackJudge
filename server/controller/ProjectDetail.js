import { db } from "../config/firebaseAdmin.js";
import ai from "../config/gemini.js";
import fs from "fs";

export const addProjectDetails = async (req, res) => {
    try {
        const {
            projectTitle,
            problemStatement,
            solutionDescription,
            techStack,
            keyFeature,
            githubLink,
            deckUrl,
        } = req.body;

        const uid = req.user.uid;

        // storing project data in database
        const docRef = await db.collection('projects').add({
            UserId: uid,
            Title: projectTitle,
            ProblemStatement: problemStatement,
            Description: solutionDescription,
            TechStack: techStack,
            Feature: keyFeature,
            GithubUrl: githubLink,
            DeckUrl: deckUrl
        })

        const question = await generateQuestions(docRef.id);

        if(!question){
            console.log("Question is undefined");
            res.status(500).json({
                message: "Error generating first question"
            })
        }

        const interviewRef = await db.collection('interviews').add({
            projectId: docRef.id,
            userId: uid,
            conversation: [
                {
                    judgeQuestion: question,
                    candidateAnswer: ""
                }
            ],
            createdAt: new Date()
        });

        res.status(200).json({
            message: "Project has been added successfully",
            projectId: docRef.id,
            interviewId: interviewRef.id,
            question
        });

    } catch (err) {
        console.log("Project Adding error: ", err);

        res.status(500).json({
            message: "Failed to add project",
        });
    }
}


const generateQuestions = async (projectId) => {
    try {

        const doc = await db.collection('projects').doc(projectId).get();

        const project = doc.data();

        const prompt = `
           ## Role

            You are an experienced Hackathon Judge 'Aria' with expertise in software engineering, product development, startups, user experience, and business strategy. Your goal is to conduct a realistic hackathon judging session.

            ## Task

            You will be provided with the following project details:

            * Project Title: ${project.Title}
            * Problem Statement: ${project.ProblemStatement}
            * Project Description: ${project.Description}
            * Tech Stack: ${project.TechStack}
            * Features: ${project.Feature}
            * Supporting Documents: ${project.DeckUrl}

            Analyze the project and supporting documents before asking any questions.

            Judge the project using these criteria:

            * Innovation
            * Feasibility
            * Impact & Benefits
            * Implementation (engineering, architecture, technical decisions)
            * Design & User Experience

            Start the interview by **Greeting first** to the candidate and introducing yourself like your name and you are the judge today and then ask **one** thoughtful and relevant question. Begin with the judging criterion that you believe is the most important based on the project details.

            ## Instructions

            * Behave like a professional hackathon judge.
            * Ask only one question.
            * Do not evaluate the project yet.
            * Do not ask multiple questions.
            * Do not provide feedback, hints, or scores.

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
            model: "gemini-2.5-flash",
            contents,
        });

        console.log("Questions: ", result.text);

        return result.text;

    } catch (err) {
        console.error("Generating first quesiton error: ", err);
    }
}

import { db } from "../config/firebaseAdmin.js";

export const addProjectDetails = async (req, res) => {
    try {
        const {
            projectTitle,
            problemStatement,
            solutionDescription,
            techStack,
            keyFeature,
            deckUrl,
            judge
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
            DeckUrl: deckUrl,
            judgeType: judge,
            fileUri: ""
        })

        res.status(200).json({
            message: "Project has been added successfully",
            projectId: docRef.id,
        });

    } catch (err) {
        console.log("Project Adding error: ", err);

        res.status(500).json({
            message: "Failed to add project",
        });
    }
}




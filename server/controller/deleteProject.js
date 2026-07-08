import { db } from "../config/firebaseAdmin.js";

export const deleteProject = async (req, res) => {

    try {
        const projectId = req.params.projectId;

        const feedbackSnapshot = await db.collection('feedback').where("projectId", "==", projectId).get();
        const interviewSnapshot = await db.collection('interviews').where("projectId", "==", projectId).get();

        const batch = db.batch();

        feedbackSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        interviewSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        })

        batch.delete(db.collection("projects").doc(projectId));

        await batch.commit();

        res.status(200).json({
            message: "Successfully deleted the project.",
        })
    } catch (err) {
        console.log("Error deleting a project: ", err);

        res.status(500).json({
            message: "Failed to delete project."
        })
    }
}
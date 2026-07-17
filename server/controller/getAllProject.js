import { db } from "../config/firebaseAdmin.js";

export const getAllProject = async (req, res) => {
    try {

        const userId = req.params.userId;

        const projectSnapshot = await db.collection("projects").where("UserId", "==", userId).get();

        const result = await Promise.all(
            projectSnapshot.docs.map(async (doc) => {
                const projectId = doc.id;
                const project = doc.data();

                const feedbackSnapshot = await db.collection('feedback').where("projectId", "==", projectId).get();

                const feedback = await Promise.all(
                    feedbackSnapshot.docs.map(async doc => {
                        const data = doc.data();

                        const interviewRef = await db.collection('interviews').doc(data.interviewId).get();
                        const interviewData = interviewRef.data();

                        return {
                            feedbackId: doc.id,
                            convosummary: data.convosummary || "",
                            categoryfeedback: data.categoryfeedback || {},
                            convofeedback: data.convofeedback || [],
                            conversation: interviewData?.conversation || []
                        }
                    })
                );

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
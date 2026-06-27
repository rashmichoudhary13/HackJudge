import { db } from '../config/firebaseAdmin.js';

export const storeUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const uid = req.user.uid;

        console.log("uid is: ", uid);

        await db.collection('users').doc(uid).set({
            Name: name,
            Email: email,
            createdAt: Date.now(),
        });

        res.status(201).json({
            message: "User data is stored"
        });
    } catch(err){
        console.log("user storing error: ", err.message);
        res.status(500).json({
            message: "User cannot be stored"
        });
    }
}

import admin from 'firebase-admin';

export const isauthenticated = async (req, res, next) => {
    try {
        // Get the token from authorization header
        const authHeader = req.headers.authorization;

        // Check if token exist
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "User is not authorized"
            });
        }

        // Verify the token
        const token = authHeader.split("Bearer ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = decodedToken;
        next();
    } catch(err){
        console.error("Authentication error: ", err)
        res.status(401).json({
            message: "Invalid token",
        });
    }
};
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function to delete a user from Firebase Auth by email.
 * This is restricted to authenticated users (Administrators checking is done via Firestore role in next steps).
 */
exports.deleteAuthUser = onCall(async (request) => {
    // 1. Basic Auth check
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "Solo usuarios autenticados pueden realizar esta acción.");
    }

    const { email } = request.data;

    if (!email) {
        throw new HttpsError("invalid-argument", "El campo 'email' es obligatorio.");
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);

        return {
            status: "success",
            message: `Usuario con email ${email} eliminado correctamente de Authentication.`
        };
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return {
                status: "not_found",
                message: "El usuario no existe en Authentication."
            };
        }

        console.error("Error al borrar usuario de Auth:", error);
        throw new HttpsError("internal", "Error interno al intentar borrar el usuario.");
    }
});

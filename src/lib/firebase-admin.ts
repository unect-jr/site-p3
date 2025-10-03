import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountJson = Buffer.from(
      process.env.FIREBASE_ADMIN_SDK_BASE64!,
      "base64"
    ).toString("utf-8");

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Firebase admin initialization error", error.stack);
    } else {
      console.error(
        "An unknown error occurred during Firebase admin initialization",
        error
      );
    }
  }
}

export const firestoreAdmin = admin.firestore();

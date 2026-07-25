import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountJson = Buffer.from(
      process.env.FIREBASE_ADMIN_SDK_BASE64!,
      "base64"
    ).toString("utf-8");

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
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

function ensureInitialized() {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase Admin SDK not initialized — check FIREBASE_ADMIN_SDK_BASE64"
    );
  }
}

export function getFirestoreAdmin() {
  ensureInitialized();
  return admin.firestore();
}

export function getStorageBucket() {
  ensureInitialized();
  return admin.storage().bucket();
}

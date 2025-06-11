import { db } from "../../firebaseConfig.js";

export { db };

export function handleFirebaseError(operation, error) {
  console.error(`Error during ${operation}:`, error);
  if (error.code === "permission-denied") {
    throw new Error(
      `Permission denied. You don't have access to ${operation}.`
    );
  }
  if (error.code === "not-found") {
    throw new Error(`Item not found. It may have been deleted.`);
  }
  if (error.message?.includes("network")) {
    throw new Error(
      `Network error. Please check your connection and try again.`
    );
  }
  throw new Error(
    `Something went wrong during ${operation}. Please try again.`
  );
}

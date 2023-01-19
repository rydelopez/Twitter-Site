import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBv1B8e_xuO8qQVG_KSu19ocbac9ZUYtHc",
	authDomain: "twitter-penn-spark.firebaseapp.com",
	projectId: "twitter-penn-spark",
	storageBucket: "twitter-penn-spark.appspot.com",
	messagingSenderId: "198953919068",
	appId: "1:198953919068:web:cb7fa6c10b3a150b763c99",
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
// export const analytics = getAnalytics(app);

// Helper functions

/*
 * Gets a user/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
	const usersRef = firestore.collection("users");
	const query = usersRef.where("username", "==", username).limit(1);
	const userDoc = (await query.get()).docs[0];
	return userDoc;
}

/*
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 * /
 */
export function postToJSON(doc) {
	const data = doc.data();
	return {
		...data,
		// Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	};
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

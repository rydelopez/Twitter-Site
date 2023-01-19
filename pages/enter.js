import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useContext, useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import Router, { useRouter } from "next/router";

export default function Enter(props) {
	const { user, username } = useContext(UserContext);

	return (
		<main>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
}

// Sign in with Google button
function SignInButton() {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};
	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			<img src={"/google.png"} /> Sign in with Google
		</button>
	);
}

// Sign out button
function SignOutButton() {
	return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// Username form
function UsernameForm() {
	const [formValue, setFormValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const onChange = (e) => {
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username) => {
			if (username.length >= 3) {
				const ref = firestore.doc(`usernames/${username}`);
				const { exists } = await ref.get();
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	const onSubmit = async (e) => {
		e.preventDefault();

		const userDoc = firestore.doc(`users/${user.uid}`);
		const usernameDoc = firestore.doc(`usernames/${formValue}`);

		const batch = firestore.batch();
		batch.set(userDoc, {
			username: formValue,
			photoURL: user.photoURL,
			displayName: user.displayName,
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();

		router.push("/");
	};

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={onSubmit}>
					<input
						name="username"
						placeholder="username"
						value={formValue}
						onChange={onChange}
					/>
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
					<button type="submit" className="btn-blue" disabled={!isValid}>
						Choose
					</button>
				</form>
			</section>
		)
	);
}

function UsernameMessage({ username, isValid, loading }) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className="text-success">{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>;
	} else {
		return <p></p>;
	}
}

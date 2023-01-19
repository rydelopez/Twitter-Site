import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
	return (
		<main>
			<AuthCheck>
				<CreateNewTweet />
				<PostList />
			</AuthCheck>
		</main>
	);
}

function PostList() {
	const ref = firestore
		.collection("users")
		.doc(auth.currentUser.uid)
		.collection("posts");
	const query = ref.orderBy("createdAt");
	const [querySnapshot] = useCollection(query);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<PostFeed posts={posts} admin />
		</>
	);
}

function CreateNewTweet() {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState("");

	// Ensure slug is URL safe
	const slug = encodeURI(kebabCase(title));

	// Validate length
	const isValid = title.length > 3 && title.length < 100;

	const createTweet = async (e) => {
		e.preventDefault();
		const uid = auth.currentUser.uid;
		const ref = firestore
			.collection("users")
			.doc(uid)
			.collection("posts")
			.doc(slug);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: "hello world!",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		await ref.set(data);

		toast.success("Post created!");

		// Imperative navigation after doc is set
		router.push(`/admin/${slug}`);
	};

	return (
		<>
			<h1>Manage your Tweets</h1>
			<form onSubmit={createTweet}>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="My Tweet Title!"
					className={styles.input}
				/>
				<button type="submit" disabled={!isValid} className="btn-blue">
					Create Tweet
				</button>
			</form>
		</>
	);
}

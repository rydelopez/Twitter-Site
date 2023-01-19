import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent.js";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection("posts").doc(slug);
		post = postToJSON(await postRef.get());

		path = postRef.path;
	}

	return {
		props: { post, path },
		revalidate: 5000,
	};
}

export async function getStaticPaths() {
	// Improve this after using Admin SDK to select empty docs
	const snapshot = await firestore.collectionGroup("posts").get();
	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: "blocking", // called before initial render; when user navigates to a page that has not been rendered yet, use SSR to generate the page
	};
}

export default function Post(props) {
	const postRef = firestore.doc(props.path);
	const [realtimePost] = useDocumentData(postRef);

	// defaults to real-time data, but if data hasn't loaded yet, fallback to pre-rendered data on server from props
	const post = realtimePost || props.post;

	return (
		<main className={styles.container}>
			<section>
				<PostContent post={post} />
			</section>
		</main>
	);
}

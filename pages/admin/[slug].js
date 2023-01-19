import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import ImageUploader from "../../components/ImageUploader";

import { useRouter } from "next/router";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPostEdit(props) {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}

function PostManager() {
	const router = useRouter();
	const { slug } = router.query;

	const postRef = firestore
		.collection("users")
		.doc(auth.currentUser.uid)
		.collection("posts")
		.doc(slug);
	const [post] = useDocumentData(postRef);

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Go to Tweet</button>
						</Link>
						<PostForm postRef={postRef} defaultValues={post} />
					</section>
				</>
			)}
		</main>
	);
}

function PostForm({ defaultValues, postRef }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm({
		defaultValues,
		mode: "onChange",
	});

	const updatePost = async ({ content, published }) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success("Post updated successfully!");
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			<div className={styles.controls}>
				<ImageUploader />
				<textarea
					{...register("content", {
						minLength: { value: 5, message: "content is too short" },
						maxLength: { value: 20000, message: "content is too long" },
						required: { value: true, message: "content is required" },
					})}
				></textarea>

				{errors.content && (
					<p className="text-danger">{errors.content.message}</p>
				)}

				<fieldset>
					<input
						className={styles.checkbox}
						type="checkbox"
						{...register("published")}
					/>
					<label>Public?</label>
				</fieldset>

				<button
					type="submit"
					className="btn-blue"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}

import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function PostFeed({ posts, admin }) {
	return posts ? (
		<div>
			{posts.map((post) => (
				<PostItem key={post.slug} post={post} admin={admin} />
			))}
		</div>
	) : null;
}

function PostItem({ post, admin = false }) {
	return (
		<div className="card">
			<Link href={`/${post.username}`}>
				<strong>By @{post.username}</strong>
			</Link>
			<Link href={`/${post.username}/${post.slug}`}>
				<h2>{post.title}</h2>
				<ReactMarkdown>{post?.content}</ReactMarkdown>
			</Link>
			{/* If admin view, show extra controls */}
			{admin && (
				<>
					<Link href={`admin/${post.slug}`}>
						<h3>
							<button className="btn-blue">Edit Tweet</button>
						</h3>
					</Link>
					{post.published ? (
						<p className="text-success">Live</p>
					) : (
						<p className="text-danger">Unpublished</p>
					)}
				</>
			)}
		</div>
	);
}

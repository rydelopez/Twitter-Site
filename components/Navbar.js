import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

// Top navbar
export default function Navbar() {
	const { user, username } = useContext(UserContext);
	const [searchTerm, setSearchTerm] = useState("");

	const router = useRouter();
	const signOut = () => {
		auth.signOut();
		router.reload();
	};

	const onSubmit = (e) => {
		e.preventDefault();
		router.push(`/${searchTerm}`);
	};

	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/">
						<img src={"/twitter.png"} alt="logo" />
					</Link>
				</li>
				<li id="search">
					<form onSubmit={onSubmit}>
						<input
							name="username"
							placeholder="Search Twitter for users"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={(e) => {
								e.key === "Enter" && onSubmit;
							}}
							type="search"
						/>
						<button type="submit" className="btn-blue">
							Go
						</button>
					</form>
				</li>
				{/* user is signed-in and has username */}
				{username && (
					<>
						<li className="push-left">
							<button onClick={signOut}>Sign Out</button>
						</li>
						<li>
							<Link href="/admin">
								<button className="btn-blue">Tweets</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
								<img src={user?.photoURL} />
							</Link>
						</li>
					</>
				)}

				{/* user is not signed OR has not created username */}
				{!username && (
					<li>
						<Link href="/enter">
							<button className="btn-blue">Log in</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}

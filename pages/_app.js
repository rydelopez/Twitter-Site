import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import Head from "next/head";
import image from "../public/twitter.png";

export default function App({ Component, pageProps }) {
	const userData = useUserData();

	return (
		<>
			<UserContext.Provider value={userData}>
				<Head>
					<title>Twitter Clone</title>
					<meta property="og:image" content={image} />
				</Head>
				<Navbar />
				<Component {...pageProps} />
				<Toaster />
			</UserContext.Provider>
		</>
	);
}

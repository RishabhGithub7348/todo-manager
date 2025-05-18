import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { UserProvider } from "@/context/userContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
	title: "Todo Manager",
	description: "A Todo Manager",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (

		<html lang="en">
			<body className="bg-gray-100">
				<Providers>
					 <UserProvider>
						<Toaster />
							  {children}
							</UserProvider>
				</Providers>
			</body>
		</html>

	);
}
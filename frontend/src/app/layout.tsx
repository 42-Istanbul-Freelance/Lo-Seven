import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "LoSeven - Sosyal Etki Ağı",
	description: "LÖSEV gönüllülük takip ve sosyal etki ağı platformu.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr">
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased min-h-screen bg-zinc-50 text-zinc-800 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col`}
			>
				<Providers>
					<main className="flex-1 flex flex-col">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}

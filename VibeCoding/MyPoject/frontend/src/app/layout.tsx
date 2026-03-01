import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
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

export const metadata: Metadata = {
	title: "Lösev Medya - Sosyal Etki Ağı",
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
				className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-zinc-50 text-zinc-800 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col`}
			>
				<Providers>
					<Header />

					<main className="flex-1 flex flex-col">
						{children}
					</main>

					<footer className="border-t border-zinc-200 py-6 mt-12 bg-white">
						<div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
							<p className="font-mono text-xs text-zinc-400">
								© {new Date().getFullYear()} Lösev Medya — LÖSEV Gönüllülük Platformu
							</p>
						</div>
					</footer>
				</Providers>
			</body>
		</html>
	);
}

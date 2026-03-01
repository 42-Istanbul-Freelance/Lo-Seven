import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
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
	title: "Vibe Coding Starter - 42 İstanbul Freelance",
	description: "A fast, open-source boilerplate by 42 İstanbul Freelance for the Vibe Coding marathon.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-black text-zinc-300 selection:bg-zinc-800 selection:text-white flex flex-col`}
			>
				<header className="border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
					<div className="container mx-auto px-4 h-16 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-mono text-xs text-zinc-500">[</span>
							<span className="font-mono text-sm font-semibold text-white">42 İstanbul Freelance</span>
							<span className="font-mono text-xs text-zinc-500">]</span>
						</div>

						<nav className="hidden md:flex items-center gap-6">
							<a href="https://intra.42freelance.com" target="_blank" rel="noreferrer" className="text-sm font-mono text-zinc-400 hover:text-white transition-colors">
								›_Intra
							</a>
							<a href="#" className="text-sm font-mono text-zinc-400 hover:text-white transition-colors">
								›_Yardım_Al
							</a>
						</nav>

						<div className="flex items-center">
							<button className="bg-white text-black text-xs font-mono font-bold px-3 py-1.5 hover:bg-zinc-200 transition-colors">
								GİRİŞ_YAP
							</button>
						</div>
					</div>
				</header>

				<main className="flex-1 flex flex-col">
					{children}
				</main>

				<footer className="border-t border-zinc-900 py-6 mt-12 bg-black">
					<div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
						<p className="font-mono text-xs text-zinc-600">
							© {new Date().getFullYear()} 42 İstanbul Freelance. Tüm sunucu giderleri desteklenmektedir.
						</p>
					</div>
				</footer>
			</body>
		</html>
	);
}

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
			<div className="max-w-3xl w-full border border-zinc-800 bg-black/80 backdrop-blur-xl p-8 shadow-2xl relative">
				{/* Terminal Header */}
				<div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
					<div className="w-3 h-3 rounded-full bg-red-500/50"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
					<div className="w-3 h-3 rounded-full bg-green-500/50"></div>
					<p className="ml-2 font-mono text-[10px] text-zinc-500 tracking-wider">~/42freelance/vibe-coding</p>
				</div>

				<div className="mt-8 space-y-6">
					<div className="border-l-2 border-emerald-500 pl-4 py-2">
						<h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-white mb-2">
							SİSTEM BOOT EDİLDİ.
						</h1>
						<p className="font-mono text-zinc-400 text-sm">
							[ status: ok ] Boilerplate aktif. Üretmeye başlayabilirsiniz.
						</p>
					</div>

					<div className="space-y-4">
						<p className="text-zinc-300 leading-relaxed font-sans mt-4">
							Bu boilerplate, 42 İstanbul Freelance Hackathon & Vibe Coding sürecinde sizi konfigürasyon
							yükünden kurtarmak için tasarlanmıştır. İçerisinde <span className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded">TailwindCSS</span>, <span className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded">TypeScript</span> ve
							hazır bir <span className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded">Docker</span> altyapısı mevcuttur.
						</p>

						<div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm font-mono text-sm">
							<div className="flex items-center gap-2 text-zinc-400 mb-2">
								<span className="text-emerald-500">›</span> Başlamak için:
							</div>
							<code className="text-zinc-200 block mb-1">$ src/app/page.tsx'i düzenleyin</code>
							<code className="text-zinc-200 block mb-1">$ intra.42freelance.com üzerinden projenizi ekleyin</code>
							<code className="text-zinc-200 block">$ Yardıma ihtiyacınız olursa "Needs Help" bayrağı açın</code>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
						<a
							href="https://intra.42freelance.com"
							target="_blank"
							rel="noreferrer"
							className="group border border-zinc-800 bg-zinc-950 p-4 hover:border-emerald-500/50 transition-colors flex flex-col justify-between h-32"
						>
							<div>
								<h3 className="font-mono text-white text-sm flex items-center gap-2">
									[ INTRA ]
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</h3>
								<p className="text-zinc-500 text-xs mt-2">Takımınızın projesini 42 İstanbul Freelance ekosistemine ekleyin.</p>
							</div>
						</a>

						<a
							href="#"
							className="group border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-500 transition-colors flex flex-col justify-between h-32"
						>
							<div>
								<h3 className="font-mono text-white text-sm flex items-center gap-2">
									[ DEVOPS & SUNUCU ]
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</h3>
								<p className="text-zinc-500 text-xs mt-2">Geliştirdiğiniz uygulamanın açık kaynak deployment kılavuzu.</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

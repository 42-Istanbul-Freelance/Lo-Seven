import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
			<div className="max-w-3xl w-full border border-zinc-200 bg-white rounded-xl p-8 shadow-lg">
				<div className="space-y-6">
					<div className="border-l-4 border-indigo-500 pl-4 py-2">
						<div className="mb-4">
							<Image
								src="/logo.svg"
								alt="LoSeven Logo"
								width={200}
								height={60}
								className="object-contain"
								priority
							/>
						</div>
						<p className="font-mono text-zinc-500 text-sm">
							[ status: aktif ] Gönüllülük takip ve sosyal etki ağı platformu.
						</p>
					</div>

					<div className="space-y-4">
						<p className="text-zinc-600 leading-relaxed font-sans mt-4">
							LoSeven, LÖSEV bünyesindeki okullarda gönüllülük çalışmalarını
							takip etmek, onaylamak ve görselleştirmek için geliştirilmiş bir
							sosyal etki ağı platformudur. Öğrenciler aktivitelerini kaydeder,
							öğretmenler onaylar, herkes sosyal akışta paylaşır.
						</p>

						<div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg font-mono text-sm">
							<div className="flex items-center gap-2 text-zinc-500 mb-2">
								<span className="text-indigo-500">›</span> Özellikler:
							</div>
							<div className="text-zinc-700 space-y-1">
								<p>✓ Gönüllülük saati takibi ve onay sistemi</p>
								<p>✓ Sosyal akış — paylaş, beğen, yorum yap</p>
								<p>✓ Oyunlaştırma — İnci Rozetleri ve XP sistemi</p>
								<p>✓ HQ Rapor Paneli — okul bazlı istatistikler</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
						<Link
							href="/login"
							className="group border border-zinc-200 bg-zinc-50 p-5 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between h-32"
						>
							<div>
								<h3 className="font-mono text-zinc-900 text-sm flex items-center gap-2 font-bold">
									[ GİRİŞ YAP ]
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</h3>
								<p className="text-zinc-500 text-xs mt-2">Hesabınla giriş yap ve dashboard&apos;a geç.</p>
							</div>
						</Link>

						<Link
							href="/register"
							className="group border border-zinc-200 bg-zinc-50 p-5 rounded-lg hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between h-32"
						>
							<div>
								<h3 className="font-mono text-zinc-900 text-sm flex items-center gap-2 font-bold">
									[ KAYIT OL ]
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</h3>
								<p className="text-zinc-500 text-xs mt-2">Yeni hesap oluştur ve gönüllü ol.</p>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

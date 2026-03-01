"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getApiUrl } from "@/lib/api";

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        hours: 1,
    });
    const [loading, setLoading] = useState(false);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Onboarding error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-2xl">

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${s === step ? "bg-red-500 scale-125" : s < step ? "bg-red-300" : "bg-zinc-200"
                                }`}
                        />
                    ))}
                </div>

                <div className="bg-white rounded-[32px] shadow-[0_8px_40px_-10px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-hidden">

                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <div className="p-10 md:p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
                                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-zinc-900 mb-4">PearlConnect'e Hoş Geldiniz!</h1>
                            <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                                Gönüllülük profilini oluşturmaya başlayalım. Sadece bir dakikanı alacak!
                            </p>
                            <button
                                onClick={() => setStep(2)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-10 py-4 rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
                            >
                                Başla →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Create Your First Activity */}
                    {step === 2 && (
                        <div className="p-10 md:p-14">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-2">İlk hedefiniz nedir?</h2>
                            <p className="text-zinc-500 mb-10">Zaman ayırmak istediğiniz etkinliği belirleyin.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Etkinlik Başlığı</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="örn. Sahil Temizliği Kampanyası"
                                        className="w-full border border-zinc-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all bg-zinc-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Açıklama</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        placeholder="Projeden biaz bahset..."
                                        className="w-full border border-zinc-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none bg-zinc-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Hedef Süre (Saat)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 1 })}
                                        className="w-full border border-zinc-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all bg-zinc-50/50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-10">
                                <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-zinc-600 font-semibold text-sm transition-colors">
                                    ← Geri
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.title || !formData.description}
                                    className="ml-auto bg-red-500 hover:bg-red-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all text-sm"
                                >
                                    İleri →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm & Go */}
                    {step === 3 && (
                        <div className="p-10 md:p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
                                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-3">Her şey hazır!</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto mb-4 leading-relaxed">
                                İlk hedefin <strong className="text-zinc-800">"{formData.title}"</strong> ({formData.hours}s) onaylanmak üzere gönderilecek.
                            </p>
                            <p className="text-zinc-400 text-sm mb-10">
                                Daha sonra her zaman panodan yeni etkinlikler ekleyebilirsin.
                            </p>

                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-2xl shadow-md transition-all text-sm"
                                >
                                    {loading ? "Gönderiliyor..." : "Gönüllü Ol 🚀"}
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="text-zinc-400 hover:text-zinc-600 font-semibold text-sm transition-colors"
                                >
                                    Şimdilik atla
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

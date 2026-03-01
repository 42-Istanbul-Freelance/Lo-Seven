"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial state matching basic user details
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
    });

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            // Using the same upload endpoint we have for activities
            const uploadRes = await fetch(`${getApiUrl()}/api/v1/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
                body: formDataUpload,
            });

            if (uploadRes.ok) {
                const { url } = await uploadRes.json();

                // Assuming we have a user update endpoint (mock/fallback behavior)
                // In a real scenario, you'd send this to your profile update API
                await update({ image: url }); // Update NextAuth session
                setSuccess("Profil fotoğrafı başarıyla güncellendi.");
            } else {
                const data = await uploadRes.json();
                setError(data.error || "Dosya yükleme başarısız.");
            }
        } catch (err) {
            setError("Profil resmi güncellenirken hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess("");
        setError("");

        try {
            // Placeholder for profile update API call
            await update({ name: formData.name });
            setSuccess("Bilgileriniz başarıyla güncellendi.");
        } catch (err) {
            setError("Bilgiler güncellenirken hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Dashboard'a Dön
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-black/5 overflow-hidden">
                    <div className="p-8 border-b border-zinc-100">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Profil Ayarları</h1>
                        <p className="text-sm text-zinc-500 mt-1">Hesap bilgilerinizi ve profil fotoğrafınızı güncelleyin.</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm">
                                {success}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-zinc-100">
                            <div className="flex flex-col items-center sm:items-start gap-4">
                                <span className="block text-sm font-medium leading-6 text-zinc-700">Profil Fotoğrafı</span>
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center font-bold text-3xl text-zinc-400 group-hover:opacity-80 transition-opacity">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            session.user?.name?.charAt(0) || "👤"
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureUpload}
                                        title="Profil Resmi Yükle"
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 text-center sm:text-left">Değiştirmek için fotoğrafa tıklayın.<br />Max 5MB (JPG, PNG)</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-700">Ad Soyad</label>
                                    <div className="mt-1">
                                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                                            className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-700">E-posta Adresi (Değiştirilemez)</label>
                                    <div className="mt-1">
                                        <input type="email" id="email" name="email" value={formData.email} disabled
                                            className="block w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 px-4 text-zinc-500 cursor-not-allowed sm:text-sm" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={isLoading}
                                        className="w-full sm:w-auto px-6 flex justify-center rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50">
                                        {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="text-sm">
                            <h3 className="font-bold text-red-600 mb-2">Tehlikeli Alan</h3>
                            <p className="text-zinc-500 mb-4">Hesabınızı silmek kalıcı bir işlemdir ve geri alınamaz.</p>
                            <button className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-xs">
                                Hesabı Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

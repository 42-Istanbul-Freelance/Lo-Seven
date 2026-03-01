"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function NewActivityPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        hours: "",
    });
    const [mediaUrl, setMediaUrl] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated" || (session?.user?.role && session.user.role.toUpperCase() !== "STUDENT")) {
        console.log("Unauthorized Access details:", { sessionRole: session?.user?.role, status });
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] font-sans">
                <p className="text-zinc-500 mb-4">Yetkisiz Erişim. Lütfen öğrenci hesabınızla giriş yapın.</p>
                <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-sm">Dashboard'a Dön</button>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => setUploadPreview(ev.target?.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);
        setError("");

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch(`${getApiUrl()}/api/v1/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setMediaUrl(data.url);
            } else {
                const data = await res.json();
                setError(data.error || "Dosya yükleme başarısız.");
                setUploadPreview(null);
            }
        } catch (err) {
            setError("Dosya yüklenirken bağlantı hatası.");
            setUploadPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    hours: parseInt(formData.hours, 10),
                    mediaUrl: mediaUrl || null,
                }),
            });

            if (res.ok) {
                setSuccess("Aktivite başarıyla oluşturuldu ve onaya gönderildi.");
                setTimeout(() => router.push("/dashboard"), 2000);
            } else {
                const text = await res.text();
                setError(text || "Aktivite oluşturulamadı.");
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu.");
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
                        Geri Dön
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-black/5">
                    <div className="mb-8 border-b border-zinc-100 pb-6">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Yeni Etki Ekstra</h1>
                        <p className="text-sm text-zinc-500 mt-1">Gönüllülük saatlerini kaydetmek için detayları girin</p>
                    </div>

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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-700">Aktivite Başlığı</label>
                            <div className="mt-1">
                                <input type="text" id="title" name="title" required value={formData.title} onChange={handleChange}
                                    placeholder="Örn: Ağaç Dikme Etkinliği"
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-zinc-700">Neler Yaptınız?</label>
                            <div className="mt-1">
                                <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange}
                                    placeholder="Etkinlik detaylarını kısaca anlatın..."
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="hours" className="block text-sm font-medium leading-6 text-zinc-700">Katılım Süresi (Saat)</label>
                            <div className="mt-1">
                                <input type="number" id="hours" name="hours" min="1" required value={formData.hours} onChange={handleChange}
                                    placeholder="Örn: 4"
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" />
                            </div>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium leading-6 text-zinc-700 mb-1">Kanıt & Medya</label>
                            <div onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-zinc-200 bg-[#fafafa] rounded-xl p-8 text-center cursor-pointer hover:border-red-400 hover:bg-white transition-all group">
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm font-medium text-red-500">Yükleniyor...</p>
                                    </div>
                                ) : uploadPreview ? (
                                    <div className="flex flex-col items-center gap-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={uploadPreview} alt="Preview" className="max-h-40 rounded-lg object-contain shadow-sm border border-zinc-100" />
                                        <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Dosya eklendi
                                        </p>
                                        <p className="text-xs text-zinc-400 group-hover:text-zinc-600 transition-colors">Değiştirmek için tıklayın</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:border-red-100 transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-700">Fotoğraf Yükle</p>
                                            <p className="text-xs text-zinc-500 mt-1">PNG, JPG — Max 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </div>

                        <div className="pt-6 border-t border-zinc-100">
                            <button type="submit" disabled={isLoading || isUploading}
                                className="w-full flex justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? "Gönderiliyor..." : "Etkiyi Paylaş"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

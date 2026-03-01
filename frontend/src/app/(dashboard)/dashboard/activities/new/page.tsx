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
        return <p className="text-center mt-12 font-mono text-zinc-400">Yükleniyor...</p>;
    }

    if (status === "unauthenticated" || session?.user?.role !== "STUDENT") {
        return <p className="text-center mt-12 font-mono text-red-500">Yetkisiz Erişim.</p>;
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
                    "Authorization": `Bearer ${session.accessToken}`,
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
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm font-mono text-zinc-500 hover:text-indigo-600 transition-colors">
                    &larr; Dashboard&apos;a Dön
                </Link>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
                <h1 className="text-2xl font-bold font-mono text-zinc-900 mb-6">[Yeni_Aktivite_Ekle]</h1>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm font-mono">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md text-sm font-mono">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 font-mono mb-2">Başlık</label>
                        <input type="text" id="title" name="title" required value={formData.title} onChange={handleChange}
                            placeholder="Örn: Ağaç Dikme Etkinliği"
                            className="block w-full rounded-md border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm" />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 font-mono mb-2">Açıklama</label>
                        <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange}
                            placeholder="Etkinlikte neler yaptınız?"
                            className="block w-full rounded-md border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm" />
                    </div>

                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-zinc-700 font-mono mb-2">Kazanılan Saat</label>
                        <input type="number" id="hours" name="hours" min="1" required value={formData.hours} onChange={handleChange}
                            placeholder="Örn: 4"
                            className="block w-full rounded-md border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm" />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 font-mono mb-2">Kanıt Fotoğrafı / Belgesi</label>
                        <div onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors group">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm font-mono text-indigo-600">Yükleniyor...</p>
                                </div>
                            ) : uploadPreview ? (
                                <div className="flex flex-col items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={uploadPreview} alt="Preview" className="max-h-32 rounded-md object-contain" />
                                    <p className="text-xs font-mono text-green-600">✓ Dosya yüklendi</p>
                                    <p className="text-xs font-mono text-zinc-400">Değiştirmek için tıklayın</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-10 h-10 text-zinc-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-sm font-mono text-zinc-500 group-hover:text-zinc-600">Fotoğraf veya belge yüklemek için tıklayın</p>
                                    <p className="text-xs font-mono text-zinc-400">PNG, JPG, PDF — Max 10MB</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isLoading || isUploading}
                            className="w-full bg-indigo-600 text-white font-mono font-bold py-2.5 rounded-md hover:bg-indigo-500 transition-colors disabled:opacity-50">
                            {isLoading ? "GÖNDERİLİYOR..." : "ONAYA GÖNDER"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

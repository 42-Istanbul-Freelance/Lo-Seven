"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function NewActivityPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        hours: "",
        mediaUrl: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (status === "loading") {
        return <p className="text-center mt-12 font-mono text-zinc-500">Yükleniyor...</p>;
    }

    if (status === "unauthenticated" || session?.user?.role !== "STUDENT") {
        return <p className="text-center mt-12 font-mono text-red-500">Yetkisiz Erişim.</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    mediaUrl: formData.mediaUrl,
                }),
            });

            if (res.ok) {
                setSuccess("Aktivite başarıyla oluşturuldu ve onaya gönderildi.");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
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
                <Link href="/dashboard" className="text-sm font-mono text-zinc-500 hover:text-white transition-colors">
                    &larr; Dashboard'a Dön
                </Link>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
                <h1 className="text-2xl font-bold font-mono text-white mb-6">[Yeni_Aktivite_Ekle]</h1>

                {error && (
                    <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm font-mono">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-md text-sm font-mono">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 font-mono mb-2">Başlık</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Örn: Ağaç Dikme Etkinliği"
                            className="block w-full rounded-md border border-zinc-700 bg-zinc-900 py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 font-mono mb-2">Açıklama</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Etkinlikte neler yaptınız? Ne kadar sürdü?"
                            className="block w-full rounded-md border border-zinc-700 bg-zinc-900 py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="hours" className="block text-sm font-medium text-zinc-300 font-mono mb-2">Kazanılan Saat</label>
                            <input
                                type="number"
                                id="hours"
                                name="hours"
                                min="1"
                                required
                                value={formData.hours}
                                onChange={handleChange}
                                placeholder="Örn: 4"
                                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="mediaUrl" className="block text-sm font-medium text-zinc-300 font-mono mb-2">Fotoğraf URL (Opsiyonel)</label>
                            <input
                                type="url"
                                id="mediaUrl"
                                name="mediaUrl"
                                value={formData.mediaUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-mono font-bold py-2.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "GÖNDERİLİYOR..." : "ONAYA GÖNDER"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

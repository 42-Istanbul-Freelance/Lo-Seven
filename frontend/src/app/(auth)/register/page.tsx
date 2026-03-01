"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "STUDENT",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${getApiUrl()}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                const text = await res.text();
                setError(text || "Kayıt işlemi başarısız oldu.");
            }
        } catch (err) {
            setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] sm:rounded-2xl sm:px-12 border border-black/5">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Hesap Oluştur
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2">
                            Aramıza katılmak için formu doldurun
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-zinc-700">Ad</label>
                                <div className="mt-1">
                                    <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange}
                                        className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" placeholder="Ahmet" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-zinc-700">Soyad</label>
                                <div className="mt-1">
                                    <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange}
                                        className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" placeholder="Yılmaz" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-700">E-posta Adresi</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" placeholder="ornek@posta.com" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-700">Şifre</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} value={formData.password} onChange={handleChange}
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" placeholder="En az 6 karakter" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-zinc-700">Hesap Türü</label>
                            <div className="mt-1">
                                <select id="role" name="role" value={formData.role} onChange={handleChange}
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm">
                                    <option value="STUDENT">Öğrenci</option>
                                    <option value="TEACHER">Öğretmen</option>
                                    <option value="PRINCIPAL">Okul İdaresi</option>
                                    <option value="HQ">Genel Merkez (LÖSEV)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={isLoading}
                                className="flex w-full justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Zaten hesabınız var mı?{" "}
                    <Link href="/login" className="font-bold text-red-500 hover:text-red-600 transition-colors">
                        Giriş Yapın
                    </Link>
                </p>
            </div>
        </div>
    );
}

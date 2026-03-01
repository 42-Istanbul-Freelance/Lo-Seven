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
            setError("Beklenmeyen bir hata oluştu. Backend'in çalıştığından emin olun.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900 font-mono">
                    [Kayıt_Ol]
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm font-mono">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-zinc-700 font-mono">Ad</label>
                            <div className="mt-2">
                                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange}
                                    className="block w-full rounded-md border border-zinc-300 bg-white py-1.5 text-zinc-900 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-zinc-700 font-mono">Soyad</label>
                            <div className="mt-2">
                                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange}
                                    className="block w-full rounded-md border border-zinc-300 bg-white py-1.5 text-zinc-900 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-700 font-mono">Email Adresi</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                                className="block w-full rounded-md border border-zinc-300 bg-white py-1.5 text-zinc-900 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-700 font-mono">Şifre (Min 6 karakter)</label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} value={formData.password} onChange={handleChange}
                                className="block w-full rounded-md border border-zinc-300 bg-white py-1.5 text-zinc-900 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-zinc-700 font-mono">Rol</label>
                        <div className="mt-2">
                            <select id="role" name="role" value={formData.role} onChange={handleChange}
                                className="block w-full rounded-md border border-zinc-300 bg-white py-2 text-zinc-900 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3 font-mono">
                                <option value="STUDENT">Öğrenci</option>
                                <option value="TEACHER">Öğretmen</option>
                                <option value="PRINCIPAL">Okul İdaresi</option>
                                <option value="HQ">Genel Merkez (LÖSEV)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono">
                            {isLoading ? "Kaydediliyor..." : "KAYIT OL"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-zinc-500 font-mono">
                    Zaten hesabın var mı?{" "}
                    <Link href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 underline underline-offset-4">
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
}

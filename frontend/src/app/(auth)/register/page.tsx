"use client";

import { useState, useEffect } from "react";
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
        schoolId: "",
        schoolName: "",
        schoolType: "LISE",
    });
    const [schools, setSchools] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetch(`${getApiUrl()}/api/v1/auth/schools`)
            .then(res => res.json())
            .then(data => setSchools(data))
            .catch(err => console.error("Failed to fetch schools", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${getApiUrl()}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.role === "PRINCIPAL" ? formData.schoolName : formData.firstName,
                    lastName: formData.role === "PRINCIPAL" ? "" : formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    schoolId: formData.schoolId ? parseInt(formData.schoolId, 10) : null,
                    schoolName: formData.role === "PRINCIPAL" ? formData.schoolName : null,
                    schoolType: formData.role === "PRINCIPAL" ? formData.schoolType : null,
                }),
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

                        {formData.role === "PRINCIPAL" ? (
                            /* PRINCIPAL: Kurum Adı only, no Soyad */
                            <div>
                                <label htmlFor="schoolName" className="block text-sm font-medium leading-6 text-zinc-700">Kurum Adı</label>
                                <div className="mt-1">
                                    <input id="schoolName" name="schoolName" type="text" required value={formData.schoolName} onChange={handleChange}
                                        className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm" placeholder="Örnek Lisesi" />
                                </div>
                            </div>
                        ) : (
                            /* STUDENT / TEACHER: Ad ve Soyad */
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
                        )}

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
                                </select>
                            </div>
                        </div>

                        {formData.role === "PRINCIPAL" && (
                            <div>
                                <label htmlFor="schoolType" className="block text-sm font-medium leading-6 text-zinc-700">Okul Türü</label>
                                <div className="mt-1">
                                    <select id="schoolType" name="schoolType" value={formData.schoolType} onChange={handleChange}
                                        className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm">
                                        <option value="ORTAOKUL">Ortaokul</option>
                                        <option value="LISE">Lise</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {["STUDENT", "TEACHER"].includes(formData.role) && (
                            <div>
                                <label htmlFor="schoolId" className="block text-sm font-medium leading-6 text-zinc-700">Okul Seçimi</label>
                                <div className="mt-1">
                                    <select id="schoolId" name="schoolId" required value={formData.schoolId} onChange={handleChange}
                                        className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm">
                                        <option value="" disabled>Lütfen okulunuzu seçin</option>
                                        {schools.map(school => (
                                            <option key={school.id} value={school.id}>{school.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

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

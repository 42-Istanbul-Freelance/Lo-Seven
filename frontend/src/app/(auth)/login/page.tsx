"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
            } else {
                router.push("/dashboard");
                router.refresh();
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
                <div className="bg-white py-12 px-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] sm:rounded-2xl sm:px-12 border border-black/5">
                    <div className="mb-8 text-center flex flex-col items-center">
                        <Image
                            src="/logo.svg"
                            alt="LoSeven Logo"
                            width={180}
                            height={60}
                            className="object-contain mb-4"
                            priority
                        />
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Hoş Geldiniz
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2">
                            Sosyal Etki Platformu
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-700">
                                Email Adresi
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
                                    placeholder="ornek@posta.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-700">
                                Şifre
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-zinc-200 bg-[#fafafa] py-3 px-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Hesabınız yok mu?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                        Kayıt Ol
                    </Link>
                </p>
            </div>
        </div>
    );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="border-b border-zinc-300 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="LoSeven Logo"
                        width={140}
                        height={40}
                        className="object-contain h-10 w-auto"
                        priority
                    />
                </Link>

                <div className="flex items-center">
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-4">
                            {session?.user?.role === "HQ" && (
                                <Link
                                    href="/dashboard/roles"
                                    className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                                >
                                    Yetki Yönetimi
                                </Link>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="bg-white border border-zinc-200 text-zinc-600 text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-red-600 transition-colors shadow-[0_2px_10px_-3px_rgba(239,68,68,0.3)]"
                        >
                            Giriş Yap
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

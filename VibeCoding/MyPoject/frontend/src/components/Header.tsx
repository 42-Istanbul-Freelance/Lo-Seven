"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="border-b border-zinc-300 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400">[</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900">Lösev Medya</span>
                    <span className="font-mono text-xs text-zinc-400">]</span>
                </Link>

                <div className="flex items-center">
                    {status === "authenticated" ? (
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="bg-red-500 text-white text-xs font-mono font-bold px-4 py-1.5 rounded-md hover:bg-red-600 transition-colors"
                        >
                            ÇIKIŞ_YAP
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-zinc-900 text-white text-xs font-mono font-bold px-4 py-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                        >
                            GİRİŞ_YAP
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

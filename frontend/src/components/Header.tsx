"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="LoSeven Logo"
                        width={180}
                        height={40}
                        className="object-contain h-8 w-auto"
                        priority
                    />
                </Link>

                {/* Center Navigation Links (Only authenticated users) */}
                {status === "authenticated" && session?.user?.role !== "HQ" && session?.user?.role !== "PRINCIPAL" && (
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link href="/dashboard" className="text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1 translate-y-0.5">
                            Dashboard
                        </Link>
                        <Link href="/explore" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                            Explore
                        </Link>
                        <Link href="/community" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                            Community
                        </Link>
                    </nav>
                )}

                {/* Right Side: Profile / Actions */}
                <div className="flex items-center">
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-6">
                            {session?.user?.role === "HQ" && (
                                <Link
                                    href="/dashboard/roles"
                                    className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                                >
                                    Yetki Yönetimi
                                </Link>
                            )}

                            {/* User Profile display instead of raw Logout button */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-xs font-semibold text-zinc-800">Hi, {session.user?.name?.split(" ")[0] || "Student"}</p>
                                </div>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 cursor-pointer outline-none">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center font-bold text-zinc-500 border border-zinc-200">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{session.user?.name?.charAt(0) || "U"}</span>
                                            )}
                                        </div>
                                        <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="p-2 space-y-1">
                                            <Link href="/profile" className="block px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-lg hover:text-zinc-900">Profilim</Link>
                                            <Link href="/settings" className="block px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-lg hover:text-zinc-900">Ayarlar</Link>
                                            <button onClick={() => signOut({ callbackUrl: "/login" })} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">Çıkış Yap</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-red-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                        >
                            Giriş Yap
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

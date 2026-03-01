"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-6xl mx-auto p-4 md:p-8 flex gap-8">

                {/* Left Mini Sidebar */}
                <aside className="w-16 shrink-0 flex flex-col items-center py-6 gap-8 text-zinc-400 pt-16">
                    <Link href="/dashboard" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </Link>
                    <Link href="/explore" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                    </Link>
                    <Link href="/gamified" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </Link>
                    <div className="flex-1"></div>
                    <button className="p-2 text-zinc-900 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-[32px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-zinc-50 overflow-hidden min-h-[750px] p-8 md:p-12 relative flex flex-col">

                    {/* Top Icons Header */}
                    <div className="absolute top-8 right-12 flex items-center gap-4 text-zinc-400">
                        <button className="p-2 hover:text-zinc-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <Link href="/notifications" className="p-2 hover:text-zinc-900 transition-colors relative">
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </Link>
                        <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center bg-red-50 text-xs font-bold text-red-500">
                            {session.user?.name?.charAt(0) || "U"}
                        </Link>
                    </div>

                    <h1 className="text-3xl font-bold text-zinc-900 mb-10">App Settings</h1>

                    {/* Profile Banner */}
                    <div className="flex items-center gap-6 mb-16 px-4">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-2xl font-bold text-red-500 ring-4 ring-red-100/50">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-500 mb-1">{session.user?.email}</p>
                            <h2 className="text-2xl font-bold text-zinc-900">{session.user?.name || "Your Profile"}</h2>
                        </div>

                        <Link href="/profile" className="ml-8 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors shadow-sm border border-zinc-100">
                            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl px-4">

                        {/* Connections Col */}
                        <div className="flex-1 space-y-6">
                            <h3 className="text-lg font-bold text-zinc-900">Connections</h3>

                            <div className="bg-[#f0f2f5] rounded-[24px] p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Alex" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                            <span className="font-bold text-sm text-zinc-900">Alex Johnson</span>
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500">volunteer</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Maya" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                            <span className="font-bold text-sm text-zinc-900">Maya Lee</span>
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500">leader</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Jordan" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                            <span className="font-bold text-sm text-zinc-900">Jordan Smith</span>
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500">supporter</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-zinc-200/50">
                                    <input
                                        type="email"
                                        placeholder="Enter email to connect"
                                        className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                    <button className="bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm">
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#f0f2f5] rounded-[24px] p-6 flex items-center justify-between mt-8">
                                <p className="text-sm font-semibold text-zinc-600">Stay active in the community. Want to leave?</p>
                                <button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm shrink-0">
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Options Col */}
                        <div className="w-full md:w-80 shrink-0 space-y-10">

                            {/* Volunteer Plan */}
                            <section>
                                <h3 className="text-lg font-bold text-zinc-900 mb-6">Volunteer Plan</h3>
                                <div className="bg-[#f0f2f5] rounded-[24px] p-6 space-y-4">
                                    <p className="text-sm font-semibold text-zinc-600 leading-relaxed">
                                        Track 50 hours monthly. Need more?
                                    </p>
                                    <button className="bg-red-500 text-white font-bold text-sm px-8 py-3 rounded-[14px] hover:bg-red-600 transition-colors shadow-sm">
                                        Upgrade
                                    </button>
                                </div>
                            </section>

                            {/* Privacy Options */}
                            <section>
                                <h3 className="text-lg font-bold text-zinc-900 mb-6">Privacy Options</h3>
                                <div className="bg-[#f0f2f5] rounded-[24px] p-6 space-y-6">
                                    <p className="text-sm font-semibold text-zinc-600 leading-relaxed">
                                        Control who sees your posts.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-red-500 text-white font-bold text-sm py-3.5 rounded-[14px] shadow-md transition-all scale-100 hover:scale-[1.02]">
                                            Public
                                        </button>
                                        <button className="flex-1 bg-[#ff4d4d] text-white font-bold text-sm py-3.5 rounded-[14px] shadow-sm hover:bg-red-500 transition-colors opacity-90">
                                            Private
                                        </button>
                                    </div>
                                </div>
                            </section>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

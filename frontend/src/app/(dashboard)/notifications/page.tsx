"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

type NotificationType = {
    id: number;
    type: string;
    message: string;
    actorName: string | null;
    referenceId: number | null;
    isRead: boolean;
    createdAt: string;
};

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string[]>(["LIKE", "COMMENT", "ACTIVITY_APPROVED", "ACTIVITY_REJECTED", "BADGE"]);

    const fetchNotifications = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/notifications`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
                setNotifications(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) fetchNotifications();
    }, [session?.accessToken, fetchNotifications]);

    const handleMarkAllRead = async () => {
        try {
            await fetch(`${getApiUrl()}/api/v1/notifications/mark-all-read`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await fetch(`${getApiUrl()}/api/v1/notifications/${id}/mark-read`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const toggleFilter = (type: string) => {
        setFilter(prev => prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]);
    };

    const filteredNotifications = notifications.filter(n => filter.includes(n.type));

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "LIKE": return "❤️";
            case "COMMENT": return "💬";
            case "ACTIVITY_APPROVED": return "✅";
            case "ACTIVITY_REJECTED": return "❌";
            case "BADGE": return "🏆";
            default: return "🔔";
        }
    };

    const getTimeDiff = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return "şimdi";
        if (hours < 24) return `${hours}s`;
        return `${Math.floor(hours / 24)}g`;
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">

                {/* Left Sidebar Menu */}
                <aside className="w-full md:w-64 shrink-0 flex flex-col pt-4">
                    <h2 className="text-xl font-bold text-zinc-400 px-4 mb-8 tracking-tight">Menü</h2>
                    <nav className="space-y-6">
                        <div>
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">
                                <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Ana Sayfa
                            </Link>
                        </div>
                        <div>
                            <div className="flex items-center justify-between px-4 py-2 text-zinc-400 font-semibold mb-1 cursor-default">
                                <span className="flex items-center gap-3 text-zinc-900">
                                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                                    Gönüllülük
                                </span>
                            </div>
                            <div className="pl-12 flex flex-col space-y-3 mt-2 border-l-2 border-zinc-100 ml-6">
                                <Link href="/explore" className="text-sm text-zinc-500 hover:text-zinc-900">Fırsatları Keşfet</Link>
                                <Link href="/gamified" className="text-sm text-zinc-500 hover:text-zinc-900">Gelişimim</Link>
                                <Link href="/gamified" className="text-sm text-zinc-500 hover:text-zinc-900">Başarılarım</Link>
                                <Link href="/community" className="text-sm text-zinc-500 hover:text-zinc-900">Sosyal Akış</Link>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between px-4 py-2 text-zinc-400 font-semibold mb-1 cursor-default">
                                <span className="flex items-center gap-3 text-zinc-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Gönüllü Paneli
                                </span>
                            </div>
                            <div className="pl-12 flex flex-col space-y-3 mt-2 border-l-2 border-zinc-100 ml-6">
                                <Link href="/profile" className="text-sm text-zinc-500 hover:text-zinc-900">Profilim</Link>
                                <Link href="/gamified" className="text-sm text-zinc-500 hover:text-zinc-900">Rozetlerim</Link>
                                <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900">Son Aktiviteler</Link>
                            </div>
                        </div>
                    </nav>
                    <div className="mt-auto pt-10 px-4">
                        <Link href="/onboarding" className="flex items-center gap-2 text-sm text-zinc-400 font-semibold hover:text-zinc-900">
                            <span className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center text-[10px]">i</span>
                            Gönüllülüğe Başla
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-[32px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-zinc-50 overflow-hidden flex min-h-[750px]">

                    {/* Notifications Feed */}
                    <div className="flex-1 p-8 md:p-12 border-r border-zinc-50">
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-3xl font-bold text-zinc-400/50 uppercase tracking-wider">Bildirimler</h1>
                            <button
                                onClick={handleMarkAllRead}
                                className="bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-full px-5 py-2 hover:bg-zinc-100 transition-colors"
                            >
                                Tümünü okundu işaretle
                            </button>
                        </div>

                        <div className="space-y-2">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                    <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    <p className="font-semibold">Henüz bildirim yok</p>
                                    <p className="text-sm mt-1">Her şey harika görünüyor!</p>
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl transition-colors group cursor-pointer ${notification.isRead ? 'hover:bg-zinc-50' : 'bg-red-50/30 hover:bg-red-50/50'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-lg">
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <p className="text-sm text-zinc-600 mb-1">
                                                {notification.actorName && <span className="font-bold text-zinc-800 mr-1">{notification.actorName}</span>}
                                                {notification.message.replace(notification.actorName || "", "").trim()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1 shrink-0">
                                            <span className="text-xs font-bold text-zinc-300 group-hover:text-zinc-400">{getTimeDiff(notification.createdAt)}</span>
                                            {!notification.isRead && <div className="w-2 h-2 rounded-full bg-red-400"></div>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Filter Sidebar */}
                    <div className="w-72 shrink-0 bg-[#fafafa] p-8 hidden lg:block">
                        <h3 className="text-lg font-bold text-zinc-400 mb-8">Filtrele</h3>
                        <div className="bg-[#f2f2f2] rounded-3xl p-6 space-y-6 border border-zinc-100 shadow-sm">
                            {[
                                { key: "COMMENT", label: "Yorumlar" },
                                { key: "LIKE", label: "Beğeniler" },
                                { key: "ACTIVITY_APPROVED", label: "Onaylananlar" },
                                { key: "ACTIVITY_REJECTED", label: "Reddedilenler" },
                                { key: "BADGE", label: "Rozetler" },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-800 transition-colors">{label}</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={filter.includes(key)}
                                            onChange={() => toggleFilter(key)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${filter.includes(key) ? 'bg-red-500 border-red-500' : 'bg-white border-zinc-300'}`}>
                                            {filter.includes(key) && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}

                            <div className="flex gap-3 pt-4 border-t border-zinc-200/50">
                                <button
                                    onClick={() => setFilter(["LIKE", "COMMENT", "ACTIVITY_APPROVED", "ACTIVITY_REJECTED", "BADGE"])}
                                    className="flex-1 bg-red-100 text-red-600 font-bold text-[11px] uppercase tracking-wide py-2.5 rounded-xl hover:bg-red-200 transition-colors"
                                >Tümünü Seç</button>
                                <button
                                    onClick={() => setFilter([])}
                                    className="flex-1 bg-red-100 text-red-600/60 font-bold text-[11px] uppercase tracking-wide py-2.5 rounded-xl hover:bg-red-200 hover:text-red-600 transition-colors"
                                >Temizle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

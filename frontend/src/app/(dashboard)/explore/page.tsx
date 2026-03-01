"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

type ActivityType = {
    id: number;
    title: string;
    description: string;
    hours: number;
    mediaUrl: string | null;
    status: string;
    studentName: string;
    createdAt: string;
};

export default function ExplorePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchActivities = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities/my`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (err) {
            console.error("Failed to fetch activities:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) fetchActivities();
    }, [session?.accessToken, fetchActivities]);

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    const selectedActivity = activities[selectedIndex] || null;

    // Fallback highlights with unsplash images for empty state
    const defaultImages = [
        "https://images.unsplash.com/photo-1593113565694-c700e5fff0b5?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=300",
    ];

    const getProgressForActivity = (act: ActivityType) => {
        if (act.status === "APPROVED") return 100;
        if (act.status === "PENDING") return 50;
        return 0;
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-6xl mx-auto p-4 md:p-8 flex gap-8">

                {/* Left Mini Sidebar */}
                <aside className="w-16 shrink-0 flex flex-col items-center py-6 gap-8 text-zinc-400">
                    <Link href="/dashboard" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    </Link>
                    <Link href="/community" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                    </Link>
                    <Link href="/gamified" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    </Link>
                    <div className="flex-1"></div>
                    <Link href="/settings" className="p-2 text-zinc-900 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden flex flex-col md:flex-row min-h-[700px]">

                    {/* Impact List */}
                    <div className="w-full md:w-[45%] border-r border-zinc-100 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Your Impact</h2>
                            <Link href="/dashboard/activities/new" className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-colors px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                + Add
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                            {activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    <p className="font-semibold text-sm">Henüz etkinlik yok</p>
                                    <Link href="/dashboard/activities/new" className="text-red-500 font-bold text-sm mt-2 hover:underline">İlk etkinliğini sen ekle</Link>
                                </div>
                            ) : (
                                activities.map((activity, index) => {
                                    const progress = getProgressForActivity(activity);
                                    return (
                                        <div
                                            key={activity.id}
                                            onClick={() => setSelectedIndex(index)}
                                            className={`p-4 rounded-2xl flex gap-4 items-center cursor-pointer transition-colors border ${index === selectedIndex ? 'bg-zinc-50 border-zinc-200' : 'bg-white border-transparent hover:bg-zinc-50'}`}
                                        >
                                            <div className="w-20 h-16 rounded-xl bg-red-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                {activity.mediaUrl ? (
                                                    <img src={activity.mediaUrl} alt={activity.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={defaultImages[index % defaultImages.length]} alt={activity.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-sm text-zinc-900 truncate">{activity.title}</h3>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${activity.status === "APPROVED" ? 'bg-green-500' : activity.status === "PENDING" ? 'bg-yellow-400' : 'bg-red-500'}`}>
                                                        <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 mb-3">{activity.hours}s · {activity.status === 'APPROVED' ? 'ONAYLANDI' : activity.status === 'PENDING' ? 'BEKLEMEDE' : 'REDDEDİLDİ'}</p>
                                                <div className="flex items-center justify-between gap-3 text-[10px] font-bold text-zinc-500">
                                                    <div className="flex-1 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${activity.status === "APPROVED" ? 'bg-green-400' : 'bg-zinc-400'}`} style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <span>{progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="w-full md:w-[55%] bg-[#f8f9fa] p-8 flex flex-col">
                        {selectedActivity ? (
                            <>
                                <div className="w-full h-64 rounded-2xl bg-zinc-200 overflow-hidden mb-8 shadow-sm">
                                    <img
                                        src={selectedActivity.mediaUrl || defaultImages[selectedIndex % defaultImages.length]}
                                        alt={selectedActivity.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h2 className="text-xl font-bold text-zinc-900 mb-4">{selectedActivity.title}</h2>

                                <div className="flex items-center gap-3 mb-6 bg-white self-start px-4 py-2 rounded-xl shadow-sm border border-zinc-100">
                                    <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-xs font-bold text-red-500">
                                        {session.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-800">{session.user?.name}</span>
                                </div>

                                <div className="flex flex-col gap-2 mb-8">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                        {selectedActivity.hours}h
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedActivity.status === "APPROVED" ? 'bg-green-100 text-green-700' : selectedActivity.status === "PENDING" ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {selectedActivity.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-auto">
                                    <h3 className="font-bold text-sm text-zinc-900 mb-2">Açıklama</h3>
                                    <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
                                        {selectedActivity.description}
                                    </p>
                                </div>

                                <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-200/50">
                                    <Link href="/dashboard/activities/new" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm text-center">
                                        Yeni Etkinlik Ekle
                                    </Link>
                                    <Link href="/gamified" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm text-center">
                                        Başarıları Gör
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-zinc-400">
                                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                <p className="font-bold text-lg mb-2">Keşfetmeye Başla</p>
                                <p className="text-sm text-center max-w-xs">İlk gönüllülük görevini ekle ve serüvenini buradan takip et.</p>
                                <Link href="/dashboard/activities/new" className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors shadow-sm">
                                    Başla
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

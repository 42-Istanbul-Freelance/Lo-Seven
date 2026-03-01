"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

interface SchoolStats {
    schoolId: number;
    schoolName: string;
    studentCount: number;
    totalApprovedHours: number;
    totalPoints: number;
}

interface HqStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalSchools: number;
    totalActivities: number;
    approvedActivities: number;
    pendingActivities: number;
    totalPosts: number;
    schoolLeaderboard: SchoolStats[];
}

interface Activity {
    id: number;
    title: string;
    description: string;
    hours: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    mediaUrl?: string;
    approverName?: string;
    studentName?: string;
}

export default function HqDashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<HqStats | null>(null);
    const [pendingActivities, setPendingActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.accessToken) return;
            try {
                const statsRes = await fetch(`${getApiUrl()}/api/v1/reports/stats`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` }
                });
                if (statsRes.ok) setStats(await statsRes.json());
                else setError("API Hatası (Stats)");

                const activitiesRes = await fetch(`${getApiUrl()}/api/v1/activities/pending`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` }
                });
                if (activitiesRes.ok) {
                    setPendingActivities(await activitiesRes.json());
                }
            } catch (e) { setError("Bağlantı hatası oluştu."); }
            finally { setIsLoading(false); }
        };

        if (status === "authenticated") fetchDashboardData();
        else if (status === "unauthenticated") { setIsLoading(false); setError("Giriş yapmanız gerekiyor."); }
    }, [session, status]);

    const handleApprove = async (id: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities/${id}/approve`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` }
            });
            if (res.ok) setPendingActivities(pendingActivities.filter(a => a.id !== id));
        } catch (e) { console.error(e); }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities/${id}/reject`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` }
            });
            if (res.ok) setPendingActivities(pendingActivities.filter(a => a.id !== id));
        } catch (e) { console.error(e); }
    };

    const filteredActivities = pendingActivities.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading || status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="flex bg-[#f8f9fa] min-h-screen items-center justify-center flex-col p-4 text-center">
            <p className="font-semibold text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100">{error}</p>
        </div>;
    }

    if (!stats) return null;

    const kpiCards = [
        { label: "Toplam Saat", value: stats.schoolLeaderboard.reduce((acc, curr) => acc + curr.totalApprovedHours, 0) + "h" },
        { label: "Aktif Öğrenciler", value: stats.totalStudents },
        { label: "Bekleyen Onay", value: Math.max(stats.pendingActivities, pendingActivities.length) },
        { label: "Okullar", value: stats.totalSchools }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-zinc-800">

            {/* Sidebar (Desktop Persistent - Minimalist) */}
            <aside className="w-full md:w-64 bg-[#f8f9fa] md:min-h-screen border-r border-zinc-200 flex-shrink-0 flex flex-col hidden md:flex">
                <div className="p-6">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="LoSeven Logo"
                            width={140}
                            height={40}
                            className="object-contain h-8 w-auto mb-1"
                            priority
                        />
                    </Link>
                    <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wider">{session?.user?.role} PANELİ</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <Link href="/dashboard/hq" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span>Genel Bakış</span>
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-white hover:shadow-sm transition-all group">
                        <svg className="w-5 h-5 group-hover:text-zinc-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="group-hover:text-zinc-800 transition-colors">Öğrenciler</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-white hover:shadow-sm transition-all relative group">
                        <svg className="w-5 h-5 group-hover:text-zinc-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="group-hover:text-zinc-800 transition-colors">Onaylamalar</span>
                        {pendingActivities.length > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {pendingActivities.length}
                            </span>
                        )}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-white hover:shadow-sm transition-all group">
                        <svg className="w-5 h-5 group-hover:text-zinc-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="group-hover:text-zinc-800 transition-colors">Ayarlar</span>
                    </a>
                </nav>

                <div className="p-6 border-t border-zinc-200 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-200 border border-white shadow-sm flex items-center justify-center font-bold text-zinc-600">
                            {session?.user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-zinc-900 truncate">{session?.user?.name}</p>
                            <Link href="/api/auth/signout" className="text-xs text-zinc-400 hover:text-red-500 transition-colors block">Çıkış Yap</Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* Top Header */}
                <header className="bg-white/50 backdrop-blur-md h-16 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 border-b border-zinc-100">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Aktivite veya öğrenci ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {pendingActivities.length > 0 && (
                                <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* KPI Grid (Minimalist) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {kpiCards.map((kpi, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-5 flex flex-col justify-between h-28">
                                    <dt className="text-sm font-medium text-zinc-500">{kpi.label}</dt>
                                    <dd className="text-3xl font-bold text-zinc-900 tracking-tight">{kpi.value}</dd>
                                </div>
                            ))}
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Data Table: Pending Approvals (Spans 2 columns) */}
                            <div className="xl:col-span-2 bg-white border border-zinc-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col overflow-hidden">
                                <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center">
                                    <h3 className="text-base font-bold text-zinc-900">Bekleyen Onaylar</h3>
                                    <span className="bg-red-50 text-red-600 py-1 px-3 rounded-md text-xs font-semibold">{pendingActivities.length} İstek</span>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    {filteredActivities.length === 0 ? (
                                        <div className="p-10 text-center text-zinc-500 text-sm">
                                            Bekleyen onay işlemi bulunmamaktadır. Harika!
                                        </div>
                                    ) : (
                                        <table className="min-w-full">
                                            <thead className="bg-[#fafafa] border-b border-zinc-100">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">Görsel</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">Öğrenci & Aktivite</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">Detaylar</th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">Aksiyon</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-zinc-50">
                                                {filteredActivities.map((activity) => (
                                                    <tr key={activity.id} className="hover:bg-zinc-50/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {activity.mediaUrl ? (
                                                                <img src={activity.mediaUrl} alt="Aktivite" className="w-12 h-12 object-cover rounded-lg border border-zinc-200" />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 border border-zinc-200">
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-zinc-900 text-sm mb-0.5">{activity.title}</span>
                                                                <span className="text-xs text-zinc-500 line-clamp-1">{activity.description}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-zinc-700 font-medium">{activity.hours} Saat</span>
                                                                <span className="text-xs text-zinc-400">{new Date(activity.createdAt).toLocaleDateString("tr-TR")}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleApprove(activity.id)}
                                                                    className="px-3 py-1.5 border border-red-500 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                                >
                                                                    Onayla
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(activity.id)}
                                                                    className="px-3 py-1.5 border border-zinc-200 text-zinc-500 text-xs font-bold rounded-lg hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                                                                >
                                                                    Reddet
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                            {/* Secondary Information: Top Schools Sidebar Component */}
                            <div className="xl:col-span-1 bg-white border border-zinc-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
                                <div className="px-6 py-5 border-b border-zinc-100">
                                    <h3 className="text-base font-bold text-zinc-900">Okul Sıralaması</h3>
                                </div>
                                <div className="p-6 flex-1 overflow-auto">
                                    {stats.schoolLeaderboard.length === 0 ? (
                                        <p className="text-sm text-zinc-500 text-center py-4">Sıralama verisi yok.</p>
                                    ) : (
                                        <ul className="space-y-5">
                                            {stats.schoolLeaderboard.slice(0, 5).map((school, idx) => (
                                                <li key={school.schoolId} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${idx === 0 ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                                            idx === 1 ? 'bg-zinc-50 border-zinc-200 text-zinc-500' :
                                                                idx === 2 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-[#fafafa] border-transparent text-zinc-400'
                                                            }`}>
                                                            {idx + 1}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold text-zinc-800 truncate" title={school.schoolName}>{school.schoolName}</p>
                                                            <p className="text-[11px] text-zinc-400">{school.studentCount} Öğrenci</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right pl-2">
                                                        <p className="text-sm font-bold text-zinc-900 group-hover:text-red-500 transition-colors">{school.totalApprovedHours}s</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

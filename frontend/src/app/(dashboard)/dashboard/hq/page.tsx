"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function HqDashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<HqStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.accessToken) return;
            try {
                const res = await fetch(`${getApiUrl()}/api/v1/reports/stats`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` }
                });
                if (res.ok) setStats(await res.json());
                else setError(`API Hatası: ${res.status}`);
            } catch (e) { setError("Bağlantı hatası"); }
            finally { setIsLoading(false); }
        };

        if (status === "authenticated") fetchStats();
        else if (status === "unauthenticated") { setIsLoading(false); setError("Giriş yapmanız gerekiyor."); }
    }, [session, status]);

    if (isLoading || status === "loading") {
        return <div className="flex h-[80vh] items-center justify-center"><p className="font-mono text-zinc-400">İstatistikler yükleniyor...</p></div>;
    }

    if (error) {
        return <div className="flex h-[80vh] items-center justify-center flex-col gap-4"><p className="font-mono text-red-500">Hata: {error}</p><Link href="/dashboard" className="font-mono text-sm text-zinc-400 hover:text-indigo-600 underline">← Dashboard&apos;a Dön</Link></div>;
    }

    if (!stats) {
        return <div className="flex h-[80vh] items-center justify-center flex-col gap-4"><p className="font-mono text-zinc-400">Veri bulunamadı.</p><Link href="/dashboard" className="font-mono text-sm text-zinc-400 hover:text-indigo-600 underline">← Dashboard&apos;a Dön</Link></div>;
    }

    const statCards = [
        { label: "Toplam Kullanıcı", value: stats.totalUsers, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
        { label: "Öğrenci", value: stats.totalStudents, color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
        { label: "Öğretmen", value: stats.totalTeachers, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
        { label: "Okul Sayısı", value: stats.totalSchools, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
        { label: "Toplam Aktivite", value: stats.totalActivities, color: "text-green-600", bg: "bg-green-50 border-green-200" },
        { label: "Onaylanan", value: stats.approvedActivities, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
        { label: "Bekleyen", value: stats.pendingActivities, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
        { label: "Paylaşım", value: stats.totalPosts, color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
    ];

    const totalAct = stats.totalActivities || 1;
    const approvedPct = Math.round((stats.approvedActivities / totalAct) * 100);
    const pendingPct = Math.round((stats.pendingActivities / totalAct) * 100);
    const rejectedPct = 100 - approvedPct - pendingPct;
    const maxHours = Math.max(...stats.schoolLeaderboard.map(s => s.totalApprovedHours), 1);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-mono text-zinc-900">[Genel_Merkez_Raporu]</h1>
                        <p className="font-mono text-sm text-zinc-500 mt-1">Tüm okulların özet istatistikleri ve performans analizi</p>
                    </div>
                    <Link href="/dashboard" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-4 py-2 rounded-md font-mono text-sm transition-colors border border-zinc-200">
                        ← Dashboard
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div key={card.label} className={`border rounded-lg p-5 ${card.bg}`}>
                            <p className="font-mono text-xs text-zinc-500 mb-1">{card.label}</p>
                            <p className={`text-3xl font-bold font-mono ${card.color}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Activity Distribution Chart */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-mono text-zinc-900 mb-6">[Aktivite_Dağılımı]</h2>
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-44 h-44">
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3"
                                        strokeDasharray={`${approvedPct} ${100 - approvedPct}`} strokeDashoffset="0" />
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f59e0b" strokeWidth="3"
                                        strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={`${-approvedPct}`} />
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ef4444" strokeWidth="3"
                                        strokeDasharray={`${rejectedPct} ${100 - rejectedPct}`} strokeDashoffset={`${-(approvedPct + pendingPct)}`} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold font-mono text-zinc-900">{stats.totalActivities}</span>
                                    <span className="text-xs font-mono text-zinc-400">Toplam</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 font-mono text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-zinc-600">Onaylı ({approvedPct}%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-zinc-600">Bekleyen ({pendingPct}%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-zinc-600">Red ({rejectedPct}%)</span></div>
                        </div>
                    </div>

                    {/* School Hours Bar Chart */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-mono text-zinc-900 mb-6">[Okul_Bazlı_Gönüllülük_Saati]</h2>
                        {stats.schoolLeaderboard.length === 0 ? (
                            <p className="font-mono text-sm text-zinc-400 text-center py-6">Henüz okul verisi yok.</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.schoolLeaderboard.slice(0, 10).map((school, idx) => (
                                    <div key={school.schoolId}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-mono text-sm text-zinc-700 truncate max-w-[60%]">
                                                {idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : `${idx + 1}. `}{school.schoolName}
                                            </span>
                                            <span className="font-mono text-xs text-green-600 font-bold">{school.totalApprovedHours}h</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
                                            <div className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-indigo-500 to-indigo-400"
                                                style={{ width: `${Math.max(3, (school.totalApprovedHours / maxHours) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* School XP Cards */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-mono text-zinc-900 mb-6">[Okul_XP_Sıralaması]</h2>
                    {stats.schoolLeaderboard.length === 0 ? (
                        <p className="font-mono text-sm text-zinc-400 text-center py-6">Veri yok.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.schoolLeaderboard.map((school, idx) => (
                                <div key={school.schoolId} className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm
                                            ${idx === 0 ? "bg-yellow-100 text-yellow-700" : idx === 1 ? "bg-zinc-200 text-zinc-600" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-zinc-100 text-zinc-500"}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-mono text-sm font-bold text-zinc-800 truncate">{school.schoolName}</h3>
                                            <p className="font-mono text-xs text-zinc-500">{school.studentCount} öğrenci</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                                            <p className="text-lg font-bold font-mono text-green-700">{school.totalApprovedHours}h</p>
                                            <p className="text-[10px] font-mono text-zinc-500">Onaylı Saat</p>
                                        </div>
                                        <div className="bg-indigo-50 border border-indigo-200 rounded p-2 text-center">
                                            <p className="text-lg font-bold font-mono text-indigo-700">{school.totalPoints}</p>
                                            <p className="text-[10px] font-mono text-zinc-500">Toplam XP</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-mono text-zinc-900 mb-6">[Detaylı_Okul_Tablosu]</h2>
                    {stats.schoolLeaderboard.length === 0 ? (
                        <p className="font-mono text-sm text-zinc-400 text-center py-6">Henüz okul kaydı yok.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 text-zinc-500">
                                        <th className="text-left py-3 px-4">#</th>
                                        <th className="text-left py-3 px-4">Okul</th>
                                        <th className="text-right py-3 px-4">Öğrenci</th>
                                        <th className="text-right py-3 px-4">Onaylı Saat</th>
                                        <th className="text-right py-3 px-4">Toplam XP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.schoolLeaderboard.map((school, index) => (
                                        <tr key={school.schoolId} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                            <td className="py-3 px-4 text-zinc-500">
                                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                                            </td>
                                            <td className="py-3 px-4 text-zinc-800 font-bold">{school.schoolName}</td>
                                            <td className="py-3 px-4 text-right text-cyan-600">{school.studentCount}</td>
                                            <td className="py-3 px-4 text-right text-green-600">{school.totalApprovedHours}h</td>
                                            <td className="py-3 px-4 text-right text-indigo-600 font-bold">{school.totalPoints} XP</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

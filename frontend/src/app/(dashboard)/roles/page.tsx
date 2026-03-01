"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

type Role = "STUDENT" | "TEACHER" | "PRINCIPAL" | "HQ";

interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    level: number;
    points: number;
    totalHours: number;
    createdAt: string;
}

export default function RolesPage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "HQ") {
            fetchUsers();
        } else if (status === "authenticated" && session?.user?.role !== "HQ") {
            setError("Bu sayfayı görüntüleme yetkiniz yok.");
            setIsLoading(false);
        }
    }, [status, session]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/users`, {
                headers: { "Authorization": `Bearer ${session?.accessToken}` }
            });
            if (!res.ok) throw new Error("Kullanıcılar getirilemedi.");
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: Role) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) throw new Error("Yetki güncellenemedi.");

            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert("Yetki başarıyla güncellendi.");
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-zinc-500 font-mono text-sm max-w-4xl mx-auto mt-12">Yükleniyor...</div>;

    if (error) return (
        <div className="max-w-4xl mx-auto mt-12 p-8">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center font-medium">
                {error}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-outfit)]">
                    Yetki Yönetimi
                </h1>
                <p className="text-zinc-500 mt-2 font-sans">
                    Sistemdeki tüm kullanıcıların yetkilerini görebilir ve yönetebilirsiniz.
                </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-[#f8f9fa] border-b border-zinc-200 text-xs uppercase text-zinc-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Kullanıcı</th>
                                <th className="px-6 py-4 font-semibold">E-posta</th>
                                <th className="px-6 py-4 font-semibold">Kayıt Tarihi</th>
                                <th className="px-6 py-4 font-semibold">Mevcut Rol</th>
                                <th className="px-6 py-4 text-right font-semibold">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-zinc-900">{u.firstName} {u.lastName}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5">ID: {u.id} | LVL {u.level}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">
                                        {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'HQ' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'PRINCIPAL' ? 'bg-blue-100 text-blue-800' :
                                                    u.role === 'TEACHER' ? 'bg-teal-100 text-teal-800' :
                                                        'bg-zinc-100 text-zinc-800'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                                            className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer shadow-sm"
                                        >
                                            <option value="STUDENT">Öğrenci (STUDENT)</option>
                                            <option value="TEACHER">Öğretmen (TEACHER)</option>
                                            <option value="PRINCIPAL">Okul Müdürü (PRINCIPAL)</option>
                                            <option value="HQ">Merkez Yönetici (HQ)</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                                        Kullanıcı bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isHqDashboard = pathname?.startsWith('/dashboard/hq');

    return (
        <>
            {!isHqDashboard && <Header />}
            {children}
            {!isHqDashboard && (
                <footer className="border-t border-zinc-200 py-6 mt-auto bg-white">
                    <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
                        <p className="font-mono text-xs text-zinc-400">
                            © {new Date().getFullYear()} LoSeven — LÖSEV Gönüllülük Platformu
                        </p>
                    </div>
                </footer>
            )}
        </>
    );
}

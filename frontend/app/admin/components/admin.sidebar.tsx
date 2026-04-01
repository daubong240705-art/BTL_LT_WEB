"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Film,
    Home,
    LayoutDashboard,
    LogOut,
    Tag,
    Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authApi } from "@/app/services/auth.service";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Film, label: "Quản lý phim", href: "/admin/movies" },
    { icon: Tag, label: "Quản lý thể loại", href: "/admin/categories" },
    { icon: Users, label: "Quản lý người dùng", href: "/admin/users" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await authApi.logout();
        } finally {
            setIsLoggingOut(false);
            router.push("/");
            router.refresh();
        }
    };

    return (
        <aside className="sticky top-0 flex h-screen w-72 flex-col overflow-hidden border-r border-gray-700 bg-gray-800">
            <div className="flex h-full min-h-0 flex-1 flex-col p-6">
                <div className="mb-8 flex items-center gap-2 text-red-600">
                    <Film className="h-8 w-8" />
                    <span className="text-2xl font-bold">Admin</span>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 rounded-lg px-4 py-3 font-medium transition-colors",
                                    isActive
                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/20 hover:bg-red-600"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                )}
                            >
                                <Link href={item.href}>
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                <div className="mt-4 shrink-0 space-y-2 border-t border-gray-700 pt-6">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                    >
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            <span>Về trang chủ</span>
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 rounded-lg px-4 py-3 font-medium text-red-400 transition-colors hover:bg-red-600/10 hover:text-red-300 disabled:opacity-60"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>{isLoggingOut ? "Dang dang xuat..." : "Đăng xuất"}</span>
                    </Button>
                </div>
            </div>
        </aside>
    );
}

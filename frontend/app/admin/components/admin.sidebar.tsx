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
        <aside className="sticky top-0 z-40 w-full border-b border-gray-700 bg-gray-800 lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0">
            <div className="flex w-full flex-col gap-4 p-3 sm:p-4 lg:h-full lg:min-h-0 lg:flex-1 lg:gap-6 lg:p-6">
                <div className="flex items-center gap-2 text-red-600">
                    <Film className="h-7 w-7 shrink-0 lg:h-8 lg:w-8" />
                    <span className="text-xl font-bold lg:text-2xl">Admin</span>
                </div>

                <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "h-auto shrink-0 justify-start gap-3 whitespace-nowrap rounded-lg px-4 py-3 font-medium transition-colors lg:w-full",
                                    isActive
                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/20 hover:bg-red-600"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                )}
                            >
                                <Link href={item.href}>
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                <div className="flex flex-wrap gap-2 border-t border-gray-700 pt-4 lg:mt-auto lg:flex-col lg:gap-2 lg:pt-6">
                    <Button
                        asChild
                        variant="ghost"
                        className="h-auto justify-start gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white lg:w-full"
                    >
                        <Link href="/">
                            <Home className="h-5 w-5 shrink-0" />
                            <span>Về trang chủ</span>
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="h-auto justify-start gap-3 rounded-lg px-4 py-3 font-medium text-red-400 transition-colors hover:bg-red-600/10 hover:text-red-300 disabled:opacity-60 lg:w-full"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span>{isLoggingOut ? "Dang dang xuat..." : "Đăng xuất"}</span>
                    </Button>
                </div>
            </div>
        </aside>
    );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Check, Loader2, LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { authApi, type AccountPayload } from "@/app/services/auth.service";
import { useAuth } from "@/app/context/auth-provider";


type SettingsTab = "general";

type AvatarOption = {
    id: string;
    url: string;
};

const AVATAR_OPTIONS: AvatarOption[] = [
    { id: "hero-red", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Crimson" },
    { id: "hero-blue", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Azure" },
    { id: "hero-gold", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Golden" },
    { id: "hero-neo", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Neo" },
    { id: "hero-luna", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna" },
    { id: "hero-storm", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Storm" },
    { id: "hero-mint", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mint" },
    { id: "hero-sunset", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sunset" },
];

export default function AccountSettingsPage() {
    const router = useRouter();

    const { setUser } = useAuth();

    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [account, setAccount] = useState<AccountPayload | null>(null);

    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0].url);

    const [avatarOpen, setAvatarOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const loadAccount = async () => {
            const res = await authApi.getAccount();

            if (+res.statusCode === 401 || +res.statusCode === 403 || !res.data) {
                toast.error("Vui lòng đăng nhập để xem trang tài khoản.");
                router.push("/login");
                return;
            }

            setAccount(res.data);
            setFullName(res.data.fullName ?? "");
            setAvatarUrl(res.data.avatarUrl || AVATAR_OPTIONS[0].url);
            setIsLoading(false);
        };

        void loadAccount();
    }, [router]);

    const hasChanges = useMemo(() => {
        if (!account) return false;

        return (
            fullName.trim() !== (account.fullName ?? "") ||
            avatarUrl !== (account.avatarUrl ?? "")
        );
    }, [account, avatarUrl, fullName]);

    const handleSaveChanges = async () => {
        if (!account) return;

        const trimmedName = fullName.trim();

        if (!trimmedName) {
            toast.error("Tên hiển thị không được để trống.");
            return;
        }

        setIsSaving(true);

        const res = await authApi.updateProfile({
            fullName: trimmedName,
            avatarUrl,
        });

        setIsSaving(false);

        if (+res.statusCode === 401 || +res.statusCode === 403) {
            toast.error("Phiên đăng nhập đã hết hạn.");
            router.push("/login");
            return;
        }

        if (+res.statusCode >= 400 || !res.data?.user) {
            toast.error(res.message || "Không thể cập nhật.");
            return;
        }

        const updatedUser = res.data.user;

        setAccount(updatedUser);
        setFullName(updatedUser.fullName ?? "");
        setAvatarUrl(updatedUser.avatarUrl || AVATAR_OPTIONS[0].url);

        // ⭐ update global auth state
        setUser(updatedUser);

        toast.success("Cập nhật hồ sơ thành công");
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        await authApi.logout();

        // ⭐ update global auth state
        setUser(null);

        setIsLoggingOut(false);

        toast.success("Đã đăng xuất");

        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-[#111] px-6 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                    Đang tải thông tin tài khoản...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-12 pt-24">
            <div className="container mx-auto max-w-6xl px-4">
                <h1 className="mb-8 text-3xl font-bold text-white">
                    Tài khoản của tôi
                </h1>

                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="sticky top-24 rounded-xl border border-gray-800 bg-[#111] p-4">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("general")}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeTab === "general"
                                        ? "bg-red-600/10 text-red-500"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <User className="h-4 w-4" />
                                    Thông tin chung
                                </button>
                            </nav>

                            <div className="mt-6 space-y-2 border-t border-gray-800 pt-6">
                                <Link
                                    href="/favorites"
                                    className="block rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                                >
                                    Tủ phim của tôi
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-red-600/10 hover:text-red-500"
                                >
                                    {isLoggingOut ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="h-4 w-4" />
                                    )}
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="lg:w-3/4">
                        <div className="rounded-xl border border-gray-800 bg-[#111] p-8">

                            <h2 className="mb-6 border-b border-gray-800 pb-4 text-xl font-bold text-white">
                                Hồ sơ cá nhân
                            </h2>

                            {/* Avatar */}
                            <div className="mb-8 flex flex-col items-start gap-8 md:flex-row">

                                <Popover open={avatarOpen} onOpenChange={setAvatarOpen}>
                                    <PopoverTrigger asChild>
                                        <button className="group relative mx-auto md:mx-0">
                                            <div className="flex h-32 w-32 overflow-hidden rounded-full ring-4 ring-gray-800 transition-all group-hover:ring-red-500">
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-all group-hover:opacity-100">
                                                <Camera className="h-7 w-7 text-white" />
                                            </div>
                                        </button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-105 border-gray-800 bg-[#0d0d0d] p-4">
                                        <div className="mb-4 text-sm text-gray-400">
                                            Chọn avatar
                                        </div>

                                        <ScrollArea className="h-50">
                                            <div className="grid grid-cols-4 gap-3">

                                                {AVATAR_OPTIONS.map((avatar) => {
                                                    const isSelected = avatar.url === avatarUrl;

                                                    return (
                                                        <button
                                                            key={avatar.id}
                                                            onClick={() => {
                                                                setAvatarUrl(avatar.url);
                                                                setAvatarOpen(false);
                                                            }}
                                                            className={`relative rounded-xl border p-2 ${isSelected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "border-gray-800 hover:border-gray-700"
                                                                }`}
                                                        >
                                                            <div className="h-14 w-14 overflow-hidden rounded-full">
                                                                <img
                                                                    src={avatar.url}
                                                                    alt={avatar.id}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>

                                                            {isSelected && (
                                                                <div className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1">
                                                                    <Check className="h-3 w-3 text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}

                                            </div>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>

                                {/* Info */}
                                <div className="w-full flex-1 space-y-4">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-2 text-white"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            value={account?.username}
                                            disabled
                                            className="rounded-lg border border-gray-800 bg-[#1a1a1a] px-4 py-2 text-gray-500"
                                        />

                                        <input
                                            value={account?.email}
                                            disabled
                                            className="rounded-lg border border-gray-800 bg-[#1a1a1a] px-4 py-2 text-gray-500"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-800 pt-6">
                                <Button
                                    onClick={handleSaveChanges}
                                    disabled={!hasChanges || isSaving}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isSaving && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Lưu thay đổi
                                </Button>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
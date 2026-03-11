"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SettingsTab = 'general' | 'password' | 'history';

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [fullName, setFullName] = useState('Minh Đức Ngô');
    const [avatarUrl, setAvatarUrl] = useState('');

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Đã lưu thay đổi!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-white mb-8">Tài khoản của tôi</h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- LEFT SIDEBAR (Menu) --- */}
                    <aside className="lg:w-1/4">
                        <div className="bg-[#111] rounded-xl p-4 sticky top-24 border border-gray-800">
                            <nav className="space-y-1">
                                {[
                                    { id: 'general', icon: User, label: 'Thông tin chung' },
                                    { id: 'password', icon: Lock, label: 'Đổi mật khẩu' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as SettingsTab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${activeTab === item.id
                                            ? 'bg-red-600/10 text-red-500'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                                <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    Tủ phim của tôi
                                </Link>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* --- RIGHT CONTENT AREA --- */}
                    <main className="lg:w-3/4">
                        <div className="bg-[#111] rounded-xl p-6 md:p-8 border border-gray-800 ">

                            {/* TAB 1: GENERAL INFO */}
                            {activeTab === 'general' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Hồ sơ cá nhân</h2>

                                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                                        {/* Avatar */}
                                        <div className="relative group mx-auto md:mx-0">
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden ring-4 ring-gray-800">
                                                {avatarUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-12 h-12 text-gray-500" />
                                                )}
                                            </div>
                                            <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera className="w-8 h-8 text-white" />
                                            </button>
                                        </div>

                                        {/* Info Form */}
                                        <div className="flex-1 w-full space-y-4">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1.5">Tên hiển thị</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-400 block mb-1.5">Tên đăng nhập</label>
                                                    <input type="text" value="minhduc" disabled className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-400 block mb-1.5">Email</label>
                                                    <input type="email" value="minhduc@email.com" disabled className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">Hủy</Button>
                                        <Button onClick={handleSaveChanges} className="bg-red-600 hover:bg-red-700 text-white px-6">Lưu thay đổi</Button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PASSWORD */}
                            {activeTab === 'password' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
                                    <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Đổi mật khẩu</h2>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1.5">Mật khẩu hiện tại</label>
                                            <input type="password" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-600 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1.5">Mật khẩu mới</label>
                                            <input type="password" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-600 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1.5">Xác nhận mật khẩu</label>
                                            <input type="password" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-600 focus:outline-none" />
                                        </div>
                                        <div className="pt-4">
                                            <Button className="w-full bg-red-600 hover:bg-red-700">Cập nhật mật khẩu</Button>
                                        </div>
                                    </form>
                                </div>
                            )}




                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
"use client"

import { ChevronDown, Film, Heart, LogOut, Search, ShieldUser, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { sendRequest } from "@/lib/api/wrapprer"
import { getBackendBaseUrl } from "@/lib/config/api-url"
import { buildMovieSearchHref } from "@/lib/filter/MovieQueryBuilder"
import { useAuth } from "@/app/context/auth-provider"

interface Props {
    categories: Category[]
}



const API_URL = getBackendBaseUrl()

export default function Header({ categories }: Props) {


    const router = useRouter()
    const { user, setUser } = useAuth()


    //logout
    const handleLogout = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await sendRequest<IBackendRes<any>>({
                url: `${API_URL}/auth/logout`,
                method: "POST",
                auth: true,
                useCredentials: true,
            })
        } finally {
            setUser(null)
            router.push("/")
            router.refresh()
        }
    }


    //serch

    const [keyword, setKeyword] = useState("")
    const [isScrolled, setIsScrolled] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && keyword.trim()) {
            router.push(buildMovieSearchHref({ q: keyword.trim(), page: 1 }))
        }
    }

    const pathname = usePathname()

    useEffect(() => {
        setKeyword("")
    }, [pathname])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24)
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isHomePage = pathname === "/"
    const isBannerOverlay = pathname === "/" && !isScrolled

    return (
        <>
            <header className={`${isHomePage
                ? "fixed top-0 left-0"
                : "sticky top-0"
                } z-50 w-full border-b transition-all duration-300 ${isBannerOverlay
                    ? "border-transparent bg-transparent"
                    : "border-gray-800/80 bg-[#111111]/95 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
                    }`}>
                <div className={`absolute inset-0 transition-opacity duration-300 ${isBannerOverlay
                    ? "bg-linear-to-b from-black/55 via-black/20 to-transparent opacity-100"
                    : "opacity-0"
                    }`} />
                <div className="relative container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors">
                        <Film className="w-7 h-7" />
                        <span className="text-2xl font-bold">LUOIFLIX</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link href={buildMovieSearchHref({ type: "series", page: 1 })} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim bộ</Link>
                        <Link href={buildMovieSearchHref({ type: "single", page: 1 })} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim lẻ</Link>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-red-500 transition-colors focus:outline-none">
                                Thể loại <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-100 bg-slate-900 border-slate-800 text-slate-300 p-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.map((cat) => (
                                        <DropdownMenuItem
                                            asChild
                                            key={cat.id}
                                            className="cursor-pointer hover:bg-slate-800 hover:text-white"
                                        >
                                            <Link href={buildMovieSearchHref({ category: cat.slug, page: 1 })}>
                                                {cat.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className={`pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 ${isBannerOverlay
                            ? "text-gray-200"
                            : "text-slate-400"
                            }`} />
                        <Input
                            type="text"
                            placeholder="Tìm phim..."
                            value={keyword ?? ""}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={`h-9 border pl-9 text-white focus-visible:ring-red-600 transition-colors ${isBannerOverlay
                                ? "border-white/10 bg-black/35 backdrop-blur text-white placeholder:text-gray-300"
                                : "border-slate-800 bg-slate-900"
                                }`}
                        />
                    </div>

                    <Link href="/favorites">
                        <Button variant="ghost" size="icon" className={`${isBannerOverlay
                            ? "text-gray-200 hover:bg-white/12 hover:text-red-400"
                            : "text-gray-400 hover:bg-white/10 hover:text-red-500"
                            }`}>
                            <Heart className="h-5 w-5" />
                        </Button>
                    </Link>

                    {user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition ${isBannerOverlay
                                    ? "border-white/20 bg-black/35 backdrop-blur hover:border-red-400"
                                    : "border-slate-700 bg-slate-900 hover:border-red-500"
                                    }`}>
                                    {user?.avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-slate-300" />
                                    )}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52 bg-slate-900 border-slate-800 text-slate-200">
                                <div className="px-3 py-2 border-b border-slate-800">
                                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                                    <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
                                </div>

                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-800 hover:text-white">
                                    <Link href="/profile" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Thông tin tài khoản
                                    </Link>
                                </DropdownMenuItem>
                                {user?.role === "ADMIN" && (<DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-800 hover:text-white">
                                    <Link href="/admin" className="flex items-center gap-2">
                                        <ShieldUser className="h-4 w-4" />
                                        Trang quản trị
                                    </Link>
                                </DropdownMenuItem>)}


                                <DropdownMenuItem
                                    className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Đăng xuất

                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-red-600 hover:bg-red-700 text-white">Đăng nhập</Button>
                        </Link>
                    )}
                </div>
                </div>
            </header>
        </>
    )
}

"use client";

import {
    ChevronDown,
    Film,
    Heart,
    LogOut,
    Menu,
    Search,
    ShieldUser,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getMovies } from "@/lib/api/main.api";
import { sendRequest } from "@/lib/api/wrapprer";
import { getBackendBaseUrl } from "@/lib/config/api-url";
import { buildMovieSearchHref } from "@/lib/filter/MovieQueryBuilder";
import { useAuth } from "@/app/context/auth-provider";

import SearchSuggestions from "./main.search-suggestions";

interface Props {
    categories: Category[];
}

const API_URL = getBackendBaseUrl();
const SEARCH_SUGGESTION_LIMIT = 5;
const SEARCH_SUGGESTION_DELAY = 250;

const escapeFilterValue = (value: string) => value.replace(/'/g, "\\'");
const buildSuggestionFilter = (value: string) => {
    const normalizedKeyword = value.trim();
    if (!normalizedKeyword) return "";

    const escapedKeyword = escapeFilterValue(normalizedKeyword);
    return `(title ~~ '%${escapedKeyword}%' or slug ~~ '%${escapedKeyword}%')`;
};

export default function Header({ categories }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useAuth();

    const [keyword, setKeyword] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const isHomePage = pathname === "/";
    const isBannerOverlay = isHomePage && !isScrolled;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await sendRequest<IBackendRes<any>>({
                url: `${API_URL}/auth/logout`,
                method: "POST",
                auth: true,
                useCredentials: true,
            });
        } finally {
            setUser(null);
            setIsMobileMenuOpen(false);
            router.push("/");
            router.refresh();
        }
    };

    const submitSearch = () => {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) return;

        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        router.push(buildMovieSearchHref({ q: trimmedKeyword, page: 1 }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            submitSearch();
        }
    };

    useEffect(() => {
        setKeyword("");
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setSearchSuggestions([]);
    }, [pathname]);

    useEffect(() => {
        const trimmedKeyword = keyword.trim();

        if (trimmedKeyword.length < 2) {
            setSearchSuggestions([]);
            setIsLoadingSuggestions(false);
            return;
        }

        let cancelled = false;
        setIsLoadingSuggestions(true);

        const timeout = window.setTimeout(async () => {
            try {
                const res = await getMovies(
                    buildSuggestionFilter(trimmedKeyword),
                    1,
                    SEARCH_SUGGESTION_LIMIT
                );

                if (cancelled) return;

                setSearchSuggestions(res.data?.result ?? []);
            } catch {
                if (cancelled) return;
                setSearchSuggestions([]);
            } finally {
                if (!cancelled) setIsLoadingSuggestions(false);
            }
        }, SEARCH_SUGGESTION_DELAY);

        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
        };
    }, [keyword]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const showSuggestions = isSearchOpen && keyword.trim().length >= 2;

    const handleSearchBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const nextFocused = e.relatedTarget;

        if (nextFocused instanceof Node && e.currentTarget.contains(nextFocused)) {
            return;
        }

        setIsSearchOpen(false);
    };

    const searchInputClasses = `h-9 border pl-9 text-white focus-visible:ring-red-600 transition-colors ${isBannerOverlay
        ? "border-white/10 bg-black/35 backdrop-blur text-white placeholder:text-gray-300"
        : "border-slate-800 bg-slate-900"
        }`;

    const renderSearchBox = (wrapperClassName: string) => (
        <div
            className={wrapperClassName}
            onFocusCapture={() => setIsSearchOpen(true)}
            onBlurCapture={handleSearchBlur}
        >
            <Search
                className={`pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 ${isBannerOverlay ? "text-gray-200" : "text-slate-400"
                    }`}
            />
            <Input
                type="text"
                placeholder="Tim phim..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={searchInputClasses}
            />
            <SearchSuggestions
                keyword={keyword}
                movies={searchSuggestions}
                isLoading={isLoadingSuggestions}
                open={showSuggestions}
                isBannerOverlay={isBannerOverlay}
                onSelect={() => {
                    setIsSearchOpen(false);
                    setIsMobileMenuOpen(false);
                }}
            />
        </div>
    );

    return (
        <header
            className={`${isHomePage ? "fixed top-0 left-0" : "sticky top-0"
                } z-50 w-full border-b transition-all duration-300 ${isBannerOverlay
                    ? "border-transparent bg-transparent"
                    : "border-gray-800/80 bg-[#111111]/95 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
                }`}
        >
            <div
                className={`absolute inset-0 transition-opacity duration-300 ${isBannerOverlay
                    ? "bg-linear-to-b from-black/55 via-black/20 to-transparent opacity-100"
                    : "opacity-0"
                    }`}
            />

            <div className="relative container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-4 lg:gap-8">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2 text-red-600 transition-colors hover:text-red-500"
                    >
                        <Film className="h-6 w-6 sm:h-7 sm:w-7" />
                        <span className="text-xl font-bold sm:text-2xl">LUOIFLIX</span>
                    </Link>

                    <nav className="hidden items-center gap-6 lg:flex">
                        <Link
                            href={buildMovieSearchHref({ type: "series", page: 1 })}
                            className="text-sm font-medium text-gray-300 transition-colors hover:text-red-500"
                        >
                            Phim bộ
                        </Link>
                        <Link
                            href={buildMovieSearchHref({ type: "single", page: 1 })}
                            className="text-sm font-medium text-gray-300 transition-colors hover:text-red-500"
                        >
                            Phim lẻ
                        </Link>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors hover:text-red-500 focus:outline-none">
                                Thể loại <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-100 border-slate-800 bg-slate-900 p-4 text-slate-300">
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.map((category) => (
                                        <DropdownMenuItem
                                            asChild
                                            key={category.id}
                                            className="cursor-pointer hover:bg-slate-800 hover:text-white"
                                        >
                                            <Link
                                                href={buildMovieSearchHref({
                                                    category: category.slug,
                                                    page: 1,
                                                })}
                                            >
                                                {category.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="hidden lg:block">
                        {renderSearchBox("relative w-60 xl:w-72")}
                    </div>

                    <Link href="/favorites" className="hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={
                                isBannerOverlay
                                    ? "text-gray-200 hover:bg-white/12 hover:text-red-400"
                                    : "text-gray-400 hover:bg-white/10 hover:text-red-500"
                            }
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </Link>

                    {user ? (
                        <div className="hidden lg:block">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition ${isBannerOverlay
                                            ? "border-white/20 bg-black/35 backdrop-blur hover:border-red-400"
                                            : "border-slate-700 bg-slate-900 hover:border-red-500"
                                            }`}
                                    >
                                        {user.avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={user.avatarUrl}
                                                alt="avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5 text-slate-300" />
                                        )}
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-52 border-slate-800 bg-slate-900 text-slate-200"
                                >
                                    <div className="border-b border-slate-800 px-3 py-2">
                                        <p className="truncate text-sm font-medium">
                                            {user.fullName}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {user.email || ""}
                                        </p>
                                    </div>

                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer hover:bg-slate-800 hover:text-white"
                                    >
                                        <Link href="/profile" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Thông tin tài khoản
                                        </Link>
                                    </DropdownMenuItem>

                                    {user.role === "ADMIN" ? (
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer hover:bg-slate-800 hover:text-white"
                                        >
                                            <Link href="/admin" className="flex items-center gap-2">
                                                <ShieldUser className="h-4 w-4" />
                                                Trang quản trị
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : null}

                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Dang xuat
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden lg:block">
                            <Button className="bg-red-600 text-white hover:bg-red-700">
                                Dang nhap
                            </Button>
                        </Link>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen((current) => !current)}
                        className={`lg:hidden ${isBannerOverlay
                            ? "text-gray-100 hover:bg-white/12 hover:text-white"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {isMobileMenuOpen ? (
                <div className="relative border-t border-gray-800/80 bg-[#0f0f0f]/98 shadow-2xl backdrop-blur-xl lg:hidden">
                    <div className="container mx-auto max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 sm:px-6">
                        {renderSearchBox("relative w-full")}

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                                href={buildMovieSearchHref({ type: "series", page: 1 })}
                                onClick={closeMobileMenu}
                                className="rounded-lg border border-white/8 bg-white/4 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/8 hover:text-white"
                            >
                                Phim bộ
                            </Link>
                            <Link
                                href={buildMovieSearchHref({ type: "single", page: 1 })}
                                onClick={closeMobileMenu}
                                className="rounded-lg border border-white/8 bg-white/4 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/8 hover:text-white"
                            >
                                Phim lẻ
                            </Link>
                        </div>

                        <div className="mt-4">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Thể loại
                            </div>
                            <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={buildMovieSearchHref({
                                            category: category.slug,
                                            page: 1,
                                        })}
                                        onClick={closeMobileMenu}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 border-t border-white/8 pt-4">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/favorites"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/6 hover:text-white"
                                >
                                    <Heart className="h-4 w-4" />
                                    Tủ phim
                                </Link>

                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/6 hover:text-white"
                                        >
                                            <User className="h-4 w-4" />
                                            Thông tin tài khoản
                                        </Link>

                                        {user.role === "ADMIN" ? (
                                            <Link
                                                href="/admin"
                                                onClick={closeMobileMenu}
                                                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/6 hover:text-white"
                                            >
                                                <ShieldUser className="h-4 w-4" />
                                                Trang quản trị
                                            </Link>
                                        ) : null}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                    >
                                        Đăng nhập
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}

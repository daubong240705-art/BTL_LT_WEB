"use client"
import { ChevronDown, Film } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/category";


export default function Header() {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    })
    return (
        <header className="bg-[#141414] border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors">
                        <Film className="w-7 h-7" />
                        <span className="text-2xl font-bold">LUOIFLIX</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link href="" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim bộ</Link>
                        <Link href="" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim lẻ</Link>
                    </nav>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-red-500 transition-colors focus:outline-none" >
                            Thể Loại <ChevronDown className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-100 bg-slate-900 border-slate-800 text-slate-300 p-4">
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((cat) => (
                                    <DropdownMenuItem key="cat"
                                        className="cursor-pointer hover:bg-slate-800 hover:text-white">{cat.name}</DropdownMenuItem>
                                ))}
                            </div>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

        </header>
    )
}
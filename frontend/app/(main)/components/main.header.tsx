
import { ChevronDown, Film, Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input";


import { Category } from "@/app/types/movie.type";

type Props = {
    categories: Category[]
}
export default function Header({ categories }: Props) {
    return (
        <header className="bg-[#141414] border-b border-gray-800/50 top-0 left-0 w-full z-500000">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors">
                        <Film className="w-7 h-7" />
                        <span className="text-2xl font-bold">LUOIFLIX</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link href="" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim bộ</Link>
                        <Link href="" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Phim lẻ</Link>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-red-500 transition-colors focus:outline-none" >
                                Thể Loại <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-100 bg-slate-900 border-slate-800 text-slate-300 p-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.map((cat) => (
                                        <DropdownMenuItem key={cat.id}
                                            className="cursor-pointer hover:bg-slate-800 hover:text-white">{cat.name}</DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            name="q"
                            placeholder="Tìm phim..."
                            className="bg-slate-900 border-slate-800 pl-9 text-white focus-visible:ring-red-600 h-9"
                        />
                    </div>
                    <Link href="">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-white/10">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

        </header>
    )
}
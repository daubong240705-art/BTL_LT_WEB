// import { Category } from "@/app/types/type"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Film, Plus, Search, Trash } from "lucide-react";
import { useAdminCategories } from "./hooks/useAdminCategories";
// import { useState } from "react";
// import CategoryDialog from "./CategoryDialog";



export default function CategoryTable() {
    const { data: categories, isLoading, isError, error } = useAdminCategories();
    console.log(categories)
    // const [open, setOpen] = useState(false)
    // const [mode, setMode] = useState<"add" | "edit">("add");
    // const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

    return (
        <div>
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Trang quản lý thể loại</h1>
                        <p className="text-gray-400 text-sm mt-1">Tổng số: {categories?.length} thể loại</p>
                    </div>
                    <Button
                        // onClick={() => {
                        //     setMode("add");
                        //     setOpen(true);
                        // }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20">
                        <Plus className="w-5 h-5" />
                        <span>Thêm thể loại</span>
                    </Button>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm thể loại"
                            className="w-full bg-gray-900 border-gray-700
                            text-white pl-12 pr-4 py-5 rounded-lg
                            focus-visible:ring-0
                            focus:border-green-500
                            hover:border-green-500
                            transition-all " />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                </div>



                <div className="grid grid-cols-4 gap-6">
                    {categories?.map((cat) => (
                        <div key={cat.id}
                            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all group hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-700/50 p-3.5 rounded-xl group-hover:bg-green-600/20 transition-colors">
                                        <Film className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{cat.name}</h3>
                                        <p className="text-gray-500 text-xs">{cat.slug}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                <div className="flex gap-2">
                                    <Button
                                        // onClick={() => {
                                        //     setMode("edit");
                                        //     setOpen(true);
                                        //     setSelectedCategory(cat);

                                        // }}
                                        className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg transition-colors border border-blue-600/20">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors border border-red-600/20">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {isLoading && (

                    <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                        <Film className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Đang tải thể loại...</h3>
                    </div>

                )}
                {isError && (

                    <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                        <Film className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Đã xảy ra lỗi: {error.message}</h3>
                    </div>

                )}
            </div >
            {/* <CategoryDialog
                open={open}
                onOpenChange={setOpen}
                mode={mode}
                initialData={selectedCategory}
            /> */}
        </div>
    )
}
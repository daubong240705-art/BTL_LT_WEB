
import { Category } from "@/app/types/movie.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { CategoryFormValues, useCategoryForm } from "./hooks/useCategoryForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../service/api/category.api";
import { FormError } from "@/components/shared/FormError";

type Props = {
    mode: "add" | "edit";
    initialData?: Category;
    onClose: () => void;
};
export default function CategoryForm({ mode, initialData, onClose }: Props) {
    const form = useCategoryForm(mode, initialData);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: CategoryFormValues) =>
            mode === "add"
                ? categoryApi.createCategory(data)
                : categoryApi.updateCategory(initialData!.id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            onClose();
        }
    });
    const onSubmit = (data: CategoryFormValues) => {
        console.log("jdjda", data)
        mutation.mutate(data);
    }
    // console.log(initialData)
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <div className="flex-1 px-6 pb-6 space-y-2">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Tên thể loại
                        </label>
                        <Input
                            {...form.register("name")}
                            type="text"
                            className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-0
                            focus:border-green-500
                            hover:border-green-500
                            transition-all"
                            placeholder="Nhập tên thể loại"
                        />
                        <FormError message={form.formState.errors.name?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Slug
                        </label>
                        <Input
                            {...form.register("slug")}
                            type="text"
                            className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-0
                            focus:border-green-500
                            hover:border-green-500
                            transition-all"
                            placeholder="Nhập đường dẫn"
                        />
                        <FormError message={form.formState.errors.slug?.message} />
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                <Button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Hủy bỏ
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>

            </div>
        </form>

    )
}
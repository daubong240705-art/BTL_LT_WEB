
import { Category } from "@/app/types/movie.type";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CategoryFormValues, useCategoryForm, useCategoryMutation } from "../../hooks/category/useCategoryForm";
import { FormError } from "@/components/shared/FormError";
import { AppInput } from "@/components/shared/AppInput";

type Props = {
    mode: "add" | "edit";
    initialData?: Category;
    onClose: () => void;
};
export default function CategoryForm({ mode, initialData, onClose }: Props) {
    const form = useCategoryForm(mode, initialData);
    const mutation = useCategoryMutation(mode, initialData?.id, onClose);
    const onSubmit = (data: CategoryFormValues) => {
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
                        <AppInput
                            {...form.register("name")}
                            type="text" color="green"
                            placeholder="Nhập tên thể loại"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.name?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Slug
                        </label>
                        <AppInput
                            {...form.register("slug")}
                            type="text" color="green"
                            placeholder="Nhập đường dẫn"
                            className="px-4 py-5"
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
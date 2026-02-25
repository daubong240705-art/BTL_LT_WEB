import CategoriesController from "./components/CategoryController";

export default async function AdminCategoriesPage() {
    const res = await fetch("http://localhost:8080/api/v1/categories", {
        cache: "no-store",
    });

    const categories = await res.json();

    return (
        <CategoriesController categories={categories} />
    );
}
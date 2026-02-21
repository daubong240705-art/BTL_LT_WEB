export type Category = {
    slug: ReactNode;
    id: number;
    name: string;
};

export const fetchCategories = async (): Promise<Category[]> => {
    const res = await fetch("http://localhost:3001/categories");

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

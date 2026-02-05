export type Movie = {
    id?: number;
    title: string;
    slug: string;
    year: number;
    status: "ongoing" | "completed";
    description?: string;
    poster?: string;
    categories?: number[];
};
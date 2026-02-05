
export interface Movie {
    id?: number;
    title: string;
    slug: string;
    description: string;
    status: "ongoing" | "completed";
    publish_year: number;
    poster_url: string;
}

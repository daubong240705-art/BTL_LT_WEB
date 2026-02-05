
export interface Movie {
    id?: number;
    title: string;
    slug: string;
    description: string;
    status: "ongoing" | "completed";
    publish_year: number;
    poster_url: string;
}

export interface Episode {
    id?: number;
    movie_id: number;
    name: string;
    slug: string;
    description: string;
    episode_order: number;
    duration: string;
    video_url: string;
}
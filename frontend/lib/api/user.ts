import { User } from "@/app/types/type";

const API_URL = "http://localhost:3001/users";

export const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch movies");
    return res.json();
};
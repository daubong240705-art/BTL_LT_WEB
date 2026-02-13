"use client"
import { fetchUsers } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import UserTable from "./UserTable";

export default function AdminUsersPage() {
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    })

    return (
        <UserTable users={users} isLoading={isLoading} />
    );
}
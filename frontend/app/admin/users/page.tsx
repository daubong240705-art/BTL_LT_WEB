import UsersController from "./components/UserController";

export default async function AdminUsersPage() {
    const res = await fetch("http://localhost:8080/api/v1/users", {
        cache: "no-store",
    });

    const users = await res.json();


    return (
        <UsersController users={users} />
    );
}
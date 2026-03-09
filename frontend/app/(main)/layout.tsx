import { getCategories } from "@/lib/api/main.api";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import Footer from "./components/main.footer";
import Header from "./components/main.header";

type HeaderUser = {
  fullName?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
};

const parseUserFromAccessToken = (token?: string): HeaderUser | null => {
  if (!token) return null;

  try {
    const parsed = jwtDecode<{ user?: HeaderUser }>(token);

    return (parsed?.user ?? null) as HeaderUser | null;
  } catch {
    return null;
  }
};


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getCategories();
  const categories = res.data?.result ?? [];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const initialUser = parseUserFromAccessToken(accessToken);

  return (
    <>
      <Header categories={categories} initialUser={initialUser} />
      {children}
      <Footer />
    </>
  );
}

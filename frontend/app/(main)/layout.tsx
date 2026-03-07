import { getCategories } from "@/lib/api/main.api";
import Footer from "./components/main.footer";
import Header from "./components/main.header";
import CheckAuth from "../login/checkAuth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getCategories();
  const categories = res.data?.result ?? [];

  return (
    <>
      <CheckAuth />
      <Header categories={categories} />
      {children}
      <Footer />
    </>
  );
}
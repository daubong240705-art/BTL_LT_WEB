import { getCategories } from "@/lib/api/main.api";
import Footer from "./components/main.footer";
import Header from "./components/main.header";
import { getCurrentUser } from "@/lib/getCurrentUser";



export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getCategories();
  const categories = res.data?.result ?? [];
  const initialUser = await getCurrentUser();

  return (
    <>
      <Header categories={categories} initialUser={initialUser} />
      {children}
      <Footer />
    </>
  );
}

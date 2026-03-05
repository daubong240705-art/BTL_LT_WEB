import { getCategories } from "@/lib/api/main.api";
import Footer from "./components/main.footer";
import Header from "./components/main.header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getCategories();
  const categories = res.data?.result ?? [];

  return (
    <html lang="en">
      <body>
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
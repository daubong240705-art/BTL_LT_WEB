import Footer from "./components/main.footer";
import Header from "./components/main.header";
import { getCategories } from "./service/main.api";


const categories = await getCategories();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header
          categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}

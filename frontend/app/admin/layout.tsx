import { Metadata } from "next";
import AdminSidebar from "./components/admin.sidebar";


export const metadata: Metadata = {
  title: "Luoiflix-Admin",
  description: "Website bài tập thôi nhá",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}




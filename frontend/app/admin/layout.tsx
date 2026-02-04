import AdminSidebar from "./components/admin.sidebar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-8">
        {children}
      </main>
    </div>
  );
}




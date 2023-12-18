export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-h-[100vh] overflow-y-hidden bg-secondary">
      <main className="container max-w-7xl">{children}</main>
    </div>
  );
}

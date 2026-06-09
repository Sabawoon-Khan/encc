import { Sidebar } from "@/components/Sidebar";
import { PortalHeader } from "@/components/PortalHeader";
import { getSessionRole } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getSessionRole();

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalHeader role={role} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

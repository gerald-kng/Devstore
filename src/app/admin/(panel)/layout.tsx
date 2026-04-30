import { AdminPanelShell } from "@/components/admin/AdminPanelShell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminPanelShell userEmail={user?.email}>{children}</AdminPanelShell>;
}

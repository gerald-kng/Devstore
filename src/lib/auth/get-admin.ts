import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

/**
 * Returns the admin Supabase (service) client if the current session is an
 * allowlisted admin email. Never expose the service client to the browser.
 */
export async function getServiceRoleIfAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return null;
  }
  return { user, db: createAdminClient() };
}

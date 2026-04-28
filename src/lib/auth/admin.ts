export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (list.length === 0) {
    return false;
  }
  return list.includes(normalized);
}

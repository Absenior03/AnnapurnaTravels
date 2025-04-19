import { redirect } from "next/navigation";

// Simple redirect page to avoid route conflicts
export default function LoginRedirectPage() {
  redirect("/(regular-routes)/login");
}

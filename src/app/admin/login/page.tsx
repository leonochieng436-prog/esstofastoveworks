import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false, nosnippet: true },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return <LoginForm />;
}

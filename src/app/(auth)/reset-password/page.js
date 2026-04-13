import Link from "next/link";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token || null;

  return <ResetPasswordClient token={token} />;
}

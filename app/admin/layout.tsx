import { Metadata } from "next";
import AdminLayoutClient from "../components/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Console | Robo Rumble 3.0",
  description: "Restricted Access Area",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

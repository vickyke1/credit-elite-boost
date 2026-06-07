import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <div className="container-page py-10">
      <AdminDashboard />
    </div>
  );
}

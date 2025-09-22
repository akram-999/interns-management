import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { InternManagement } from "@/components/interns/intern-management"

export default function InternsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <InternManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}

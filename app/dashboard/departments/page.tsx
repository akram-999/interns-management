import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DepartmentManagement } from "@/components/departments/department-management"

export default function DepartmentsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DepartmentManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}

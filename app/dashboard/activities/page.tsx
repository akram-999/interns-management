import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ActivityManagement } from "@/components/activities/activity-management"

export default function ActivitiesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ActivityManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}
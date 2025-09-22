import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CertificateManagement } from "@/components/certificates/certificate-management"

export default function CertificatesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CertificateManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}

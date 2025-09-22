"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Calendar, Users } from "lucide-react"
import { CertificateGenerator } from "./certificate-generator"

// Mock data for completed interns
const completedInterns = [
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Chicago, IL 60601",
    departmentId: "3",
    departmentName: "Human Resources",
    startDate: "2024-01-05",
    endDate: "2024-04-05",
    status: "completed" as const,
    progress: 100,
    documents: {
      cv: "emily_cv.pdf",
      idCard: "emily_id.pdf",
      certificates: ["hr_cert.pdf", "leadership_cert.pdf"],
    },
    createdAt: "2024-01-05",
    certificateGenerated: true,
    certificateDate: "2024-04-06",
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 567-8901",
    address: "456 Maple Ave, Boston, MA 02101",
    departmentId: "1",
    departmentName: "Information Technology",
    startDate: "2023-12-01",
    endDate: "2024-03-01",
    status: "completed" as const,
    progress: 100,
    documents: {
      cv: "alex_cv.pdf",
      idCard: "alex_id.pdf",
      certificates: ["react_cert.pdf", "node_cert.pdf"],
    },
    createdAt: "2023-12-01",
    certificateGenerated: false,
    certificateDate: null,
  },
]

export function CertificateManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIntern, setSelectedIntern] = useState<any>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  const filteredInterns = completedInterns.filter(
    (intern) =>
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.departmentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGenerateCertificate = (intern: any) => {
    setSelectedIntern(intern)
    setShowGenerator(true)
  }

  const handleDownloadCertificate = (intern: any) => {
    // Mock download
    alert(`Downloading certificate for ${intern.name}`)
  }

  const stats = {
    totalCompleted: completedInterns.length,
    certificatesGenerated: completedInterns.filter((i) => i.certificateGenerated).length,
    pendingCertificates: completedInterns.filter((i) => !i.certificateGenerated).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Certificate Management</h1>
        <p className="text-muted-foreground">Generate and manage training completion certificates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Training finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificatesGenerated}</div>
            <p className="text-xs text-muted-foreground">Ready for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Certificates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCertificates}</div>
            <p className="text-xs text-muted-foreground">Need generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intern</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Certificate Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterns.map((intern) => (
                  <TableRow key={intern.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-medium text-primary-foreground">
                            {intern.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{intern.name}</div>
                          <div className="text-sm text-muted-foreground">{intern.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{intern.departmentName}</TableCell>
                    <TableCell>{intern.endDate}</TableCell>
                    <TableCell>
                      {intern.certificateGenerated ? (
                        <Badge variant="secondary">Generated</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {intern.certificateGenerated ? (
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadCertificate(intern)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleGenerateCertificate(intern)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Generator Dialog */}
      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Training Completion Certificate</DialogTitle>
          </DialogHeader>
          {selectedIntern && <CertificateGenerator intern={selectedIntern} onClose={() => setShowGenerator(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

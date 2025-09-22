"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Building2, Calendar, FileText, Download } from "lucide-react"
import { CertificateGenerator } from "@/components/certificates/certificate-generator"
import type { Intern } from "./intern-management"

interface InternDetailsProps {
  intern: Intern
  onClose: () => void
}

export function InternDetails({ intern, onClose }: InternDetailsProps) {
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "terminated":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleDownloadDocument = (docName: string) => {
    // Mock download - replace with real file download logic
    console.log(`Downloading ${docName}`)
    alert(`Downloading ${docName}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-medium text-primary-foreground">
              {intern.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{intern.name}</h2>
            <p className="text-muted-foreground">{intern.departmentName}</p>
            <Badge variant={getStatusColor(intern.status) as any} className="mt-1">
              {intern.status}
            </Badge>
          </div>
        </div>
        {intern.status === "completed" && (
          <Button onClick={() => setShowCertificateGenerator(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Certificate
          </Button>
        )}
      </div>

      <Separator />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{intern.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{intern.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{intern.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Training Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Training Period</p>
                <p className="text-sm text-muted-foreground">
                  {intern.startDate} to {intern.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{intern.departmentName}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Progress</p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-secondary rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${intern.progress}%` }} />
              </div>
              <span className="text-sm font-medium">{intern.progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {intern.documents.cv && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">CV/Resume</p>
                  <p className="text-xs text-muted-foreground">{intern.documents.cv}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(intern.documents.cv!)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {intern.documents.idCard && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">ID Card</p>
                  <p className="text-xs text-muted-foreground">{intern.documents.idCard}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(intern.documents.idCard!)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {intern.documents.certificates && intern.documents.certificates.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Certificates</p>
              {intern.documents.certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Certificate {index + 1}</p>
                      <p className="text-xs text-muted-foreground">{cert}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(cert)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!intern.documents.cv &&
            !intern.documents.idCard &&
            (!intern.documents.certificates || intern.documents.certificates.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded</p>
            )}
        </CardContent>
      </Card>

      {/* Certificate Generator Dialog */}
      <Dialog open={showCertificateGenerator} onOpenChange={setShowCertificateGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Training Completion Certificate</DialogTitle>
          </DialogHeader>
          <CertificateGenerator intern={intern} onClose={() => setShowCertificateGenerator(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

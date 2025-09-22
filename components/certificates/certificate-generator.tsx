"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Eye, Loader2 } from "lucide-react"
import type { Intern } from "@/components/interns/intern-management"

interface CertificateGeneratorProps {
  intern: Intern
  onClose?: () => void
}

export function CertificateGenerator({ intern, onClose }: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "Tech Solutions Inc.",
    managerName: "John Smith",
    additionalNotes: "",
  })

  const handleGenerateCertificate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internName: intern.name,
          departmentName: intern.departmentName,
          startDate: intern.startDate,
          endDate: intern.endDate,
          companyName: formData.companyName,
          managerName: formData.managerName,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCertificateUrl(result.certificateUrl)
        // In a real app, you would trigger the actual download here
        alert(`Certificate generated successfully! File: ${result.fileName}`)
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("Certificate generation error:", error)
      alert("Failed to generate certificate. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (certificateUrl) {
      // In a real app, this would trigger the actual file download
      alert(`Downloading certificate from: ${certificateUrl}`)
    }
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Training Completion Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intern Name</Label>
              <Input value={intern.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={intern.departmentName} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Training Start Date</Label>
              <Input value={intern.startDate} disabled />
            </div>
            <div className="space-y-2">
              <Label>Training End Date</Label>
              <Input value={intern.endDate} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">Manager Name</Label>
              <Input
                id="managerName"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="Department Manager Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any additional notes or achievements to include..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handlePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleGenerateCertificate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>
            {certificateUrl && (
              <Button onClick={handleDownload} variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          <CertificatePreview intern={intern} companyName={formData.companyName} managerName={formData.managerName} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CertificatePreviewProps {
  intern: Intern
  companyName: string
  managerName: string
}

function CertificatePreview({ intern, companyName, managerName }: CertificatePreviewProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-lg">
      <div className="bg-white p-12 rounded-xl shadow-2xl border-8 border-blue-500 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-2 uppercase tracking-wider">Certificate</h1>
          <h2 className="text-2xl text-gray-600 mb-8">of Training Completion</h2>
        </div>

        <div className="mb-8 leading-relaxed">
          <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
          <div className="text-4xl font-bold text-gray-800 mb-4 underline decoration-blue-500">{intern.name}</div>
          <p className="text-lg text-gray-700 mb-2">
            has successfully completed the internship training program in the
          </p>
          <p className="text-lg font-bold text-blue-600 mb-2">{intern.departmentName} Department</p>
          <p className="text-lg text-gray-700 mb-2">
            from {intern.startDate} to {intern.endDate}
          </p>
          <p className="text-lg text-gray-700">
            and has demonstrated proficiency in the required skills and competencies.
          </p>
        </div>

        <div className="w-24 h-24 border-4 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600 mx-auto mb-8">
          SEAL
        </div>

        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="border-t-2 border-gray-800 pt-2 w-48">
              <div className="font-semibold">{managerName}</div>
              <div className="text-sm text-gray-600">Department Manager</div>
            </div>
          </div>
          <div className="text-right">
            <div>Date: {currentDate}</div>
            <div className="text-sm text-gray-600">{companyName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

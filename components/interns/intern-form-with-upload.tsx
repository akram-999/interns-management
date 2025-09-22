"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"
import type { Intern } from "./intern-management"

interface InternFormWithUploadProps {
  intern?: Intern
  departments: { id: string; name: string }[]
  onSubmit: (data: Omit<Intern, "id" | "createdAt" | "departmentName">) => void
  onCancel: () => void
}

export function InternFormWithUpload({ intern, departments, onSubmit, onCancel }: InternFormWithUploadProps) {
  const [formData, setFormData] = useState({
    name: intern?.name || "",
    email: intern?.email || "",
    phone: intern?.phone || "",
    address: intern?.address || "",
    departmentId: intern?.departmentId || "",
    startDate: intern?.startDate || "",
    endDate: intern?.endDate || "",
    status: intern?.status || ("active" as "active" | "completed" | "terminated"),
    progress: intern?.progress || 0,
    photo: intern?.photo || "",
    documents: {
      cv: intern?.documents?.cv || "",
      idCard: intern?.documents?.idCard || "",
      certificates: intern?.documents?.certificates || [],
    },
  })

  const [photoFiles, setPhotoFiles] = useState<UploadedFile[]>([])
  const [cvFiles, setCvFiles] = useState<UploadedFile[]>([])
  const [idFiles, setIdFiles] = useState<UploadedFile[]>([])
  const [certificateFiles, setCertificateFiles] = useState<UploadedFile[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update form data with uploaded files
    const updatedFormData = {
      ...formData,
      photo: photoFiles.length > 0 ? photoFiles[0].name : formData.photo,
      documents: {
        cv: cvFiles.length > 0 ? cvFiles[0].name : formData.documents.cv,
        idCard: idFiles.length > 0 ? idFiles[0].name : formData.documents.idCard,
        certificates:
          certificateFiles.length > 0 ? certificateFiles.map((f) => f.name) : formData.documents.certificates,
      },
    }

    onSubmit(updatedFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State, ZIP"
              rows={2}
              required
            />
          </div>

          {/* Photo Upload */}
          <FileUpload
            accept="image/*"
            maxSize={5}
            maxFiles={1}
            onFilesChange={setPhotoFiles}
            label="Profile Photo"
            description="Upload a profile photo (JPG, PNG, max 5MB)"
          />
        </CardContent>
      </Card>

      {/* Training Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "completed" | "terminated") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CV Upload */}
          <FileUpload
            accept=".pdf,.doc,.docx"
            maxSize={10}
            maxFiles={1}
            onFilesChange={setCvFiles}
            label="CV/Resume"
            description="Upload CV or Resume (PDF, DOC, DOCX, max 10MB)"
          />

          {/* ID Card Upload */}
          <FileUpload
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5}
            maxFiles={1}
            onFilesChange={setIdFiles}
            label="ID Card"
            description="Upload ID Card (PDF, JPG, PNG, max 5MB)"
          />

          {/* Certificates Upload */}
          <FileUpload
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10}
            maxFiles={5}
            onFilesChange={setCertificateFiles}
            label="Certificates"
            description="Upload certificates (PDF, JPG, PNG, max 10MB each, up to 5 files)"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{intern ? "Update" : "Create"} Intern</Button>
      </div>
    </form>
  )
}

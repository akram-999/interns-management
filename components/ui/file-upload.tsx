"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
}

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange: (files: UploadedFile[]) => void
  existingFiles?: UploadedFile[]
  className?: string
  label?: string
  description?: string
}

export function FileUpload({
  accept = "*/*",
  maxSize = 10,
  maxFiles = 5,
  onFilesChange,
  existingFiles = [],
  className,
  label = "Upload Files",
  description = "Drag and drop files here or click to browse",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      handleFiles(droppedFiles)
    },
    [files, maxFiles, maxSize],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      handleFiles(selectedFiles)
    },
    [files, maxFiles, maxSize],
  )

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
        return false
      }
      return true
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadProgress: 0,
      status: "uploading",
    }))

    const updatedFiles = [...files, ...uploadedFiles]
    setFiles(updatedFiles)

    // Simulate upload progress
    uploadedFiles.forEach((file) => {
      simulateUpload(file, updatedFiles)
    })
  }

  const simulateUpload = (file: UploadedFile, currentFiles: UploadedFile[]) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        const newFiles = currentFiles.map((f) =>
          f.id === file.id ? { ...f, uploadProgress: 100, status: "completed" as const } : f,
        )
        setFiles(newFiles)
        onFilesChange(newFiles)
      } else {
        const newFiles = currentFiles.map((f) => (f.id === file.id ? { ...f, uploadProgress: progress } : f))
        setFiles(newFiles)
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">{description}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Maximum {maxFiles} files, {maxSize}MB each
            </p>
            <input
              type="file"
              accept={accept}
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </CardContent>
        </Card>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && <Progress value={file.uploadProgress} className="h-1 mt-1" />}
                      {file.status === "error" && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          <span className="text-xs text-destructive">Upload failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

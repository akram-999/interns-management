"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Calendar, Trash2, Eye, Download } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface ActivityImage {
  id: string
  title: string
  description: string
  imageUrl: string
  uploadedAt: Date
  tags: string[]
  fileName: string
  fileSize: number
}

// Mock data for demonstration
const mockActivities: ActivityImage[] = [
  {
    id: "1",
    title: "Team Building Workshop",
    description: "Interns participating in collaborative team building exercises",
    imageUrl: "/team-building-workshop-interns.jpg",
    uploadedAt: new Date("2024-01-15"),
    tags: ["team-building", "workshop", "collaboration"],
    fileName: "team-building-2024.jpg",
    fileSize: 2048576,
  },
  {
    id: "2",
    title: "Technical Training Session",
    description: "Hands-on coding session with senior developers",
    imageUrl: "/coding-training-session-developers.jpg",
    uploadedAt: new Date("2024-01-20"),
    tags: ["training", "technical", "coding"],
    fileName: "tech-training.jpg",
    fileSize: 1536000,
  },
  {
    id: "3",
    title: "Project Presentation Day",
    description: "Interns presenting their final projects to the management team",
    imageUrl: "/presentation-meeting-interns-projects.jpg",
    uploadedAt: new Date("2024-01-25"),
    tags: ["presentation", "projects", "showcase"],
    fileName: "presentation-day.jpg",
    fileSize: 3072000,
  },
  {
    id: "4",
    title: "Office Tour & Orientation",
    description: "New interns getting familiar with the office environment",
    imageUrl: "/office-tour-orientation-new-employees.jpg",
    uploadedAt: new Date("2024-02-01"),
    tags: ["orientation", "tour", "new-interns"],
    fileName: "office-tour.jpg",
    fileSize: 1792000,
  },
]

export function ActivityManagement() {
  const [activities, setActivities] = useState<ActivityImage[]>(mockActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<ActivityImage | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deleteActivity, setDeleteActivity] = useState<ActivityImage | null>(null)

  // Form state for adding new activity
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    tags: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.description || uploadedFiles.length === 0) {
      alert("Please fill in all fields and upload at least one image")
      return
    }

    // In a real app, you would upload the files to a server here
    uploadedFiles.forEach((file) => {
      const activity: ActivityImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: newActivity.title,
        description: newActivity.description,
        imageUrl: file.url,
        uploadedAt: new Date(),
        tags: newActivity.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        fileName: file.name,
        fileSize: file.size,
      }

      setActivities((prev) => [activity, ...prev])
    })

    // Reset form
    setNewActivity({ title: "", description: "", tags: "" })
    setUploadedFiles([])
    setIsAddDialogOpen(false)
  }

  const handleDeleteActivity = (activity: ActivityImage) => {
    setActivities((prev) => prev.filter((a) => a.id !== activity.id))
    setDeleteActivity(null)
  }

  const handleViewActivity = (activity: ActivityImage) => {
    setSelectedActivity(activity)
    setIsViewDialogOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activities Gallery</h1>
          <p className="text-muted-foreground">Manage intern activity photos and memories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Activity Images</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter activity title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newActivity.tags}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="workshop, training, team-building"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the activity..."
                  rows={3}
                />
              </div>
              <FileUpload
                accept="image/*"
                maxSize={10}
                maxFiles={10}
                onFilesChange={setUploadedFiles}
                existingFiles={uploadedFiles}
                label="Upload Images"
                description="Upload activity photos (JPG, PNG, GIF)"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddActivity}>Add Activity</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Activity photos uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter((a) => a.uploadedAt.getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">Images added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(activities.reduce((total, activity) => total + activity.fileSize, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total storage used</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={activity.imageUrl || "/placeholder.svg"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-1">{activity.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {activity.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {activity.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{activity.tags.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(activity.uploadedAt)}
                </div>
                <span>{formatFileSize(activity.fileSize)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewActivity(activity)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteActivity(activity)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No activities found matching your search.</p>
        </div>
      )}

      {/* View Activity Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedActivity.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={selectedActivity.imageUrl || "/placeholder.svg"}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-muted-foreground">{selectedActivity.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Uploaded: {formatDate(selectedActivity.uploadedAt)}</span>
                      <span>Size: {formatFileSize(selectedActivity.fileSize)}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteActivity}
        onClose={() => setDeleteActivity(null)}
        onConfirm={() => deleteActivity && handleDeleteActivity(deleteActivity)}
        title="Delete Activity Image"
        description={`Are you sure you want to delete "${deleteActivity?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}

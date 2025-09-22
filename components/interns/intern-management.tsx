"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Users, GraduationCap, Clock, FileText } from "lucide-react"
import { InternFormWithUpload } from "./intern-form-with-upload"
import { InternDetails } from "./intern-details"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

export interface Intern {
  id: string
  name: string
  email: string
  phone: string
  address: string
  departmentId: string
  departmentName: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "terminated"
  progress: number
  photo?: string
  documents: {
    cv?: string
    idCard?: string
    certificates?: string[]
  }
  createdAt: string
}

// Mock data - replace with real API calls later
const initialInterns: Intern[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    departmentId: "1",
    departmentName: "Information Technology",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "active",
    progress: 75,
    documents: {
      cv: "sarah_cv.pdf",
      idCard: "sarah_id.pdf",
      certificates: ["javascript_cert.pdf"],
    },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    departmentId: "2",
    departmentName: "Finance",
    startDate: "2024-01-10",
    endDate: "2024-04-10",
    status: "active",
    progress: 60,
    documents: {
      cv: "michael_cv.pdf",
      idCard: "michael_id.pdf",
    },
    createdAt: "2024-01-10",
  },
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
    status: "completed",
    progress: 100,
    documents: {
      cv: "emily_cv.pdf",
      idCard: "emily_id.pdf",
      certificates: ["hr_cert.pdf", "leadership_cert.pdf"],
    },
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Houston, TX 77001",
    departmentId: "4",
    departmentName: "Marketing",
    startDate: "2024-01-20",
    endDate: "2024-04-20",
    status: "active",
    progress: 45,
    documents: {
      cv: "james_cv.pdf",
      idCard: "james_id.pdf",
    },
    createdAt: "2024-01-20",
  },
]

const departments = [
  { id: "1", name: "Information Technology" },
  { id: "2", name: "Finance" },
  { id: "3", name: "Human Resources" },
  { id: "4", name: "Marketing" },
  { id: "5", name: "Legal" },
]

export function InternManagement() {
  const [interns, setInterns] = useState<Intern[]>(initialInterns)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null)
  const [viewingIntern, setViewingIntern] = useState<Intern | null>(null)
  const [deletingIntern, setDeletingIntern] = useState<Intern | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.departmentName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || intern.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || intern.departmentId === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleCreateIntern = (internData: Omit<Intern, "id" | "createdAt" | "departmentName">) => {
    const department = departments.find((d) => d.id === internData.departmentId)
    const newIntern: Intern = {
      ...internData,
      id: Date.now().toString(),
      departmentName: department?.name || "",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setInterns([...interns, newIntern])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateIntern = (internData: Omit<Intern, "id" | "createdAt" | "departmentName">) => {
    if (!editingIntern) return

    const department = departments.find((d) => d.id === internData.departmentId)
    setInterns(
      interns.map((intern) =>
        intern.id === editingIntern.id ? { ...intern, ...internData, departmentName: department?.name || "" } : intern,
      ),
    )
    setEditingIntern(null)
  }

  const handleDeleteIntern = () => {
    if (!deletingIntern) return

    setInterns(interns.filter((intern) => intern.id !== deletingIntern.id))
    setDeletingIntern(null)
  }

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

  const stats = {
    total: interns.length,
    active: interns.filter((i) => i.status === "active").length,
    completed: interns.filter((i) => i.status === "completed").length,
    avgProgress: Math.round(interns.reduce((sum, i) => sum + i.progress, 0) / interns.length) || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Intern Management</h1>
          <p className="text-muted-foreground">Manage interns and their training progress</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Intern
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Intern</DialogTitle>
            </DialogHeader>
            <InternFormWithUpload
              departments={departments}
              onSubmit={handleCreateIntern}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Training finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intern</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Training Period</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <div className="text-sm">
                        <div>{intern.startDate}</div>
                        <div className="text-muted-foreground">to {intern.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${intern.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{intern.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(intern.status) as any}>{intern.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewingIntern(intern)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingIntern(intern)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingIntern(intern)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!viewingIntern} onOpenChange={() => setViewingIntern(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Intern Details</DialogTitle>
          </DialogHeader>
          {viewingIntern && <InternDetails intern={viewingIntern} onClose={() => setViewingIntern(null)} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingIntern} onOpenChange={() => setEditingIntern(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Intern</DialogTitle>
          </DialogHeader>
          {editingIntern && (
            <InternFormWithUpload
              intern={editingIntern}
              departments={departments}
              onSubmit={handleUpdateIntern}
              onCancel={() => setEditingIntern(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingIntern}
        onOpenChange={() => setDeletingIntern(null)}
        onConfirm={handleDeleteIntern}
        title="Delete Intern"
        description={`Are you sure you want to delete "${deletingIntern?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}

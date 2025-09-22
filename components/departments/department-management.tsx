"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, Users } from "lucide-react"
import { DepartmentForm } from "./department-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

export interface Department {
  id: string
  name: string
  description: string
  manager: string
  internCount: number
  createdAt: string
  status: "active" | "inactive"
}

// Mock data - replace with real API calls later
const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Information Technology",
    description: "Software development, system administration, and IT support",
    manager: "John Smith",
    internCount: 8,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "Finance",
    description: "Financial planning, accounting, and budget management",
    manager: "Sarah Johnson",
    internCount: 5,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "3",
    name: "Human Resources",
    description: "Recruitment, employee relations, and HR policies",
    manager: "Michael Brown",
    internCount: 3,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "4",
    name: "Marketing",
    description: "Digital marketing, content creation, and brand management",
    manager: "Emily Davis",
    internCount: 6,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "5",
    name: "Legal",
    description: "Legal compliance, contract management, and legal advisory",
    manager: "David Wilson",
    internCount: 2,
    createdAt: "2024-01-01",
    status: "inactive",
  },
]

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateDepartment = (departmentData: Omit<Department, "id" | "createdAt" | "internCount">) => {
    const newDepartment: Department = {
      ...departmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      internCount: 0,
    }
    setDepartments([...departments, newDepartment])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateDepartment = (departmentData: Omit<Department, "id" | "createdAt" | "internCount">) => {
    if (!editingDepartment) return

    setDepartments(
      departments.map((dept) => (dept.id === editingDepartment.id ? { ...dept, ...departmentData } : dept)),
    )
    setEditingDepartment(null)
  }

  const handleDeleteDepartment = () => {
    if (!deletingDepartment) return

    setDepartments(departments.filter((dept) => dept.id !== deletingDepartment.id))
    setDeletingDepartment(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground">Manage departments and their information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <DepartmentForm onSubmit={handleCreateDepartment} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              {departments.filter((d) => d.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.reduce((sum, dept) => sum + dept.internCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.length > 0
                ? Math.round(departments.reduce((sum, dept) => sum + dept.internCount, 0) / departments.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per department</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search departments or managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Interns</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{department.name}</div>
                        <div className="text-sm text-muted-foreground">{department.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{department.internCount} interns</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={department.status === "active" ? "default" : "secondary"}>
                        {department.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{department.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingDepartment(department)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingDepartment(department)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDepartment && (
            <DepartmentForm
              department={editingDepartment}
              onSubmit={handleUpdateDepartment}
              onCancel={() => setEditingDepartment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingDepartment}
        onOpenChange={() => setDeletingDepartment(null)}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        description={`Are you sure you want to delete "${deletingDepartment?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}

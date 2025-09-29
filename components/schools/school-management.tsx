"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, GraduationCap, Users, MapPin } from "lucide-react"
import { SchoolForm } from "./school-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

export interface School {
  id: string
  name: string
  address: string
  city: string
  type: "university" | "college" | "institute" | "academy"
  contactEmail: string
  contactPhone: string
  website?: string
  studentCount: number
  createdAt: string
  status: "active" | "inactive"
}

// Mock data - replace with real API calls later
const initialSchools: School[] = [
  {
    id: "1",
    name: "Stanford University",
    address: "450 Serra Mall",
    city: "Stanford, CA",
    type: "university",
    contactEmail: "admissions@stanford.edu",
    contactPhone: "+1 (650) 723-2300",
    website: "https://stanford.edu",
    studentCount: 17249,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "MIT",
    address: "77 Massachusetts Ave",
    city: "Cambridge, MA",
    type: "institute",
    contactEmail: "admissions@mit.edu",
    contactPhone: "+1 (617) 253-1000",
    website: "https://mit.edu",
    studentCount: 11934,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "3",
    name: "Berkeley College",
    address: "2121 Allston Way",
    city: "Berkeley, CA",
    type: "college",
    contactEmail: "info@berkeley.edu",
    contactPhone: "+1 (510) 642-6000",
    website: "https://berkeley.edu",
    studentCount: 8500,
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "4",
    name: "Tech Academy",
    address: "123 Innovation Drive",
    city: "San Francisco, CA",
    type: "academy",
    contactEmail: "contact@techacademy.edu",
    contactPhone: "+1 (415) 555-0123",
    studentCount: 2500,
    createdAt: "2024-01-01",
    status: "active",
  },
]

export function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>(initialSchools)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateSchool = (schoolData: Omit<School, "id" | "createdAt" | "studentCount">) => {
    const newSchool: School = {
      ...schoolData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      studentCount: 0,
    }
    setSchools([...schools, newSchool])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateSchool = (schoolData: Omit<School, "id" | "createdAt" | "studentCount">) => {
    if (!editingSchool) return

    setSchools(schools.map((school) => (school.id === editingSchool.id ? { ...school, ...schoolData } : school)))
    setEditingSchool(null)
  }

  const handleDeleteSchool = () => {
    if (!deletingSchool) return

    setSchools(schools.filter((school) => school.id !== deletingSchool.id))
    setDeletingSchool(null)
  }

  const getTypeColor = (type: School["type"]) => {
    switch (type) {
      case "university":
        return "default"
      case "college":
        return "secondary"
      case "institute":
        return "outline"
      case "academy":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Management</h1>
          <p className="text-muted-foreground">Manage educational institutions and their information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New School</DialogTitle>
            </DialogHeader>
            <SchoolForm onSubmit={handleCreateSchool} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.length}</div>
            <p className="text-xs text-muted-foreground">
              {schools.filter((s) => s.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.filter((s) => s.type === "university").length}</div>
            <p className="text-xs text-muted-foreground">Research institutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schools.reduce((sum, school) => sum + school.studentCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(schools.map((s) => s.city.split(",")[0])).size}</div>
            <p className="text-xs text-muted-foreground">Different locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search schools, cities, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-sm text-muted-foreground">{school.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(school.type)}>
                        {school.type.charAt(0).toUpperCase() + school.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{school.contactEmail}</div>
                        <div className="text-muted-foreground">{school.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{school.studentCount.toLocaleString()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.status === "active" ? "default" : "secondary"}>{school.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingSchool(school)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingSchool(school)}
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
      <Dialog open={!!editingSchool} onOpenChange={() => setEditingSchool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          {editingSchool && (
            <SchoolForm school={editingSchool} onSubmit={handleUpdateSchool} onCancel={() => setEditingSchool(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingSchool}
        onOpenChange={() => setDeletingSchool(null)}
        onConfirm={handleDeleteSchool}
        title="Delete School"
        description={`Are you sure you want to delete "${deletingSchool?.name}"? This action cannot be undone and may affect associated interns.`}
      />
    </div>
  )
}

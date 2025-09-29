"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, GraduationCap, FileText } from "lucide-react"
import { TrainingAlerts } from "@/components/notifications/training-alerts"

// Mock data - replace with real data later
const stats = [
  {
    title: "Total Interns",
    value: "24",
    description: "Active interns in training",
    icon: Users,
    trend: "+2 this month",
  },
  {
    title: "Departments",
    value: "6",
    description: "Active departments",
    icon: Building2,
    trend: "IT, Finance, HR, Marketing, Legal, Operations",
  },
  {
    title: "Completed Training",
    value: "18",
    description: "Interns who completed training",
    icon: GraduationCap,
    trend: "+5 this month",
  },
  {
    title: "Certificates Generated",
    value: "15",
    description: "Training completion certificates",
    icon: FileText,
    trend: "+3 this week",
  },
]

const recentInterns = [
  {
    name: "Sarah Johnson",
    department: "IT",
    startDate: "2024-01-15",
    status: "Active",
    progress: 75,
  },
  {
    name: "Michael Chen",
    department: "Finance",
    startDate: "2024-01-10",
    status: "Active",
    progress: 60,
  },
  {
    name: "Emily Davis",
    department: "HR",
    startDate: "2024-01-05",
    status: "Completed",
    progress: 100,
  },
  {
    name: "James Wilson",
    department: "Marketing",
    startDate: "2024-01-20",
    status: "Active",
    progress: 45,
  },
]

const mockInternsForAlerts = [
  {
    id: "1",
    name: "Sarah Johnson",
    departmentName: "Information Technology",
    endDate: "2024-12-31", // 3 days from now (adjust based on current date)
    status: "active" as const,
  },
  {
    id: "2",
    name: "Michael Chen",
    departmentName: "Finance",
    endDate: "2024-12-30", // 2 days from now
    status: "active" as const,
  },
  {
    id: "4",
    name: "James Wilson",
    departmentName: "Marketing",
    endDate: "2024-12-27", // Overdue
    status: "active" as const,
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Interns Management System</p>
      </div>

      <TrainingAlerts interns={mockInternsForAlerts} />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Interns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterns.map((intern) => (
              <div key={intern.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <span className="text-sm font-medium text-primary-foreground">
                      {intern.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {intern.department} • Started {intern.startDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{intern.progress}%</p>
                    <p className={`text-xs ${intern.status === "Completed" ? "text-green-600" : "text-blue-600"}`}>
                      {intern.status}
                    </p>
                  </div>
                  <div className="w-16 bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${intern.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

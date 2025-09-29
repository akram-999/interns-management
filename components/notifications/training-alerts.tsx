"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, User, CheckCircle } from "lucide-react"

interface TrainingAlert {
  id: string
  internId: string
  internName: string
  departmentName: string
  endDate: string
  daysLeft: number
  status: "ending_soon" | "overdue" | "completed"
  priority: "high" | "medium" | "low"
}

interface TrainingAlertsProps {
  interns?: Array<{
    id: string
    name: string
    departmentName: string
    endDate: string
    status: "active" | "completed" | "terminated"
  }>
}

export function TrainingAlerts({ interns = [] }: TrainingAlertsProps) {
  const [alerts, setAlerts] = useState<TrainingAlert[]>([])

  // Calculate days between two dates
  const calculateDaysLeft = (endDate: string): number => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Generate training alerts
  useEffect(() => {
    const newAlerts: TrainingAlert[] = []

    interns.forEach((intern) => {
      if (intern.status !== "active") return

      const daysLeft = calculateDaysLeft(intern.endDate)

      // Training ending in 3 days or less (but not overdue)
      if (daysLeft <= 3 && daysLeft >= 0) {
        newAlerts.push({
          id: `alert_${intern.id}`,
          internId: intern.id,
          internName: intern.name,
          departmentName: intern.departmentName,
          endDate: intern.endDate,
          daysLeft,
          status: "ending_soon",
          priority: daysLeft <= 1 ? "high" : "medium",
        })
      }

      // Training overdue
      if (daysLeft < 0) {
        newAlerts.push({
          id: `alert_overdue_${intern.id}`,
          internId: intern.id,
          internName: intern.name,
          departmentName: intern.departmentName,
          endDate: intern.endDate,
          daysLeft,
          status: "overdue",
          priority: "high",
        })
      }
    })

    setAlerts(newAlerts)
  }, [interns])

  const handleMarkCompleted = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ending_soon":
        return Clock
      case "overdue":
        return AlertTriangle
      case "completed":
        return CheckCircle
      default:
        return User
    }
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Training Completion Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const IconComponent = getStatusIcon(alert.status)
            return (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      alert.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.internName}</span>
                      <Badge variant={getPriorityColor(alert.priority) as any} className="text-xs">
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.status === "overdue"
                        ? `Training is ${Math.abs(alert.daysLeft)} day${Math.abs(alert.daysLeft) !== 1 ? "s" : ""} overdue`
                        : `Training ends in ${alert.daysLeft} day${alert.daysLeft !== 1 ? "s" : ""}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.departmentName} • End Date: {alert.endDate}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleMarkCompleted(alert.id)}>
                  Mark Handled
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, User, X, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Notification {
  id: string
  type: "training_ending" | "training_overdue" | "certificate_pending"
  title: string
  message: string
  internId: string
  internName: string
  departmentName: string
  daysLeft: number
  priority: "high" | "medium" | "low"
  createdAt: Date
  read: boolean
}

interface Intern {
  id: string
  name: string
  departmentName: string
  endDate: string
  status: "active" | "completed" | "terminated"
}

// Mock interns data - in real app, this would come from props or API
const mockInterns: Intern[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    departmentName: "Information Technology",
    endDate: "2024-12-31", // 3 days from now (adjust based on current date)
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    departmentName: "Finance",
    endDate: "2024-12-30", // 2 days from now
    status: "active",
  },
  {
    id: "4",
    name: "James Wilson",
    departmentName: "Marketing",
    endDate: "2024-12-27", // Overdue
    status: "active",
  },
]

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Calculate days between two dates
  const calculateDaysLeft = (endDate: string): number => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Generate notifications based on intern training end dates
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = []

    mockInterns.forEach((intern) => {
      if (intern.status !== "active") return

      const daysLeft = calculateDaysLeft(intern.endDate)

      // Training ending in 3 days or less (but not overdue)
      if (daysLeft <= 3 && daysLeft >= 0) {
        notifications.push({
          id: `training_ending_${intern.id}`,
          type: "training_ending",
          title: "Training Ending Soon",
          message: `${intern.name}'s training in ${intern.departmentName} ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
          internId: intern.id,
          internName: intern.name,
          departmentName: intern.departmentName,
          daysLeft,
          priority: daysLeft <= 1 ? "high" : "medium",
          createdAt: new Date(),
          read: false,
        })
      }

      // Training overdue
      if (daysLeft < 0) {
        notifications.push({
          id: `training_overdue_${intern.id}`,
          type: "training_overdue",
          title: "Training Overdue",
          message: `${intern.name}'s training in ${intern.departmentName} is ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} overdue`,
          internId: intern.id,
          internName: intern.name,
          departmentName: intern.departmentName,
          daysLeft,
          priority: "high",
          createdAt: new Date(),
          read: false,
        })
      }
    })

    return notifications
  }

  // Initialize notifications on component mount
  useEffect(() => {
    const newNotifications = generateNotifications()
    setNotifications(newNotifications)
    setUnreadCount(newNotifications.filter((n) => !n.read).length)
  }, [])

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Remove notification
  const removeNotification = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId)
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "training_ending":
        return Clock
      case "training_overdue":
        return AlertTriangle
      case "certificate_pending":
        return User
      default:
        return Bell
    }
  }

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  return (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-colors ${!notification.read ? "bg-accent/50" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`p-2 rounded-full ${
                                notification.priority === "high"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{notification.departmentName}</span>
                                <span>•</span>
                                <span>{notification.createdAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

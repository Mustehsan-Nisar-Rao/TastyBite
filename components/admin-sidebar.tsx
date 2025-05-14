"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Users, FileText, MessageSquare, Utensils, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Recipes",
    href: "/admin/recipes",
    icon: Utensils,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog-posts",
    icon: FileText,
  },
  {
    title: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Tasty</span>
            <span>Bites</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Back to Site">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span>Back to Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

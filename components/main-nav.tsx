"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, CheckSquare, Tag } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Tareas",
      icon: <CheckSquare className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/categories",
      label: "Categorías",
      icon: <Tag className="h-5 w-5" />,
      active: pathname === "/categories",
    },
    {
      href: "/reports",
      label: "Reportes",
      icon: <BarChart className="h-5 w-5" />,
      active: pathname === "/reports",
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md hidden md:block">
        <div className="container flex h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-8 flex items-center space-x-2">
              <CheckSquare className="h-6 w-6 text-primary-600" />
              <span className="font-medium text-xl text-primary-700">Task Manager</span>
            </Link>
            <nav className="flex items-center space-x-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    route.active
                      ? "text-primary-700 bg-primary-50"
                      : "text-slate-700 hover:text-primary-600 hover:bg-primary-50/50",
                  )}
                >
                  {route.icon}
                  <span className="ml-2">{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Bottom Bar */}
      <header className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
        <nav className="flex justify-around items-center h-16">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                route.active ? "text-primary-700" : "text-slate-700 hover:text-primary-600",
              )}
            >
              <div className={cn("p-1.5 rounded-full mb-1", route.active ? "bg-primary-50" : "")}>{route.icon}</div>
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Header - Top Bar */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md md:hidden">
        <div className="flex h-14 items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-lg text-primary-700">Task Manager</span>
          </Link>
        </div>
      </header>
    </>
  )
}

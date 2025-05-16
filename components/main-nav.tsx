"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, CheckSquare, Menu, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const routes = [
    {
      href: "/",
      label: "Tareas",
      icon: <CheckSquare className="h-5 w-5 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/categories",
      label: "Categorías",
      icon: <Tag className="h-5 w-5 mr-2" />,
      active: pathname === "/categories",
    },
    {
      href: "/reports",
      label: "Reportes",
      icon: <BarChart className="h-5 w-5 mr-2" />,
      active: pathname === "/reports",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex items-center">
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
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex md:hidden items-center">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-slate-700">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <Link href="/" className="ml-2 flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-lg text-primary-700">Task Manager</span>
          </Link>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden">
            <nav className="container py-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center py-3 px-4 text-base font-medium transition-colors rounded-lg my-1",
                    route.active
                      ? "text-primary-700 bg-primary-50"
                      : "text-slate-700 hover:text-primary-600 hover:bg-primary-50/50",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

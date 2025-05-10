"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, CheckSquare, Menu, X } from "lucide-react"
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
      icon: <CheckSquare className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/reports",
      label: "Reportes",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      active: pathname === "/reports",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Task Manager</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground" : "text-foreground/60",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="ml-2 flex items-center space-x-2">
            <span className="font-bold">Task Manager</span>
          </Link>
        </div>

        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 border-b bg-background md:hidden">
            <nav className="container py-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center py-2 text-base font-medium transition-colors hover:text-foreground/80",
                    route.active ? "text-foreground" : "text-foreground/60",
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

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    // Store the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    // Show iOS prompt if needed
    if (isIOS && !localStorage.getItem("iosPromptDismissed")) {
      setShowIOSPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setInstallPrompt(null)
      setShowIOSPrompt(false)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    // Show the install prompt
    await installPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice

    // Reset the install prompt variable
    setInstallPrompt(null)

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
      setDismissed(true)
    }
  }

  const dismissIOSPrompt = () => {
    setShowIOSPrompt(false)
    localStorage.setItem("iosPromptDismissed", "true")
  }

  if (isInstalled || (dismissed && !showIOSPrompt)) return null

  if (showIOSPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Instalar aplicación</CardTitle>
              <Button variant="ghost" size="icon" onClick={dismissIOSPrompt}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Añade esta app a tu pantalla de inicio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Toca{" "}
              <span className="inline-block bg-gray-100 p-1 rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.18 19.638 8 19C7.5 19 5.5 20 4.5 20C4 20 3.5 19.5 4 19C4.5 18.5 5 17.5 5 16.5C3.699 15.239 3 13.705 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{" "}
              y luego "Añadir a la pantalla de inicio"
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (installPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleInstallClick} className="shadow-lg">
          <Download className="mr-2 h-4 w-4" />
          Instalar aplicación
        </Button>
      </div>
    )
  }

  return null
}

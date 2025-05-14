"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrintButton() {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Get the recipe content
    const recipeContent = document.querySelector("main")
    if (!recipeContent) return

    // Create print-friendly styles
    const styles = `
      <style>
        @media print {
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            padding: 20px;
          }
          h1 { font-size: 24px; margin-bottom: 10px; }
          h2 { font-size: 20px; margin: 20px 0 10px; }
          p { margin: 0 0 10px; }
          .print-hide { display: none; }
          .recipe-content { max-width: 800px; margin: 0 auto; }
          .ingredients-list { margin: 20px 0; }
          .ingredients-list li { margin-bottom: 8px; }
          .instructions-list { margin: 20px 0; }
          .instructions-list li { margin-bottom: 15px; }
          @page { margin: 2cm; }
        }
      </style>
    `

    // Generate print-friendly HTML
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recipe - Print Version</title>
          ${styles}
        </head>
        <body>
          <div class="recipe-content">
            ${recipeContent.innerHTML}
          </div>
          <script>
            // Remove non-printable elements
            document.querySelectorAll('.print-hide').forEach(el => el.remove())
            // Auto-print
            window.onload = () => {
              window.print()
              window.close()
            }
          </script>
        </body>
      </html>
    `

    // Write the content to the new window and trigger print
    printWindow.document.write(content)
    printWindow.document.close()
  }

  return (
    <Button variant="outline" size="icon" onClick={handlePrint}>
      <Printer className="h-4 w-4" />
    </Button>
  )
}

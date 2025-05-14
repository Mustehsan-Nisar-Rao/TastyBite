import { Button } from "@/components/ui/button"

interface RecipePaginationProps {
  currentPage: number
  totalPages: number
}

export default function RecipePagination({ currentPage, totalPages }: RecipePaginationProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentPage === 1 ? "outline" : "default"}
        className={`border-amber-400 ${
          currentPage === 1 ? "text-amber-400 hover:bg-amber-100" : "bg-amber-400 hover:bg-amber-500 text-amber-900"
        }`}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {[...Array(totalPages)].map((_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          className={`border-amber-400 ${
            currentPage === i + 1 ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-amber-900 hover:bg-amber-100"
          }`}
        >
          {i + 1}
        </Button>
      ))}

      <Button
        variant={currentPage === totalPages ? "outline" : "default"}
        className={`border-amber-400 ${
          currentPage === totalPages
            ? "text-amber-400 hover:bg-amber-100"
            : "bg-amber-400 hover:bg-amber-500 text-amber-900"
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  )
}

import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold">EcoSnap X</span>
          </Link>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/about" className="text-sm hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/contact" className="text-sm hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} EcoSnap X. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

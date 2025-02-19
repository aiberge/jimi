import { MaqdisCarWebsite } from "@/components/maqdis-car-website"
import { notFound } from "next/navigation"

// Define languages directly here for server-side use
const validLanguages = ['en', 'ar', 'fr'] as const
type ValidLanguage = typeof validLanguages[number]

export default function Page({ params }: { params: { lang: string } }) {
  if (!validLanguages.includes(params.lang as ValidLanguage)) {
    notFound()
  }

  return <MaqdisCarWebsite />
}

export function generateStaticParams() {
  // Return static array instead of using map
  return [
    { lang: 'en' },
    { lang: 'ar' },
    { lang: 'fr' }
  ]
}

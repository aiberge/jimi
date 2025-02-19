export default function SchemaMarkup() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CarRental",
          "name": "Jimi Car",
          "image": "/logo.png",
          "description": "Professional car rental service in Fès, Morocco. We offer a wide range of vehicles for all your needs.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "fes X225+32H, N8",
            "addressLocality": "Oulad Tayeb",
            "addressRegion": "Fès",
            "addressCountry": "MA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "33.9502674",
            "longitude": "-4.9922795"
          },
          "openingHours": [
            "Mo-Fr 08:00-20:00",
            "Sa-Su 09:00-18:00"
          ],
          "telephone": "+212664691080",
          "email": "contact@jimicar.com",
          "url": "https://jimicar.com",
          "priceRange": "$$"
        })
      }}
    />
  )
}

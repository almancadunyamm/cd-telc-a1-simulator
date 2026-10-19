/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Öğrenci belgesi PDF'i için font/imza dosyaları sunucu paketine dahil edilsin.
  outputFileTracingIncludes: {
    "/api/belge/*": ["./lib/documents/assets/**/*"],
    "/api/admin/belge": ["./lib/documents/assets/**/*"],
  },
}

export default nextConfig

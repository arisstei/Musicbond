/** @type {import('next').NextConfig} */
const nextConfig = {
  // Το /api/songs διαβάζεται από το Musicbond (άλλο domain) — επιτρέπουμε CORS.
  // Είναι δημόσια, read-only δεδομένα, οπότε το "*" είναι ασφαλές εδώ.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ],
      },
    ];
  },
};

export default nextConfig;

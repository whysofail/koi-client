// app/api/env/route.js

export async function GET() {
  // Define the public environment variables to expose
  const publicEnvVars = {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_APPLICATION_URL: process.env.NEXT_PUBLIC_APPLICATION_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_LARAVEL_URL: process.env.NEXT_PUBLIC_LARAVEL_URL,
    NEXT_PUBLIC_KOI_IMG_BASE_URL: process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL,
    NEXT_PUBLIC_S3_URL: process.env.NEXT_PUBLIC_S3_URL,
  };

  // Respond with the public environment variables
  return new Response(JSON.stringify(publicEnvVars), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

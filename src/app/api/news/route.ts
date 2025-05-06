import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_URL;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const page = request.nextUrl.searchParams.get("page") ?? "1";

  let url = `${BASE_URL}/api/news`;
  if (slug) {
    url += `/${slug}`;
  } else {
    url += `?page=${page}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch news, please try again later" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_URL;
const API_KEY = process.env.KOI_HEADERS;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const koiId = searchParams.get("id");
    const page = searchParams.get("page");
    const perPage = searchParams.get("per_page");
    const status = searchParams.get("status");

    let url = `${BASE_URL}/api/kois`;
    if (koiId) {
      url += `/${koiId}`;
    } else if (page) {
      url += `?page=${page}&per_page=${perPage}&status=${status}`;
    }

    const response = await fetch(url, {
      headers: {
        "x-api-key": API_KEY!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch koi data, please try again later",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { koiId, status, buyer_name, sell_date } = await request.json();

    // Ensure sell_date is sent only when status is "Sold"
    const payload: Record<string, any> = { status };
    if (buyer_name) payload.buyer_name = buyer_name;
    if (status === "Sold" && sell_date) payload.sell_date = sell_date;

    const response = await fetch(`${BASE_URL}/api/kois/${koiId}`, {
      method: "PUT",
      headers: {
        "x-api-key": API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        message: "Operation failed, please try again later",
      },
      { status: 500 },
    );
  }
}

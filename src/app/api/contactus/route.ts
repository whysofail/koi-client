import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_URL;
const API_KEY = process.env.KOI_HEADERS;

export type ContactUsData = {
  email?: string;
  whatsapp?: string;
  message?: string;
};

export async function GET() {
  try {
    const url = `${BASE_URL}/api/contact`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": API_KEY!,
      },
    });

    const data: ContactUsData = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch contact us data, please try again later",
      },
      { status: 500 },
    );
  }
}

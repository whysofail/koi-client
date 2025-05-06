"use client";

import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useNewsDetail } from "@/server/news/queries"; // Adjust the import path as needed

// This is a Client Component
export default function NewsDetailContent({ slug }: { slug: string }) {
  const { data, isLoading, error } = useNewsDetail(slug);

  // Access the nested data structure correctly
  const newsItem = data?.data;

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mx-auto mb-8 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-6 h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="rounded-xl bg-white p-6  dark:bg-gray-800">
        <p className="text-center text-red-500">Failed to load news item</p>
        <div className="mt-4 text-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-700">
            <pre>
              {JSON.stringify({ error: error?.message, data }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  const date = parseISO(newsItem.created_at);

  // Handle image URL - check if it's a full URL or a relative path
  const imageUrl = newsItem.image.startsWith("http")
    ? newsItem.image
    : `${process.env.NEXT_PUBLIC_LARAVEL_URL}/img/koi/website/news/${newsItem.image}`;

  return (
    <div className="rounded-xl bg-white p-6  dark:bg-gray-800">
      <div className="mb-2 text-center">
        <span className="text-gray-600 dark:text-gray-400">
          {/* {newsItem.type} */}
        </span>
      </div>

      {newsItem.image && (
        <div className="relative my-6">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={newsItem.title}
            width={800}
            height={450}
            className="mx-auto rounded-lg object-cover"
            priority
          />
        </div>
      )}
      <h1 className="mb-4  text-2xl font-bold md:text-3xl">{newsItem.title}</h1>
      <div className="mb-4  text-red-600 dark:text-red-300">
        <div className="text-sm font-medium">
          {format(date, "EEEE, dd MMMM yyyy")}
        </div>
        <div className="text-sm font-medium">{format(date, "HH:mm")}</div>
      </div>
      <div
        className="prose prose-sm md:prose-base dark:prose-invert mt-8 max-w-none leading-relaxed text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: newsItem.description }}
      />
    </div>
  );
}

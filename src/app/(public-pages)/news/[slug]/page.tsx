import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsDetailContent from "@/components/home/news/news-detail";

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-red-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to News
        </Link>

        <NewsDetailContent slug={params.slug} />
      </div>
    </div>
  );
}

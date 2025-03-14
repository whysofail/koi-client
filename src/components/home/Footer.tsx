import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-red-800 py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          <Link
            href="/about"
            className="whitespace-nowrap py-1 text-sm hover:underline sm:text-base"
          >
            About FS Koi
          </Link>
          <Link
            href="/license"
            className="whitespace-nowrap py-1 text-sm hover:underline sm:text-base"
          >
            License/Certificate
          </Link>
          <Link
            href="/terms"
            className="whitespace-nowrap py-1 text-sm hover:underline sm:text-base"
          >
            Terms of Use Agreement
          </Link>
          <Link
            href="/privacy"
            className="whitespace-nowrap py-1 text-sm hover:underline sm:text-base"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

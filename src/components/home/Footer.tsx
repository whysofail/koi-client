import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-red-800 py-6 text-white">
      <div className="container mx-auto flex justify-center space-x-8 px-4">
        <Link href="/about" className="hover:underline">
          About FS Koi
        </Link>
        <Link href="/license" className="hover:underline">
          License/Certificate
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Use Agreement
        </Link>
        <Link href="/privacy" className="hover:underline">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}

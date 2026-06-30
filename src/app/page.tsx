import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-white p-8">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="MATSEK — Matematička sekcija"
            width={420}
            height={160}
            className="h-auto w-full max-w-[420px]"
            priority
            unoptimized
          />
        </div>
        <p className="text-xl text-gray-600 leading-relaxed">
          Dobrodošli u službenu aplikaciju za upravljanje aktivnostima
          studentskog Math Cluba na Fakultetu elektrotehnike i računarstva.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg
                       hover:bg-brand-700 transition-colors font-medium"
          >
            Registriraj se
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-brand-300 text-brand-700
                       rounded-lg hover:bg-brand-50 transition-colors font-medium"
          >
            Prijavi se
          </Link>
        </div>
        <div className="pt-4">
          <Link
            href="/calendar"
            className="text-brand-600 hover:underline"
          >
            Pogledaj kalendar aktivnosti →
          </Link>
        </div>
      </div>
    </main>
  );
}

import React, { FC } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const LandingPage: FC = () => {
  return (
    <main className="flex-grow dark:bg-gray-900">
      {/* Carousel Banner */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="relative overflow-hidden rounded-3xl bg-black">
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px]">
            <Image
              src="/ikan.png"
              alt="Koi fish"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl p-4 text-white sm:p-8 md:p-12">
              <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:mb-4 md:text-5xl">
                Current Event
              </h1>
              <p className="mb-2 text-xs text-yellow-200 sm:text-sm md:mb-4">
                Period of the event | 2025.01.10 8:00 - 2025.01.20 21:00
              </p>
              <p className="hidden text-xs text-gray-200 sm:block sm:text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                ipsum suspendisse ultrices gravida. Risus commodo.
              </p>
            </div>

            {/* Navigation */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-1 sm:left-4 sm:p-2">
              <ChevronLeft className="h-4 w-4 text-white sm:h-6 sm:w-6" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-1 sm:right-4 sm:p-2">
              <ChevronRight className="h-4 w-4 text-white sm:h-6 sm:w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2 sm:bottom-6">
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white/50" />
              <div className="h-2 w-2 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Upcoming Events */}
          <div className="relative mt-6">
            <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-[#E8D5B0] px-8 py-2 text-lg font-bold dark:bg-[#6a5c41] dark:text-gray-100 sm:text-xl">
              Upcoming Events
            </div>
            <div className="flex flex-col rounded-xl bg-red-800 p-4 dark:bg-red-900 sm:flex-row sm:p-6">
              <div className="mb-4 flex w-full justify-center sm:mb-0 sm:block sm:w-1/3">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Valentine Auction"
                  width={150}
                  height={150}
                  className="rounded-lg bg-blue-500"
                />
              </div>
              <div className="w-full text-white sm:w-2/3 sm:pl-6">
                <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                  Valentine Auction
                </h3>
                <p className="mb-2 text-xs text-yellow-200 sm:text-sm">
                  Period of the event
                  <br />
                  2025.02.12 8:00 - 2025.02.14 21:00
                </p>
                <p className="text-xs sm:text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices.
                </p>
              </div>
            </div>
          </div>

          {/* Past Events */}
          <div className="relative mt-6">
            <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-[#E8D5B0] px-8 py-2 text-lg font-bold dark:bg-[#6a5c41] dark:text-gray-100 sm:text-xl">
              Past Events
            </div>
            <div className="flex flex-col rounded-xl bg-red-800 p-4 dark:bg-red-900 sm:flex-row sm:p-6">
              <div className="mb-4 flex w-full justify-center sm:mb-0 sm:block sm:w-1/3">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Year End Auction"
                  width={150}
                  height={150}
                  className="rounded-lg bg-blue-500"
                />
              </div>
              <div className="w-full text-white sm:w-2/3 sm:pl-6">
                <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                  Year End Auction
                </h3>
                <p className="mb-2 text-xs text-yellow-200 sm:text-sm">
                  Period of the event
                  <br />
                  2024.12.20 8:00 - 2024.12.30 21:00
                </p>
                <p className="text-xs sm:text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-[#E8D5B0] p-4 dark:bg-[#6a5c41] sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold dark:text-gray-100 sm:mb-8 sm:text-3xl">
            News
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex flex-col rounded-lg bg-white p-4 dark:bg-gray-800 sm:flex-row"
              >
                <div className="mb-2 w-full font-bold text-red-800 dark:text-red-300 sm:mb-0 sm:w-32">
                  2024 12 31
                </div>
                <div className="flex-1 dark:text-gray-200">
                  <h3 className="mb-2 font-bold">
                    {item === 1 ? "Auction winner" : "Lorem Ipsum"}
                  </h3>
                  <p className="text-xs sm:text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                    commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-2 dark:text-gray-200">
            <Link href="#" className="px-2">
              1
            </Link>
            <Link href="#" className="px-2">
              2
            </Link>
            <Link href="#" className="px-2">
              3
            </Link>
            <Link href="#" className="px-2">
              4
            </Link>
            <Link href="#" className="px-2">
              »
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="FS KOI Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <div className="text-center dark:text-gray-200 sm:text-left">
              <div className="mb-2">
                <span className="font-bold">Location</span> | Lorem Ipsum
              </div>
              <div className="mb-2">
                <span className="font-bold">Tel</span> | 021 123456
              </div>
              <div className="mb-2">
                <span className="font-bold">Mail</span> | LoremIpsum@mail.com
              </div>
              <div className="mt-4 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
                  FS KOI
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Location Map"
              width={600}
              height={300}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;

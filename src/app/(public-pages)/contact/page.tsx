import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const ContactPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Contact Us</h1>

        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=120&width=120"
                alt="FS KOI Logo"
                width={120}
                height={120}
                className="mr-6"
              />
              <h2 className="text-3xl font-bold text-red-800">FS KOI</h2>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-red-800" />
                <span>123 Koi Street, Aquarium District, Jakarta</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-red-800" />
                <span>+62 21 123456</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-red-800" />
                <span>info@fskoi.com</span>
              </div>
            </div>

            <h3 className="mb-4 text-xl font-semibold">Business Hours</h3>
            <div className="mb-8 grid grid-cols-2 gap-2">
              <div>Monday - Friday:</div>
              <div>9:00 AM - 6:00 PM</div>
              <div>Saturday:</div>
              <div>10:00 AM - 4:00 PM</div>
              <div>Sunday:</div>
              <div>Closed</div>
            </div>

            <h3 className="mb-4 text-xl font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="rounded-full bg-red-800 p-3 text-white transition-colors hover:bg-red-700"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="rounded-full bg-red-800 p-3 text-white transition-colors hover:bg-red-700"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="rounded-full bg-red-800 p-3 text-white transition-colors hover:bg-red-700"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg bg-yellow-100 p-8 shadow-md">
            <h3 className="mb-6 text-xl font-semibold">Send Us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded-md bg-red-800 px-6 py-2 text-white transition-colors hover:bg-red-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">Find Us</h3>
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300">
            {/* Replace this with an actual Google Maps embed in production */}
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Location Map"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-12 w-12" />
                <p className="text-lg font-semibold">FS KOI Location</p>
                <p>Interactive map would appear here</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              For the best experience visiting our store, we recommend calling
              ahead to schedule an appointment.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-lg bg-yellow-100 p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="border-b border-gray-300 pb-4">
              <h4 className="mb-2 font-medium">
                What types of koi do you sell?
              </h4>
              <p className="text-gray-700">
                We specialize in high-quality Japanese koi varieties including
                Kohaku, Sanke, Showa, and many others. Our selection changes
                regularly based on availability and season.
              </p>
            </div>
            <div className="border-b border-gray-300 pb-4">
              <h4 className="mb-2 font-medium">
                How does the auction process work?
              </h4>
              <p className="text-gray-700">
                Our auctions are held online through our website. You need to
                register an account to participate. Auctions typically run for a
                set period, and the highest bidder at the end wins.
              </p>
            </div>
            <div className="border-b border-gray-300 pb-4">
              <h4 className="mb-2 font-medium">Do you ship internationally?</h4>
              <p className="text-gray-700">
                Yes, we offer international shipping for our koi. Shipping costs
                and requirements vary by destination. Please contact us for
                specific details about shipping to your location.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;

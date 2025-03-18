"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

type ContactUsData = {
  email: string;
  whatsapp: string;
  message: string;
};

const ContactPage = () => {
  const [contact, setContact] = useState<ContactUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/contactus");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch data.");
        }

        setContact(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load contact details.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Contact Us</h1>

        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            {loading ? (
              <p className="text-center text-gray-500">
                Loading contact details...
              </p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-center">
                  <Image
                    src="/Logo.png"
                    alt="FS KOI Logo"
                    width={240}
                    height={240}
                    className="mr-6"
                  />
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-red-800" />
                    <span>{contact?.whatsapp || "+62 21 123456"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-red-800" />
                    <span>{contact?.email || "info@fskoi.com"}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{contact?.message || ""}</span>
                  </div>
                </div>
              </>
            )}
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
      </main>
    </div>
  );
};

export default ContactPage;

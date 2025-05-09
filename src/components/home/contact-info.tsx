// components/ContactInfo.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";

type ContactUsData = {
  email: string;
  whatsapp: string;
  message: string;
};

const ContactInfo = () => {
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
      } catch (err) {
        setError("Failed to load contact details." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading contact details...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center justify-center">
        <Image
          src="/Logo.png"
          alt="FS KOI Logo"
          width={240}
          height={240}
          className="mr-6"
        />
      </div>
      <div className="mb-8 space-y-6 text-center">
        <div className="flex items-center justify-center">
          <Phone className="mr-3 h-5 w-5 text-red-800" />
          <span className="text-xl">
            {contact?.whatsapp || "+62 21 123456"}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <Mail className="mr-3 h-5 w-5 text-red-800" />
          <span className="text-xl">{contact?.email || "info@fskoi.com"}</span>
        </div>
        {contact?.message && (
          <div className="text-lg text-gray-700">{contact?.message}</div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;

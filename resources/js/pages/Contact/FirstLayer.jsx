import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const FirstLayer = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      {/* <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-[#4E40D9] mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At OptiVest, we value your inquiries and feedback. Whether you have
          questions about our services, need investment guidance, or want to
          collaborate, our team is here to assist you.
        </p>
      </div> */}

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          {
            icon: <Phone className="w-8 h-8 text-[#4E40D9]" />,
            title: "Call Us",
            detail: "+234 901 123 4567",
          },
          {
            icon: <Mail className="w-8 h-8 text-[#4E40D9]" />,
            title: "Email Us",
            detail: "support@optivest.com",
          },
          {
            icon: <MapPin className="w-8 h-8 text-[#4E40D9]" />,
            title: "Visit Us",
            detail: "123 OptiVest Street, Lagos, Nigeria",
          },
          {
            icon: <Clock className="w-8 h-8 text-[#4E40D9]" />,
            title: "Working Hours",
            detail: "Mon - Fri: 8:00 AM - 6:00 PM",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#4E40D9] mb-6">
          Send Us a Message
        </h2>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E40D9]"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E40D9]"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E40D9]"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E40D9]"
          ></textarea>
          <button
            type="submit"
            className="bg-[#4E40D9] hover:bg-[#080244] transition-colors duration-300 text-white font-semibold py-3 px-6 rounded-lg w-full md:w-auto"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Map Embed */}
      {/* <div className="max-w-6xl mx-auto mt-16">
        <iframe
          title="OptiVest Location"
          src="https://www.google.com/maps/embed?pb=!1m18!..."
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl shadow-md"
        ></iframe>
      </div> */}
    </div>
  );
};

export default FirstLayer;

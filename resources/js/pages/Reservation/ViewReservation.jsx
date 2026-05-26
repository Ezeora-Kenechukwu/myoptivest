import React, { useState } from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaFacebook, FaTimes, FaWhatsapp } from "react-icons/fa";
import { BadgeCheck, Clock, XCircle, ShieldCheck, Ban, ThumbsDown, CheckCircle2, Slash } from "lucide-react";
import { useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

import Modal from '@/components/Modal';
import SweetAlert from '@/components/SweetAlert'; // make sure you import your sweet alert
import { Button } from '@/components/ui/button';
import { HiCheckCircle, HiClock, HiXCircle } from 'react-icons/hi';
import { FaTelegramPlane } from 'react-icons/fa';
const ViewReservation = ({ reservation, show, onClose }) => {
    const { user, celebrity } = reservation;

    const statusBadge = (status) => {
      switch (status) {
        case 'approved':
          return (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <HiCheckCircle className="w-4 h-4 mr-1" /> Approved
            </span>
          );
        case 'pending':
          return (
            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <HiClock className="w-4 h-4 mr-1" /> Pending
            </span>
          );
        case 'rejected':
          return (
            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <HiXCircle className="w-4 h-4 mr-1" /> Rejected
            </span>
          );
        default:
          return status;
      }
    };

    const renderSocialIcon = (title) => {
      switch (title.toLowerCase()) {
        case 'facebook':
          return <FaFacebook className="w-5 h-5" />;
        case 'whatsapp':
          return <FaWhatsapp className="w-5 h-5" />;
        case 'telegram':
          return <FaTelegramPlane className="w-5 h-5" />;
        default:
          return null;
      }
    };

    return (
        <Modal closeable={true} show={show} onClose={onClose}>
      <div className="max-w-5xl max-h-[500px] mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-2xl space-y-8 mt-10 border border-gray-100 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800">Reservation Details</h1>
          {statusBadge(reservation.status)}
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailCard title="Occasion" value={reservation.occasion_type} />
          <DetailCard title="Date & Time" value={`${new Date(reservation.event_date).toDateString()} at ${reservation.event_time}`} />
          <DetailCard title="Duration" value={`${reservation.event_duration} hour(s)`} />
          <DetailCard title="Payment Status" value={reservation.payment_status} />
          <DetailCard
            title="Amount"
            value={
              celebrity.currency_position === 'left'
                ? `${celebrity.currency}${reservation.amount}`
                : `${reservation.amount}${celebrity.currency}`
            }
            bold
          />
          {reservation.telegram_link && (
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm space-y-2">
              <h3 className="text-lg font-semibold text-blue-700">Telegram Group</h3>
              <a
                href={reservation.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 font-medium hover:underline"
              >
                <FaTelegramPlane className="mr-2" /> Join Group
              </a>
            </div>
          )}
        </div>

        {/* Location */}
        <Section title="Event Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <p><strong>State:</strong> {reservation.event_state}</p>
            <p><strong>City:</strong> {reservation.event_city}</p>
            <p><strong>Location:</strong> {reservation.event_location}</p>
            <p><strong>Landmark:</strong> {reservation.nearest_landmark}</p>
            <p><strong>Direction Hint:</strong> {reservation.direction_hint}</p>
            <p><strong>Nearest Police Station:</strong> {reservation.nearest_police_station}</p>
          </div>
        </Section>

        {/* Additional Info */}
        <Section title="Additional Information">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: reservation.additional_info }} />
        </Section>

        {/* User Info */}
        <Section title="Booked By">
          <InfoList data={{
            'Name': user.name,
            'Email': user.email,
            'Phone': user.phone,
            'User Type': user.type,
          }} />
        </Section>

        {/* Celebrity Info */}
        <Section title="Celebrity Info">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`/storage/${celebrity.thumbnail}`}
              alt={celebrity.name}
              className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow"
            />
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {celebrity.name}</p>
              <p><strong>Bio:</strong> {celebrity.bio}</p>
              <div className="flex space-x-4">
                {celebrity.social_links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    {renderSocialIcon(link.title)}
                    <span className="text-sm">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {celebrity.photo?.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {celebrity.photo.map((img, i) => (
                <img
                  key={i}
                  src={`/storage/${img}`}
                  alt={`celebrity-${i}`}
                  className="w-full h-40 object-cover rounded-md shadow-sm border border-gray-100"
                />
              ))}
            </div>
          )}
        </Section>
      </div>
      </Modal>
    );
};

// Reusable Components
const DetailCard = ({ title, value, bold }) => (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={bold ? 'font-bold text-gray-900' : 'text-gray-600'}>{value}</p>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );

  const InfoList = ({ data }) => (
    <div className="text-gray-600 space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <p key={key}><strong>{key}:</strong> {value}</p>
      ))}
    </div>
  );


export default ViewReservation;

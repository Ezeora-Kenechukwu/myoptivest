import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaTimes } from "react-icons/fa";
import Modal from '@/components/Modal';

const ViewSavingsplan = ({ savingsplan, show, onClose }) => {
  return (
    <Modal closeable={false} show={show} onClose={onClose}>
      <div className="w-full max-h-[90vh] overflow-y-auto px-4 md:px-10 py-6">
        {/* Close Button */}
        <button className="text-red-600 text-2xl cursor-pointer" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Header Thumbnail */}
        <div className="relative h-48 md:h-64 w-full rounded-xl overflow-hidden mb-6 shadow-lg">
          <img
            src={`/storage/${savingsplan.thumbnail}`}
            alt={savingsplan.name}
            className="w-[300px] block mx-auto h-full object-contain"
          />
          <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4 text-white">
            <h1 className="text-xl md:text-2xl font-semibold">{savingsplan.name}</h1>
          </div>
        </div>

        {/* Carousel */}
        <div className="rounded-xl overflow-hidden mb-6">
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={4000}
            showStatus={false}
          >
            {savingsplan.photos.map((src, idx) => (
              <div key={idx} className="h-[200px] md:h-[350px] bg-black">
                <img
                  src={`/storage/${src}`}
                  alt={`Photo ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Plan Info */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Slug:</strong> {savingsplan.slug}</p>
            <p><strong>Type:</strong> {savingsplan.type}</p>
            <p><strong>Daily Amount:</strong> ₦{savingsplan.daily_amount}</p>
            <p><strong>Monthly Charge:</strong> ₦{savingsplan.monthly_charge}</p>
            <p><strong>Duration:</strong> {savingsplan.duration} days</p>
            <p><strong>Target Amount:</strong> ₦{savingsplan.target_amount}</p>
            <p><strong>Status:</strong> {savingsplan.active ? 'Active' : 'Inactive'}</p>
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-lg font-semibold mt-6">Short Description</h2>
            <p>{savingsplan.short_description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mt-4">Long Description</h2>
            <div
              className="prose max-w-none prose-p:leading-relaxed prose-headings:text-gray-800"
              dangerouslySetInnerHTML={{ __html: savingsplan.long_description }}
            />
          </div>

          {/* Creator Info */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold">Created By</h2>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={`/storage/${savingsplan.creator.avatar}`}
                alt={savingsplan.creator.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{savingsplan.creator.name}</p>
                <p className="text-xs text-gray-500">{savingsplan.creator.email}</p>
                <p className="text-xs text-gray-500">{savingsplan.creator.phone}</p>
                <p className="text-xs text-gray-500">{savingsplan.creator.city}, {savingsplan.creator.country}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <p>Created At: {new Date(savingsplan.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(savingsplan.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewSavingsplan;

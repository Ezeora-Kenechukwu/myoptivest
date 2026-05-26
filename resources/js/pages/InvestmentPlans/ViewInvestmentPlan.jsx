import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaTimes } from "react-icons/fa";
import Modal from '@/components/Modal';

const ViewInvestmentPlan = ({ investmentplan, show, onClose }) => {
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
            src={`/storage/${investmentplan.thumbnail}`}
            alt={investmentplan.name}
            className="w-[300px] block mx-auto h-full object-contain"
          />
          <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4 text-white">
            <h1 className="text-xl md:text-2xl font-semibold">{investmentplan.name}</h1>
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
            {investmentplan.photos.map((src, idx) => (
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
            <p><strong>Slug:</strong> {investmentplan.slug}</p>
            <p><strong>Minimum Amount:</strong> {investmentplan.min_amount}</p>
            <p><strong>Maximum Amount:</strong> {investmentplan.max_amount || 'N/A'}</p>
            <p><strong>ROI:</strong> {investmentplan.roi}%</p>
            <p><strong>Duration:</strong> {investmentplan.duration} days</p>
            <p><strong>Payout Frequency:</strong> {investmentplan.payout_frequency}</p>
            <p><strong>Status:</strong> {investmentplan.active ? 'Active' : 'Inactive'}</p>
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-lg font-semibold mt-6">Short Description</h2>
            <p>{investmentplan.short_description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mt-4">Long Description</h2>
            <div
              className="prose max-w-none prose-p:leading-relaxed prose-headings:text-gray-800"
              dangerouslySetInnerHTML={{ __html: investmentplan.long_description }}
            />
          </div>

          {/* Creator Info */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold">Created By</h2>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={`/storage/${investmentplan.creator.avatar}`}
                alt={investmentplan.creator.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{investmentplan.creator.name}</p>
                <p className="text-xs text-gray-500">{investmentplan.creator.email}</p>
                <p className="text-xs text-gray-500">{investmentplan.creator.phone}</p>
                <p className="text-xs text-gray-500">{investmentplan.creator.city}, {investmentplan.creator.country}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-500 mt-4">
            <p>Created At: {new Date(investmentplan.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(investmentplan.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewInvestmentPlan;

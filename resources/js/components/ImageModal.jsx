import React, { useState } from 'react';
import { FaTimes, FaPrint, FaDownload } from 'react-icons/fa';

// ImageModal Component
const ImageModal = ({ filePath, imageClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
{/* <ImageModal filePath={staff?.signature} imageClass="w-32 h-32 rounded shadow-lg" /> */}
  // Check if the file path is an image
  const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

  // Toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Print the image
  const handlePrint = () => {
    const printWindow = window.open('');
    printWindow.document.write(`<img src="/storage/${filePath}" onload="window.print();window.close()" />`);
    printWindow.document.close();
  };

  // Get the download URL
  const downloadUrl = `/storage/${filePath}`;

  return (
    <>
      {/* Display Image if it's valid */}
      {filePath && isImage(filePath) ? (
        <img
          src={downloadUrl}
          alt="Preview"
          className={imageClass}
          onClick={toggleModal}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <span className="text-gray-500">Invalid image path</span>
      )}

      {/* Modal for full-screen image display */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-black text-2xl"
            >
              <FaTimes />
            </button>
            <img src={downloadUrl} alt="Full View" className="max-w-full max-h-screen" />

            {/* Buttons for Print and Download */}
            <div className="absolute bottom-4 right-4 flex gap-4">
              <button
                onClick={handlePrint}
                className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center"
              >
                <FaPrint className="mr-2" /> Print
              </button>
              <a
                href={downloadUrl}
                download
                className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg flex items-center"
              >
                <FaDownload className="mr-2" /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;

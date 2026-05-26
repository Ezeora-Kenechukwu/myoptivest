import React, { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const ImageUpload = ({ onImagesChange,preview=[] }) => {
    const [imageData, setImageData] = useState({ previews: preview, files: [] });
    const fileInputRef = useRef(null);

    useEffect(() => {
        onImagesChange(imageData.files);
    }, [imageData.files]);

    const handleImagesChange = (e, replaceIndex = null) => {
        const newFiles = Array.from(e.target.files);
        if (replaceIndex !== null) {
            const updatedPreviews = imageData.previews.map((prev, i) =>
                i === replaceIndex ? URL.createObjectURL(newFiles[0]) : prev
            );
            const updatedFiles = imageData.files.map((file, i) =>
                i === replaceIndex ? newFiles[0] : file
            );

            setImageData({ previews: updatedPreviews, files: updatedFiles });
        } else {
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImageData(prevData => ({
                previews: [...prevData.previews, ...newPreviews],
                files: [...prevData.files, ...newFiles],
            }));
        }
    };

    const handleAddAnotherImage = () => {
        fileInputRef.current.click();
    };

    const handleEditImage = (index) => {
        fileInputRef.current.setAttribute("data-edit-index", index);
        fileInputRef.current.click();
    };

    const handleRemoveImage = (index) => {
        const updatedPreviews = imageData.previews.filter((_, i) => i !== index);
        const updatedFiles = imageData.files.filter((_, i) => i !== index);
        setImageData({ previews: updatedPreviews, files: updatedFiles });
        onImagesChange(updatedFiles);
    };

    return (
        <div className="space-y-4 ">
            {/* <label className="block text-sm font-black text-gray-700 py-2 dark:text-gray-300">Upload Image(s)</label> */}

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                    const editIndex = fileInputRef.current.getAttribute("data-edit-index");
                    handleImagesChange(e, editIndex ? parseInt(editIndex) : null);
                    fileInputRef.current.removeAttribute("data-edit-index");
                }}
                ref={fileInputRef}
                className="hidden"
            />

            {/* {imageData.previews.length === 0 ? (
                <button
                    type="button"
                    onClick={handleAddAnotherImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload Image
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleAddAnotherImage}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Another Image
                </button>
            )} */}

               <button
                    type="button"
                    onClick={handleAddAnotherImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload Image
                </button>

            <div className="mt-4 grid grid-cols-4 gap-1">
                {imageData.previews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded border border-gray-300" />

                        <button
                            type="button"
                            onClick={() => handleEditImage(index)}
                            className="absolute top-1 left-1 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-900"
                            title="Edit Image"
                        >
                            {/* ✎ */}
                            <MdEdit />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                            title="Remove Image"
                        >
                            {/* &times; */}
                            <FaTimes/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;

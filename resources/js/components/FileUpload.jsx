import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  IoCloudUploadSharp
} from 'react-icons/io5';
import {
  FaRegFilePdf,
  FaFileCsv,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
  FaTrash,
  FaFileExcel
} from 'react-icons/fa';
import InputError from '@/components/InputError';

// Helper: get appropriate icon or thumbnail preview
const getFileIcon = (file, isPath = false) => {
  const ext = isPath ? file.split('.').pop().toLowerCase() : file.name.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return <FaRegFilePdf className="text-red-600" />;
    case 'xls':
    case 'xlsx':
      return <FaFileExcel className="text-green-600" />;
    case 'csv':
      return <FaFileCsv className="text-yellow-600" />;
    case 'doc':
    case 'docx':
      return <FaFileWord className="text-blue-600" />;
    case 'ppt':
    case 'pptx':
      return <FaFilePowerpoint className="text-orange-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'PNG':
      return isPath ? (
        <img src={`/storage/${file}`} alt={file} className="w-8 h-8 object-cover" />
      ) : (
        <img src={URL.createObjectURL(file)} alt={file.name} className="w-8 h-8 object-cover" />
      );
    default:
      return <FaFileAlt className="text-gray-600" />;
  }
};

const FileUpload = ({ label, multiple, image = [], setData, className, accept, name, error, data }) => {
  const [files, setFiles] = useState(typeof image === 'string' ? [image] : image);

  const acceptedFileTypes = useMemo(() => accept.map(type => type.toLowerCase()), [accept]);

  // On mount or prop change, set files if data has existing values
  useEffect(() => {
    if (data && Array.isArray(data[name]) && typeof data[name][0] === 'string') {
      setFiles(data[name]);
    }
  }, [data, name]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const filteredFiles = acceptedFiles.filter(file => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return acceptedFileTypes.includes(file.type) || acceptedFileTypes.includes(`.${fileExtension}`);
      });

      if (filteredFiles.length !== acceptedFiles.length) {
        alert("Some files were rejected because they are not allowed.");
      }

      if (!multiple) {
        setFiles(filteredFiles);
        if (setData) {
          setData(prevData => ({
            ...prevData,
            [name]: filteredFiles[0],
          }));
        }
      } else {
        setFiles(filteredFiles); // overwrite (not append)
        if (setData) {
          setData(prevData => ({
            ...prevData,
            [name]: filteredFiles, // only update this field
          }));
        }
      }
    },
    [multiple, setData, name, acceptedFileTypes]
  );

  const removeFile = useCallback(
    (fileIndex) => {
      const newFiles = files.filter((_, index) => index !== fileIndex);
      setFiles(newFiles);
      if (setData) {
        setData(prevData => ({
          ...prevData,
          [name]: newFiles,
        }));
      }
    },
    [files, name, setData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    accept: acceptedFileTypes,
  });

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        {...getRootProps({
          className:
            'border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer mt-1',
        })}
      >
        <input {...getInputProps()} />
        <div className="text-3xl text-gray-300 mb-2">
          <IoCloudUploadSharp />
        </div>
        <p className="text-gray-500">Drag & drop files here, or click to select files</p>
      </div>

      {files?.length > 0 && (
        <div className="max-w-4xl overflow-x-auto">
          <table className="min-w-full max-w-4xl overflow-x-hidden mt-6 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Extension & MIME Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file, index) => (
                <tr key={typeof file === 'string' ? file : file.name + index}>
                  <td className="px-6 py-4 whitespace-nowrap">{getFileIcon(file, typeof file === 'string')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof file === 'string' ? file.split('/').pop() : file.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof file === 'string' ? 'N/A' : `${(file.size / 1024).toFixed(2)} KB`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof file === 'string'
                      ? 'N/A'
                      : new Date(file.lastModified).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof file === 'string' ? file.split('.').pop() : file.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <InputError messages={error} className="mt-2" />}
    </div>
  );
};

export default FileUpload;

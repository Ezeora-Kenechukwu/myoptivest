import React from 'react'
import { FaBacon, FaCheck, FaExclamation, FaInfo, FaTimes } from 'react-icons/fa'
import PrimaryButton from './PrimaryButton'

const SweetAlert = ({ success, message, error, warning, info, cancel, confirm, action, children }) => {

  const newMessage = message ? message : 'No Message';

  return (
    <div className="z-[9999999999] w-screen h-screen bg-[rgba(255,255,255,0.56)] fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div className={`w-[450px] min-h-[350px] bg-white rounded-lg shadow-lg flex items-center justify-center flex-col`}>
        <div className={`text-[50px] animate-pulse flex items-center justify-center rounded-full border-[10px] ${error ? "bg-red-100 border border-red-400 text-red-700" : info ? "bg-teal-100 border-teal-500 text-teal-900" : success ? "bg-green-100 border-green-500 text-green-900" : confirm ? "bg-violet-100 text-violet-900 border-violet-500" : "bg-orange-100 border-orange-500 text-orange-900"} w-[100px] h-[100px] alert`}>
          {error ? <FaTimes /> :
            success ? <FaCheck /> :
              info ? <FaInfo /> :
                confirm ? <FaBacon /> :
                  <FaExclamation />
          }
        </div>
        <h1 className={`px-10 py-4 my-5 text-4xl border-l-4 alertText ${error ? "bg-red-100 border-red-400 text-red-700" : info ? "bg-teal-100 border-teal-500 text-teal-900" : success ? "bg-green-100 border-green-500 text-green-900" : !confirm ? "bg-violet-100 text-violet-900 border-violet-500" : "bg-orange-100 border-orange-500 text-orange-900"}`}>
          {success ? "Success!!!" : error ? "Error!!!" : info ? "Info" : confirm ? "Confirm!!!" : "Warning!!!"}
        </h1>
        <div className="text-gray-900 mb-4">
          {Array.isArray(newMessage) ? newMessage.map((item, index) => {
            return (
              <p className="text-gray-900 text-sm text-center" key={index}>{item}</p>
            )
          })
            :
            <p className="text-gray-900 text-sm text-center ">{newMessage}</p>
          }
        </div>

        {/* Render children before the buttons */}
        {children && <div className="mb-4">{children}</div>}

        <div className="flex items-center justify-evenly w-full">
          {confirm && <PrimaryButton onClick={cancel}>Cancel</PrimaryButton>}
          <PrimaryButton onClick={action}>
            {confirm ? "Confirm" : "Ok"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default SweetAlert;

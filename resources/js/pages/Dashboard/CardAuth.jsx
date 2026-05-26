import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardAuth = ({ data, setData, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect for 3D Secure cards
  useEffect(() => {
    if (data.cardType === '3ds' && data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  }, [data]);

  // OTP submit handler
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('/monnify/card/otp-authorize', {
        transactionReference: data.transactionReference,
        tokenId: data.tokenId,
        token: otp,
        collectionChannel: 'API_NOTIFICATION',
      });

      const res = response.data;

      if (res.success) {
        setMessage('Payment authorized successfully!');
        onSuccess?.(res);
        setData({ ...data, showOtp: false });
      } else {
        setMessage(res.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP authorization error:', error);
      setMessage('An error occurred while authorizing OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  if (data.cardType === '3ds') {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700">Redirecting to your bank for 3D Secure authorization...</p>
      </div>
    );
  }

  if (data.cardType === 'otp') {
    return (
      <form onSubmit={handleOtpSubmit} className="max-w-md mx-auto mt-6 p-4 border rounded shadow">
        <h2 className="text-lg font-semibold text-center mb-4">Enter OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded mb-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit OTP'}
        </button>

        {message && (
          <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
        )}
      </form>
    );
  }

  return null;
};

export default CardAuth;

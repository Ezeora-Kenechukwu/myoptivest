import React from 'react';
import axios from 'axios';

const CardPayment = ({ data, setData }) => {
  const handleHostedCheckout = async () => {
    try {
      setData('loading', true);

      const response = await axios.post('/monnify/init-card', {
        amount: data.amount,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
      });

      const result = response.data;

      if (result.success && result.data?.checkoutUrl) {
        window.open(result.data.checkoutUrl, '_blank');
        setData({
          ...data,
          showCardCharge: false,
          showFund: false,
          loading: false,
          transactionReference: result.data.transactionReference,
          paymentReference: result.data.paymentReference,
        });
        return;
      }

      alert(result.message || 'Hosted card checkout could not be initialized.');
    } catch (error) {
      console.error('Hosted card checkout error', error);
      alert('Unable to start hosted card checkout.');
    } finally {
      setData('loading', false);
    }
  };

  return (
    <div className="mx-auto max-w-[511px] text-center">
      <h1 className="font-rubik text-[28px] font-medium text-[#23272E]">Secure Card Checkout</h1>
      <p className="mt-3 text-sm leading-6 text-[#606060]">
        Card payments are completed through Monnify hosted checkout. OptiVest does not collect or store card numbers, CVV, PIN, or OTP.
      </p>
      <button
        type="button"
        onClick={handleHostedCheckout}
        className="mt-6 w-full rounded-full border border-[#5042DA] bg-[#5042DA] px-6 py-4 text-sm font-semibold text-white"
      >
        Continue to secure checkout
      </button>
    </div>
  );
};

export default CardPayment;

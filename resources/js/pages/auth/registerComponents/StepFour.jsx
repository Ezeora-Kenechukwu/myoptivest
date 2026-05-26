import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

export default function StepFour({ data, setData, errors, disabled }) {
  const [showPin, setShowPin] = useState(false);
  const [isValidPin, setIsValidPin] = useState(false);
  const [pinMatch, setPinMatch] = useState(true);

  useEffect(() => {
    const pinRegex = /^\d{4}$/; // exactly 4 digits
    setIsValidPin(pinRegex.test(data.pin));

    // Check confirmation match
    setPinMatch(data.pin === data.pin_confirmation || data.pin_confirmation === '');
  }, [data.pin, data.pin_confirmation]);

  const togglePin = () => setShowPin((prev) => !prev);

  return (
    <div className="grid gap-4">
      <h1 className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%] my-4 max-w-lg">
        Set Up Your PIN
      </h1>

      <h2 className="text-[#101928] text-md font-rubik font-medium max-w-lg">
        Create a secure 4-digit PIN. You’ll use this to authorize withdrawals and sensitive actions on your account.
      </h2>

      {/* PIN Field */}
      <div className="relative">
        <Label htmlFor="pin">Pin *</Label>
        <Input
          id="pin"
          type={showPin ? 'text' : 'password'}
          value={data.pin}
          onChange={(e) => setData('pin', e.target.value.replace(/\D/g, ''))} // allow only digits
          disabled={disabled}
          className="pr-10"
          maxLength={4}
        />
        <button
          type="button"
          onClick={togglePin}
          className="absolute right-3 top-9 text-muted-foreground focus:outline-none"
          tabIndex={-1}
        >
          {showPin ? <FaEyeSlash /> : <FaEye />}
        </button>
        <InputError message={!isValidPin && data.pin.length > 0 ? 'PIN must be exactly 4 digits' : errors.pin} />
      </div>

      {/* Confirm PIN */}
      <div className="relative">
        <Label htmlFor="pin_confirmation">Confirm Pin *</Label>
        <Input
          id="pin_confirmation"
          type={showPin ? 'text' : 'password'}
          value={data.pin_confirmation}
          onChange={(e) => setData('pin_confirmation', e.target.value.replace(/\D/g, ''))}
          disabled={disabled}
          className="pr-10"
          maxLength={4}
        />
        <button
          type="button"
          onClick={togglePin}
          className="absolute right-3 top-9 text-muted-foreground focus:outline-none"
          tabIndex={-1}
        >
          {showPin ? <FaEyeSlash /> : <FaEye />}
        </button>
        <InputError message={!pinMatch ? 'PINs do not match' : errors.pin_confirmation} />
      </div>

      {/* Visual Indicator */}
      <div className="mt-2 flex items-center text-sm">
        <FaCheckCircle className={`mr-2 ${isValidPin ? 'text-green-600' : 'text-gray-300'}`} />
        <span className={`${isValidPin ? 'text-green-700' : 'text-muted-foreground'}`}>
          Must be exactly 4 digits
        </span>
      </div>
    </div>
  );
}

// components/CopyButton.jsx
import { FaRegCopy } from 'react-icons/fa';
import { useState } from 'react';

export default function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
    >
      <FaRegCopy className="inline-block" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

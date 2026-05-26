import React from "react";
import clsx from "clsx";

export default function Switch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "relative inline-flex h-5 itmes-center w-10 transition-colors duration-200 ease-in-out rounded-full focus:outline-none",
        checked ? "bg-green-500" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
        
      <span
        className={clsx(
          "inline-block h-5 w-5 transform bg-white rounded-full shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

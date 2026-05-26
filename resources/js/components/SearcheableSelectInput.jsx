import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

const SearchableSelectInput = ({
  options = [],
  valueKey = 'id',
  labelKey = 'name',
  multiple = false,
  searchable = true,
  allowClear = true,
  placeholder = "Select options...",
  defaultValue = [],
  onChange,
  className = '',
}) => {
  const [info, setInfo] = useState({
    isOpen: false,
    searchQuery: '',
    selectedOptions: Array.isArray(defaultValue) ? defaultValue : [defaultValue],
  });

  const inputRef = useRef(null);

  // Handle option selection
  const handleSelect = (option) => {
    setInfo((prevInfo) => {
      const { selectedOptions } = prevInfo;

      const newSelectedOptions = multiple
        ? selectedOptions.includes(option[valueKey])
          ? selectedOptions.filter((id) => id !== option[valueKey])
          : [...selectedOptions, option[valueKey]]
        : [option[valueKey]];

      return {
        ...prevInfo,
        searchQuery: '', // Clear search query
        isOpen: false, // Close dropdown for single select
        selectedOptions: newSelectedOptions,
      };
    });
  };

  // Handle removing a selected option
  const handleRemove = (value) => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      selectedOptions: prevInfo.selectedOptions.filter((id) => id !== value),
    }));
  };

  // Handle clearing all selected options
  const handleClearAll = () => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      selectedOptions: [],
    }));
  };

  // Handle toggling dropdown visibility
  const toggleDropdown = () => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      isOpen: !prevInfo.isOpen,
    }));
  };

  // Handle outside clicks to close dropdown
  const handleClickOutside = useCallback(
    (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setInfo((prevInfo) => ({
          ...prevInfo,
          isOpen: false,
        }));
      }
    },
    [inputRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    onChange && onChange(info.selectedOptions);
  }, [info.selectedOptions]);

  const filteredOptions = info.searchQuery
    ? options.filter((item) =>
        item[labelKey].toLowerCase().includes(info.searchQuery.toLowerCase())
      )
    : options;

  return (
    <div ref={inputRef} className={`relative w-full mx-auto ${className}`}>
      <div
        className="relative flex items-center w-full cursor-pointer overflow-hidden rounded-lg  text-left border p-2"
        onClick={toggleDropdown}
      >
        {/* Selected Tags */}
        <div className="flex flex-wrap items-center gap-1">
          {info.selectedOptions.map((selectedId) => {
            const option = options.find((opt) => opt[valueKey] === selectedId);
            return (
              option && (
                <span
                  key={selectedId}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 rounded mr-1"
                >
                  {option[labelKey]}
                  <button
                    type="button"
                    className="ml-1 text-xs text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(selectedId);
                    }}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )
            );
          })}
          {/* Search Input */}
          <input
            type="text"
            className={`flex-grow border-none py-1 px-2 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none ${
              searchable ? '' : 'pointer-events-none'
            }`}
            name="searchfield"
            value={info.searchQuery}
            onChange={(e) =>
              setInfo((prevInfo) => ({
                ...prevInfo,
                searchQuery: e.target.value,
                isOpen: true, // Open dropdown on typing
              }))
            }
            placeholder={info.selectedOptions.length === 0 ? placeholder : ''}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Dropdown Icon */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <FaChevronDown className="w-5 h-5 text-gray-400" />
        </span>

        {/* Clear Button */}
        {allowClear && info.selectedOptions.length > 0 && (
          <button
            type="button"
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Options */}
      {info.isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-950 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length === 0 ? (
            <li className="cursor-default select-none py-2 px-4 text-gray-300">
              No options found.
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option[valueKey]}
                className="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-600 hover:text-white"
                onClick={() => handleSelect(option)}
              >
                <span
                  className={`block truncate ${
                    info.selectedOptions.includes(option[valueKey])
                      ? 'font-medium'
                      : 'font-normal'
                  }`}
                >
                  {option[labelKey]}
                </span>
                {info.selectedOptions.includes(option[valueKey]) && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    ✓
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelectInput;

import { Transition } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const isDestructiveAction = (className = '', children) => {
    const text = `${className} ${React.Children.toArray(children)
        .map((child) => (typeof child === 'string' ? child : ''))
        .join(' ')}`;
    return /delete|remove|deactivate|decline|reject|cancel|red|danger/i.test(text);
};

const DropdownComponent = ({ buttonText, buttonClass = '', children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const triggerLabel = typeof buttonText === 'string' ? buttonText : 'Actions';

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                aria-label={triggerLabel || 'Actions'}
                className={`${buttonClass} inline-flex size-9 items-center justify-center rounded-full border border-transparent !bg-transparent !p-0 text-[#181D27] !shadow-none transition hover:border-[#E9EAEB] hover:text-[#5042DA] focus:ring-2 focus:ring-[#5042DA]/20 focus:outline-none`}
                onClick={() => setIsOpen((open) => !open)}
            >
                <MoreVertical className="size-5" />
            </button>

            <Transition
                show={isOpen}
                as="div"
                className="absolute right-0 z-50 mt-2 min-w-[180px] origin-top-right rounded-[14px] border border-[#E9EAEB] bg-white p-1.5 shadow-[0_18px_42px_rgba(10,13,18,0.14)]"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="space-y-1">
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) {
                            return child;
                        }

                        const destructive = isDestructiveAction(child.props?.className, child.props?.children);
                        const originalOnClick = child.props?.onClick;

                        return React.cloneElement(child, {
                            onClick: (event) => {
                                setIsOpen(false);
                                originalOnClick?.(event);
                            },
                            className: `flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left !text-sm font-medium transition ${
                                destructive ? '!text-[#D92D20] hover:bg-[#FEF3F2]' : '!text-[#414651] hover:bg-[#F6F5FF] hover:!text-[#5042DA]'
                            } ${child.props?.className || ''}`,
                        });
                    })}
                </div>
            </Transition>
        </div>
    );
};

export default DropdownComponent;

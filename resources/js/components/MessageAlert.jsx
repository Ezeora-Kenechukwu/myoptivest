import React, { useEffect, useState } from 'react';
import SweetAlert from './SweetAlert';

const MessageAlert = ({ message, resetMessage }) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (message) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                resetMessage(); // Reset success after timeout
            }, 3000);
            return () => clearTimeout(timer); // Cleanup timeout
        }
    }, [message, resetMessage]);

    return (
        <>
            {showAlert && <SweetAlert show={showAlert} info={true} className='z-[9999]' message={message} action={() => {
                setShowAlert(false);
                resetMessage(); // Reset success when action is triggered
            }} />}
        </>
    );
};

export default MessageAlert;

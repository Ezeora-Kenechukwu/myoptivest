import React, { useEffect, useState } from 'react';
import SweetAlert from './SweetAlert';

const ErrorAlert = ({ error, resetError }) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (error) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                resetError(); // Reset error after timeout
            }, 3000);
            return () => clearTimeout(timer); // Cleanup timeout
        }
    }, [error, resetError]);

    return (
        <>
            {showAlert && <SweetAlert show={showAlert} className='z-[9999]' error={true} message={error} action={() => {
                setShowAlert(false);
                resetError(); // Reset error when action is triggered
            }} />}
        </>
    );
};

export default ErrorAlert;

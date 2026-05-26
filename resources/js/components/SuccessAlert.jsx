import React, { useEffect, useState } from 'react';
import SweetAlert from './SweetAlert';

const SuccessAlert = ({ success, resetSuccess }) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (success) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                resetSuccess(); // Reset success after timeout
            }, 3000);
            return () => clearTimeout(timer); // Cleanup timeout
        }
    }, [success, resetSuccess]);

    return (
        <>
            {showAlert && <SweetAlert show={showAlert} className='z-[9999]' success={true} message={success} action={() => {
                setShowAlert(false);
                resetSuccess(); // Reset success when action is triggered
            }} />}
        </>
    );
};

export default SuccessAlert;

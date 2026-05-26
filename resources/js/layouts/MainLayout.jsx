import ErrorAlert from '@/components/ErrorAlert'
import MessageAlert from '@/components/MessageAlert'
import PageLoader from '@/components/PageLoader'
import SuccessAlert from '@/components/SuccessAlert'
import { usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage, setSuccess, setError, clearStatus } from '@/Features/requestStatus/requestStatusSlice'

const MainLayout = ({ children, className }) => {
    const status = useSelector(state => state.requestStatus)
    const flash = usePage().props.flash
    const { errors } = usePage().props  // Get errors from Inertia
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("Flash Data:", flash);

        if (flash?.message) dispatch(setMessage(flash.message))
        if (flash?.success) dispatch(setSuccess(flash.success))
        if (flash?.error) dispatch(setError(flash.error))
        if (flash?.unauthorized) dispatch(setError(flash.unauthorized))

    }, [flash])

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const errorList = Object.values(errors).flat()  // Convert errors to an array
            dispatch(setError(errorList))  // Dispatch to Redux
        }
    }, [errors])

    return (
        <div className={`min-h-screen ${className} overflow-x-hidden w-full`}>
            {children}

            <PageLoader />

            {status.success && <SuccessAlert success={status.success} resetSuccess={() => dispatch(clearStatus())} />}
            {status.error && <ErrorAlert error={status.error} resetError={() => dispatch(clearStatus())} />}
            {status.message && <MessageAlert message={status.message} resetMessage={() => dispatch(clearStatus())} />}
        </div>
    )
}

export default MainLayout

import { Link } from '@inertiajs/react';
import { FaArrowRight } from 'react-icons/fa';
import formatDate from "@/utils/formatDate";
export default function ReservationTable({ reservations }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto w-full max-w-[90vw] mx-auto mb-10">
            <h1 className="font-amarante my-4 text-2xl border-b-4 w-fit border-b-green-600 mb-10">Reservations</h1>
            <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <th className="text-left px-4 py-3 text-sm font-semibold">Occasion</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Date</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Time</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Celebrity</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Location</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reservations.map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{reservation.occasion_type}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(reservation.event_date)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{reservation.event_time}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{reservation.celebrity?.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{reservation.event_location}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                            ${
                                                reservation.status === 'pending'
                                                    ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100'
                                                    : reservation.status === 'approved'
                                                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                                            }`
                                        }
                                    >
                                        {reservation.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* See More Button */}
            <div className="flex justify-end mt-4">
                <Link
                    href="/reservations"
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                    See More
                    <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { FaArrowRight } from 'react-icons/fa';
export default function CelebritiesTable({celebrities}) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto w-full max-w-[90vw] mx-auto mb-10">
              <h1 className="font-amarante my-4 text-2xl border-b-4 w-fit border-b-green-600 mb-10">Celebrities</h1>
            <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <th className="text-left px-4 py-3 text-sm font-semibold">Photo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Name</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Category</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Booking</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {celebrities.map((celebrity) => (
                            <tr key={celebrity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-3">
                                    <img
                                        src={`/storage/${celebrity.thumbnail}`}
                                        alt={celebrity.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {celebrity.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {celebrity.category.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {celebrity.currency_position === 'left' ? (
                                        <>{celebrity.currency}{celebrity.booking_amount}</>
                                    ) : (
                                        <>{celebrity.booking_amount}{celebrity.currency}</>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                                        Active
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
                    href="/celebrities"
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                    See More
                    <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
}
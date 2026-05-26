import { useEffect, useState } from 'react';
// import axiosInstance from '@/lib/axios';

import useSWR from 'swr';

export const useForm = (geturl = null, submittedData = {}) => {
    const currentPath = window.location.pathname;
let axiosInstance = () => {
    
}
    const [requestState, setRequestState] = useState({
        errors: '',
        isError: false,
        errorMessage: '',
        isLoading: false,
    });

    const storedFormData = JSON.parse(localStorage.getItem(currentPath)) || {};
    const [formData, setFormData] = useState({ ...submittedData, ...storedFormData });
    const [fileData, setFileData] = useState({});

    const fetcher = url => axiosInstance.get(url).then(res => res.data);

    const { data, error, mutate } = useSWR(geturl, fetcher, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
        onSuccess: () => {
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: false,
                errorMessage: '',
            }));
        },
        onError: (error) => {
            setRequestState(prevState => ({
                ...prevState,
                isError: true,
                isLoading: false,
                errorMessage: error.response?.data?.message || 'Unknown error',
            }));
        },
    });

    const clearFormData = () => {
        setFormData(submittedData);
        setFileData({});
        localStorage.removeItem(currentPath);
    };

    useEffect(() => {
        if (geturl) {
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: true,
                errorMessage: '',
            }));
        }
    }, [geturl]);

    const updateLocalStorage = (formData) => {
        const filteredData = {};
        for (const key in formData) {
            if (!(formData[key] instanceof File) && !isArrayWithFiles(formData[key])) {
                filteredData[key] = formData[key];
            }
        }
        localStorage.setItem(currentPath, JSON.stringify(filteredData));
    };

    const isArrayWithFiles = (array) => {
        return Array.isArray(array) && array.some(item => item instanceof File);
    };

    const handleFormDataChange = (newFormData) => {
        setFormData(newFormData);
        updateLocalStorage(newFormData);
    };

    const handleFileChange = (key, files) => {
        setFileData(prevState => ({
            ...prevState,
            [key]: files,
        }));
    };

    const prepareFormData = () => {
        const form = new FormData();
        for (const key in formData) {
            if (formData[key] instanceof File) {
                form.append(key, formData[key]);
            } else if (Array.isArray(formData[key]) && formData[key].some(item => item instanceof File)) {
                formData[key].forEach(file => {
                    form.append(`${key}[]`, file);
                });
            } else {
                form.append(key, formData[key]);
            }
        }
        return form;
    };

    const postData = async (url) => {
        setRequestState(prevState => ({
            ...prevState,
            isError: false,
            isLoading: true,
            errorMessage: '',
        }));

        try {
            const form = prepareFormData();
            const response = await axiosInstance.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: false,
                errorMessage: '',
            }));
            clearFormData();
            mutate();  // Refetch data
            return response.data;
        } catch (error) {
            setRequestState(prevState => ({
                ...prevState,
                isLoading: false,
                isError: true,
                errorMessage: error.response?.data?.message || 'Unknown error',
                errors: error.response?.data?.errors || [],
            }));
            return error;
        }
    };

    const updateData = async (url) => {
        setRequestState(prevState => ({
            ...prevState,
            isError: false,
            isLoading: true,
            errorMessage: '',
        }));

        try {
            const form = prepareFormData();
            const response = await axiosInstance.put(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: false,
                errorMessage: '',
            }));
            clearFormData();
            mutate();  // Refetch data
            return response.data;
        } catch (error) {
            setRequestState(prevState => ({
                ...prevState,
                isError: true,
                isLoading: false,
                errorMessage: error.response?.data?.message || 'Unknown error',
                errors: error.response?.data?.errors || [],
            }));
        }
    };

    const fetchData = async (url) => {
        setRequestState(prevState => ({
            ...prevState,
            isError: false,
            isLoading: true,
            errorMessage: '',
        }));

        try {
            const response = await axiosInstance.get(url);
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: false,
                errorMessage: '',
            }));
            return response.data;
        } catch (error) {
            setRequestState(prevState => ({
                ...prevState,
                isError: true,
                isLoading: false,
                errorMessage: error.response?.data?.message || 'Unknown error',
            }));
        }
    };

    const deleteData = async (url) => {
        setRequestState(prevState => ({
            ...prevState,
            isError: false,
            isLoading: true,
            errorMessage: '',
        }));

        try {
            const response = await axiosInstance.delete(url);
            setRequestState(prevState => ({
                ...prevState,
                isError: false,
                isLoading: false,
                errorMessage: '',
            }));
            mutate();  // Refetch data
            return response.data;
        } catch (error) {
            setRequestState(prevState => ({
                ...prevState,
                isError: true,
                isLoading: false,
                errorMessage: error.response?.data?.message || 'Unknown error',
                errors: error.response?.data?.errors || [],
            }));
        }
    };

    useEffect(() => {
        updateLocalStorage(formData);
    }, [formData, currentPath]);

    return {
        responseData: data,
        responseError: error,
        postData,
        deleteData,
        updateData,
        fetchData,
        ...requestState,
        formData,
        setFormData,
        handleFormDataChange,
        handleFileChange,
        clearFormData,
    };
};

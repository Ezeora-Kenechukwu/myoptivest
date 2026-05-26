// src/Features/notifications/notificationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { router } from '@inertiajs/react'

// Get all notifications
export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
    return new Promise((resolve) => {
        router.get('/notifications', {}, {
            preserveState: true,
            onSuccess: (page) => {
                resolve(page.props.notifications || [])
            }
        })
    })
})

// Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk('notifications/markAsRead', async (id) => {
    return new Promise((resolve) => {
        router.post(`/notifications/${id}/mark-as-read`, {}, {
            preserveState: true,
            onSuccess: () => resolve(id)
        })
    })
})

// Delete a notification
export const deleteNotification = createAsyncThunk('notifications/delete', async (id) => {
    return new Promise((resolve) => {
        router.delete(`/notifications/${id}`, {
            preserveState: true,
            onSuccess: () => resolve(id)
        })
    })
})

// Mark all as read
export const markAllAsRead = createAsyncThunk('notifications/markAll', async () => {
    return new Promise((resolve) => {
        router.post('/notifications/mark-all-as-read', {}, {
            preserveState: true,
            onSuccess: () => resolve(true)
        })
    })
})

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const noti = state.notifications.find(n => n.id === action.payload)
                if (noti) noti.read_at = new Date().toISOString()
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n.id !== action.payload)
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map(n => ({
                    ...n,
                    read_at: new Date().toISOString()
                }))
            })
    }
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer

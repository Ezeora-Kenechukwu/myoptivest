import { configureStore } from '@reduxjs/toolkit'
import requestStatusReducer from '@/Features/requestStatus/requestStatusSlice'
import notificationReducer from '@/Features/notifications/notificationSlice'
export const store = configureStore({
  reducer: {
    requestStatus: requestStatusReducer,
    notifications: notificationReducer,
},
})


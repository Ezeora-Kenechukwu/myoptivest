import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  success: null,
  error: null,
  message: null,
}

export const requestStatusSlice = createSlice({
    name: 'requestStatus',
    initialState,
    reducers: {
      setMessage: (state, action) => {
        console.log("Message Set:", action.payload); // ✅ Debugging Log
        state.message = action.payload;
      },
      setSuccess: (state, action) => {
        console.log("Success Set:", action.payload); // ✅ Debugging Log
        state.success = action.payload;
      },
      setError: (state, action) => {
        console.log("Error Set:", action.payload); // ✅ Debugging Log
        state.error = action.payload;
      },
      clearStatus: (state) => {
        console.log("Clearing Status"); // ✅ Debugging Log
        state.error = null;
        state.message = null;
        state.success = null;
      },
    },
  });


// Action creators are generated for each case reducer function
export const { setMessage, setSuccess, setError, clearStatus } = requestStatusSlice.actions

export default requestStatusSlice.reducer

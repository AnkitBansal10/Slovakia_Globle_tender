import {createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit'
import api from '../../api/authApi'


 export const Nationality =createAsyncThunk (
    "auth/Nationality",
    async (_,{rejectWithValue}) =>{
      try {
      const response = await api.get('nationality');
      return response.data; // Return nationality data
    } catch (error) {
      console.error('Fetch Nationalities Error:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch nationalities'
      );
    }
  }
);
export const fetchNationalities = createAsyncThunk(
  'auth/fetchNationalities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('nationality');
      return response.data; // Return nationality data
    } catch (error) {
      console.error('Fetch Nationalities Error:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch nationalities'
      );
    }
  }
);

export const availability = createAsyncThunk(
  'auth/availability',
  async ({ location_id ,appointment_date,slot_type}, { rejectWithValue }) => {
    try {
      const response = await api.post('availability',{
      location_id,
    appointment_date,
    slot_type
    })
      console.log("API Response:", response.data);
      return response.data?.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch appointment availability'
      );
    }
  }
);
import { createSlice } from "@reduxjs/toolkit";
import { Nationality, fetchNationalities, availability } from "./authThunks";

const initialState = {
    nationalities: null,
    error: null,
    loading: false,
    lastFetched: null
}

const nationalitiesSlice = createSlice({
    name: 'nationalities',
    initialState,
    reducers: {
        clearNationalitiesError: (state) => {
            state.error = null;
        },
        clearNationalities: (state) => {
            state.nationalities = null;
        },
        setNationalities: (state, action) => {
            state.nationalities = action.payload;
            state.lastFetched = new Date().toISOString();
        },
        resetNationalities: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Handle both thunks but point to the same state
            .addCase(Nationality.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Nationality.fulfilled, (state, action) => {
                state.loading = false;
                state.nationalities = action.payload;
                state.error = null;
                state.lastFetched = new Date().toISOString();
            })
            .addCase(Nationality.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    message: action.payload || action.error?.message || 'Failed to fetch nationalities',
                    code: action.error?.code,
                    timestamp: new Date().toISOString()
                };
            })
            .addCase(fetchNationalities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNationalities.fulfilled, (state, action) => {
                state.loading = false;
                state.nationalities = action.payload;
                state.error = null;
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchNationalities.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    message: action.payload || action.error?.message || 'Failed to fetch nationalities',
                    code: action.error?.code,
                    timestamp: new Date().toISOString()
                };
            })
            .addCase(availability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(availability.fulfilled, (state, action) => {
                state.loading = false;
                state.availabilitys = action.payload;
            })
    }
});

// Export actions and reducer
export const {
    clearNationalitiesError,
    clearNationalities,
    setNationalities,
    resetNationalities
} = nationalitiesSlice.actions;
export default nationalitiesSlice.reducer;
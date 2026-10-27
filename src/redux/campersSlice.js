import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCampers } from "../services/campersApi";

export const fetchCampers = createAsyncThunk(
    "campers/fetchCampers",
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await getCampers(params);

            return {
                items: data.items,
                total: data.total,
                page: params.page || 1,
            };
        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    items: [],
                    total: 0,
                    page: params.page || 1,
                };
            }

            return rejectWithValue(
                error.response?.data?.message || "Failed to load campers."
            );
        }
    }
);

const campersSlice = createSlice({
    name: "campers",

    initialState: {
        items: [],
        total: 0,
        page: 1,
        isLoading: false,
        isLoadingMore: false,
        error: null,
    },

    reducers: {
        clearCampers: (state) => {
            state.items = [];
            state.total = 0;
            state.page = 1;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCampers.pending, (state, action) => {
                if (action.meta.arg?.page > 1) {
                    state.isLoadingMore = true;
                } else {
                    state.isLoading = true;
                }

                state.error = null;
            })

            .addCase(fetchCampers.fulfilled, (state, action) => {
                const { items, total, page } = action.payload;

                if (page > 1) {
                    state.items = [...state.items, ...items];
                } else {
                    state.items = items;
                }

                state.total = total;
                state.page = page;
                state.isLoading = false;
                state.isLoadingMore = false;
            })

            .addCase(fetchCampers.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoadingMore = false;
                state.error = action.payload || "Failed to load campers.";
            });
    },
});

export const { clearCampers } = campersSlice.actions;

export default campersSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const savedFavorites = localStorage.getItem("favorites");

const initialState = {
    items: savedFavorites ? JSON.parse(savedFavorites) : [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        toggleFavorite: (state, action) => {
            const camperId = action.payload;
            const isFavorite = state.items.includes(camperId);

            if (isFavorite) {
                state.items = state.items.filter((id) => id !== camperId);
            } else {
                state.items.push(camperId);
            }

            localStorage.setItem("favorites", JSON.stringify(state.items));
        },
    },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
    theme: string;
}
const initialState: ThemeState = {
    theme: 'light',
}
export const themeSlice = createSlice({
    name: "themeSlice",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
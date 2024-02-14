import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    isAdmin: boolean;
}
export interface UserState {
    currentUser: User;
    error: string;
    loading: boolean;
}

const initialUser: User = {
    username: '',
    email: '',
    password: '',
    profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    isAdmin: false,
}
const initialState: UserState = {
    currentUser: initialUser,
    error: '',
    loading: false,
}
export const useSlice = createSlice({
    name: "useSlice",
    initialState,
    reducers: {
        signinStart: (state) => {
            state.loading = true;
            state.error = '';
        },
        signinSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = '';
        },
        signinFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = '';
        },
        updateSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = '';
        },
        updateFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = '';
        },
        deleteUserSuccess: (state) => {
            state.currentUser = initialUser;
            state.loading = false;
            state.error = '';
        },
        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = initialUser;
            state.loading = false;
            state.error = '';
        },
    },
});

export const { 
    signinStart, signinSuccess, signinFailure,
    updateStart, updateSuccess, updateFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    signoutSuccess
 } = useSlice.actions;
export const userReducer = useSlice.reducer;
import {createSlice} from "@reduxjs/toolkit";
import {login, logout, register} from "./usersThunks";
import {User} from "../../types";

interface UsersState {
    user: User | null;
    registerLoading: boolean,
    loginLoading: boolean,
    logoutLoading: boolean,
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    loginLoading: false,
    logoutLoading: false,
}

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.registerLoading = true;
        });
        builder.addCase(register.fulfilled, (state, {payload: user}) => {
            state.registerLoading = false;
            state.user = user;
        });
        builder.addCase(register.rejected, (state, {payload: error}) => {
            state.registerLoading = false;
        });
        builder.addCase(login.pending, (state) => {
            state.loginLoading = true;
        });
        builder.addCase(login.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        });
        builder.addCase(login.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
        });
        builder.addCase(logout.pending, (state) => {
            state.user = null;
            state.logoutLoading = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.logoutLoading = false;
        });
        builder.addCase(logout.rejected, (state) => {
            state.logoutLoading = false;
        });
    },
});

export const usersReducer = usersSlice.reducer;
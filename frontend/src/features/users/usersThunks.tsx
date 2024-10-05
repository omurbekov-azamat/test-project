import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {LoginMutation, RegisterMutation, RegisterResponse, User} from "../../types";

export const register = createAsyncThunk<User, RegisterMutation>(
    'users/register',
    async (registerMutation) => {
        try {
            const formData= new FormData();
            const keys = Object.keys(registerMutation) as (keyof RegisterMutation)[];

            keys.forEach((key) => {
                const value = registerMutation[key];

                if (value !== null) {
                    formData.append(key, value);
                }
            });

            const response = await axiosApi.post<RegisterResponse>('/users', formData);
            return response.data.user;
        } catch (e) {
            throw e;
        }
    }
);

export const login = createAsyncThunk<User, LoginMutation>(
    'users/login',
    async (loginMutation) => {
        try {
            const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
            return response.data.user;
        } catch (e) {
            throw e;
        }
    }
);

export const logout = createAsyncThunk(
    'users/logout',
    async () => {
        await axiosApi.delete('/users/sessions');
    }
);
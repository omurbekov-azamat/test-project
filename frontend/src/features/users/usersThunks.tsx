import {LoginMutation, RegisterMutation, RegisterResponse, User, ValidationError} from "../../types";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
    'users/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const formData = new FormData();
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
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as ValidationError);
            }
            throw e;
        }
    }
);

export const login = createAsyncThunk<
    User,
    { loginMutation: LoginMutation, navigate: Function },
    { rejectValue: ValidationError }
>(
    'users/login',
    async ({ loginMutation, navigate }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
            await navigate('/');
            return response.data.user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as ValidationError);
            }
            throw e;
        }
    }
);

export const logout = createAsyncThunk<void, string>(
    'users/logout',
    async (token) => {
        await axiosApi.delete('/users/sessions', {headers: {'Authorization': token}});
    }
);

export const getUsers = createAsyncThunk<User[]>(
    'users/getUsers',
    async () => {
        try {
            const users = await axiosApi.get<User[]>('/users');
            return users.data;
        } catch (e) {
            throw e;
        }
    }
);
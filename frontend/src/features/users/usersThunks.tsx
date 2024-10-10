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
    async ({loginMutation, navigate}, {rejectWithValue}) => {
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

export const getUsers = createAsyncThunk<User[], string | null>(
    'users/getUsers',
    async (token) => {
        try {
            const users = await axiosApi.get<User[]>('/users',
                {headers: {'Authorization': token}});
            return users.data;
        } catch (e) {
            throw e;
        }
    }
);

export const addUser = createAsyncThunk<void, {username: string, token: string}>(
    'users/addChat',
    async (data) => {
        try {
            await axiosApi.post<User[]>('/users/addUser', {username: data.username},
                {headers: {'Authorization': data.token}});
        } catch (e) {
            throw new Error();
        }
    }
);

export const changePass = createAsyncThunk<ValidationError, {
    password: string,
    token: string
}>('users/changePassword', async (data) => {
    try {
        const response = await axiosApi.patch('/users/password',
            {newPassword: data.password},
            {headers: {'Authorization': data.token}});
        return response.data;
    } catch {
        throw new Error();
    }
});
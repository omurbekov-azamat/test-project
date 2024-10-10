import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";
import {Message, MessageMutation, RegisterResponse, User, ValidationError} from "../../types";

export const getMessages = createAsyncThunk<Message[], { id: string, token: string }>(
    'messages/getMessages',
    async (data) => {
        try {
            const users = await axiosApi.get(`messages/${data.id}`,
                {headers: {'Authorization': data.token}});
            return users.data;
        } catch (e) {
            throw e;
        }
    }
);

export const sendMessage = createAsyncThunk<void, { message: MessageMutation, token: string }, {
    rejectValue: ValidationError
}>(
    'messages/sendMessage',
    async (data, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            const keys = Object.keys(data.message) as (keyof MessageMutation)[];

            keys.forEach((key) => {
                const value = data.message[key];

                if (value !== null) {
                    formData.append(key, value);
                }
            });

            await axiosApi.post('/messages/', formData, {headers: {'Authorization': data.token}});
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as ValidationError);
            }
            throw e;
        }
    }
);
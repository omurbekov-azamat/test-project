import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {Group} from "../../types";

export const getGroups = createAsyncThunk<Group[], string | null>(
    'groups/getGroups',
    async (token) => {
        try {
            const groups = await axiosApi.get<Group[]>('/groups',
                {headers: {'Authorization': token}});
            return groups.data;
        } catch (e) {
            throw e;
        }
    }
);
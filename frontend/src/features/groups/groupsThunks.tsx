import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {Group, GroupData} from "../../types";

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

export const getGroupMessages = createAsyncThunk<GroupData, { id: string, token: string }>(
    'groups/getGroupMessages',
    async (data) => {
        try {
            const groupsData = await axiosApi.get(`/groups/${data.id}`,
                {headers: {'Authorization': data.token}});
            return groupsData.data;
        } catch (e) {
            throw e;
        }
    }
);

export const createNewGroup = createAsyncThunk<void, {groupName: string, users: string[], token: string}>(
    'groups/createNewGroup',
    async (data) => {
        try {
            await axiosApi.post('groups/create-group', data, {headers: {'Authorization': data.token}});
        } catch (e) {
            throw e;
        }
    }
)
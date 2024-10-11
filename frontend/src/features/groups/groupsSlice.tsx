import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {Group} from "../../types";
import {getGroups} from "./groupsThunks";

interface GroupsState {
    groups: Group[];
    getGroupsLoading: boolean;
}

const initialState: GroupsState = {
    groups: [],
    getGroupsLoading: false,
}

export const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGroups.pending, (state) => {
            state.groups = [];
            state.getGroupsLoading = true;
        });
        builder.addCase(getGroups.fulfilled, (state, {payload: groups}) => {
            state.getGroupsLoading = false;
            state.groups = groups;
        });
        builder.addCase(getGroups.rejected, (state) => {
            state.getGroupsLoading = false;
        });
    },
});

export const groupsReducer = groupsSlice.reducer;

export const selectGroups = (state: RootState) => state.groups.groups;
export const selectGetGroupsLoading = (state: RootState) => state.groups.getGroupsLoading;
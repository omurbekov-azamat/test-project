import {createSlice} from "@reduxjs/toolkit";
import {getMessages, sendMessage} from "./messagesThunks";
import {RootState} from "../../app/store";
import {getGroupMessages} from "../groups/groupsThunks";
import {MemberChat, Message} from "../../types";

interface MessagesState {
    messages: Message[];
    getMessagesLoading: boolean;
    sendMessageLoading: boolean;
    groupMembers: MemberChat[]
}

const initialState: MessagesState = {
    messages: [],
    getMessagesLoading: false,
    sendMessageLoading: false,
    groupMembers: [],
}

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessages: (state: MessagesState) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, (state) => {
            state.messages = [];
            state.getMessagesLoading = true;
        });
        builder.addCase(getMessages.fulfilled, (state, {payload: messages}) => {
            state.getMessagesLoading = false;
            state.messages = messages;
        });
        builder.addCase(getMessages.rejected, (state, {payload: error}) => {
            state.getMessagesLoading = false;
        });
        builder.addCase(sendMessage.pending, (state, payload) => {
            state.sendMessageLoading = true;
        });
        builder.addCase(sendMessage.fulfilled, (state, payload) => {
            state.sendMessageLoading = false;
        });
        builder.addCase(sendMessage.rejected, (state, payload) => {
            state.sendMessageLoading = false;
        });
        builder.addCase(getGroupMessages.pending, (state, {payload: groups}) => {
           state.messages = [];
        });
        builder.addCase(getGroupMessages.fulfilled, (state, {payload: groups}) => {
            state.messages = groups.messages;
            state.groupMembers = groups.users;
        });
    },
});

export const messagesReducer = messagesSlice.reducer;
export const { clearMessages } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectSendMessageLoading = (state: RootState) => state.messages.sendMessageLoading;
export const selectGroupMembers = (state: RootState) => state.messages.groupMembers;
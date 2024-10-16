export interface ValidationError {
    [key: string]: string;
}

export interface RegisterMutation {
    email: string;
    password: string;
    username: string;
    image: File | null;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    image: string;
    token: string;
    online: boolean;
    is_admin: boolean;
}
export interface RegisterResponse {
    user: User;
}

export interface MessageMutation {
    text: string;
    receiver_id: string | null;
    image: File | null;
    chat_group_id: string | null;
}

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    image: string | null;
    text: string | null;
    created_at: string;
    sender_name:string;
}

export interface Group {
    id: string;
    name: string;
}

export interface MemberChat {
    userId: string;
    username: string;
}

export interface GroupData {
    groupId: string;
    messages: Message[],
    users: MemberChat[],
}
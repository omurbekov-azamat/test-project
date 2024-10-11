export interface IUser {
    id:string;
    email: string;
    password: string;
    username: string;
    image: string | null;
    online: boolean;
    token: string;
    is_admin: boolean;
}

export interface IMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    text: string | null;
    image: string | null;
    createdAt: string;
}

interface IGroup {
    message_id: number;
    sender_id: number | null;
    message_text: string | null;
    message_created_at: Date;
    user_id: number;
    username: string;
}
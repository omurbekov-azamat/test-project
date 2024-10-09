export interface IUser {
    id:string;
    email: string;
    password: string;
    username: string;
    image: string | null;
    online: boolean;
    token: string;
}

export interface IMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    text: string | null;
    image: string | null;
    createdAt: string;
}
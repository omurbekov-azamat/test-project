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
}
export interface RegisterResponse {
    user: User;
}
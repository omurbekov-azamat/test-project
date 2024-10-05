export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _name: string;
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
    _id: string;
    email: string;
    username: string;
    image: string;
    token: string;
}
export interface RegisterResponse {
    user: User;
}
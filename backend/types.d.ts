export interface IUser {
    id:string;
    email: string;
    password: string;
    username: string;
    image: string | null;
    online: boolean;
    token: string;
}
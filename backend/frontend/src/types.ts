export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'user' | 'support' | 'engineer' | 'admin';
    token?: string;
}

export interface IAuthResponse extends IUser {
    token: string;
}
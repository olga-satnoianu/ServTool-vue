export interface LoginCallbackResponse {
    token: string;
    refreshToken: string;
}

export interface GoogleLoginCallbackResponse {
    access_token: string;
    refresh_token: string;
}

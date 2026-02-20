export const API = {
    AUTH: {
        REGISTER : "/api/auth/register",
        LOGIN : "/api/auth/login",
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN:{
        USER:{
            CREATE: '/api/admin/users/',
            GET_ALL: '/api/admin/users/',
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
        },
        SONG: {
            CREATE: '/api/songs/upload',
            GET_ALL: '/api/songs/',
            GET_ONE: (songId: string) => `/api/songs/${songId}`,
            UPDATE: (songId: string) => `/api/songs/${songId}`,
            DELETE: (songId: string) => `/api/songs/${songId}`,
        }
    }
}
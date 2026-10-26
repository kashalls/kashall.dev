// Stored in a cookie capped at 4 KB, so keep it to what identifies the account.
declare module '#auth-utils' {
    interface User {
        id: number
        login: string
        name: string | null
        avatar: string
    }

    interface UserSession {
        loggedInAt: number
    }
}

export {}

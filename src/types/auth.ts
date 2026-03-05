export type User = {
    id: number
    email: string
    username: string
}

export type SignInPayload = {
    email: string
    password: string
}

export type SignUpPayload = {
    email: string
    password: string
    username: string
}

export type ResetPasswordPayload = {
    email: string
}

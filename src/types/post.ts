export interface Post {
    id: string
    caption: string
    location: string
    photoFile: Blob | File | null
    photoUrl?: string
    date: number
}

export type PostTypes = {
    caption: string
    location: string
    photoFile: Blob | File | null
    photoUrl?: string
    takenAt: string
}

export type PostPayload = PostTypes & {
    photoFile: Blob | File
    uniqueFileName: string
}

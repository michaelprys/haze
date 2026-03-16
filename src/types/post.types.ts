export type Post = {
    id: string;
    caption: string;
    location: string;
    photoFile: Blob | File | null;
    photoUrl?: string;
    takenAt: string;
};

export type PostPayload = Post & {
    photoFile: Blob | File;
    uniqueFileName: string;
};

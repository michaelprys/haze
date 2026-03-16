export type Post = {
  id: string;
  caption: string;
  location: string;
  photoFile: Blob | File | null;
  photoUrl?: string;
  takenAt: string;
};

export type PostApi = {
  id: string;
  caption: string | null;
  created_at: string | null;
  image_url: string;
  location: string | null;
  taken_at: string;
  user_id: string;
};

export type PostPayload = Post & {
  photoFile: Blob | File;
  uniqueFileName: string;
};

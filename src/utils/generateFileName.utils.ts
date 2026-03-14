export const generateFileName = (file: Blob | File) => {
    const ext = 'name' in file && file.name ? file.name.split('.').pop() || 'jpg' : 'png';

    return `post-${crypto.randomUUID()}.${ext}`;
};

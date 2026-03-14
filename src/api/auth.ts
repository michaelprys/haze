import { supabase } from 'src/api/supabaseClient';

export const getCurrentUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    return user;
};

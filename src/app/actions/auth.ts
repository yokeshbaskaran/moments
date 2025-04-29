"use server";

import { supabaseServer } from "@/supabase/server";
import { Login, Register } from "../../helpers/types";

const CURRENT_LINK = process.env.LIVEPAGE_LINK;

export async function registerAccount({ email, password, username }: Register) {
    // const data = { email, password, username }
    // console.log("user-data:", data);

    //supabase 
    const { auth } = await supabaseServer();
    const { data, error } = await auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: CURRENT_LINK,
            data: {
                username: username
            }
        }
    });

    if (error) {
        return { errorMessage: error.message }
    }

    return { errorMessage: null, data }
}

export async function loginAccount({ email, password, }: Login) {
    // const data = { email, password }
    // console.log("user-data:", data);

    //supabase 
    const { auth } = await supabaseServer();
    const { error } = await auth.signInWithPassword({
        email, password,
    });

    if (error) {
        return { errorMessage: error.message }
    }

    return { errorMessage: null }
}

export async function logout() {
    //supabase 
    const { auth } = await supabaseServer();
    const { error } = await auth.signOut()

    if (error) {
        return { errorMessage: error.message }
    }

    return { errorMessage: null }
}
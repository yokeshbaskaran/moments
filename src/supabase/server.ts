import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function supabaseServer() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function getUser() {
    const { auth } = await supabaseServer();
    const data = await auth.getUser();
    const user = data.data.user;
    return user;
}

export async function protectRoute() {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
}
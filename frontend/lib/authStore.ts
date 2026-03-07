import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    accessToken: string | null
    setToken: (token: string) => void
    clear: () => void
}

export const authStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,

            setToken: (token) =>
                set({
                    accessToken: token
                }),

            clear: () =>
                set({
                    accessToken: null
                })
        }),
        {
            name: "auth-store"
        }
    )
)

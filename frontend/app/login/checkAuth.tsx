"use client"

import { useEffect } from "react"
import { authStore } from "@/lib/authStore"
import { sendRequest } from "@/lib/api/wrapprer"

export default function CheckAuth() {

    const token = authStore((state) => state.accessToken)
    const setToken = authStore((state) => state.setToken)

    useEffect(() => {

        // nếu đã có token thì không cần refresh
        if (token) return

        const refresh = async () => {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await sendRequest<IBackendRes<any>>({
                url: "http://localhost:8080/api/v1/auth/refresh",
                method: "GET",
                useCredentials: true
            })

            if (res?.data?.accessToken) {
                setToken(res.data.accessToken)
                console.log("đã login từ refresh token")
            } else {
                console.log("chưa đăng nhập")
            }
        }

        refresh()

    }, [token, setToken])

    return null
}

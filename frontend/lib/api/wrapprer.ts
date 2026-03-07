/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string"
import { authStore } from "@/lib/authStore"


let isRefreshing = false
let refreshSubscribers: any[] = []

const subscribeTokenRefresh = (cb: any) => {
    refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token))
    refreshSubscribers = []
}


const refreshToken = async () => {

    const res = await fetch(
        "http://localhost:8080/api/v1/auth/refresh",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store"
        }
    )

    if (!res.ok) throw new Error("refresh failed")

    const data = await res.json()

    const newToken = data.data.accessToken

    authStore.getState().setToken(newToken)

    return newToken
}

export const sendRequest = async <T>(props: IRequest): Promise<T> => {

    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        auth = false
    } = props

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`
    }

    const finalHeaders: any = {
        "content-type": "application/json",
        ...headers
    }

    const currentToken = authStore.getState().accessToken
    if (auth && currentToken) {
        finalHeaders["Authorization"] = `Bearer ${currentToken}`
    }

    const options: any = {
        method,
        headers: new Headers(finalHeaders),
        body: body ? JSON.stringify(body) : null,
        cache: "no-store",
        ...nextOption
    }

    if (useCredentials) options.credentials = "include"

    const res = await fetch(url, options)

    if (res.ok) {
        return res.json()
    }

    // TOKEN EXPIRED
    if (res.status === 401 && auth) {

        if (!isRefreshing) {

            isRefreshing = true

            try {

                const newToken = await refreshToken()

                isRefreshing = false

                onRefreshed(newToken)

            } catch (error) {

                isRefreshing = false
                authStore.getState().clear()

                window.location.href = "/login"

                throw error
            }

        }

        return new Promise((resolve) => {

            subscribeTokenRefresh((token: string) => {

                headers["Authorization"] = `Bearer ${token}`

                resolve(sendRequest<T>({
                    ...props,
                    headers
                }))

            })

        })

    }

    const json = await res.json()

    return {
        statusCode: res.status,
        message: json?.message ?? "",
        error: json?.error ?? ""
    } as T
}

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { logOut } from '../auth/authSlice'

const baseQueryFn =  retry(
    async (arg, api, extraOptions) => {
        const result = await fetchBaseQuery({
            baseUrl: 'http://localhost:9000/',
            prepareHeaders: (headers, {getState}) => {
                const token = getState().auth.accessToken
                if(token) {
                    headers.set("Authorization", `Bearer ${token}`)
                }
                return headers;
            }
        })(arg, api, extraOptions)

        if(result?.error?.status === 401 && result?.error) {
            api.dispatch(logOut())
            localStorage.clear()
            return retry.fail(result.error)
        }

        return result;
    },
    {
        maxRetries: 1,
    }
)

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryFn,
    // eslint-disable-next-line no-unused-vars
    endpoints: builder => ({}),
})
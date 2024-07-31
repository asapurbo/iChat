import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findUser: builder.query({
            query: (email) => `/users?email=${email}`
        })
    })
})

export const { useFindUserQuery } = userApi;
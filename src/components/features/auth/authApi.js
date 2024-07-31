import { apiSlice } from '../api/apiSlice'
import {logIn} from '../auth/authSlice'

export const authSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        registration: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data,
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                const data = (await queryFulfilled).data;
                localStorage.setItem('auth', JSON.stringify(data));
                
                dispatch(logIn({
                    accessToken: data.accessToken,
                    user: data.user
                }))
            }
        }),
        login: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "/login",
                body: data
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                const data = (await queryFulfilled).data;
                localStorage.setItem('auth', JSON.stringify(data));
                
                dispatch(logIn({
                    accessToken: data.accessToken,
                    user: data.user
                }))
            } 
        }),
    })
})

export const { useRegistrationMutation, useLoginMutation } = authSlice;
import { io } from 'socket.io-client';
import { apiSlice } from '../api/apiSlice';

export const messagesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMessages: builder.query({
            query: (id) => {
                return `messages?conversationId=${id}`
            },
            onCacheEntryAdded: async (arg, {cacheDataLoaded, updateCachedData}) => {
                const socket = io("http://localhost:9000", {
                    reconnectionDelay: 1000,
                    reconnection: true,
                    reconnectionAttemps: 10,
                    transports: ["websocket"],
                    agent: false,
                    upgrade: false,
                    rejectUnauthorized: false,
                });
                

                try {
                    await cacheDataLoaded;

                    socket.on('messages', (data) => {
                        updateCachedData(draft => {
                            const con = data?.data?.conversationId === Number(arg) ? true : false
                            if(con) {
                                draft.push(data.data)
                            }
                        })
                    })
                } catch (error) {
                    
                }
            }
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: '/messages',
                body: data
            })
        })
    })
})


export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
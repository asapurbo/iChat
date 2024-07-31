import { apiSlice } from "../api/apiSlice";
import { io } from "socket.io-client";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => {
        return {
          url: `/conversations?participants_like=${email}&_limit=5&_sort=timestamp&_order=desc`,
        };
      },
      onCacheEntryAdded: async (arg, { cacheDataLoaded, updateCachedData }) => {
        // create socket
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

          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const currentUser = data?.data?.users?.find((cn) => cn.email === arg);
              const conversation = draft?.find(cn => cn.id === data?.data?.id)
              
              // console.log(JSON.stringify(conversation));
              
              if(currentUser && conversation) {
                conversation.message = data.data.message
                conversation.timestamp = data.data.timestamp
              } else if(draft.length >= 0 && currentUser) {
                draft.push(data.data)
              }
              
            });
          });
        } catch (error) {}
      },
    }),
    findConversation: builder.query({
      query: ({ myEmail, partnerEmail }) => ({
        url: `/conversations?participants_like=${myEmail}-${partnerEmail}&participants_like=${partnerEmail}-${myEmail}`,
      }),
    }),
    // add conversation

    // edit conversation
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `/conversations/${id}`,
        body: data.data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        // Optimistic Updates start
        const pathResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.data.sender,
            (draft) => {
              const { message, timestamp } = arg.data.data ?? {};
              const conversation = draft?.find(
                (conv) => conv.email === arg.data.email
              );
              conversation.message = message;
              conversation.timestamp = timestamp;
            }
          )
        );
        // Optimistic Updates end

        const conversation = (await queryFulfilled).data;

        try {
          const { sender } = arg?.data || {};
          const senderEmail = conversation?.users?.find(
            (user) => user?.email === sender
          );
          const receiverEmail = conversation?.users?.find(
            (user) => user?.email !== sender
          );

          await dispatch(
            apiSlice.endpoints.addMessage.initiate({
              conversationId: conversation?.id,
              sender: senderEmail,
              receiver: receiverEmail,
              message: conversation?.message,
              timestamp: conversation?.timestamp,
            })
          );

          // dispatch(
          //   apiSlice.util.updateQueryData(
          //     "getMessages",
          //     conversation?.id.toString(),
          //     (draft) => {
          //       draft.push(messageData.data);
          //     }
          //   )
          // );
        } catch (error) {
          pathResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useFindConversationQuery,
  useEditConversationMutation,
} = conversationsApi;

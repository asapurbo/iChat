import { apiSlice } from "../api/apiSlice";
// import { useAddMessageMutation } from "../messages/messagesApi";

export const addConversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addConversation: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/conversations",
        body: data.data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const conversation = (await queryFulfilled).data;
        // const userEmail = conversation.users?.find(u => u.email === )

        // Pessimistically Updates start
        // dispatch(
        //   apiSlice.util.updateQueryData(
        //     "getConversations",
        //     arg.sender,
        //     (draft) => {
        //       if (draft?.length) {
        //         return [...draft, conversation];
        //       } else {
        //         return [conversation];
        //       }
        //     }
        //   )
        // );
        // Pessimistically Updates end

        try {
          const { sender } = arg || {};
          const senderEmail = conversation?.users?.find(
            (user) => user?.email === sender
          );
          const receiverEmail = conversation?.users?.find(
            (user) => user?.email !== sender
          );

          dispatch(
            apiSlice.endpoints.addMessage.initiate({
              conversationId: conversation?.id,
              sender: senderEmail,
              receiver: receiverEmail,
              message: conversation?.message,
              timestamp: conversation?.timestamp,
            })
          );
        } catch (error) {}
      },
    }),
  }),
});


export const { useAddConversationMutation } = addConversationApi;

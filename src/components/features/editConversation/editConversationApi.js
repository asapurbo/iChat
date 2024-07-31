import { apiSlice } from "../api/apiSlice";
// import { useAddMessageMutation } from "../messages/messagesApi";

export const editConversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

          let messageData = await dispatch(
            apiSlice.endpoints.addMessage.initiate({
              conversationId: conversation?.id,
              sender: senderEmail,
              receiver: receiverEmail,
              message: conversation?.message,
              timestamp: conversation?.timestamp,
            })
          );

          dispatch(
            apiSlice.util.updateQueryData(
              "getMessages",
              conversation?.id.toString(),
              (draft) => {
                draft.push(messageData.data);
              }
            )
          );
        } catch (error) {
          pathResult.undo();
        }
      },
    }),
  }),
});

export const { useEditConversationMutation } = editConversationApi;

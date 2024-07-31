import { useParams } from "react-router-dom";
import ChattingBox from "./ChattingBox";
import { useGetMessagesQuery } from "../../features/messages/messagesApi";
import ChatHeader from "./ChatHeader";
import ChatItem from "./ChatItem";
import Error from "../../../ui/Error";
import { useSelector } from "react-redux";

const Chatting = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useGetMessagesQuery(id);
  const { email } = useSelector((state) => state.auth.user);

  let content = null;
  if (isError && !isLoading) {
    content = <Error message="There was an error in the server side!" />;
  } else if (!isError && isLoading) {
    content = <div>Loading.....</div>;
  } else if (!isError && !isLoading && data?.length === 0) {
    content = <div>Content is not found!</div>;
  } else if (!isError && !isLoading && data?.length > 0) {
    content = [...data]
      .sort((a, b) => a - b)
      .map((item) => {
        const { id, message } = item;
        // const my = item.sender.email === email ? item.sender : item.receiver;

        const con = (item?.receiver?.email === email || item?.sender?.email === email) ? true : false
        if(con) {
          const myChat = item.sender.email === email ? true : false;

          return (
            <ChatItem
              message={message}
              key={id}
              justify={myChat ? "end" : "start"}
              type={!myChat}
            />
          );
        }
        
      });
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {/* chat header */}
        {!isError && !isLoading && data?.length > 0 && (data?.receiver?.email === email || data?.sender?.email === email) && (
          <ChatHeader data={data} />
        )}
        <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
          <ul className="space-y-2">{content}</ul>
        </div>
        {/* chatting box */}
        {!isError && !isLoading && data?.length > 0 && (
          <ChattingBox data={data} />
        )}
      </div>
    </div>
  );
};

export default Chatting;

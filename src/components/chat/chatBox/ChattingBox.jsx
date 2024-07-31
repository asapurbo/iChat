import { useEffect, useState } from "react";
import { useEditConversationMutation } from "../../features/conversations/conversationsApi";
import { useSelector } from "react-redux";

const ChattingBox = ({data}) => {
  const [input, setInput] = useState('')
  const [editConversation, {isSuccess}] = useEditConversationMutation()
  const { conversationId } = data[0] ?? {}
  const user = useSelector(state => state.auth.user);
  const {email} = user ?? {};

  // find partner email
  const partnerEmail = data[0].receiver.email === email ? data[0].sender : data[0].receiver

  const handleSubmit = (_) => {
    _.preventDefault()

    editConversation({
      id: conversationId,
      data: {
      sender: email,
      data: {
        participants: `${email}-${partnerEmail.email}`,
        users: [
          partnerEmail,
          user
        ],
        message: input,
        timestamp: new Date().getTime()
      }
    }})
  }

  useEffect(() => {
    if(isSuccess) {
      setInput('')
    }
  }, [isSuccess])
  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between w-full p-3 border-t border-gray-300">
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Message"
        className="block w-full py-2 pl-4 mx-3 bg-gray-100 focus:ring focus:ring-violet-500 rounded-full outline-none focus:text-gray-700"
        name="message"
        value={input}
        required
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">
        <svg
          className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
};

export default ChattingBox;

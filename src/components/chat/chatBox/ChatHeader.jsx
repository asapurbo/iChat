import gravatarUrl from "gravatar-url";
import { useSelector } from "react-redux";

const ChatHeader = ({data}) => {
  const { email } = useSelector((state) => state.auth.user);
  const partnerDetails = data[0].sender.email === email ? data[0].receiver : data[0].sender;

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(partnerDetails.email)}
        alt="username"
      />
      <span className="block ml-2 font-bold text-gray-600">{partnerDetails.name}</span>
      <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
    </div>
  );
};

export default ChatHeader;

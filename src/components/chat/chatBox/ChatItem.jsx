const ChatItem = ({justify, message, type}) => {
  return (
    <li className={`flex justify-${justify} `}>
      <div className={`relative  max-w-xl ${type ? 'bg-slate-100' : null} px-4 py-2 text-gray-700 rounded shadow`}>
        <span className="block">{message}</span>
      </div>
    </li>
  );
};

export default ChatItem;

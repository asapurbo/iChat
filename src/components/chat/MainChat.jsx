import { Outlet } from "react-router-dom";
import ChatBar from "./chatBar/ChatBar";
import ChatSender from "./ChatSender";
import Modal from "./Modal";
import { useState } from "react";

const MainChat = () => {
  const [modal, setModal] = useState(false);
  const handleClick = () => {
    setModal(prevModal => !prevModal)
  }
  
  return (
    <div className="max-w-7xl mx-auto -mt-1">
      <div className="min-w-full border rounded flex lg:grid lg:grid-cols-3">
        <div className="w-[100px] border-r border-t-0 border-gray-300 lg:col-span-1 md:w-full">
          <ChatSender handleClick={handleClick} />
          {modal && <Modal handleClick={handleClick} />}
         {/* chat bar */}
         <ChatBar />
        </div>
        {/*  */}
        < Outlet />
      </div>
    </div>
  );
};

export default MainChat;

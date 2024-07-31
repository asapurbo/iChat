import MainChat from "../chat/MainChat";
import logo from '../../assets/logo.png'
import { useDispatch } from "react-redux";
import {logOut} from '../features/auth/authSlice'

const Chat = () => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut())
    localStorage.clear()
  }
  return (
    <div>
      <nav className="border-general sticky top-0 z-40 border-b bg-slate-100 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16 items-center">
            <img className="h-10" src={logo} />
            <ul>
              <li className="text-black">
                <span className="cursor-pointer" onClick={handleLogOut} href="#">Logout</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* chat */}
      <MainChat />
    </div>
  );
};

export default Chat;

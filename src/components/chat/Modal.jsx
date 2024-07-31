import { useEffect, useState } from "react";
import useEmailValidation from "../hooks/useEmailValidation";
import { useFindUserQuery } from "../features/user/userApi";
import { apiSlice } from "../features/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../ui/Error";
// import { useEditConversationMutation } from '../features/conversations/conversationsApi'
import { useAddConversationMutation } from "../features/addConversation/addConversationApi";
import { useEditConversationMutation } from '../features/conversations/conversationsApi'

const Modal = ({ handleClick }) => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [skip, setSkip] = useState(true);
  const { user } = useSelector((state) => state.auth) ?? {};
  const { email } = user ?? {};
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState("");

  const [addConversation, { isSuccess: addIsSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: editIsSuccess }] =
    useEditConversationMutation();

  const dispatch = useDispatch();
  const { data } = useFindUserQuery(to, {
    skip: skip,
  });

  function chechEmail(fn, duration) {
    let time;
    return function (...arg) {
      clearTimeout(time);
      time = setTimeout(() => {
        fn(...arg);
      }, duration);
    };
  }

  function _emailTo(value) {
    setError("");
    if (useEmailValidation(value)) {
      setSkip(!skip);
    } else {
      setSkip(true);
      setError("Invalid email!");
    }
  }

  const handleEmail = chechEmail(_emailTo, 500);

  // isSuccess
  useEffect(() => {
    if (addIsSuccess || editIsSuccess) {
      handleClick();
    }
  }, [addIsSuccess, editIsSuccess]);

  // error
  useEffect(() => {
    if (useEmailValidation(to) && data?.length === 0) {
      setError("User is not found!");
    } else if (error && to === "" && data?.length === 0) {
      setError("");
    }
  }, [data, error, to]);

  // user validation
  useEffect(() => {
    if (data?.length > 0 && data[0]?.email !== email) {
      dispatch(
        apiSlice.endpoints.findConversation.initiate({
          myEmail: email,
          partnerEmail: data[0].email,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        });
    }
  }, [data]);

  function handleSubmit(_) {
    _.preventDefault();

    if (conversation[0]?.id) {
      // edit conversation
      editConversation({
        id: conversation[0]?.id,
        data: {
          sender: email,
          data: {
            participants: `${email}-${data[0].email}`,
            users: [data[0], user],
            message,
            timestamp: new Date().getTime(),
          },
        },
      });
    } else if (conversation.length === 0) {
      // add conversation
      addConversation({
        sender: email,
        data: {
          participants: `${email}-${data[0].email}`,
          users: [data[0], user],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
      ></div>
      <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Send message
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="to" className="sr-only">
                To
              </label>
              <input
                id="to"
                name="to"
                type="email"
                value={to}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                placeholder="Send to"
                onChange={(e) => (
                  setTo(e.target.value), handleEmail(e.target.value)
                )}
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              disabled={data?.length > 0 && data[0]?.email === email}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Send Message
            </button>
          </div>

          {error && data?.length === 0 && <Error message={error} />}

          {data?.length > 0 && data[0]?.email === email && (
            <Error message="You cannot send messages to yourself" />
          )}
        </form>
      </div>
    </>
  );
};

export default Modal;

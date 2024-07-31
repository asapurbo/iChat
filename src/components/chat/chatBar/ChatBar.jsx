import BarItem from "./BarItem";
import { useGetConversationsQuery } from '../../features/conversations/conversationsApi'
import Error from '../../../ui/Error';
import { useSelector } from "react-redux";
import usePartnerEmail from "../../hooks/usePartnerEmail";

const ChatBar = () => {
  const {email} = useSelector(state => state.auth.user)
  const {data, isError, isLoading, isSuccess, error} = useGetConversationsQuery(email)
  
  let content = null;
  if(isError && !isLoading) {
    content = <Error message='There was an error in the server side!'/>
  } else if(!isError && isLoading) {
    content = <div>Loading.....</div>
  } else if(!isError && !isLoading && data?.length === 0) {
    content = <div>Content is not found!</div>
  } else if(!isError && !isLoading && data?.length > 0) {
    content = data.map((item, index) => {
      const {id} = item
      return <BarItem key={id} content={item} partner={usePartnerEmail({item, email})} />
    })
  }
  return (
    <ul className="overflow-auto">
      {content}
    </ul>
  );
};

export default ChatBar;

import {MdClose , MdThumbUp} from 'react-icons/md';

import './LikeDislike.css';

interface ILileDislikeProps {
  like: () => void;
  dislike: () => void;
}

export const LikeDislike: React.FC<ILileDislikeProps> = ({like, dislike}) => {
  return (
    <div className='like-dislike-container'> 
      <button className='like-dislike-button' onClick={dislike}>
        <MdClose size={40} color='darkred'/>
      </button>
      <button className='like-dislike-button' onClick={like}>
        <MdThumbUp size={40} color='teal'/>
      </button>
    </div> 
  )
} 
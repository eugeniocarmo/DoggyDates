import { useMemo } from 'react';
import './PhotoCard.css'


interface IPhotoCardProps{
  imageUrl: string;
  shadowForFirstCard: boolean;
  stackingTop?: number;
  move: 'right'| 'left'| undefined;
}


// Photo Card
export const PhotoCard: React.FC<IPhotoCardProps> = ({imageUrl, shadowForFirstCard, stackingTop, move}) => {
  

  const movePhotoCard = useMemo( () => {
    if ( move === 'left' ) {  
      return 'photo-card-move-left';

    } else if ( move === 'right' ) {
      return 'photo-card-move-right';

    } else {
      return '';
    }

  },[move]);


  const stackPhotoCard = useMemo( () => {
    
    if (!stackingTop) return undefined;

    return `translateY(-${stackingTop})px)`;
    
  },[stackingTop]);

  
  const shadowPhotoCard = useMemo( () => {
    
    if (!shadowForFirstCard) return undefined;

    // return `0px 0px 10px 2px #00000050`; // alternative shaddow image
    return `1px 0px 10px 3px #00000073`;

  },[shadowForFirstCard]);


  const titlePhotoCard = useMemo( () => {
      return (imageUrl.split(/:\/\/|\//)[3]);
  },[imageUrl]);
  
  
  return (
    <div 
      className={`photo-card-container ${movePhotoCard}`} 
      style={{
        boxShadow: shadowPhotoCard,
        transform: stackPhotoCard, 
      }}
    >
      <p className="photo-card-title">{titlePhotoCard}</p>
      < img 
        src={imageUrl}
        draggable="false"
        className="photo-card-image"

      />
    </div>
  );
}


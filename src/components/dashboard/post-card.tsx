import TagList from './TagList.jsx';
import '../../styles/post-card.scss';
import { type FunctionComponent } from 'react';

// type PostBlobData = {
//   content: {
//     userId: string | null;
//     title: string;
//     subheading?: string;
//     date?: string;
//     body: string;
//     image?: string[];
//     tags: string[];
//   };
// };

type PostCardProps = {
  title: string;
  subheading?: string;
  authorName: string;
  date: string;
  body: string;
  image: string[];
  tags: string[];
};

export const PostCard: FunctionComponent<PostCardProps> = ({
  title,
  subheading = '',
  authorName = '',
  date,
  body,
  image = [],
  tags,
}) => {
  return (
    <article className='post card update-entry'>
      {image.length > 0 && (
        <div className='update-entry__images'>
          {image.map((image) => (
            <img key={image} className="update-entry__image-item" src={image} alt={title} />
          ))}
        </div>
      )}
      <h3 className='update-entry__title'>{title}</h3>
      <h4 className='update-entry__subheading'>{subheading}</h4>
      <small className='update-entry__date'>Published: {date}</small>
      <span className='update-entry__author'>By {authorName}</span>
      <p className='update-entry__content'>{body}</p>
      <TagList tags={tags} /> 
    </article>
  )
};

export default PostCard;

import TagList from './TagList';
import '../../styles/post-card.scss';

export default function PostCard({
  title,
  subheading = false,
  authorName,
  date,
  body,
  images = [],
  tags = []
}) {
  return (
    <article className='post card update-entry'>
      {images.length > 0 && (
        <div className='update-entry__images'>
          {images.map((image) => (
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
}
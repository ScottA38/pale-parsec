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
    <article class='post card update-entry'>
      <h3 className='update-entry__title'>{title}</h3>
      <h4 className='update-entry__subheading'>{subheading}</h4>
      <small className='update-entry__date'>Published: {date}</small>
      <strong className='update-entry__author'>By {authorName}</strong>
      <p className='update-entry__content'>{body}</p>
      {images.length > 0 && (
        <div class='update-entry__images'>
          {images.map((image) => (
            <img src={image} alt={title} />
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div class='update-entry__tags'>
          <strong><span class='update-entry__tag-label'>Tags:</span></strong>
          {tags.map((tag) => (
            <span class='tag'>{tag}</span>
          ))}
        </div>
      )}
    </article>
  )
}
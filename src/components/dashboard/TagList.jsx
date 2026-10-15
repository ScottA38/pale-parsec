export default function TagList({ tags }) {
  function getTagItemText(tag, index) {
    let tagText = (index > 0 ? ' ' : '') + tag + (index < tags.length - 1 ? ',' : '');

    return (
      <span key={tag} className='update-entry__tag-item'>{tagText}</span>
    );
  }
  const tagList = tags.filter((tag) => !tag.trim(" ") == "" );

  if (tagList.length == 0) {
    return <div className='update-entry__tags' style={{ "visibility": "hidden" }} aria-hidden="true"></div>
  }
  
  return (
    <div className='update-entry__tags'>
      <span className='update-entry__tag-label'>Tags:</span>
      {tags.map(getTagItemText)}
    </div>
  )
}
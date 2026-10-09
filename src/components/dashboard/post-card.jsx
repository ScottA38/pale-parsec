import { getStore } from '@netlify:blobs';
const { blogBlobKey } = Astro.props;

export default async function PostCard() {
  const blogBlobStore = await getStore('blog');
  const blobBlogObject = await blogStore.get(blob.key);

  return (
    <div class='blob-card'>
      <h3>{blobBlogObject.title}</h3>
      <h4>By {blobBlogObject.subheading}</h4>
      <p>{blobBlogObject.body}</p>
      <small>Published: {blobBlogObject.date}</small>
    </div>
  )
}
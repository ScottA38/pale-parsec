import { type Store, getStore } from '@netlify/blobs';
import * as zod from 'zod';
import { v7 as uuidGen } from 'uuid';

export type blogEntry = {
  content: {
    uuid: String,
    title: String,
    date: Date,
    subheading: String,
    body: String,
    author: String,
    images: Array<String>,
    tags: Array<String>, 
  },
}
const updateSchema = zod.object({
  blog: zod.object({
    content: zod.object({
      title: zod.string(),
      subheading: zod.string().optional(),
      body: zod.string(),
      author: zod.string(),
      images: zod.array(
        zod.string().refine((val) => val.match(/\.jpg$|\.png$|\.avif$|\.webp$/))
      ).optional(),
      tags: zod.array(zod.string()),
    })
  })
});

export const POST = async ({ request }: { request: Request }) => {
  const resJson = await request.json();
  const blogStore: Store = getStore('blog');
  const validationResponse = updateSchema.safeParse(resJson);
  if (validationResponse.error) {
    return new Response(
      JSON.stringify(
        { "error": `The submitted article doesn\'t match the required schema, message: ${validationResponse.error.message}` }
      ), 
      { status: 400 }
    );
  }

  const validatedBlog = validationResponse.data.blog;
  const uuidKey = uuidGen();
  const updatePayload = new Blob([JSON.stringify(validatedBlog)], { type: "application/json" })
  await blogStore.set( uuidKey, updatePayload );

  return new Response(
    JSON.stringify({ message: `Band update successfully uploaded as ${uuidKey}` })
  );
}

export const GET = async () => {
  const blogStore: Store = getStore('blog');
  const storeList = [];

  for await (const blob of (await blogStore.list()).blobs) {
    const blobKey: string = blob.key
    const blobObject = await blogStore.get(blobKey);
    storeList.push({ [blobKey] : blobObject });
  }

  return new Response(JSON.stringify(storeList));
}
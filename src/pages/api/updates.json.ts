import { type Store, getStore } from '@netlify/blobs';
import * as zod from 'zod';
import path from 'node:path';

export type blogEntry = {
  content: {
    uuid: String,
    title: String,
    date: Date,
    subheading: String,
    body: String,
    link: String,
    images: Array<String>,
    tags: Array<String>, 
  },
}
const updateSchema = zod.object({
  blog: zod.object({
    content: zod.object({
      uuid: zod.string(),
      title: zod.string(),
      date: zod.string(),
      subheading: zod.string(),
      body: zod.string(),
      link: zod.url(),
      images: zod.array(
        zod.string().refine((val) => val.match(/\.jpg$|\.png$|\.avif$|\.webp$/))
      ),
      tags: zod.array(zod.string()),
    })
  })
});

export const POST = async ({ request }: { request: Request }) => {
  const resJson = await request.json();
  const blogStore: Store = getStore(('blog'));
  const validationResponse = updateSchema.safeParse(resJson);
  if (validationResponse.error) {
    return new Response(
      JSON.stringify(
        { "error": `The submitted article doesn\'t match the required schema, expected: ${updateSchema.toString()}` }
      ), 
      { status: 400 }
    );
  }

  const validatedBlog = validationResponse.data.blog;
  const uuidKey = validatedBlog.content.uuid;
  await blogStore.set(uuidKey, new Blob([JSON.stringify(validatedBlog)], { type: "application/json" }));

  return new Response(
    JSON.stringify({ message: `Band update successfully uploaded as ${uuidKey}` })
  );
}
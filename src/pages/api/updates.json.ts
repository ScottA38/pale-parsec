import { type Store, getStore } from '@netlify/blobs';
import * as zod from 'zod';
import { v7 as uuidGen } from 'uuid';

export type BlogEntry = zod.infer<typeof blogUpdateSchema>;
type UpdatesResponse = Array<Record<string, BlogEntry>>;
const base64regex = /^data:image\/(jpeg|png|avif|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const blogUpdateSchema = zod.object({
  content: zod.object({
    title: zod.string(),
    subheading: zod.string().optional(),
    body: zod.string(),
    userId: zod.string(),
    image: zod.array(
      zod.string().refine((val) => base64regex.test(val))
    ).optional(),
    tags: zod.array(zod.string()),
  })
});

export const POST = async ({ request }: { request: Request }) => {
  const resJson = await request.json();
  const blogStore: Store = getStore('blog');
  const validationResponse = blogUpdateSchema.safeParse(resJson);
  if (validationResponse.error) {
    return new Response(
      JSON.stringify(
        { "error": `The submitted article doesn\'t match the required schema, message: ${validationResponse.error.message}` }
      ), 
      { status: 400 }
    );
  }

  const validatedBlog = validationResponse.data;
  const uuidKey = uuidGen();
  const updatePayload = new Blob([JSON.stringify(validatedBlog)], { type: "application/json" })
  await blogStore.set( uuidKey, updatePayload );

  return new Response(
    JSON.stringify({ message: `Band update successfully uploaded as ${uuidKey}` })
  );
}

export const GET = async () => {
  const blogStore: Store = getStore('blog');
  const storeList: UpdatesResponse = [];

  for await (const blob of (await blogStore.list()).blobs) {
    const blobObject = await blogStore.get(blob.key, { 'type': 'json' });
    const entry = blogUpdateSchema.safeParse(blobObject);
    if (!entry.success) {
      console.error(`Invalid blog blob ${blob.key}`, entry.error.issues);
      
      continue;
    }
    storeList.push({ [blob.key] : entry.data });
  }

  return new Response(JSON.stringify(storeList));
}
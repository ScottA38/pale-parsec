import { type APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

export const DELETE = (async ({ params, request }: { params: any, request: Request }) => {
  const store = getStore('blog');
  const { id } = params;

  try {
    await store.delete(id);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: `Unable to delete blob with id ${id}` }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ message: `Blog update with id ${id} deleted successfully` }),
    { status: 200 }
  );
}) satisfies APIRoute;
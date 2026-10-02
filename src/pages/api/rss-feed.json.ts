import type { APIRoute } from "astro";
import RSSParser from 'rss-parser';

export const prerender = false;
const parser = new RSSParser();

export const GET = (async ({ params, request: Request, session: AstroSession }): Promise<Response> => {
  const feedUrl = import.meta.env.BAND_SEARCH_URL;

  if (!feedUrl) {
    return new Response(JSON.stringify({ error: "BAND_SEARCH_URL is not configured" }), { status: 500 });
  }

  try {
    const rssResponse: Response = await fetch(feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    
    if (!rssResponse.ok) {
      console.error(`Band feed request failed with status ${rssResponse.status}`);

      return new Response(JSON.stringify({ error: "Band feed request failed" }), { status: 502 });
    }

    const feed = await parser.parseString(await rssResponse.text());

    return new Response(JSON.stringify(feed));
  } catch (error) {
    console.error("Failed to load band feed", error);

    return new Response(JSON.stringify({ error: "Failed to load band feed" }), { status: 500 });
  }
}) satisfies APIRoute;
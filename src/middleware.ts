import { clerkMiddleware, type User } from "@clerk/astro/server";
import type { APIContext, MiddlewareNext } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { sequence } from "astro:middleware";

/**
 * Add a counter to API requests which add/remove blog entries
 * 
 * @param _  - APIContext (Astro)
 * @param next - Response
 * @returns A promise of a reponse (return from `next` param)
 */
export const addPostCountToClerk = async (_: APIContext, next: MiddlewareNext): Promise<Response> => {
  const requestUrl = new URL(_.request.url);
  const response = await next();

  if (response.ok && requestUrl.host == _.site?.host && requestUrl.pathname.match(/^\/api\/update/)) {
    const clerk = clerkClient(_);
    const { userId } = _.locals.auth()
    const requestMethod = _.request.method;
    if (userId == null) {
      throw new Error('Unable to identify current user in Middleware function.');
    }

    // Retrieve existing count of posts [if exists]
    const clerkUser: User = await clerk.users.getUser(userId);
    let postCount: number | undefined = clerkUser.privateMetadata.postCount;

    // 'Add' route
    if (requestMethod == 'POST') {
      clerk.users.updateUserMetadata(userId, {
        privateMetadata: {
          postCount: typeof postCount == 'number' ? ++postCount : 0
        }
      });
    // 'Remove' route
    } else if (requestMethod == 'DELETE') {
      clerk.users.updateUserMetadata(userId, {
        privateMetadata: {
          postCount: typeof postCount == 'number' ? --postCount : 0
        }
      });
    }
  }

  return response;
}

export const onRequest = sequence(
  clerkMiddleware(),
  addPostCountToClerk
);
import { sequence } from "astro:middleware";
import { defineMiddleware } from "astro:middleware";
import { clerkMiddleware, type Session } from "@clerk/astro/server";
import type { APIContext } from "astro";

async function getSoundCloudToken() {
  const scBase64Key = btoa(process.env.SOUNDCLOUD_CLIENT_ID + ':' + process.env.SOUNDCLOUD_SECRET_KEY);
  const soundCloudAuthResponse = await fetch('https://secure.soundcloud.com/oauth/token', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${scBase64Key}`
    },
    body: encodeURI('grant_type=client_credentials')
  });
  
  return soundCloudAuthResponse;
}

async function isTokenExpired(
  _: APIContext,
  now = Date.now()
) : Promise<boolean> {
  const expiresAt = await _.session!.get('soundcloud_expires_at');
  const soundcloudToken = await _.session?.get('soundcloud_token');
  const refreshToken = await _.session?.get('refresh_token');
  if (
    expiresAt == undefined || soundcloudToken == undefined || refreshToken == undefined
  ) {
    return true;
  } 

  return expiresAt < Math.floor(now / 1000);
}

const soundCloudBearerToken = defineMiddleware( async (_: APIContext, next) => {
  if (_.session === undefined) {
   console.error('Astro session is not defined: skipping soundcloud oauth');
   const response = await next();

   return response;
  }

  const tokenExpired = await isTokenExpired(_);
  if (
    tokenExpired
  ) {
    const soundCloudAuthResponse = await getSoundCloudToken();
    if (!soundCloudAuthResponse.ok) {
      console.error('Unable to get SoundCloud Auth response, status:' + soundCloudAuthResponse.status);
      const response = await next();

      return response;
    }
    
    const authRequestData: SoundCloudAPI.oauth = await soundCloudAuthResponse.json();
    const expiresAt = Math.floor(Date.now() / 1000) + authRequestData.expires_in;

    await _.session.set('soundcloud_token', authRequestData.access_token);
    await _.session.set('soundcloud_refresh_token', authRequestData.refresh_token)
    await _.session.set('soundcloud_expires_at', expiresAt)
    const response = await next();

    return response;
  }
  
  const response = await next();

  return response;
});

export const onRequest = sequence(clerkMiddleware(), soundCloudBearerToken)
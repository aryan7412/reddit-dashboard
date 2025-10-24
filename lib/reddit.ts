import { cache } from "react";

let tokenCache: {
  accessToken: string;
  expiresAt: number; // epoch ms
} | null = null;

const TOKEN_ENDPOINT = "https://www.reddit.com/api/v1/access_token";

function getBasicAuthHeader(clientId: string, clientSecret: string) {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${creds}`;
}

async function fetchToken(): Promise<{ access_token: string; expires_in: number }>
{
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET env vars. Set them in your environment/Vercel."
    );
  }

  const resp = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: getBasicAuthHeader(clientId, clientSecret),
      "User-Agent":
        "reddit-dashboard/1.0 (https://reddit-dashboard-teal.vercel.app; +https://github.com/aryan7412/reddit-dashboard)",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "read" }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Failed to obtain Reddit token: ${resp.status} ${t}`);
  }
  return resp.json();
}

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - 10_000 > now) {
    return tokenCache.accessToken;
  }
  const tok = await fetchToken();
  tokenCache = {
    accessToken: tok.access_token,
    // expires_in is seconds; store slightly earlier than actual expiry
    expiresAt: now + (tok.expires_in - 30) * 1000,
  };
  return tokenCache.accessToken;
}

export async function oauthFetch(input: string, init: RequestInit = {}) {
  let token = await getAccessToken();
  const doRequest = async (bearer: string) =>
    fetch(input, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent":
          "reddit-dashboard/1.0 (https://reddit-dashboard-teal.vercel.app; +https://github.com/aryan7412/reddit-dashboard)",
        Authorization: `Bearer ${bearer}`,
        ...(init.headers || {}),
      },
      cache: "no-store",
      next: { revalidate: 0 },
    } as RequestInit);

  let res = await doRequest(token);
  if (res.status === 401) {
    // refresh token once
    tokenCache = null;
    token = await getAccessToken();
    res = await doRequest(token);
  }
  return res;
}

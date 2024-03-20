import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// export the POST function
export async function POST(request: Request) {
  // create a new URL object from the request URL (https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
  const requestUrl = new URL(request.url);

  // delete the auth cookie from the request headers (https://nextjs.org/docs/api-reference/next/headers#cookies)
  cookies().delete("auth");

  // return a redirect response to the root of the website (https://nextjs.org/docs/api-reference/next/server#redirect)
  return NextResponse.redirect(`${requestUrl.origin}`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
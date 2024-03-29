import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJwtSecretKey } from "@/lib/authentication/get-jwt";
import { SignJWT } from "jose";
import isAuth from "@/lib/authentication/is-auth";

// Create a POST request handler
export async function POST(request: Request) {
  // Read the password from the request body
  const data = await request.json();
  const password = data.password;

  // Read the admin secret from the .env.local file
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  // Check that the password is correct
  try {
    if (password === adminSecret) {
      // Create a signed JWT token
      const token = await new SignJWT({
        password: password,
        role: "admin", // Set your own roles
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(getJwtSecretKey());

      // Set a cookie with the signed JWT token
      cookies().set({
        name: "auth",
        value: token,
        secure: true,
        sameSite: "none",
      });

      // Redirect the user to the home page
      return NextResponse.json(`Correct pass`, {
        // a 200 status is required to redirect from a POST to a GET route
        status: 200,
      });
    } else {
      // Redirect the user back to the login page if the password is incorrect
      return NextResponse.json(`Could not authenticate user`, {
        // a 200 status is required to redirect from a POST to a GET route
        status: 401,
      });
    }
  } catch (error) {
    // Redirect the user back to the login page if there was an error
    console.error("Error:", error);
    return NextResponse.json(`server error`, {
      // a 500 status is required to redirect from a POST to a GET route
      status: 500,
    });
  }
}

export async function GET():Promise<Response> {

  // Check that the password is correct
  try {
    const authorizationStatus = await isAuth()
    if (authorizationStatus) {
      return NextResponse.json('Authorized',{status:200})
    } else {
      return NextResponse.json('Unauthorized', { status: 200 })
    }
  } catch (error) {
    // Redirect the user back to the login page if there was an error
    console.error("Error:", error);
    return NextResponse.json(`server error`, {
      // a 500 status is required to redirect from a POST to a GET route
      status: 500,
    });
  }
}

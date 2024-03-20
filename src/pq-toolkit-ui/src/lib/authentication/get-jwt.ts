import { jwtVerify, KeyLike } from "jose";

/**
 * Retrieves the JWT secret key from the environment variable and encodes it as a `Uint8Array`.
 * This encoding is necessary for the `jose` library to use the key in its functions.
 *
 * @returns {Uint8Array} The encoded JWT secret key.
 * @throws {Error} If the JWT secret key is not found in the environment variables.
 */
export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "JWT secret key is not defined in the environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Verifies a JWT token using the secret key.
 *
 * @param {string | Uint8Array} token - The JWT token to verify.
 * @returns {Promise<object | null>} The payload of the verified JWT token, or `null` if verification fails.
 */
export async function verifyJwtToken(token: string): Promise<object | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey as unknown as KeyLike);
    return payload;
  } catch (error) {
    console.error("Failed to verify JWT token:", error);
    return null;
  }
}
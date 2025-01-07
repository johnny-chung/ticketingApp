import request from "supertest";
import { app } from "../app";

/**
 * Reusable function to authenticate and get a cookie for further requests.
 * @param email - The user's email for authentication
 * @param password - The user's password for authentication
 * @returns A promise that resolves with the authentication cookie
 */

export const authenticateUser = async (
  email: string,
  password: string
): Promise<string[]> => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(200);

  return response.get("Set-Cookie") ?? [];
};

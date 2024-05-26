import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  hashed_password: z.string(),
  is_active: z.boolean()
})

export type UserData = z.infer<typeof UserSchema>

export const LoginSchema = z.object({
  access_token: z.string(),
  token_type: z.string()
})

export type LoginData = z.infer<typeof LoginSchema>
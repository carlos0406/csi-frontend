import { z } from "zod"

const settingsSchema =z.object({
  base_api_url: z.string().url(),
})

export const settings = settingsSchema.parse({
  base_api_url: process.env.NEXT_PUBLIC_API_URL,
}) 
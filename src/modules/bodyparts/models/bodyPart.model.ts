import { z } from 'zod'
export const BodyPartModel = z.object({
  name: z.string()
})

import { z } from 'zod'
export const ExerciseModel = z.object({
  exerciseId: z.string(),
  name: z.string(),
  gifUrl: z.string(),
  targetMuscles: z.array(z.string()),
  bodyParts: z.array(z.string()),
  equipments: z.array(z.string()),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string())
})

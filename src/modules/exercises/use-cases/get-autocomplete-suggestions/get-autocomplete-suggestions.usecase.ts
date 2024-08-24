import { IUseCase } from '#common/types/use-case.type.js'
import { IExerciseDoc, IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'

export interface GetAutoCompleteSuggestionsArgs {
  search?: string
}
export class GetAutoCompleteSuggestionsUseCase implements IUseCase<GetAutoCompleteSuggestionsArgs, IExerciseDoc[]> {
  constructor(private readonly exerciseModel: IExerciseModel) {}

  async execute({ search = '' }: GetAutoCompleteSuggestionsArgs): Promise<IExerciseDoc[]> {
    try {
      if (!search) {
        return []
      }

      const autocompleteResults = await this.exerciseModel.aggregate([
        {
          $search: {
            index: 'exercises',
            autocomplete: {
              query: search,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1
              }
            }
          }
        },
        { $limit: 10 },
        {
          $project: {
            name: 1,
            gifUrl: 1,
            exerciseId: 1,
            score: { $meta: 'searchScore' }
          }
        },
        { $sort: { score: -1 } }
      ])

      return autocompleteResults
    } catch (error) {
      throw new Error('Failed to generate exercises suggestions')
    }
  }
}

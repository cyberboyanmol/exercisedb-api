import { IUseCase } from '#common/types/use-case.type.js'
import { supabase } from '#infra/supabase'

export interface UploadImageUseCaseReturnArgs {
  publicUrl: string
}

export class UploadImageUseCase implements IUseCase<File, UploadImageUseCaseReturnArgs> {
  constructor() {}
  async execute(file: File): Promise<UploadImageUseCaseReturnArgs> {
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .upload(`${file.name}`, file, {
        contentType: `${file.type}`,
        upsert: false
      })
    if (error) throw error
    const { data: image } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME!).getPublicUrl(data.path)
    return image
  }
}

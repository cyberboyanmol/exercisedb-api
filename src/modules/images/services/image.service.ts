import { Stream } from 'stream'
import { ViewImageUseCase } from '../use-cases/view-image'
import { UploadImageUseCase } from '../use-cases/upload-image/upload-gif.usecase'

export class ImageService {
  private readonly uploadImageUseCase: UploadImageUseCase
  private readonly viewImageUseCase: ViewImageUseCase
  constructor() {
    this.uploadImageUseCase = new UploadImageUseCase()
    this.viewImageUseCase = new ViewImageUseCase()
  }

  uploadImage = (file: File) => {
    return this.uploadImageUseCase.execute(file)
  }
  viewImage = (fileName: string): Promise<any> => {
    return this.viewImageUseCase.execute(fileName)
  }
}

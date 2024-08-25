import { BodyPartController, EquipmentController, MuscleController, ExerciseController } from './modules'
import { DalService } from '#infra/mongodb/dal.service.js'
import { App } from './app'
import { ImagesController } from '#modules/images/controllers/image.controller.js'

const dalService = new DalService()
const app = new App([
  new ExerciseController(),
  new MuscleController(),
  new EquipmentController(),
  new BodyPartController(),
  new ImagesController()
]).getApp()
await dalService.connectDB()

export default app

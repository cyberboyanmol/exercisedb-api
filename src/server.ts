import { BodyPartController, EquipmentController, MuscleController, ExerciseController } from './modules'
import { DalService } from '#infra/mongodb/dal.service.js'
import { App } from './app'

const dalService = new DalService()
const app = new App([
  new ExerciseController(),
  new MuscleController(),
  new EquipmentController(),
  new BodyPartController()
]).getApp()
await dalService.connectDB()

export default app

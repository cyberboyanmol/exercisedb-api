import { DalService } from '#infra/mongodb/dal.service.js'
import { MuscleController } from '#modules/muscle/controllers/muscle.controller.js'
import { App } from './app'

const dalService = new DalService()
const app = new App([new MuscleController()]).getApp()
await dalService.connectDB()

export default app

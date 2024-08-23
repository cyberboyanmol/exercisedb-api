import { DalService } from '#infra/mongodb/dal.service.js'
import { EquipmentController } from '#modules/equipments/controllers/equipment.controller.js'
import { MuscleController } from '#modules/muscle/controllers'
import { App } from './app'

const dalService = new DalService()
const app = new App([new MuscleController(), new EquipmentController()]).getApp()
await dalService.connectDB()

export default app

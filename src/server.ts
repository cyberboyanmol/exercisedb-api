import { DalService } from '#infra/mongodb/dal.service.js'
import { App } from './app'

const dalService = new DalService()
const app = new App([]).getApp()
dalService.connectDB()

export default app

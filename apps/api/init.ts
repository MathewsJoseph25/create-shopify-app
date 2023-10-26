import mongoose from 'mongoose'
import { MONGODB_CONNECTION_STRING } from './config'
//Init mongoose
mongoose.Promise = global.Promise
if (MONGODB_CONNECTION_STRING) mongoose.connect(MONGODB_CONNECTION_STRING)
else {
  console.error('Mongodb connection string env variable is required')
  process.exit()
}

//initialise services
import('./services/auth')

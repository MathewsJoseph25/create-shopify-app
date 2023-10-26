import mongoose, { ClientSession } from 'mongoose'
import { trackException } from './trackException.util'

export const runInTransaction = async (
  callback: (session: ClientSession) => void,
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    await callback(session)
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    trackException('While executing mongoose transaction: ', error)
    throw error
  } finally {
    session.endSession()
  }
}

export const trackException = (msg: string, error?: any, extraData?: any) => {
  console.error(msg, error, extraData)
}

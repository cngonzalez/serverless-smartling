import { authenticate, initMiddleware, corsOptionsDelegate } from '../../utils'
import Cors from 'cors'
var fs = require('fs')

const cors = initMiddleware(Cors(corsOptionsDelegate))

const getTranslation = async (req, res) => {
  await cors(req, res)
  const translation = await authenticate(process.env.SMARTLING_SECRET)
    .then(token => (
fetch(`https://api.smartling.com/files-api/v2/projects/${process.env.SMARTLING_PROJECT_ID}/locales/${req.query.localeId}/file?fileUri=${req.query.taskId}&retrievalType=pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    ))
  .then(smartlingRes => {
    const chunks = []
    smartlingRes.body.on('data', chunk => chunks.push(chunk)) 
    return new Promise((resolve, reject) => {
      smartlingRes.body.on('end', () => {
          resolve(res.status(200).json({body: Buffer.concat(chunks).toString()}))
      })
    }) 
  })
}

export default getTranslation

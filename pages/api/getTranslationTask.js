import { authenticate, initMiddleware, corsOptionsDelegate } from '../../utils'
import Cors from 'cors'

const cors = initMiddleware(Cors(corsOptionsDelegate))

const getTranslationTask = async (req, res) => {
  await cors(req, res)
  const locales = await authenticate(process.env.SMARTLING_SECRET)
    .then(token => (
      fetch(`https://api.smartling.com/files-api/v2/projects/${process.env.SMARTLING_PROJECT_ID}/file/status?fileUri=${req.query.documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json' 
        }
      })
    ))
    .then(res => res.json())
    .then(res => {console.log(res.response); return res})
    .then(res => res.response.data.items.map(item => ({
        localeId: item.localeId,
        progress: Math.floor(item.completedStringCount / res.response.data.totalStringCount * 100)
      })
    ))

  res.status(200).json({
    taskId: req.query.documentId,
    documentId: req.query.documentId,
    locales
  })
}

export default getTranslationTask

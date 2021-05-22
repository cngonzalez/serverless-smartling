import { authenticate, initMiddleware, corsOptionsDelegate } from '../../utils'
import Cors from 'cors'

const cors = initMiddleware(Cors(corsOptionsDelegate))

const getLocales = async (req, res) => {
  await cors(req, res)
  const locales = await authenticate(process.env.SMARTLING_SECRET)
    .then(token => (
      fetch(`https://api.smartling.com/projects-api/v2/projects/${process.env.SMARTLING_PROJECT_ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json' 
        }
      })
    ))
    .then(res => res.json())
    .then(res => res.response.data.targetLocales)

  res.status(200).json({ locales })
}

export default getLocales

const ALLOWED_CORS_ORIGINS = ['http://localhost:3333', 'cs-demo.sanity.studio']

export const authenticate = async (smartlingSecret) => (
  fetch('https://api.smartling.com/auth-api/v2/authenticate', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: smartlingSecret
  })
  .then(res => res.json())
  .then(res => res.response.data.accessToken)
)

export const initMiddleware = (middleware) => {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export const corsOptionsDelegate = (req, callback) => {
  const corsOptions = { origin: false, methods: ['POST', 'GET', 'OPTIONS'] } 

  if (ALLOWED_CORS_ORIGINS.includes(req.headers['origin'])) {
    corsOptions.origin = true
  }

  callback(null, corsOptions) 
}

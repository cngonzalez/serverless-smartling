import FormData from 'form-data'
import { Readable } from 'stream'
import { authenticate, initMiddleware, corsOptionsDelegate } from '../../utils'
import Cors from 'cors'
var fs = require('fs')

const cors = initMiddleware(Cors(corsOptionsDelegate))

const convertDataToForm = ({ documentId, localeIds, serialized }) => {
  const formData = new FormData()
  formData.append('fileUri', documentId)
  formData.append('fileType', 'html')
  const htmlBuffer = Buffer.from(`<html><body>${serialized}</body></html>`, 'utf-8')
  formData.append('file', htmlBuffer, {filename: `${documentId}.html`})
  localeIds.forEach(id => formData.append('localeIdsToAuthorize[]', id))
  return formData
}

const createTask = async (req, res) => {
  await cors(req, res)
  const token = await authenticate(process.env.SMARTLING_SECRET)
  const sanityContent = JSON.parse(req.body)
  const formData = convertDataToForm(sanityContent)

  const uploadResult = await fetch(`https://api.smartling.com/files-api/v2/projects/${process.env.SMARTLING_PROJECT_ID}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    //TODO: do some error checking here and return error code if exists
    .then(res => console.log(res.response))

    res.status(200).json(uploadResult)
}

export default createTask

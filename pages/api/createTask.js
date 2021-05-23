import FormData from 'form-data'
import { authenticate, initMiddleware, corsOptionsDelegate } from '../../utils'
import Cors from 'cors'

const cors = initMiddleware(Cors(corsOptionsDelegate))

const convertDataToForm = ({ documentId, localeIds, serialized }) => {
  const formData = new FormData()
  formData.append('fileUri', documentId)
  formData.append('fileType', 'html')
  const htmlBuffer = Buffer.from(serialized, 'utf-8')
  formData.append('file', htmlBuffer, {filename: `${documentId}.html`})
  localeIds.forEach(id => formData.append('localeIdsToAuthorize[]', id))
  return formData
}

const uploadFile = async (req, token) => (
  fetch(`https://api.smartling.com/files-api/v2/projects/${process.env.SMARTLING_PROJECT_ID}/file`, {
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'POST',
      body: convertDataToForm(JSON.parse(req.body))
    })
)

// const findExistingJob = (documentId, token) => (
//   fetch(`https://api.smartling.com/jobs-api/v3/projects/${process.env.SMARTLING_PROJECT_ID}/jobs?jobName=${documentId}`, {
//     headers: { 'Authorization': `Bearer ${token}` },
//   })
//   .then(res => res.json())
//   .then(res => {
//     if (res.response.data.items.length) {
//       return res.response.data.items[0].translationJobUid
//       } else {
//         return ''
//       }
//   })
// ) 

// const createJob = async (token, documentId, localeIds) => {
//   return fetch(`https://api.smartling.com/jobs-api/v3/projects/${process.env.SMARTLING_PROJECT_ID}/jobs`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'content-type': 'application/json',
//           },
//           method: 'POST',
//           body: JSON.stringify({
//               jobName: documentId,
//               targetLocaleIds: localeIds
//             })
//         })
//         .then(res => res.json())
//         .then(res => {console.log(res.response.errors); return res})
//         .then(res => res.response.data.translationJobUid)
// }


// const assignFileToJob = async (tranId, token, documentId, localeIds) => (
//   fetch(`https://api.smartling.com/jobs-api/v3/projects/{process.env.SMARTLING_PROJECT_ID}/jobs/${tranId}/file/add`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({
//       fileUri: documentId,
//       targetLocaleIds: localeIds
//     })
//   })
//   .then(res => res.json())
//   .then(res => console.log(res.response.errors))
// )


const createTask = async (req, res) => {
  await cors(req, res)
  const token = await authenticate(process.env.SMARTLING_SECRET)
  const { documentId, localeIds } = JSON.parse(req.body)
  await uploadFile(req, token)
  // let taskId = await findExistingJob(documentId, token)
  // if (!taskId) {
  //   taskId = await createJob(token, documentId, localeIds)
  // }
  // await assignFileToJob(taskId, token, documentId, localeIds)  
  res.status(200).json({
    documentId,
    taskId: documentId
  })
}

export default createTask

const express = require('express')
const serverless = require('serverless-http')

const app = express()
const router = express.Router()

router.use(express.json())

// check if in production:

/* router.get('/allUsers', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.send({ message: 'Not allowed' })
    return
  }
  const { allUsers } = require('../../../src/api/db/allUsers')
  const response = await allUsers()
  res.send(response)
}) */

router.get('/checkLicense/:email/:productID', async (req, res) => {
  const { checkLicense } = require('../../../src/api/db/checkLicense')
  const response = await checkLicense(
    req.params.email,
    req.params.productID,
    req.params.licenseKey
  )
  res.send(response)
})

/* router.get('/addUser/:email/:productID/:licenseKey', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.send({ message: 'Not allowed' })
    return
  }
  const { addUser } = require('../../../src/api/db/addUser')
  const response = await addUser({
    name: req.params.email,
    email: req.params.email,
    productID: req.params.productID,
    licenseKey: req.params.licenseKey
  })
  res.send(response)
}) */

router.get('/send', async (req, res) => {
  const { sendEmail } = require('../../../src/api/email/sendEmail')
  const response = await sendEmail({
    fromName: req.query.fromName,
    fromEmail: req.query.fromEmail,
    toName: req.query.toName,
    toEmail: req.query.toEmail,
    replyTo: req.query.replyTo,
    subject: req.query.subject,
    message: req.query.message,
    resendAPIKey: req.query.resendAPIKey
  })
  res.send(response)
})

app.use('/api', router)

module.exports.handler = serverless(app)

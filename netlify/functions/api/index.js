const express = require('express')
const serverless = require('serverless-http')

const app = express()
const router = express.Router()

router.use(express.json())

router.get('/allUsers', async (req, res) => {
  const { allUsers } = require('../../../src/api/db/allUsers')
  const response = await allUsers()
  res.send(response)
})

router.get('/checkLicense/:email/:productID/:licenseKey', async (req, res) => {
  const { checkLicense } = require('../../../src/api/db/checkLicense')
  const response = await checkLicense(
    req.params.email,
    req.params.productID,
    req.params.licenseKey
  )
  res.send(response)
})

app.use('/api', router)

module.exports.handler = serverless(app)

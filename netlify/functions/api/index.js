const express = require('express')
const serverless = require('serverless-http')

const app = express()
const router = express.Router()

router.use(express.json())

// check if in production:

router.get('/allUsers', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.send({ message: 'Not allowed' })
    return
  }
  const { allUsers } = require('../../../src/api/db/allUsers')
  const response = await allUsers()
  res.send(response)
})

router.get('/checkLicense/:email/:productID', async (req, res) => {
  const { checkLicense } = require('../../../src/api/db/checkLicense')
  const response = await checkLicense(
    req.params.email,
    req.params.productID,
    req.params.licenseKey
  )
  res.send(response)
})

router.get('/addUser/:email/:productID/:licenseKey', async (req, res) => {
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
})

app.use('/api', router)

module.exports.handler = serverless(app)

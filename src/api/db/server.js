/* const express = require('express')
const serverless = require('serverless-http')
const { getUser } = require('./findUser')
const { getUserByLicenseKey } = require('./getUserByLicenseKey')
const { updateUser } = require('./updateUser')
const { addUser } = require('./addUser')
const { allUsers } = require('./allUsers')
const { deleteUser } = require('./deleteUser')
const { checkLicense } = require('./checkLicense')

const app = express()
app.use(express.json())

app.get('/user/email/:email', async (req, res) => {
  const response = await getUser(req.params.email)
  res.send(response)
})

app.get('/addUser/:name/:email/:licenseKey', async (req, res) => {
  const response = await addUser({
    name: req.params.name,
    email: req.params.email,
    licenseKey: req.params.licenseKey
  })
  res.send(response)
})

app.get('/deleteUser/email/:email', async (req, res) => {
  const response = await deleteUser(req.params.email)
  res.send(response)
})

app.get('/updateUser/email/:email', async (req, res) => {
  const response = await updateUser(req.params.email, {
    productID: 'bJ-NJvJIHf1FwZexc0pyIA==',
    licenseKey: '554DB8D9-B3264533-92D4858F-E799DE0F'
  })
  res.send(response)
})

app.get('/user/licenseKey/:licenseKey', async (req, res) => {
  const response = await getUserByLicenseKey(req.params.licenseKey)
  res.send(response)
})

app.get('/allUsers/', async (req, res) => {
  const response = await allUsers()
  res.send(response)
})

app.get('/checkLicense/:email/:productID/:licenseKey', async (req, res) => {
  const response = await checkLicense(
    req.params.email,
    req.params.productID,
    req.params.licenseKey
  )
  res.send(response)
})

module.exports.handler = serverless(app)
 */

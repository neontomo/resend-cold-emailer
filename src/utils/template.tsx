import { addCustomDataToUser, getCustomDataFromUser } from './checkLicense'

export const saveTemplate = async ({
  subject,
  message
}: {
  subject: string
  message: string
}) => {
  const dataObject = {
    subject,
    message
  }

  try {
    const data = await addCustomDataToUser({
      data: dataObject
    })

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getTemplate = async () => {
  const subject = await getCustomDataFromUser('subject')
  const message = await getCustomDataFromUser('message')

  return {
    subject,
    message
  }
}

export const saveSettings = async ({
  resendAPIKey,
  fromName,
  fromEmail,
  replyTo
}: {
  resendAPIKey: string
  fromName: string
  fromEmail: string
  replyTo: string
}) => {
  const dataObject = {
    resendAPIKey,
    fromName,
    fromEmail,
    replyTo
  }

  try {
    const data = await addCustomDataToUser({
      data: dataObject
    })

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getSettings = async () => {
  const resendAPIKey = await getCustomDataFromUser('resendAPIKey')
  const fromName = await getCustomDataFromUser('fromName')
  const fromEmail = await getCustomDataFromUser('fromEmail')
  const replyTo = await getCustomDataFromUser('replyTo')

  return {
    resendAPIKey,
    fromName,
    fromEmail,
    replyTo
  }
}

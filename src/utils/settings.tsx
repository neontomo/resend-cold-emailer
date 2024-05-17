import {
  addCustomDataToUser,
  getCustomDataFromUser,
  getMultipleCustomDataFromUser
} from '@/utils/checkLicense'

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
  const template = await getMultipleCustomDataFromUser(['subject', 'message'])

  return {
    subject: template?.subject,
    message: template?.message
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
  const settings = await getMultipleCustomDataFromUser([
    'resendAPIKey',
    'fromName',
    'fromEmail',
    'replyTo'
  ])

  return {
    resendAPIKey: settings?.resendAPIKey,
    fromName: settings?.fromName,
    fromEmail: settings?.fromEmail,
    replyTo: settings?.replyTo
  }
}

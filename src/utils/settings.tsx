import {
  addCustomDataToUser,
  getMultipleCustomDataFromUser
} from '@/utils/netlifyIdentity/user'

export const saveTemplate = async ({
  subject,
  message
}: {
  subject: string
  message: string
}) => {
  try {
    const data = await addCustomDataToUser({
      data: { subject, message }
    })

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getTemplate = async () => {
  try {
    const template = await getMultipleCustomDataFromUser(['subject', 'message'])

    return {
      subject: template?.subject,
      message: template?.message
    }
  } catch (error) {
    console.log('Error getting template:', error)
    return null
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
    console.log('Error saving settings:', error)
    return null
  }
}

export const getSettings = async () => {
  try {
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
  } catch (error) {
    console.log('Error getting settings:', error)
    return null
  }
}

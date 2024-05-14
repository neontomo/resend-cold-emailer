const { Resend } = require('resend')
const dayjs = require('dayjs')

async function sendEmail({
  fromName,
  fromEmail,
  toName,
  toEmail,
  replyTo,
  subject,
  message,
  resendAPIKey
}) {
  try {
    if (!process.env.RESEND_API_KEY && !resendAPIKey) {
      console.log('Error', 'RESEND_API_KEY is not set')
      return { error: 'RESEND_API_KEY is not set' }
    }

    const finalAPIKey = resendAPIKey ? resendAPIKey : process.env.RESEND_API_KEY

    const resend = new Resend(finalAPIKey)

    const messageProcessed = message
      .replace(/{fromName}/g, fromName)
      .replace(/{toName}/g, toName)
      .replace(/{fromEmail}/g, fromEmail)
      .replace(/{toEmail}/g, toEmail)
      .replace(/{currentDate}/g, dayjs().format('YYYY-MM-DD'))
      .replace(/{currentTime}/g, dayjs().format('HH:mm'))
      .trim()

    console.log('data received:', {
      fromName: fromName,
      fromEmail: fromEmail,
      toName: toName,
      toEmail: toEmail,
      replyTo: replyTo,
      subject: subject,
      message: message,
      messageProcessed
    })

    if (
      !fromName ||
      !fromEmail ||
      !toEmail ||
      !replyTo ||
      !subject ||
      !message ||
      !messageProcessed
    ) {
      return { error: 'Missing required fields' }
    }

    const data = await resend.emails.send({
      from: `${fromName.trim()} <${fromEmail.trim()}>`,
      to: [toEmail.trim()],
      subject: subject.trim(),
      text: messageProcessed,
      reply_to: replyTo.trim()
    })

    if (data.error) {
      console.log('Error', data.error)
      return { error: data.error }
    } else {
      console.log('Email sent successfully')
      return { message: 'Email sent successfully' }
    }
  } catch (error) {
    console.error(error)
    return { message: 'Error sending email' }
  }
}

module.exports = { sendEmail }

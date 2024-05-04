import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

export async function POST(req: Request, res: Response) {
  try {
    const {
      fromName,
      fromEmail,
      toName,
      toEmail,
      subject,
      message,
      tempAPIKey
    } = await req.json()

    if (!process.env.RESEND_API_KEY && !tempAPIKey) {
      console.log('Error', 'RESEND_API_KEY is not set')
      return NextResponse.json(
        {
          error:
            'RESEND_API_KEY is not set, please modify the RESEND_API_KEY environment variable in your .env file with your Resend API key.'
        },
        { status: 500 }
      )
    }

    const finalAPIKey = tempAPIKey ? tempAPIKey : process.env.RESEND_API_KEY
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
      fromName,
      fromEmail,
      toName,
      toEmail,
      subject,
      message,
      messageProcessed
    })

    if (
      !fromName ||
      !fromEmail ||
      !toEmail ||
      !subject ||
      !message ||
      !messageProcessed
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: `${fromName.trim()} <${fromEmail.trim()}>`,
      to: [toEmail.trim()],
      subject: subject.trim(),
      text: messageProcessed
    })

    if (error) {
      return Response.json({ error })
    }

    return NextResponse.json(
      { data: `Email sent to: ${toEmail}` },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    NextResponse.json(
      {
        message: 'Error sending email'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET(req: Request, res: Response) {
  NextResponse.json(
    {
      message: 'Method not allowed'
    },
    {
      status: 405
    }
  )
}

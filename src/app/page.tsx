'use client'

import { useEffect, useState } from 'react'
import Input from './components/Input'
import axios from 'axios'
import * as yup from 'yup'
import Code from './components/Code'
import dayjs from 'dayjs'
import Footer from './components/Footer'
import Alert from './components/Alert'

function Component() {
  const [fromName, setFromName] = useState(
    process.env.NEXT_PUBLIC_RESEND_FROM_NAME || ''
  )
  const [fromEmail, setFromEmail] = useState(
    process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || ''
  )
  const [toName, setToName] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [subject, setSubject] = useState(
    process.env.NEXT_PUBLIC_RESEND_SUBJECT || ''
  )
  const [message, setMessage] = useState(
    process.env.NEXT_PUBLIC_RESEND_MESSAGE?.trim() || ''
  )

  const [alerts, setAlerts] = useState<{ text: string; type: string }[]>([])

  const createAlert = (text: string, type: string) => {
    setAlerts([{ text, type }, ...alerts])
  }

  useEffect(() => {
    if (alerts.length > 0) {
      const x = setTimeout(() => {
        setAlerts(alerts.slice(0, alerts.length - 1))
      }, 3000)

      return () => {
        clearTimeout(x)
      }
    }
  }, [alerts])

  const availableVariables = [
    'fromName',
    'toName',
    'fromEmail',
    'toEmail',
    'currentDate',
    'currentTime'
  ]

  const handleSendEmail = async () => {
    await axios
      .post('/api/send', {
        fromName,
        fromEmail,
        toName,
        toEmail,
        subject,
        message
      })
      .then((res) => {
        console.log(res.data)
        createAlert('Email sent', 'success')
      })
      .catch((error) => {
        if (error.response.data.error) {
          console.error(error.response.data.error)
          createAlert(error.response.data.error, 'error')
          return
        } else {
          console.error(error)
          createAlert('An error occurred', 'error')
        }
      })
  }

  return (
    <>
      <div className="mx-auto p-8 md:p-16 mb-32 overflow-x-hidden">
        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title">Send email</h2>

              <form
                className="flex flex-col gap-4 my-4"
                onSubmit={(e) => {
                  e.preventDefault()

                  const schema = yup.object().shape({
                    fromName: yup.string().trim().required().min(1).max(50),
                    fromEmail: yup
                      .string()
                      .email()
                      .trim()
                      .required()
                      .min(5)
                      .max(50),
                    toName: yup.string().trim().max(50),
                    toEmail: yup
                      .string()
                      .email()
                      .trim()
                      .required()
                      .min(5)
                      .max(50),
                    subject: yup.string().trim().required().max(50),
                    message: yup.string().trim().required().max(1000)
                  })

                  schema
                    .validate({
                      fromName,
                      fromEmail,
                      toName,
                      toEmail,
                      subject,
                      message
                    })
                    .then(() => {
                      handleSendEmail()
                    })
                    .catch((error) => {
                      createAlert(error.message, 'error')
                    })
                }}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <Input
                    type="text"
                    title="from"
                    placeholder="from name"
                    value={fromName}
                    containerStyle="col-span-1 md:col-span-2"
                    style="text-xs"
                    onChange={(e) => {
                      setFromName(e.target.value)
                    }}
                  />
                  <Input
                    type="email"
                    placeholder="from email"
                    value={fromEmail}
                    containerStyle="col-span-1 md:col-span-4"
                    style="text-xs"
                    onChange={(e) => {
                      setFromEmail(e.target.value)
                    }}
                  />
                  <Input
                    type="text"
                    title="to"
                    placeholder="to name"
                    value={toName}
                    containerStyle="col-span-1 md:col-span-2"
                    style="text-xs"
                    onChange={(e) => {
                      setToName(e.target.value)
                    }}
                  />
                  <Input
                    type="email"
                    placeholder="to email"
                    value={toEmail}
                    containerStyle="col-span-1 md:col-span-4"
                    style="text-xs"
                    onChange={(e) => {
                      setToEmail(e.target.value)
                    }}
                  />

                  <Input
                    type="text"
                    title="subject"
                    placeholder="subject"
                    value={subject}
                    containerStyle="col-span-1 md:col-span-6"
                    style="text-xs"
                    onChange={(e) => {
                      setSubject(e.target.value)
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-2 items-center flex-wrap">
                    {availableVariables.map((variable, index) => (
                      <Code
                        key={index}
                        title={`Insert ${variable} into message`}
                        onClick={() => {
                          const textArea = document?.getElementById(
                            'textarea-message'
                          ) as HTMLTextAreaElement
                          if (!textArea) return

                          const cursorPosition =
                            textArea.selectionStart || textArea.value.length

                          setMessage(
                            message.slice(0, cursorPosition) +
                              `{${variable}}` +
                              message.slice(cursorPosition)
                          )
                        }}>
                        {variable}
                      </Code>
                    ))}
                  </div>
                </div>
                <textarea
                  id="textarea-message"
                  placeholder="message"
                  className="textarea textarea-bordered textarea-lg h-36 w-full text-sm mb-4"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}></textarea>

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-neutral"
                    type="submit">
                    Send email
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title">Rendered email</h2>
              <div className="flex flex-col gap-4 mt-4">
                <Code style="col-span-6 break-words">
                  From: {fromName} &lt;{fromEmail}&gt;
                </Code>
                <Code style="col-span-6 break-words">
                  To: {toName} &lt;{toEmail}&gt;
                </Code>
                <Code style="col-span-6 break-words">Subject: {subject}</Code>
              </div>

              <div className="mt-8">
                <p className="whitespace-pre-wrap break-words">
                  {message
                    .replace(/{fromName}/g, fromName)
                    .replace(/{toName}/g, toName)
                    .replace(/{fromEmail}/g, fromEmail)
                    .replace(/{toEmail}/g, toEmail)
                    .replace(/{currentDate}/g, dayjs().format('YYYY-MM-DD'))
                    .replace(/{currentTime}/g, dayjs().format('HH:mm'))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="errors"
        className="fixed bottom-16 right-4 flex flex-col gap-4">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            text={alert.text}
            type={alert.type}
          />
        ))}
      </div>
      <Footer />
    </>
  )
}

export default Component

'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import axios from 'axios'
import * as yup from 'yup'
import Code from '@/components/Code'
import dayjs from 'dayjs'
import Footer from '@/components/Footer'
import Alert from '@/components/Alert'
import {
  ArrowLineLeft,
  ArrowLineRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Spinner,
  Envelope,
  SignIn
} from '@phosphor-icons/react'

import netlifyIdentity from 'netlify-identity-widget'
import GatedComponent from 'netlify-gated-components'
import NavBar from '@/components/NavBar'

function Component() {
  const [tempAPIKey, setTempAPIKey] = useState('')

  const [fromName, setFromName] = useState(
    process.env.NEXT_PUBLIC_RESEND_FROM_NAME || ''
  )
  const [fromEmail, setFromEmail] = useState(
    process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || ''
  )
  const [toName, setToName] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [contacts, setContacts] = useState('')
  const [guessNames, setGuessNames] = useState(true)
  const [currentContactIndex, setCurrentContactIndex] = useState(0)
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

  useEffect(() => {
    setCurrentContactIndex(0)
  }, [contacts])

  useEffect(() => {
    if (contacts) {
      try {
        const contactList = contacts.split(',').map((contact) => {
          return contact.trim()
        })
        if (guessNames) {
          const currentName = contactList[currentContactIndex]
          const guessedCurrentName = contactList[currentContactIndex]
            .replace(/[^a-zA-Z].*/g, '')
            .replace(/^\w/, (c) => c.toUpperCase())

          setToName(guessedCurrentName)
        } else {
          setToName('')
        }
        setToEmail(contactList[currentContactIndex])
      } catch (error) {
        setCurrentContactIndex(0)
      }
    } else {
      setToName('')
      setToEmail('')
    }
  }, [contacts, currentContactIndex, guessNames])

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
      .get('/api/send', {
        params: {
          fromName,
          fromEmail,
          toName,
          toEmail,
          subject,
          message,
          tempAPIKey
        }
      })
      .then((res) => {
        if (res.data.error) {
          console.error(res.data.error)
          createAlert(`Error: ${res.data.error.message}`, 'error')
          return
        }
        console.log(res.data)
        createAlert(`Email sent to: ${toEmail}`, 'success')
      })
      .catch((error) => {
        if (error.response.data.error) {
          console.error(error.response.data.error)
          createAlert(error.response.data.error, 'error')

          return
        } else {
          console.error(error)
          createAlert(`Error: ${error}`, 'error')
        }
      })
  }

  return (
    <>
      <NavBar />
      {/* <GatedComponent
        noAccessContent={
          <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
            <div className="card bg-base-100 shadow-xl w-full">
              <div className="card-body">
                <div className="flex flex-col gap-4 justify-between">
                  <h2 className="card-title">License</h2>
                  <div>
                    Please purchase a license to use this product for life, or
                    log in if you already have a license.
                  </div>
                  <div className="flex flex-row gap-8 justify-end flex-wrap items-center">
                    <a
                      className="font-bold cursor-pointer"
                      onClick={() => netlifyIdentity.open('signup')}>
                      Sign up
                    </a>
                    <a
                      className="font-bold cursor-pointer"
                      onClick={() => netlifyIdentity.open('login')}>
                      Log in
                    </a>
                    <Button
                      icon={<Check />}
                      type="button"
                      value="Buy license"
                      onClick={() => {
                        window.open(
                          'https://store.neontomo.com/l/cold-emailer-client?wanted=true'
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        netlifyIdentity={netlifyIdentity}>
      {/* </GatedComponent> */}
      <div className="mx-auto overflow-x-hidden py-32 p-8">
        <div className="card bg-base-100 shadow-xl w-full mb-4">
          <div className="card-body pb-4">
            <div className="flex flex-row gap-2 flex-wrap lg:flex-nowrap justify-end">
              <Input
                id="contacts-list"
                type="text"
                placeholder="Comma-separated list of emails (daisy@gmail.com, bobby@yahoo.com, meredith@aol.com, ...)"
                containerStyle="w-full"
                style="text-xs"
              />
              <Button
                type="button"
                value="Load contacts"
                icon={<Spinner />}
                onClick={() => {
                  const contactsList = document.getElementById(
                    'contacts-list'
                  ) as HTMLInputElement
                  contactsList.value = contactsList.value
                    .split(',')
                    .map((email) => email.trim())
                    .filter((email) => yup.string().email().isValidSync(email))
                    .filter(
                      (email, index, self) => self.indexOf(email) === index
                    )
                    .join(', ')
                    .replace(/, $/, '')
                  setContacts(contactsList.value)
                }}
              />
            </div>
            <div className="flex flex-row justify-end">
              <Input
                type="checkbox"
                defaultChecked={guessNames}
                onChange={(e) => {
                  setGuessNames(!guessNames)
                }}
                title="Guess names from emails"
                titleStyle="text-xs"
                style="checkbox-xs rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <div className="flex flex-row gap-2 justify-between">
                <h2 className="card-title items-center">
                  Compose email{' '}
                  <span className="text-xs text-gray-400">
                    {contacts &&
                      `(${currentContactIndex + 1} of ${
                        contacts.split(',').length
                      })`}
                  </span>
                </h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    iconSide="left"
                    icon={<ArrowLineLeft />}
                    which="secondary"
                    disabled={currentContactIndex === 0 || !contacts}
                    onClick={() => {
                      if (contacts) {
                        try {
                          const contactList = contacts
                            .split(',')
                            .map((contact) => {
                              return contact.trim()
                            })

                          setCurrentContactIndex(0)
                        } catch (error) {
                          console.log(error)
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    iconSide="left"
                    icon={<ArrowLeft />}
                    which="secondary"
                    disabled={currentContactIndex === 0 || !contacts}
                    onClick={() => {
                      if (contacts) {
                        try {
                          const contactList = contacts
                            .split(',')
                            .map((contact) => {
                              return contact.trim()
                            })

                          if (currentContactIndex > 0) {
                            setCurrentContactIndex(currentContactIndex - 1)
                          }
                        } catch (error) {
                          setCurrentContactIndex(0)
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    iconSide="right"
                    icon={<ArrowRight />}
                    which="secondary"
                    disabled={
                      currentContactIndex === contacts.split(',').length - 1 ||
                      !contacts
                    }
                    onClick={() => {
                      if (contacts) {
                        try {
                          const contactList = contacts
                            .split(',')
                            .map((contact) => {
                              return contact.trim()
                            })

                          if (currentContactIndex < contactList.length - 1) {
                            setCurrentContactIndex(currentContactIndex + 1)
                          }
                        } catch (error) {
                          setCurrentContactIndex(0)
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    iconSide="right"
                    icon={<ArrowLineRight />}
                    which="secondary"
                    disabled={
                      currentContactIndex === contacts.split(',').length - 1 ||
                      !contacts
                    }
                    onClick={() => {
                      if (contacts) {
                        try {
                          const contactList = contacts
                            .split(',')
                            .map((contact) => {
                              return contact.trim()
                            })

                          setCurrentContactIndex(contactList.length - 1)
                        } catch (error) {
                          console.log(error)
                        }
                      }
                    }}
                  />
                </div>
              </div>
              {contacts && (
                <div className="flex flex-row gap-2 flex-wrap">
                  {contacts.split(', ').map((contact, index) => (
                    <Code
                      key={index}
                      style={
                        currentContactIndex === index
                          ? 'bg-secondary text-white hover:bg-secondary'
                          : ''
                      }
                      onClick={() => {
                        setCurrentContactIndex(index)
                      }}>
                      {contact}
                    </Code>
                  ))}
                </div>
              )}
              <form
                className="flex flex-col gap-4 my-4"
                onSubmit={(e) => {
                  e.preventDefault()

                  const schema = yup.object().shape({
                    fromName: yup.string().trim().required().min(1).max(100),
                    fromEmail: yup
                      .string()
                      .email()
                      .trim()
                      .required()
                      .min(5)
                      .max(200),
                    toName: yup.string().trim().max(100),
                    toEmail: yup
                      .string()
                      .email()
                      .trim()
                      .required()
                      .min(5)
                      .max(200),
                    subject: yup.string().trim().required().max(200),
                    message: yup.string().trim().required().max(5000)
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
                    id="fromName"
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
                    id="fromEmail"
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
                    id="toName"
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
                    id="toEmail"
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
                    id="subject"
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
                  className="textarea textarea-bordered rounded-xl textarea-lg h-36 w-full text-sm mb-4"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}></textarea>

                <div className="card-actions justify-end">
                  <Input
                    type="text"
                    placeholder="API key (not saved)"
                    containerStyle="flex-grow"
                    style="text-xs"
                    value={tempAPIKey}
                    onChange={(e) => {
                      setTempAPIKey(e.target.value)
                    }}
                  />
                  <Button
                    type="submit"
                    which="warning"
                    iconSide="left"
                    icon={<Envelope />}
                    disabled={
                      !fromName ||
                      !fromEmail ||
                      !toEmail ||
                      !subject ||
                      !message
                    }
                    value={
                      toEmail
                        ? `Send email to ${toEmail.replace(/[^a-zA-Z].*/g, '')}`
                        : 'Send email'
                    }
                  />
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

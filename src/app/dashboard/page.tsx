/* TODO:
- FIX REPLY TO EMAIL
- Fix save new user fullname
- save buttons on settings instead of on input
- batch send
- styling
- landing page details, maybe video
- new landing page image
- csv upload
- csv download
- send to yourself button
- rename project everywhere
- check pricing
- pricing page
- compare with shipfa.st
- documentation/get started page
- features list more complete
- remove local only copy
- replace <img> with Image component
- default value if a variable is not found but used: {toName || 'friend'}
- batch emails dont work, they dont update toEmail and other fields
- support variables in subject line and update help text
- add reply to field to rendered email section
*/

'use client'
import React from 'react'
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
  Spinner,
  Envelope,
  Skull,
  File,
  Upload
} from '@phosphor-icons/react'

import netlifyIdentity from 'netlify-identity-widget'
import GatedComponent from 'netlify-gated-components'
import NavBar from '@/components/NavBar'
import { checkLicenseAsync } from '@/utils/checkLicense'
import LoginScreen from '../loginscreen/page'
import { availableVariables } from '@/components/Code'
import { getSettings, getTemplate } from '@/utils/template'
import Loading from '@/components/Loading'

function Component() {
  const [resendAPIKey, setResendAPIKey] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [licensedUser, setLicensedUser] = useState(false)
  const [scrolledTop, setScrolledTop] = useState(false)

  const [loadingSettings, setLoadingSettings] = useState(true)
  const [loadingTemplate, setLoadingTemplate] = useState(true)

  const [fromName, setFromName] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [toName, setToName] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [contacts, setContacts] = useState('')
  const [guessNames, setGuessNames] = useState(true)
  const [currentContactIndex, setCurrentContactIndex] = useState(0)
  const [subject, setSubject] = useState(
    process.env.NEXT_PUBLIC_RESEND_SUBJECT || ''
  )

  const [message, setMessage] = useState(
    `Hi, {toName}!\n\nI hope you're doing well. I'm {fromName}, and I help businesses like yours get more customers.\n\nI'd love to learn more about your business and see if I can help you grow.\n\nDo you have time for a quick chat this week?\n\nKind regards,\n{fromName}`
  )

  const [shouldSubmit, setShouldSubmit] = useState(false)
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

  const handleFormSubmit = () => {
    const schema = yup.object().shape({
      fromName: yup.string().trim().required().min(1).max(100),
      fromEmail: yup.string().email().trim().required().min(5).max(200),
      toName: yup.string().trim().max(100),
      toEmail: yup.string().email().trim().required().min(5).max(200),
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
        handleSendEmail({ toEmail })
      })
      .catch((error) => {
        createAlert(error.message, 'error')
      })
  }

  const handleSendEmail = async ({ toEmail }: { toEmail: string }) => {
    const paramObject = {
      fromName,
      fromEmail,
      toName: toName || 'friend',
      toEmail,
      replyTo,
      subject,
      message,
      resendAPIKey
    }

    console.log('paramObject', paramObject)

    await axios
      .get('/api/send', {
        params: paramObject
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

  useEffect(() => {
    netlifyIdentity.init()
    if (netlifyIdentity.currentUser()) {
      setLoggedIn(true)

      getSettings().then((data) => {
        setResendAPIKey(data.resendAPIKey)
        setFromName(data.fromName)
        setFromEmail(data.fromEmail)
        setReplyTo(data.replyTo || data.fromEmail)
        setLoadingSettings(false)
      })

      getTemplate().then((data) => {
        if (data.subject) {
          setSubject(data.subject)
        }
        if (data.message) {
          setMessage(data.message)
        }
        setLoadingTemplate(false)
      })
    }

    checkLicenseAsync({}).then((result) => {
      setLicensedUser(result)
    })
  }, [netlifyIdentity])

  setTimeout(() => {
    if (!scrolledTop) {
      window.scrollTo(0, 0)
      setScrolledTop(true)
    }
  }, 300)

  useEffect(() => {
    if (shouldSubmit) {
      handleFormSubmit()
      setShouldSubmit(false)
    }
  }, [toName, toEmail, subject, message])

  return (
    <>
      <NavBar />
      <GatedComponent
        netlifyIdentity={netlifyIdentity}
        noAccessContent={
          <LoginScreen
            netlifyIdentity={netlifyIdentity}
            loggedIn={loggedIn}
          />
        }>
        {!licensedUser && (
          <LoginScreen
            netlifyIdentity={netlifyIdentity}
            loggedIn={loggedIn}
          />
        )}

        {licensedUser && (
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
                        .filter((email) =>
                          yup.string().email().isValidSync(email)
                        )
                        .filter(
                          (email, index, self) => self.indexOf(email) === index
                        )
                        .join(', ')
                        .replace(/, $/, '')
                      setContacts(contactsList.value)
                    }}
                  />
                  <Button
                    type="button"
                    value="Upload CSV"
                    icon={<Upload />}
                    onClick={() => {
                      alert('Not implemented yet')
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-xl w-full">
                <div className="card-body">
                  <div className="flex flex-row gap-x-8 justify-start items-center flex-wrap">
                    <h2 className="card-title items-center mx-auto">
                      Compose email
                    </h2>

                    <div className="hidden md:flex gap-2 flex-grow justify-end items-center">
                      <span className="text-xs text-gray-400 mr-4">
                        {contacts &&
                          `(${currentContactIndex + 1} of ${
                            contacts.split(',').length
                          })`}
                      </span>
                      <Button
                        type="button"
                        size="xs"
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
                        size="xs"
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
                        size="xs"
                        iconSide="right"
                        icon={<ArrowRight />}
                        which="secondary"
                        disabled={
                          currentContactIndex ===
                            contacts.split(',').length - 1 || !contacts
                        }
                        onClick={() => {
                          if (contacts) {
                            try {
                              const contactList = contacts
                                .split(',')
                                .map((contact) => {
                                  return contact.trim()
                                })

                              if (
                                currentContactIndex <
                                contactList.length - 1
                              ) {
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
                        size="xs"
                        iconSide="right"
                        icon={<ArrowLineRight />}
                        which="secondary"
                        disabled={
                          currentContactIndex ===
                            contacts.split(',').length - 1 || !contacts
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
                    <div className="flex flex-row mt-4 gap-2 flex-wrap contact-buttons">
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
                  {loadingSettings || loadingTemplate ? (
                    <div className="flex justify-center items-center h-full">
                      <Loading />
                    </div>
                  ) : (
                    <form
                      id="email-form"
                      className="flex flex-col gap-4 my-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleFormSubmit()
                      }}>
                      <div className="flex flex-row justify-end">
                        <Input
                          type="checkbox"
                          defaultChecked={guessNames}
                          onChange={(e) => {
                            setGuessNames(!guessNames)
                          }}
                          title="Guess names from emails"
                          titleStyle="text-xs text-gray-400"
                          style="checkbox-xs rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <Input
                          id="toName"
                          type="text"
                          title="to"
                          placeholder="to name"
                          value={toName}
                          containerStyle="col-span-1 lg:col-span-3"
                          style="text-xs"
                          help="This is the name of the person you are sending the email to."
                          onChange={(e) => {
                            setToName(e.target.value)
                          }}
                        />
                        <Input
                          id="toEmail"
                          type="email"
                          placeholder="to email"
                          value={toEmail}
                          containerStyle="col-span-1 lg:col-span-3"
                          style="text-xs"
                          help="This is the email of the person you are sending the email to."
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
                          containerStyle="col-span-1 lg:col-span-6"
                          style="text-xs"
                          help="This is the subject of the email. It does not support variables."
                          onChange={(e) => {
                            setSubject(e.target.value)
                          }}
                        />
                      </div>
                      <div>
                        <textarea
                          id="textarea-message"
                          placeholder="message"
                          className="textarea textarea-bordered rounded-xl textarea-lg h-56 w-full text-sm mb-4"
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value)
                          }}></textarea>

                        <div className="flex gap-2 flex-col">
                          <span className="text-sm font-bold">
                            Available variables:
                          </span>
                          <div className="flex flex-row gap-2 flex-wrap">
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
                                    textArea.selectionStart ||
                                    textArea.value.length

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
                      </div>
                      <div className="card-actions justify-end">
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
                              ? `Send email to ${toEmail.replace(
                                  /[^a-zA-Z].*/g,
                                  ''
                                )}`
                              : 'Send email'
                          }
                        />
                        <Button
                          iconSide="left"
                          icon={<Skull />}
                          type="button"
                          which="danger"
                          value="Batch send"
                          onClick={() => {
                            const areYouSure = prompt(
                              'Are you sure you want to batch send?\n\nThis will send an email to each contact in the list, one by one, with the same message template and subject.\n\nThere is a delay of 2 seconds between each email. Enter "yes" to confirm.',
                              ''
                            )
                            if (areYouSure === 'yes') {
                              const contactList = contacts
                                .split(',')
                                .map((contact) => {
                                  return contact.trim()
                                })

                              contactList.forEach((contact, index) => {
                                setTimeout(() => {
                                  setCurrentContactIndex(index)
                                  setShouldSubmit(true)
                                }, 2000 * index)
                              })
                            }
                          }}
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl w-full">
                <div className="card-body">
                  <h2 className="card-title">Rendered email</h2>
                  {loadingSettings || loadingTemplate ? (
                    <div className="flex justify-center items-center h-full">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 mt-4">
                        <Code
                          errorCondition={!fromName?.trim()}
                          style={`col-span-6 break-words`}>
                          From: {fromName?.trim()} &lt;{fromEmail?.trim()}&gt;
                        </Code>
                        <Code
                          errorCondition={!replyTo?.trim()}
                          style={`col-span-6 break-words`}>
                          Reply to: {fromName?.trim()} &lt;
                          {replyTo?.trim()}&gt;
                        </Code>
                        <Code
                          errorCondition={!toEmail?.trim()}
                          style={`col-span-6 break-words`}>
                          To: {toName?.trim() || 'friend'} &lt;
                          {toEmail?.trim() || 'EMAIL MISSING'}&gt;
                        </Code>
                        <Code
                          errorCondition={!subject?.trim()}
                          style={`col-span-6 break-words`}>
                          Subject: {subject}
                        </Code>
                      </div>
                      <div className="mt-8">
                        <p className="whitespace-pre-wrap break-words">
                          {message
                            .replace(/{fromName}/g, fromName?.trim())
                            .replace(
                              /{fromFirstName}/g,
                              fromName?.trim()?.split(' ')?.[0]
                            )
                            .replace(/{toName}/g, toName?.trim() || 'friend')
                            .replace(/{fromEmail}/g, fromEmail?.trim())
                            .replace(/{toEmail}/g, toEmail?.trim())
                            .replace(
                              /{currentDate}/g,
                              dayjs().format('YYYY-MM-DD')
                            )
                            .replace(/{currentTime}/g, dayjs().format('HH:mm'))}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </GatedComponent>
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

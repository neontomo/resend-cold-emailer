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
  Check,
  Spinner,
  Envelope,
  Ticket,
  Skull,
  ArrowUpRight
} from '@phosphor-icons/react'

import netlifyIdentity from 'netlify-identity-widget'
import GatedComponent from 'netlify-gated-components'
import NavBar from '@/components/NavBar'
import {
  addCustomDataToUser,
  checkLicenseKeyWithGumroad,
  getCustomDataFromUser,
  validLicenseKeyFormat
} from '@/utils/checkLicense'

function Component() {
  const [tempAPIKey, setTempAPIKey] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [licensedUser, setLicensedUser] = useState(false)
  const [scrolledTop, setScrolledTop] = useState(false)

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

  const availableVariables = [
    'fromName',
    'toName',
    'fromEmail',
    'toEmail',
    'currentDate',
    'currentTime'
  ]

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
      toName,
      toEmail,
      replyTo: replyTo ? replyTo : fromEmail,
      subject,
      message,
      tempAPIKey
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

  const checkLicenseAsync = async ({
    licenseKey
  }: {
    licenseKey?: string | undefined
  }) => {
    if (!licenseKey) {
      const licenseKeyFromUser = await getCustomDataFromUser('licenseKey')
      const validLicense = await checkLicenseKeyWithGumroad(licenseKeyFromUser)

      setLicensedUser(validLicense ? true : false)
      return validLicense
    } else {
      const validLicense = await checkLicenseKeyWithGumroad(licenseKey)

      setLicensedUser(validLicense ? true : false)
      return validLicense
    }
  }

  const addLicenseToUser = async () => {
    const licenseKeyElement = document.getElementById(
      'license-key'
    ) as HTMLInputElement

    const licenseKey = licenseKeyElement?.value

    if (!licenseKeyElement || !licenseKey) {
      createAlert('Please enter a license key', 'error')
      return
    }

    if (!validLicenseKeyFormat(licenseKey)) {
      createAlert('Invalid license key format', 'error')
      return
    }

    const isGoodLicense = await checkLicenseAsync({ licenseKey })

    if (isGoodLicense) {
      addCustomDataToUser({ data: { licenseKey: licenseKey } })
      setLicensedUser(true)
      createAlert('License key added', 'success')
    } else {
      createAlert('License key invalid', 'error')
    }
  }

  const saveTemplate = async () => {
    const dataObject = {
      subject,
      message,
      resendAPIKey: tempAPIKey,
      replyTo: replyTo
    }

    console.log('dataObject', dataObject)

    addCustomDataToUser({
      data: dataObject
    })

    createAlert('Template saved', 'success')
  }

  const getTemplate = async () => {
    const subject = await getCustomDataFromUser('subject')
    const message = await getCustomDataFromUser('message')

    if (subject) {
      setSubject(subject)
    }
    if (message) {
      setMessage(message)
    }
  }

  const getSettings = async () => {
    const resendAPIKey = await getCustomDataFromUser('resendAPIKey')
    const replyTo = await getCustomDataFromUser('replyTo')

    if (resendAPIKey) {
      setTempAPIKey(resendAPIKey)
    }
    if (replyTo) {
      setReplyTo(replyTo)
    }
  }

  useEffect(() => {
    netlifyIdentity.init()
    if (netlifyIdentity.currentUser()) {
      setLoggedIn(true)
      setFromEmail(netlifyIdentity.currentUser()?.email || '')
      setFromName(netlifyIdentity.currentUser()?.user_metadata?.full_name || '')
    }

    checkLicenseAsync({})

    getSettings()
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

  const noAccessComponent = (
    <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full">
        <div className="card-body">
          <div className="flex flex-col gap-4 justify-between">
            <h2 className="card-title">
              {loggedIn ? '🎟️ Buy license' : '🔒 No Access'}
            </h2>
            <div>
              {loggedIn ? (
                <div className="text-lg">
                  Please buy a license to use this tool. Licenses are valid for
                  life.
                </div>
              ) : (
                <div className="text-lg">
                  Please register or log in to purchase a license. Licenses are
                  valid for life.
                </div>
              )}
            </div>
            {loggedIn ? (
              <div className="flex flex-col flex-wrap justify-end w-full gap-4">
                <div className="flex flex-row flex-wrap justify-end w-full gap-4">
                  <Button
                    icon={<Ticket />}
                    type="button"
                    value="Buy license"
                    which="primary"
                    onClick={() => {
                      window.open(
                        'https://store.neontomo.com/l/cold-emailer-client?wanted=true'
                      )
                    }}
                  />
                </div>
                <div className="flex flex-row flex-wrap justify-end w-full gap-4">
                  <Input
                    id="license-key"
                    type="text"
                    placeholder="License key"
                    containerStyle="flex-grow"
                  />
                  <Button
                    icon={<Check />}
                    type="button"
                    which="light"
                    value="Verify license"
                    onClick={() => addLicenseToUser()}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-8 justify-end flex-wrap items-center">
                <Button
                  icon={<Check />}
                  type="button"
                  value="Sign up / Log in"
                  onClick={() => netlifyIdentity.open('signup')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <NavBar />
      <GatedComponent
        netlifyIdentity={netlifyIdentity}
        noAccessContent={noAccessComponent}>
        {!licensedUser && noAccessComponent}

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
                </div>
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
                  <form
                    id="email-form"
                    className="flex flex-col gap-4 my-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleFormSubmit()
                    }}>
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
                    <div className="flex flex-col gap-4 mt-4">
                      <h5>Variables</h5>

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
                      className="textarea textarea-bordered rounded-xl textarea-lg h-56 w-full text-sm mb-4"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                      }}></textarea>

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
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl w-full">
                <div className="card-body">
                  <h2 className="card-title">Rendered email</h2>
                  <div className="flex flex-col gap-4 mt-4">
                    <Code
                      errorCondition={!fromName.trim()}
                      style={`col-span-6 break-words`}>
                      From: {fromName?.trim()} &lt;{fromEmail?.trim()}&gt;
                    </Code>
                    <Code
                      errorCondition={!toEmail.trim()}
                      style={`col-span-6 break-words`}>
                      To: {toName?.trim()} &lt;{toEmail?.trim()}&gt;
                    </Code>
                    <Code
                      errorCondition={!subject.trim()}
                      style={`col-span-6 break-words`}>
                      Subject: {subject}
                    </Code>
                  </div>

                  <div className="mt-8">
                    <p className="whitespace-pre-wrap break-words">
                      {message
                        .replace(/{fromName}/g, fromName?.trim())
                        .replace(/{toName}/g, toName?.trim() || 'friend')
                        .replace(/{fromEmail}/g, fromEmail?.trim())
                        .replace(/{toEmail}/g, toEmail?.trim())
                        .replace(/{currentDate}/g, dayjs().format('YYYY-MM-DD'))
                        .replace(/{currentTime}/g, dayjs().format('HH:mm'))}
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="settings"
                className="card bg-base-100 shadow-xl w-full">
                <div className="card-body">
                  <h2 className="card-title mb-4">Settings</h2>

                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <h5>Resend API settings</h5>
                      <span className="text-xs text-gray-400 flex flex-row">
                        Get key from{' '}
                        <a
                          href="https://resend.com/signup"
                          className="text-blue-500 ml-1">
                          <span className="flex flex-row items-center gap-1">
                            resend.com
                            <ArrowUpRight />
                          </span>
                        </a>
                      </span>
                      <div className="flex flex-row gap-2">
                        <Input
                          id="tempAPIKey"
                          type="text"
                          placeholder="Resend API key"
                          value={tempAPIKey}
                          containerStyle="flex-grow"
                          style="text-xs"
                          help="This is the API key that will be used to send the email. You can get this from the API page on the Resend.com website."
                          onChange={(e) => {
                            setTempAPIKey(e.target.value)
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h5>
                        Template settings
                        <span className="text-xs text-gray-400 ml-2">
                          (subject, message)
                        </span>
                      </h5>
                      <div className="flex flex-row gap-2">
                        <Button
                          type="button"
                          value="Load template"
                          which="light"
                          onClick={getTemplate}
                        />
                        <Button
                          type="button"
                          value="Save template"
                          which="light"
                          onClick={saveTemplate}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h5>Your details</h5>
                      <span className="text-xs text-gray-400">
                        This info will be used to send the email. Please be sure
                        that your email is set up to allow incoming emails,
                        otherwise add a different email in the reply to field.
                      </span>
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <Input
                          id="fromName"
                          type="text"
                          title="from"
                          placeholder="from name"
                          value={fromName}
                          containerStyle="col-span-1 lg:col-span-6"
                          style="text-xs"
                          help="This name will be used to send the email."
                          onChange={(e) => {
                            setFromName(e.target.value)
                          }}
                        />
                        <Input
                          id="fromEmail"
                          type="email"
                          placeholder="from email"
                          value={fromEmail}
                          containerStyle="col-span-1 lg:col-span-3"
                          style="text-xs"
                          help="This email will be used to send the email. If your email is not set up to allow incoming emails, you can enter a different email in the reply to field."
                          onChange={(e) => {
                            setFromEmail(e.target.value)
                          }}
                        />
                        <Input
                          id="replyTo"
                          type="email"
                          placeholder="reply to email"
                          value={replyTo}
                          containerStyle="col-span-1 lg:col-span-3"
                          style="text-xs"
                          help="This email will be used as the reply-to email. If your email is not set up to allow incoming emails, you can enter a different email here, or the same email as the from email if you want replies to go to the same email."
                          onChange={(e) => {
                            setReplyTo(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                    {/*  */}
                  </div>
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

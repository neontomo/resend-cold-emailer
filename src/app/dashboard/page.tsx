/* TODO:
- FIX REPLY TO EMAIL
- penguin emailer
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
- default value if a variable is not found but used: {toName || 'friend'}
- batch emails dont work, they dont update toEmail and other fields
- support variables in subject line and update help text
- add reply to field to rendered email section
*/

'use client'
import React, { useCallback } from 'react'
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
import NavBar from '@/components/NavBar'
import { getMultipleCustomDataFromUser } from '@/utils/netlifyIdentity/user'
import { LoginScreen, BuyLicense } from '@/components/LoginScreen'
import { getSettings, getTemplate } from '@/utils/settings'
import { checkLoggedIn } from '@/utils/netlifyIdentity/tokens'
import { checkLicense } from '@/utils/gumroad/license'
import Composer from '@/components/dashboard/Composer'
import Rendered from '@/components/dashboard/Rendered'
import ContactLoader from '@/components/dashboard/ContactLoader'

const GatedComponent = ({
  loggedIn,
  noAccessContent,
  children
}: {
  loggedIn: boolean
  noAccessContent: React.ReactNode
  children: React.ReactNode
}) => {
  return loggedIn ? <>{children}</> : <>{noAccessContent}</>
}

function Component() {
  const [resendAPIKey, setResendAPIKey] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')
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

  const getAllSettings = useCallback(() => {
    getSettings().then((data) => {
      if (!data || !data.resendAPIKey || !data.fromName || !data.fromEmail) {
        window && window.location.replace('/settings')
        return
      }
      setResendAPIKey(data.resendAPIKey)
      setFromName(data.fromName)
      setFromEmail(data.fromEmail)
      setReplyTo(data.replyTo || data.fromEmail)
      setLoadingSettings(false)
    })

    getTemplate().then((data) => {
      if (!data) return

      if (data.subject) {
        setSubject(data.subject)
      }
      if (data.message) {
        setMessage(data.message)
      }
      setLoadingTemplate(false)
    })
  }, [])

  async function checks() {
    if (!loadingSettings) return
    const loginState = await checkLoggedIn()
    if (!loginState) return

    setLoggedIn(loginState)

    const isValidLicense = await checkLicense({})
    setLicensedUser(isValidLicense)

    const license = await getMultipleCustomDataFromUser(['licenseKey']).then(
      (data) => {
        return data.licenseKey
      }
    )
    setLicenseKey(license)

    setLoadingSettings(false)
  }

  useEffect(() => {
    if (loggedIn && licensedUser) {
      getAllSettings()
    }
  }, [loggedIn, licensedUser])

  useEffect(() => {
    checks()
  }, [])

  const createAlert = useCallback(
    (text: string, type: string) => {
      setAlerts([{ text, type }, ...alerts])
    },
    [alerts]
  )

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

  const handleSendEmail = useCallback(
    async ({ toEmail }: { toEmail: string }) => {
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
    },
    [
      fromName,
      fromEmail,
      toName,
      replyTo,
      subject,
      message,
      resendAPIKey,
      createAlert
    ]
  )

  const handleFormSubmit = useCallback(() => {
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
  }, [
    fromName,
    fromEmail,
    toName,
    toEmail,
    subject,
    message,
    handleSendEmail,
    createAlert
  ])

  useEffect(() => {
    setTimeout(() => {
      if (!scrolledTop) {
        if (window) {
          window.scrollTo(0, 0)
          setScrolledTop(true)
        }
      }
    }, 300)
  }, [scrolledTop])

  useEffect(() => {
    if (shouldSubmit) {
      handleFormSubmit()
      setShouldSubmit(false)
    }
  }, [toName, toEmail, subject, message, handleFormSubmit, shouldSubmit])

  return (
    <>
      <NavBar netlifyIdentity={netlifyIdentity} />
      <GatedComponent
        loggedIn={loggedIn}
        noAccessContent={<LoginScreen />}>
        {!licensedUser && <BuyLicense />}
        {licensedUser && (
          <div className="mx-auto overflow-x-hidden py-32 p-8 flex flex-col gap-8">
            <ContactLoader
              contacts={contacts}
              currentContactIndex={currentContactIndex}
              setContacts={setContacts}
              setCurrentContactIndex={setCurrentContactIndex}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Composer
                loadingSettings={loadingSettings}
                loadingTemplate={loadingTemplate}
                settings={{
                  contacts,
                  fromName,
                  fromEmail,
                  replyTo,
                  toName,
                  toEmail,
                  subject,
                  message,
                  resendAPIKey,
                  guessNames
                }}
                setCurrentContactIndex={setCurrentContactIndex}
                setShouldSubmit={setShouldSubmit}
                setGuessNames={setGuessNames}
                handleFormSubmit={handleFormSubmit}
                setToName={setToName}
                setToEmail={setToEmail}
                setSubject={setSubject}
                setMessage={setMessage}
              />

              <Rendered
                key={`rendered-${currentContactIndex}`}
                loadingSettings={loadingSettings}
                loadingTemplate={loadingTemplate}
                settings={{
                  contacts,
                  fromName,
                  fromEmail,
                  replyTo,
                  toName,
                  toEmail,
                  subject,
                  message,
                  resendAPIKey,
                  guessNames
                }}
              />
            </div>
          </div>
        )}
      </GatedComponent>
      <div
        id="errors"
        className="fixed bottom-16 right-4 flex flex-col gap-4">
        {alerts.map((alert, index) => (
          <Alert
            key={`error-${index}`}
            text={alert.text}
            type={alert.type}
          />
        ))}
      </div>
    </>
  )
}

export default Component

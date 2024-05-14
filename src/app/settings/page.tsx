'use client'

import { ArrowUpRight } from '@phosphor-icons/react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useEffect, useState } from 'react'
import {
  saveTemplate,
  getTemplate,
  saveSettings,
  getSettings
} from '@/utils/template'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Code from '@/components/Code'
import { availableVariables } from '@/components/Code'
import HelpComponent from '@/components/HelpComponent'
import Loading from '@/components/Loading'

export default function Settings() {
  const [resendAPIKey, setResendAPIKey] = useState('')
  const [fromName, setFromName] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [subject, setSubject] = useState(
    process.env.NEXT_PUBLIC_RESEND_SUBJECT || ''
  )
  const [message, setMessage] = useState(
    process.env.NEXT_PUBLIC_RESEND_MESSAGE || ''
  )
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [loadingTemplate, setLoadingTemplate] = useState(true)

  const handleSaveSettings = async () => {
    const data = await saveSettings({
      resendAPIKey,
      fromName,
      fromEmail,
      replyTo
    })
    if (data) {
      alert('Settings saved')
    } else {
      alert('Error saving settings')
    }
  }

  const handleSaveTemplate = async () => {
    const data = await saveTemplate({ subject, message })
    if (data) {
      alert('Template saved')
    } else {
      alert('Error saving template')
    }
  }

  useEffect(() => {
    getSettings().then((data) => {
      setResendAPIKey(data.resendAPIKey)
      setFromName(data.fromName)
      setFromEmail(data.fromEmail)
      setReplyTo(data.replyTo)
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
  }, [])

  const SettingsComponent = (
    <div
      id="settings"
      className="card bg-base-100 shadow-xl w-full">
      <div className="card-body">
        <h2 className="card-title mb-4">Settings</h2>
        {loadingSettings ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h5>Resend API settings</h5>
              <span className="text-xs text-gray-400 flex flex-row">
                Get key from{' '}
                <a
                  href="https://resend.com/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 ml-1">
                  <span className="flex flex-row items-center gap-1">
                    resend.com
                    <ArrowUpRight />
                  </span>
                </a>
              </span>
              <div className="flex flex-row gap-2">
                <Input
                  id="resendAPIKey"
                  type="text"
                  placeholder="Resend API key"
                  value={resendAPIKey || ''}
                  containerStyle="flex-grow"
                  style="text-xs"
                  help="This is the API key that will be used to send the email. You can get this from the API page on the Resend.com website."
                  onChange={(e) => {
                    setResendAPIKey(e.target.value)
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h5>Your details</h5>
              <span className="text-xs text-gray-400">
                This info will be used to send the email. Please be sure that
                your email is set up to allow incoming emails, otherwise add a
                different email in the reply to field.
              </span>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <Input
                  id="fromName"
                  type="text"
                  title="from"
                  placeholder="from name"
                  value={fromName || ''}
                  containerStyle="col-span-1 lg:col-span-6"
                  style="text-xs"
                  help="This name will be used to send the email."
                  helpDirection="bottom"
                  onChange={(e) => {
                    setFromName(e.target.value)
                  }}
                />
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="from email"
                  value={fromEmail || ''}
                  containerStyle="col-span-1 lg:col-span-3"
                  style="text-xs"
                  help="This email will be used to send the email. If your email is not set up to allow incoming emails, you can enter a different email in the reply to field."
                  helpDirection="bottom"
                  onChange={(e) => {
                    setFromEmail(e.target.value)
                  }}
                />
                <Input
                  id="replyTo"
                  type="email"
                  placeholder="reply to email"
                  value={replyTo || ''}
                  containerStyle="col-span-1 lg:col-span-3"
                  style="text-xs"
                  help="This email will be used as the reply-to email. If your email is not set up to allow incoming emails, you can enter a different email here, or the same email as the from email if you want replies to go to the same email."
                  helpDirection="bottom"
                  onChange={(e) => {
                    setReplyTo(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="card-actions justify-end items-end flex-grow">
          <Button
            type="button"
            value="Save settings"
            which="primary"
            onClick={() => {
              handleSaveSettings()
            }}
          />
        </div>
      </div>
    </div>
  )

  const templateSettingsComponent = (
    <div
      id="template-settings"
      className="card bg-base-100 shadow-xl w-full">
      <div className="card-body">
        <h2 className="card-title mb-4">Template settings</h2>
        {loadingTemplate ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2 mt-4 items-center">
                <h5>Subject</h5>
                <HelpComponent
                  help="This is the subject of the email. It does not support variables."
                  direction="right"
                />
              </div>
              <div>
                <Input
                  id="subject"
                  type="text"
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
              <div className="flex flex-row gap-2 mt-4 items-center">
                <h5>Message</h5>
                <HelpComponent
                  help="This is the body of the email. You can use variables to personalise the email, they are rendered as the email is sent."
                  direction="right"
                />
              </div>
              <div>
                <textarea
                  id="textarea-message"
                  placeholder="message"
                  className="textarea textarea-bordered rounded-xl textarea-lg h-56 w-full text-sm mb-2"
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
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  type="button"
                  value="Save template"
                  onClick={() => {
                    handleSaveTemplate()
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <NavBar />
      <div className="mx-auto overflow-x-hidden py-32 p-8">
        <div className="card bg-base-100 shadow-xl w-full mb-4">
          <div className="card-body">
            <h1 className="card-title">Settings</h1>
            <div>
              To use this service you need to set up your settings. The minimum
              required settings are:
              <div className="flex flex-row gap-2 mt-4">
                <Code>Resend API key</Code>
                <Code>From name</Code>
                <Code>From email</Code>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SettingsComponent}
          {templateSettingsComponent}
        </div>
      </div>
      <Footer />
    </>
  )
}

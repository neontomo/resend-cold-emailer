import { availableVariables } from '@/components/Code'
import HelpComponent from '@/components/HelpComponent'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Code from '@/components/Code'
import { useState } from 'react'
import { getTemplate, saveTemplate } from '@/utils/settings'
import Loading from '@/components/Loading'
import Card from '@/components/Card'

export function TemplateSettings({ userID }: { userID: string }) {
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [subject, setSubject] = useState(
    process.env.NEXT_PUBLIC_RESEND_SUBJECT || ''
  )
  const [message, setMessage] = useState(
    process.env.NEXT_PUBLIC_RESEND_MESSAGE || ''
  )

  const handleSaveTemplate = async () => {
    const data = await saveTemplate({ subject, message })
    if (data) {
      alert('Template saved')
    } else {
      alert('Error saving template')
    }
  }

  if (loadingSettings) {
    getTemplate().then((data) => {
      if (data.subject) {
        setSubject(data.subject)
      }
      if (data.message) {
        setMessage(data.message)
      }
      setLoadingSettings(false)
    })
  }

  return (
    <Card
      key={`template-settings-${userID}`}
      title="Template settings"
      actions={
        <Button
          type="button"
          value="Save template"
          onClick={() => {
            handleSaveTemplate()
          }}
        />
      }>
      {loadingSettings && <Loading />}
      {!loadingSettings && (
        <>
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-bold text-sm">Subject</span>
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
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-bold text-sm">Message</span>
                    <HelpComponent
                      help="This is the body of the email. You can use variables to personalise the email, they are rendered as the email is sent."
                      direction="right"
                    />
                  </div>
                  <div>
                    <textarea
                      id="textarea-message"
                      placeholder="message"
                      className="textarea textarea-bordered rounded-xl textarea-lg h-56 w-full text-xs mb-2"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                      }}></textarea>

                    <div className="flex gap-2 flex-col">
                      <span className="font-bold text-sm">
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
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </Card>
  )
}

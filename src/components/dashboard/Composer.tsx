import Loading from '@/components/Loading'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Code, { availableVariables } from '@/components/Code'
import { Envelope } from '@phosphor-icons/react'
import { Skull } from '@phosphor-icons/react'
import Card from '@/components/Card'

function Composer({
  loadingSettings,
  loadingTemplate,
  settings,
  setCurrentContactIndex,
  setShouldSubmit,
  setGuessNames,
  handleFormSubmit,
  setToName,
  setToEmail,
  setSubject,
  setMessage
}: {
  loadingSettings: boolean
  loadingTemplate: boolean
  settings: {
    contacts: string
    fromName: string
    fromEmail: string
    replyTo: string
    toName: string
    toEmail: string
    subject: string
    message: string
    resendAPIKey: string
    guessNames: boolean
  }
  setCurrentContactIndex: (value: number) => void
  setShouldSubmit: (value: boolean) => void
  setGuessNames: (value: boolean) => void
  handleFormSubmit: () => void
  setToName: (value: string) => void
  setToEmail: (value: string) => void
  setSubject: (value: string) => void
  setMessage: (value: string) => void
}) {
  return (
    <>
      <Card
        key={`composer-${settings.toEmail}`}
        title="Compose email"
        actions={
          <>
            <Button
              type="submit"
              which="warning"
              iconSide="left"
              icon={<Envelope />}
              disabled={
                !settings.fromName ||
                !settings.fromEmail ||
                !settings.toEmail ||
                !settings.subject ||
                !settings.message
              }
              value={
                settings.toEmail
                  ? `Send email to ${settings.toEmail
                      .replace(/[^a-zA-Z].*/g, '')
                      .replace(/^\w/, (c) => c.toUpperCase())}`
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
                const areYouSure = confirm(
                  'Are you sure you want to batch send?\n\nThis will send an email to each contact in the list, one by one, with the same message template and subject.\n\nThere is a delay of 2 seconds between each email. Enter "yes" to confirm.'
                )
                if (areYouSure) {
                  const contactList = settings.contacts
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
          </>
        }>
        <>
          {loadingSettings || loadingTemplate ? (
            <div className="flex justify-center items-center h-full">
              <Loading />
            </div>
          ) : (
            <form
              id="email-form"
              className="flex flex-col gap-4 mb-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleFormSubmit()
              }}>
              <div className="flex flex-row justify-end">
                <Input
                  type="checkbox"
                  defaultChecked={settings.guessNames}
                  onChange={(e) => {
                    setGuessNames(!settings.guessNames)
                  }}
                  title="Guess name from email"
                  style="checkbox-xs rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <Input
                  id="toName"
                  type="text"
                  title="to"
                  placeholder="to name"
                  value={settings.toName}
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
                  value={settings.toEmail}
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
                  value={settings.subject}
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
                  value={settings.message}
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
                        key={`variable-${index}`}
                        title={`Insert ${variable} into message`}
                        onClick={() => {
                          const textArea = document?.getElementById(
                            'textarea-message'
                          ) as HTMLTextAreaElement
                          if (!textArea) return

                          const cursorPosition =
                            textArea.selectionStart || textArea.value.length

                          setMessage(
                            settings.message.slice(0, cursorPosition) +
                              `{${variable}}` +
                              settings.message.slice(cursorPosition)
                          )
                        }}>
                        {variable}
                      </Code>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      </Card>
    </>
  )
}

export default Composer

import Input from '@/components/Input'
import Button from '@/components/Button'
import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { getSettings, saveSettings } from '@/utils/settings'
import Loading from '@/components/Loading'
import Card from '@/components/Card'
import DescriptionText from '@/components/DescriptionText'

export function MainSettings({ userID }: { userID: string }) {
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [fromName, setFromName] = useState('')
  const [resendAPIKey, setResendAPIKey] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [replyTo, setReplyTo] = useState('')

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

  if (loadingSettings) {
    getSettings().then((data) => {
      setResendAPIKey(data.resendAPIKey)
      setFromName(data.fromName)
      setFromEmail(data.fromEmail)
      setReplyTo(data.replyTo)

      setLoadingSettings(false)
    })
  }

  return (
    <Card
      key={`main-settings-${userID}`}
      title="Main settings"
      actions={
        <Button
          type="button"
          value="Save settings"
          which="primary"
          onClick={() => {
            handleSaveSettings()
          }}
        />
      }>
      {loadingSettings && <Loading />}
      {!loadingSettings && (
        <>
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <h4>Resend</h4>
              <span className="font-bold text-sm">Resend API key</span>
              <DescriptionText>
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
              </DescriptionText>
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
            </section>
            <section className="flex flex-col gap-4">
              <h4>Your details</h4>
              <DescriptionText>
                This info will be used to send the email. Please be sure that
                your email is set up to allow incoming emails, otherwise add a
                different email in the reply to field.
              </DescriptionText>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div className="flex flex-col gap-4 col-span-1 lg:col-span-6">
                  <span className="font-bold text-sm">From name</span>
                  <Input
                    id="fromName"
                    type="text"
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
                </div>
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
            </section>
          </div>
        </>
      )}
    </Card>
  )
}

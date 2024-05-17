import Card from '@/components/Card'
import Loading from '@/components/Loading'
import Code from '@/components/Code'
import dayjs from 'dayjs'

function Rendered({
  loadingSettings,
  loadingTemplate,
  settings
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
}) {
  return (
    <>
      <Card
        key={`rendered-${settings.toEmail}`}
        title="Rendered email"
        actions="">
        {loadingSettings || loadingTemplate ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mt-4">
              <Code
                errorCondition={!settings.fromName?.trim()}
                style={`col-span-6 break-words`}>
                From: {settings.fromName?.trim()} &lt;
                {settings.fromEmail?.trim()}&gt;
              </Code>
              <Code
                errorCondition={!settings.replyTo?.trim()}
                style={`col-span-6 break-words`}>
                Reply to: {settings.fromName?.trim()} &lt;
                {settings.replyTo?.trim()}&gt;
              </Code>
              <Code
                errorCondition={!settings.toEmail?.trim()}
                style={`col-span-6 break-words`}>
                To: {settings.toName?.trim() || 'friend'} &lt;
                {settings.toEmail?.trim() || 'EMAIL MISSING'}&gt;
              </Code>
              <Code
                errorCondition={!settings.subject?.trim()}
                style={`col-span-6 break-words`}>
                Subject: {settings.subject}
              </Code>
            </div>
            <div className="mt-8">
              <p className="whitespace-pre-wrap break-words">
                {settings.message
                  .replace(/{fromName}/g, settings.fromName?.trim())
                  .replace(
                    /{fromFirstName}/g,
                    settings.fromName?.trim()?.split(' ')?.[0]
                  )
                  .replace(/{toName}/g, settings.toName?.trim() || 'friend')
                  .replace(/{fromEmail}/g, settings.fromEmail?.trim())
                  .replace(/{toEmail}/g, settings.toEmail?.trim())
                  .replace(/{currentDate}/g, dayjs().format('YYYY-MM-DD'))
                  .replace(/{currentTime}/g, dayjs().format('HH:mm'))}
              </p>
            </div>
          </>
        )}
      </Card>
    </>
  )
}

export default Rendered

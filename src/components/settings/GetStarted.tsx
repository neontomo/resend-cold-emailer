import Code from '@/components/Code'
import Card from '@/components/Card'

export function GetStarted({ userID = 'get-started' }: { userID: string }) {
  return (
    <Card
      key={`get-started-${userID}`}
      id="get-started"
      title="Get started"
      actions={
        <div className="flex flex-row gap-2 mt-4">
          <Code>Resend API key</Code>
          <Code>From name</Code>
          <Code>From email</Code>
        </div>
      }>
      <div>
        To use this service you need to set up your settings. The minimum
        required settings are:
      </div>
    </Card>
  )
}

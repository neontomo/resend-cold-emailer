import Input from '@/components/Input'
import Button from '@/components/Button'
import { Ticket, Check } from '@phosphor-icons/react'
import { addLicenseToUser } from '@/utils/checkLicense'
import Code from '@/components/Code'
import netlifyIdentity from 'netlify-identity-widget'
import Card from '@/components/Card'

export function LicenseChecker({
  userID = 'license-checker',
  licensedUser,
  licenseKey,
  loggedIn
}: {
  userID: string
  licensedUser: boolean
  licenseKey?: string
  loggedIn: boolean
}) {
  return (
    <>
      <Card
        key={`license-checker-${userID}`}
        id="license-checker"
        active={!licensedUser}
        title="🎟️ Buy license"
        actions={
          <div>
            {loggedIn && licensedUser && (
              <div className="flex flex-row gap-4 flex-wrap">
                <Code>
                  <span className="font-bold">License valid:</span>{' '}
                  <span>Yes</span>
                </Code>
                <Code>
                  <span className="font-bold">License:</span>{' '}
                  <span>{licenseKey}</span>
                </Code>
              </div>
            )}
            {!licensedUser && (
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
            )}
          </div>
        }>
        <div className="flex flex-col gap-4">
          {!loggedIn || !licensedUser ? (
            <div>
              Please buy a license to use this tool. Licenses are valid for
              life.
            </div>
          ) : (
            <div>
              Thank you for buying a license. You can use this tool without any
              restrictions.
            </div>
          )}
          {loggedIn && !licensedUser && (
            <div className="flex flex-row gap-4 justify-between w-full">
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
                onClick={() => {
                  const licenseKeyElement = document.getElementById(
                    'license-key'
                  ) as HTMLInputElement
                  if (!licenseKeyElement) return

                  const licenseKey = licenseKeyElement?.value?.trim()
                  addLicenseToUser({ licenseKey: licenseKey })
                }}
              />
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

import React from 'react'
import { Check, Ticket } from '@phosphor-icons/react'
import Button from '@/components/Button'
import netlifyIdentity from 'netlify-identity-widget'
import Card from '@/components/Card'

export function LoginScreen() {
  return (
    <>
      <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
        <Card
          key="login"
          title="🔒 No Access"
          actions={
            <Button
              icon={<Check />}
              type="button"
              value="Sign up / Log in"
              onClick={() => netlifyIdentity.open('signup')}
            />
          }>
          <div className="text-lg">
            Please register or log in to purchase a license. Licenses are valid
            for life.
          </div>
        </Card>
      </div>
    </>
  )
}

export function BuyLicense() {
  return (
    <>
      <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
        <Card
          key="license"
          title="🎟️ Buy license"
          actions={
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
          }>
          <div className="text-lg">
            Please buy a license to use this tool. Licenses are valid for life.
          </div>
        </Card>
      </div>
    </>
  )
}

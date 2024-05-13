'use client'

import Button from '@/components/Button'
import NavBar from '@/components/NavBar'

export default function Index() {
  return (
    <>
      <NavBar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content min-h-screen flex-col lg:flex-row gap-32 p-4 md:p-8">
          <div>
            <h1 className="text-6xl font-bold">Get clients yesterday</h1>
            <div className="flex flex-col gap-4 my-8">
              <div className="text-xl">
                Resend Cold Emailer is the easiest way to get warm clients. Just
                paste your email list, create a template and start making money.
              </div>
              <span className="text-sm text-gray-400">
                * Requires custom domain for emails and a free{' '}
                <a
                  href="https://resend.com/signup"
                  className="text-secondary opacity-80 tooltip tooltip-bottom"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tip="Sign up for a Resend account">
                  resend.com
                </a>{' '}
                account.
              </span>
            </div>
            <Button
              iconSide="left"
              icon={
                <img
                  src="/logo-transparent.png"
                  alt="logo"
                  className="h-full rounded-lg"
                />
              }
              type="button"
              which="primary"
              size="lg"
              onClick={() =>
                window.open(
                  // https://store.neontomo.com/l/cold-emailer-client?wanted=true
                  '/dashboard',
                  '_blank'
                )
              }
              value="Try Resend Cold Emailer"
              style="py-3 px-6 gap-4"
            />
          </div>
          <img
            src="/resend-emailer-screenshot.png"
            className="max-w-xl rounded-lg shadow-2xl hover:scale-125 transition-all duration-500 ease-in-out"
          />
        </div>
      </div>
    </>
  )
}

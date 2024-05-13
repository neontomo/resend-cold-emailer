'use client'

import Button from '@/components/Button'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function Index() {
  return (
    <>
      <NavBar />
      <div className="hero min-h-screen bg-base-200 pt-32 lg:pt-0 pb-32">
        <div className="hero-content min-h-screen flex-col lg:flex-row gap-32 p-4 md:p-8">
          <div>
            <h1 className="text-6xl font-bold">Get clients yesterday</h1>
            <div className="flex flex-col gap-4 my-8">
              <div className="text-xl break-words">
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
            className="max-w-full md:max-w-xl rounded-lg shadow-2xl hover:scale-125 transition-all duration-500 ease-in-out"
          />
        </div>
      </div>

      <div className="gap-8 py-32 px-4 md:px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-16 w-1/2 mx-auto">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold items-center flex">
              <i
                className="ph-fill ph-file-dashed text-2xl mr-2
              "></i>
              Email Templates
            </h3>
            <p>
              Create email templates with useful variables like first name, last
              name, your name, current date, etc, and send to your email lists.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold items-center flex">
              <i
                className="ph-fill ph-envelope text-2xl mr-2
                "></i>
              Email Lists
            </h3>
            <p>
              Enter a comma-separated list of emails and send one at a time, and
              choose whether to let the software guess the name of the person.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold items-center flex">
              <i
                className="ph-fill ph-lock text-2xl mr-2
                "></i>
              Local only
            </h3>
            <p>
              Your API key, templates and email lists are deleted after each
              session for privacy. Make sure to save them to a secure location.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold items-center flex">
              <i
                className="ph-fill ph-chart-line text-2xl mr-2
                "></i>
              Email Tracking
            </h3>
            <p>
              Track the progress of your email campaigns and see who has opened
              your emails by using the resend.com dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="gap-8 py-32 px-4 md:px-8 bg-base-200">
        <h2 className="text-4xl font-bold text-center mb-16">Try it now</h2>
        <div className="flex flex-row gap-4 justify-center">
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
      </div>

      <Footer />
    </>
  )
}

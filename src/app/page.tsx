'use client'

import Button from '@/components/Button'
import LoginButton from '../components/LoginButton'

export default function Index() {
  return (
    <>
      <div className="fixed navbar bg-base-100 z-[90]">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a>Pricing</a>
              </li>
              <li>
                <a href="/dashboard">Demo</a>
              </li>
              <li>
                <a>Contact</a>
              </li>
              <LoginButton />
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">
            <img
              src="/apple-icon.png"
              alt="logo"
              className="w-8 h-8 mr-2 rounded-lg"
            />
            Resend Cold Emailer
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li
              className="tooltip tooltip-bottom"
              data-tip="See pricing for Resend Cold Emailer">
              <a>Pricing</a>
            </li>
            <li
              className="tooltip tooltip-bottom"
              data-tip="See a demo">
              <a href="/dashboard">Demo</a>
            </li>
            <li
              className="tooltip tooltip-bottom"
              data-tip="Contact support">
              <a>Contact</a>
            </li>
            <LoginButton />
          </ul>
        </div>
      </div>

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
                * Requires custom domain and a{' '}
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
                  'https://store.neontomo.com/l/cold-emailer-client?wanted=true',
                  '_blank'
                )
              }
              value="Get Resend Cold Emailer"
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

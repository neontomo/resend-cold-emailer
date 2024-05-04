function Footer() {
  return (
    <>
      <footer className="fixed bottom-0 left-0 footer items-center p-4 bg-neutral text-neutral-content text-xs">
        <aside className="items-center grid-flow-col">
          <p>
            Made by{' '}
            <a
              href="https://neontomo.com"
              className="font-bold"
              target="_blank"
              rel="noopener noreferrer">
              Tomo
            </a>{' '}
            with ❤️
          </p>
        </aside>
        <nav className="grid-flow-col gap-8 md:place-self-center md:justify-self-end">
          <a href="https://github.com/neontomo/simple-resend-emailer">Repo</a>
          <a
            href="https://github.com/neontomo"
            target="_blank"
            rel="noopener noreferrer">
            My GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/tomo-myrman"
            target="_blank"
            rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      </footer>
    </>
  )
}

export default Footer

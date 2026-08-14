import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 bg-background text-foreground">
      <div className="terminal-card max-w-xl w-full p-8 text-center">
        <p className="eyebrow">{'// 404'}</p>
        <h1 className="text-4xl font-bold mt-4">This route wandered off.</h1>
        <p className="text-muted mt-4">The page is missing, but the rest of the system is still online.</p>
        <Link className="button button-primary mt-8" href="/">Return home</Link>
      </div>
    </main>
  )
}

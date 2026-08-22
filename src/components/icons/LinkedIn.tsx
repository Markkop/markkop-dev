import type { SVGProps } from 'react'

type LinkedInProps = SVGProps<SVGSVGElement> & {
  size?: number | string
}

export default function LinkedIn({ size = 24, ...props }: LinkedInProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      {...props}
      fill="currentColor"
      stroke="none"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="0.6" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

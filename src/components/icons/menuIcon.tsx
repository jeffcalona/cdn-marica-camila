import * as React from "react"
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      d="M3 7h18M3 12h18M3 17h18"
    />
  </svg>
)
export default MenuIcon

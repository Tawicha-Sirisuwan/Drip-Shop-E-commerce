import React from 'react'
import Link from 'next/link'
function navbar() {
  return (
    <nav className='flex gap-4 border-b p-4'>
        <Link href="/home">Home</Link>
        <Link href="/login">Login</Link>
    </nav>
  )
}

export default navbar
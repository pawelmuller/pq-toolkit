'use client'

import { FaSun, FaMoon } from "react-icons/fa"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() =>  setMounted(true), [])

  if (!mounted) 
    return (
      resolvedTheme === 'dark' ? 
          <FaSun className="text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline 
          transform hover:scale-105 duration-300 ease-in-out h-5 w-5 md:h-8 md:w-8 mt-1" onClick={() => setTheme('light')} /> :
          <FaMoon className="text-blue-400 no-underline hover:text-pink-500 hover:text-underline 
          transform hover:scale-105 duration-300 ease-in-out h-5 w-5 md:h-8 md:w-8 mt-1" onClick={() => setTheme('dark')} />
  )

  if (resolvedTheme === 'dark') {
    return <FaSun className="text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline 
    transform hover:scale-105 duration-300 ease-in-out h-5 w-5 md:h-8 md:w-8 mt-1" onClick={() => setTheme('light')} />
  }

  if (resolvedTheme === 'light') {
    return <FaMoon className="text-blue-400 no-underline hover:text-pink-500 hover:text-underline 
    transform hover:scale-105 duration-300 ease-in-out h-5 w-5 md:h-8 md:w-8 mt-1" onClick={() => setTheme('dark')} />
  }

}
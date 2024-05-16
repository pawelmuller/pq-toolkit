'use client'

const Blobs = () => {
  return (
    <div>
        <div className='absolute -top-20 right-36 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-r from-pink-700 to-purple-500 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-50 animate-blob animation-delay-2000' />
        <div className='absolute -top-20 left-36 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-r from-cyan-600 to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-60 animate-blob animation-delay-6000' />
        <div className='absolute top-4 right-64 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-50 animate-blob animation-delay-4000' />
        <div className='absolute -top-32 -right-6 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-600 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-60 dark:opacity-40 animate-blob animation-delay-8000' />
        <div className='absolute -top-28 -left-11 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-50 animate-blob animation-delay-10000' />
    </div>
  )
}

export default Blobs
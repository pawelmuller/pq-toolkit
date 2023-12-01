'use client'

import { useState } from 'react'

export function UploadForm ({ url }: { url: string }): JSX.Element {
  const [file, setFile] = useState<File>()

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    if (file == null) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch(url, {
        method: 'POST',
        body: data
      })
      if (!res.ok) throw new Error(await res.text())
    } catch (e: any) {
      // TODO: handle errors
      console.error(e)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        onSubmit(e).catch(console.error)
      }}
    >
      <input
        type="file"
        name="file"
        onChange={(e) => {
          setFile(e.target.files?.[0])
        }}
      />
      <input
        type="submit"
        value="Upload"
        className="bg-white rounded-md cursor-pointer text-black p-xs"
      />
    </form>
  )
}

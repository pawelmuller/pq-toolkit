'use client'

import { useContext, useEffect, useState } from 'react'
import { ExperimentContext } from './layout'
import Loading from './loading'
import InvalidConfigurationError from './invalid-configuration-error'
import Header from "@/lib/components/basic/header"
import Blobs from "../../lib/components/basic/blobs"

const ExperimentWelcomePage = (props: { params: { name: string } }): JSX.Element => {
  const { name: experimentName } = props.params
  const context = useContext(ExperimentContext)
  const data = context?.data
  const [errorRequest, setErrorRequest] = useState(false)

  useEffect(() => {
    if ((context?.error) ?? false) {
      setErrorRequest(true)
    }
  }, [context?.error])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
        <div className="relative text-center mb-sm">
          <Blobs />
        </div>
        <div className="flex content-center bg-white dark:bg-stone-900 rounded-2xl justify-center fadeInUp z-10 p-3 mt-4 md:mt-8">
          <div className="flex flex-col justify-center content-center">
            {errorRequest ? (
              <InvalidConfigurationError />
            ) : data == null ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-md p-lg flex flex-col items-center text-black dark:text-white bg-gray-800/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <div className="text-lg">
                  Welcome to experiment <b>{data.name}</b>
                </div>
                <div className="mt-sm">{data.description}</div>
                <div className="mt-md">
                  <div className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-cyan-500  to-pink-500 cursor-pointer" onClick={() => {
                    window.location.href = `/${experimentName}/1`
                  }}>
                    Start
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperimentWelcomePage

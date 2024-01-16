'use client'

import Loading from '@/app/loading'
import useExperimentData from '@/lib/components/experiments/hooks/useExperimentData'
import { CgDanger } from 'react-icons/cg'
import { Popover } from '@mui/material'
import { useState } from 'react'
import FileUploader from '@/core/components/FileUploader'
import { type ExperimentSetup } from '@/lib/schemas/experimentSetup'
import { listExperimentSamples } from '@/lib/schemas/utils'
import useSWR from 'swr'
import { FaCheckCircle } from 'react-icons/fa'

const AdminPage = ({ params }: { params: { name: string } }): JSX.Element => {
  const { name } = params

  const noRevalidationConfig = {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0
  }

  const { isLoading, apiError, experimentData, validationErrors, mutate } =
    useExperimentData(name, noRevalidationConfig)

  const {
    data: samplesData,
    isLoading: samplesLoading,
    mutate: samplesMutate
  } = useSWR(`/api/v1/experiments/${name}/samples`, noRevalidationConfig)

  if (isLoading || samplesLoading) return <Loading />

  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center"
        >
          <h2 className="text-6xl font-bold">
            Experiment {name} configuration
          </h2>
        </div>
        <ExperimentValidationWidget
          className="mt-md"
          apiError={apiError}
          validationErrors={validationErrors}
        />
        <div className="flex mt-md gap-lg">
          <div className="w-full text-center">
            Experiment contents:
            {experimentData == null && (
              <div className="mt-sm">Cannot load setup</div>
            )}
            {experimentData?.tests.map((test, idx) => (
              <div key={idx} className="w-full flex">
                <div>{idx + 1}</div>
                <div className="mx-auto">{test.type}</div>
              </div>
            ))}
            <div className="mt-md">
              <SamplesCheckWidget
                experimentData={experimentData}
                availableSamples={samplesData}
              />
            </div>
          </div>
          <UploadersWidget
            name={name}
            mutateExperiments={mutate}
            mutateSamples={samplesMutate}
          />
        </div>
      </div>
    </main>
  )
}

const UploadersWidget = ({
  name,
  mutateExperiments,
  mutateSamples
}: {
  name: string
  mutateExperiments: () => Promise<void>
  mutateSamples: () => Promise<void>
}): JSX.Element => {
  return (
    <div className="w-full text-center">
      <div className="">
        <div className="mb-sm">Upload configuration (setup.json)</div>
        <FileUploader
          dataKey={'setup_uploader'}
          url={`/api/v1/experiments/${name}`}
          onFileUploaded={async () => {
            await mutateExperiments()
            await mutateSamples()
          }}
        />
      </div>
      <div className="mt-md">
        <div className="mb-sm">Upload samples</div>
        <FileUploader
          dataKey={'sample_uploader'}
          url={`/api/v1/experiments/${name}/samples`}
          onFileUploaded={async () => {
            await mutateExperiments()
            await mutateSamples()
          }}
          multi
        />
      </div>
    </div>
  )
}

const ExperimentValidationWidget = ({
  apiError,
  validationErrors,
  className
}: {
  apiError?: any
  validationErrors?: string[]
  className?: string
}): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  if (
    apiError == null &&
    (validationErrors == null || validationErrors.length === 0)
  )
    return <div className={className}>Configuration is valid</div>

  return (
    <div className={`flex gap-xs items-center ${className}`}>
      <div
        className="flex gap-xs items-center cursor-pointer"
        onClick={handleClick}
      >
        <div className="">Configuration is invalid</div>
        <CgDanger className="text-red-500" />
      </div>
      <Popover
        open={open}
        className="text-center"
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        onClose={handleClose}
      >
        <div className="p-sm bg-black/30 subtitle">
          <div>Errors:</div>
          {apiError != null && <div>{apiError.toString()}</div>}
          {validationErrors?.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      </Popover>
    </div>
  )
}

const SamplesCheckWidget = ({
  experimentData,
  availableSamples
}: {
  experimentData?: ExperimentSetup
  availableSamples?: string[]
}): JSX.Element => {
  if (experimentData == null) return <div>Cannot load experiment data</div>
  if (availableSamples == null) return <div>Cannot load available samples</div>

  const requiredSamples = listExperimentSamples(experimentData)

  return (
    <div className="">
      <div className="mb-sm">Required samples:</div>
      <div className="flex flex-col gap-xs">
        {requiredSamples.map((sample, idx) => (
          <div key={idx} className="flex gap-xs">
            <div>{idx + 1}</div>
            <div>{sample}</div>
            <div>
              {availableSamples.includes(sample) ? (
                <FaCheckCircle />
              ) : (
                <CgDanger />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage

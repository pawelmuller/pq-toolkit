import fs from 'fs'
import {
  getAllExperimentsBasePath,
  getAllExperimentsIndexBasePath,
  getExperimentBasePath,
  readJsonFile,
  writeJsonFile
} from '../utils'
import { EXPERIMENT_INDEX_TEMPLATE } from '../constants'

const initCheck = (): boolean => {
  const dir = getAllExperimentsBasePath()
  if (!fs.existsSync(dir)) return false
  const indexPath = getAllExperimentsIndexBasePath()
  if (!fs.existsSync(indexPath)) return false
  return true
}

const runInit = (): void => {
  console.log(`Experiment index init at ${getAllExperimentsBasePath()}`)
  const dir = getAllExperimentsBasePath()
  fs.mkdirSync(dir, { recursive: true })
  const indexPath = getAllExperimentsIndexBasePath()
  fs.writeFileSync(indexPath, EXPERIMENT_INDEX_TEMPLATE)
}

export const GET = async (): Promise<Response> => {
  if (!initCheck()) runInit()
  const jsonData = readJsonFile(getAllExperimentsIndexBasePath())

  return Response.json(jsonData)
}

export const POST = async (request: Request): Promise<Response> => {
  const body = await request.json()

  // Update experiment index
  const jsonData: { experiments: string[] } = readJsonFile(
    getAllExperimentsIndexBasePath()
  )
  const { experiments } = jsonData
  experiments.push(body.name)
  writeJsonFile(getAllExperimentsIndexBasePath(), { experiments })

  // Create dir for new experiment configuration
  const dir = getExperimentBasePath(body.name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  return Response.json({ experiments })
}

export const DELETE = async (request: Request): Promise<Response> => {
  const body = await request.json()

  // Update experiment index
  const jsonData: { experiments: string[] } = readJsonFile(
    getAllExperimentsIndexBasePath()
  )
  const { experiments } = jsonData
  const filteredExperiments = experiments.filter((item) => item !== body.name)
  writeJsonFile(getAllExperimentsIndexBasePath(), {
    experiments: filteredExperiments
  })

  // Remove experiment directory (with all data)
  const dir = getExperimentBasePath(body.name)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  return Response.json({ experiments })
}

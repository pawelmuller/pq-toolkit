import path from 'path'
import fs from 'fs'
import { BASE_EXPERIMENTS_DIR, EXPERIMENT_INDEX_FILENAME } from './constants'

/**
 * Reads and parses content of json file to js object
 * @param filePath
 * @returns object parsed by JSON.parse
 * @note uses UTF8 encoding
 */
export const readJsonFile = (filePath: string): any => {
  const data = fs.readFileSync(path.resolve(filePath), 'utf8')
  return JSON.parse(data)
}

/**
 * Writes js object to json file
 * @param filePath
 * @param data any data to be saved, parsed by JSON.stringify
 * @note uses UTF8 encoding
 */
export const writeJsonFile = (filePath: string, data: any): void => {
  fs.writeFileSync(path.resolve(filePath), JSON.stringify(data), 'utf-8')
}

/**
 * Gets base data path from environment
 * @returns base data path (configured in .env file/docker compose file)
 * @throws Error('Missing env variable: DATA_PATH')
 */
export const getDataBasePath = (): string => {
  const path = process.env.DATA_PATH
  if (path == null) throw new Error('Missing env variable: DATA_PATH')
  return path
}

export const getAllExperimentsBasePath = (): string => {
  return path.resolve(getDataBasePath(), BASE_EXPERIMENTS_DIR)
}

export const getAllExperimentsIndexBasePath = (): string => {
  return path.resolve(getAllExperimentsBasePath(), EXPERIMENT_INDEX_FILENAME)
}

export const getExperimentBasePath = (experimentName: string): string => {
  return path.resolve(getAllExperimentsBasePath(), experimentName)
}

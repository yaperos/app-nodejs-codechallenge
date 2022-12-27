import stringify from 'json-stringify-safe'
import { Request, Response } from 'express'
import { axiosRequest } from '../utils/axios-request'
import { EnvConfig } from '../utils/env-config'

export async function getTransaction(req: Request, res: Response) {
  const { id } = req.params
  const response = await axiosRequest('GET', `${EnvConfig.pathTransactions}/transaction/${id}`)
  const result = response?.data?.transaction

  res.send(stringify(result))
}

export async function createTransaction(req: Request, res: Response) {
  const response = await axiosRequest('POST', `${EnvConfig.pathTransactions}/transaction`, req.body)
  const result = response?.data?.transaction

  res.send(stringify(result))
}

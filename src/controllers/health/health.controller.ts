import { Request, Response } from 'express'

export default class HealthController {
  public health(_req: Request, res: Response): Response<{ status: string }> {
    return res.json({
      status: 'up',
    })
  }
}

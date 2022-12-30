import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { User } from '../models';

export const all = async (req: Request, res: Response): Promise<Response> => {
  const users = await User.query().select();
  return res.status(StatusCodes.OK).json(users);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const user = await User.query().findById(id);
  if (user) {
    return res.status(StatusCodes.OK).json(user);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const create = async ( req: Request, res: Response): Promise<Response> => {
  const user = await User.query().insert(req.body);
  return res.status(StatusCodes.CREATED).json(user);
};

export const update = async ( req: Request, res: Response ): Promise<Response> => {
  const id: Id = req.params.id;
  const user = await User.query().findById(id);
  if (user) {
    await User.query().findById(id).patch(req.body);
    return res.sendStatus(StatusCodes.OK);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const remove = async ( req: Request, res: Response ): Promise<Response> => {
  const id: Id = req.params.id;
  const user = await User.query().findById(id);
  if (user) {
    await User.query().deleteById(id);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const UserController = {
  all,
  get,
  create,
  update,
  remove
};

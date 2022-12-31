import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { Role } from '../models';

export const all = async (req: Request, res: Response): Promise<Response> => {
  const roles = await Role.query().select();
  return res.status(StatusCodes.OK).json(roles);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const role = await Role.query().findById(id);
  if (role) {
    return res.status(StatusCodes.OK).json(role);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const create = async ( req: Request, res: Response): Promise<Response> => {
  const role = await Role.query().insert(req.body);
  return res.status(StatusCodes.CREATED).json(role);
};

export const update = async ( req: Request, res: Response ): Promise<Response> => {
  const id: Id = req.params.id;
  const role = await Role.query().findById(id);
  if (role) {
    await Role.query().findById(id).patch(req.body);
    return res.sendStatus(StatusCodes.OK);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const remove = async ( req: Request, res: Response ): Promise<Response> => {
  const id: Id = req.params.id;
  const role = await Role.query().findById(id);
  if (role) {
    await Role.query().deleteById(id);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const RoleController = {
  all,
  get,
  create,
  update,
  remove
};

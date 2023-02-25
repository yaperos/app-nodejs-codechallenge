import { Request, Response } from 'express';
import { throwDBError } from '../../helpers/error.helper';
import { NotFound, Ok } from '../../helpers/http.helper';
import { to } from '../../utils';

export default class BaseController {
  public model: any;

  constructor(model) {
    this.model = model;
    this.findAll = this.findAll.bind(this);
    this.save = this.save.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  public async findAll(req: Request, res: Response) {
    const [err, data] = await to(this.model.find().exec());

    if (err) {
      throwDBError(err);
    }

    data ? Ok(res, data) : NotFound(res);
  }

  public async save(req: Request, res: Response) {
    const body = req.body;
    const model = new this.model(body);
    const [err, data] = await to(model.save(body));

    if (err) {
      throwDBError(err);
    }

    data ? Ok(res, { id: '1' }) : NotFound(res);
  }

  public async deleteAll(req: Request, res: Response) {
    const [err, data] = await to(this.model.deleteMany());

    if (err) {
      throwDBError(err);
    }

    return Ok(res, data);
  }
}

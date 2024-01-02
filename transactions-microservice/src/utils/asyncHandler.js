/**
 * @typedef {Record<string, any>} LocalsObj
 */

/**
 *
 * @template P
 * @template ResBody
 * @template ReqBody
 * @template ReqQuery
 *
 * @typedef {import('express').Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>} Request
 */

/**
 * @template ResBody
 *
 * @typedef {import('express').Response<ResBody, LocalsObj>} Response
 */

/**
 * @template P
 * @template ResBody
 * @template ReqBody
 * @template ReqQuery
 *
 * @typedef {(
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: import('express').NextFunction,
    ) => void} RequestHandler
 */

/**
 * @template P
 * @template ResBody
 * @template ReqBody
 * @template ReqQuery
 * @param {RequestHandler<P,ResBody,ReqBody,ReqQuery>} fn
 */
const asyncHandler = fn => (
  /** @type {Request<P,ResBody,ReqBody,ReqQuery>} */ req,
  /** @type {Response<ResBody>} */ res,
  /** @type {import('express').NextFunction} */ next,
) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next)
}

module.exports = asyncHandler

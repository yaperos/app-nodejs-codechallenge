import type { Response } from 'express';
import type { UpstreamResponse } from './proxy.service';

export function sendUpstream(res: Response, upstream: UpstreamResponse): void {
    res.status(upstream.status);
    if (upstream.contentType) res.type(upstream.contentType);
    res.send(upstream.body);
}
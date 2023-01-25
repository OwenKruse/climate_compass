import {NextApiRequest, NextApiResponse} from "next";

export default async function myRoute(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestIp = require('request-ip');
    const detectedIp = requestIp.getClientIp(req)
}
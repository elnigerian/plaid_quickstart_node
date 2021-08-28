import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query} = req;
    const link_token = query.linkToken;
    const data = await fetch('http://localhost:4000/sandbox/public_token/create', {
        method: 'POST',
        headers: {
            "Content_Type": "application/json"
        },
        body: JSON.stringify(link_token)
    }).then((res) => res.json()).then((json) => json)

    res.status(200).json(data);
}

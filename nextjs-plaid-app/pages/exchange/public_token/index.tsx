import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query} = req;
    const public_token = query.publicToken;
    const data = await fetch('http://localhost:4000/api/exchange_public_token', {
        method: 'POST',
        headers: {
            "Content_Type": "application/json"
        },
        body: JSON.stringify(public_token)
    }).then((res) => res.json()).then((json) => json)

    res.status(200).json(data);
}

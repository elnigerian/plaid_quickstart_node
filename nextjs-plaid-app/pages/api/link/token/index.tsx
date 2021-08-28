import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const data = await fetch('http://localhost:4000/api/create_link_token', {
        method: 'POST',
    }).then((res) => res.json()).then((json) => json)

    res.status(200).json(data);
}

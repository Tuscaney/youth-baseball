import { ddb, TABLE } from '../_ddb.js'
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { nanoid } from 'nanoid'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const out = await ddb.send(new ScanCommand({ TableName: TABLE }))
    return res.status(200).json(out.Items ?? [])
  }
if (req.method === 'POST') {
    const body = JSON.parse(req.body || '{}')
    const item = {
      id: nanoid(),
      playerName: body.playerName,
      age: Number(body.age),
      guardianName: body.guardianName,
      contactPhone: body.contactPhone,
      division: body.division || 'T-Ball',
      notes: body.notes || '',
      paid: Boolean(body.paid),
      createdAt: new Date().toISOString()
    }
await ddb.send(new PutCommand({ TableName: TABLE, Item: item }))
    return res.status(201).json(item)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

import { ddb, TABLE } from './_ddb.js'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export default async function handler(_req, res) {
  try {
    if (!TABLE) {
      return res.status(500).json({ ok: false, message: 'Missing DDB_TABLE env', region: process.env.AWS_REGION ?? null })
    }
    const out = await ddb.send(new ScanCommand({ TableName: TABLE, Limit: 1 }))
    return res.status(200).json({
      ok: true,
      table: TABLE,
      region: process.env.AWS_REGION ?? null,
      sampleCount: (out.Items || []).length
    })
  } catch (err) {
    console.error('HEALTH ERROR', err)
    return res.status(500).json({
      ok: false,
      message: err?.message || String(err),
      table: TABLE ?? null,
      region: process.env.AWS_REGION ?? null
    })
  }
}

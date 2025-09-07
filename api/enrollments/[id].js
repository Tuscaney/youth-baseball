import { getDdb } from '../_ddb.js'
import { UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

export default async function handler(req, res) {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const { ddb, TABLE, err } = getDdb()
    if (err) return res.status(500).json({ error: err })

    if (req.method === 'PUT') {
      const patch = JSON.parse(req.body || '{}')
      const keys = Object.keys(patch)
      if (!keys.length) return res.status(400).json({ error: 'Empty update' })

      const exprNames = {}
      const exprValues = {}
      const sets = []
      for (const k of keys) {
        exprNames['#' + k] = k
        exprValues[':' + k] = patch[k]
        sets.push(`#${k} = :${k}`)
      }

      const out = await ddb.send(new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: exprNames,
        ExpressionAttributeValues: exprValues,
        ReturnValues: 'ALL_NEW'
      }))
      return res.status(200).json(out.Attributes)
    }

    if (req.method === 'DELETE') {
      await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { id } }))
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('ENROLLMENTS/[ID] ERROR', e)
    return res.status(500).json({ error: String(e?.message || e) })
  }
}

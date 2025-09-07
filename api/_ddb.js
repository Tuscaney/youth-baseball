import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export function getDdb() {
  const AWS_REGION = process.env.AWS_REGION
  const DDB_TABLE = process.env.DDB_TABLE

  if (!AWS_REGION || !DDB_TABLE) {
    const missing = !AWS_REGION ? 'AWS_REGION' : 'DDB_TABLE'
    return { ddb: null, TABLE: DDB_TABLE || null, err: `Missing ${missing} env` }
  }

  const client = new DynamoDBClient({ region: AWS_REGION })
  const ddb = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true }
  })
  return { ddb, TABLE: DDB_TABLE, err: null }
}


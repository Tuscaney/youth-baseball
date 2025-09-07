export default function handler(_req, res) {
  const safe = {
    AWS_REGION: process.env.AWS_REGION || null,
    DDB_TABLE: process.env.DDB_TABLE || null,
    HAS_ACCESS_KEY_ID: Boolean(process.env.AWS_ACCESS_KEY_ID),
    HAS_SECRET: Boolean(process.env.AWS_SECRET_ACCESS_KEY)
  }
  res.status(200).json(safe)
}

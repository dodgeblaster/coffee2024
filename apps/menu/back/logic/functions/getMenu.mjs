export const config = {}

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: []
    })
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTION'
    }
  }
}

import { getSession, emit } from './aws.mjs'

export const config = {
    url: 'POST /getspotinline',
    env: {
        TABLE: '{@output.coffee24-customer-infra.TableName}',
        BUS: '{@output.coffee24-core.EventBusName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem'],
            Resource: '{@output.coffee24-customer-infra.TableArn}'
        },

        {
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Resource: '{@output.coffee24-core.EventBusArn}'
        }
    ]
}

export const handler = async (event) => {
    const sessionId = event.headers.authorization
    const session = await getSession(sessionId)

    if (!session) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: 'Unauthorized'
            })
        }
    }

    const userId = session.userId
    const response = await emit('request-spot', {
        userId: userId,
        orderId: '1234',
        storeId: '1234'
    })

    // return json
    return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTION'
        }
    }
}

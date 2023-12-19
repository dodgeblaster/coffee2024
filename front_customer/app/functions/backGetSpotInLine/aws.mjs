import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    PutCommand,
    GetCommand,
    DynamoDBDocumentClient,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb'
import {
    EventBridgeClient,
    PutEventsCommand
} from '@aws-sdk/client-eventbridge'

const client = new EventBridgeClient({})
const dbClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dbClient)

export const emit = async (detailType, data, source = 'customer-service') => {
    const response = await client.send(
        new PutEventsCommand({
            Entries: [
                {
                    Detail: JSON.stringify(data),
                    DetailType: detailType,
                    Source: source,
                    EventBusName: process.env.BUS
                }
            ]
        })
    )

    return response
}

export async function getSession(sessionId) {
    try {
        const command = new GetCommand({
            TableName: process.env.TABLE,
            Key: {
                pk: 'session_' + sessionId,
                sk: 'meta'
            }
        })

        const res = await docClient.send(command)

        return res.Item || false
    } catch (e) {
        return false
    }
}

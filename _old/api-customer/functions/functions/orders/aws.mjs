import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    PutCommand,
    GetCommand,
    DynamoDBDocumentClient,
    QueryCommand
} from '@aws-sdk/lib-dynamodb'
import {
    EventBridgeClient,
    PutEventsCommand
} from '@aws-sdk/client-eventbridge'

const client = new EventBridgeClient({})
const dbClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dbClient)

export const emit = async (detailType, data, source = 'customer-api') => {
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

export async function get(x) {
    try {
        const command = new GetCommand({
            TableName: process.env.TABLE,
            Key: x
        })

        const res = await docClient.send(command)
        return res.Item ? res.Item : false
    } catch (e) {
        return false
    }
}

export async function list(x) {
    const command = new QueryCommand({
        TableName: process.env.TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': x.pk,
            ':sk': x.sk
        }
    })

    const res = await docClient.send(command)
    return res.Items ? res.Items : false
}

export async function set(x) {
    const command = new PutCommand({
        TableName: process.env.TABLE,
        Item: x
    })

    return await docClient.send(command)
}

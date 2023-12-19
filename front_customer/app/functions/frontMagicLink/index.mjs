import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    PutCommand,
    GetCommand,
    DynamoDBDocumentClient,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb'
import crypto from 'crypto'
const dbClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dbClient)

export const config = {
    url: 'GET /magiclink',
    env: {
        TABLE: '{@output.coffee24-customer-infra.TableName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: [
                'dynamodb:Query',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem'
            ],
            Resource: '{@output.coffee24-customer-infra.TableArn}'
        }
    ]
}

async function getMagicLink(x) {
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

async function set(x) {
    const command = new PutCommand({
        TableName: process.env.TABLE,
        Item: x
    })

    return await docClient.send(command)
}

export const handler = async (e) => {
    const { token } = e.queryStringParameters

    /**
     * Confirm link is still valid
     */
    const magicLink = await getMagicLink({
        pk: 'magiclink_' + token,
        sk: 'meta'
    })

    if (!magicLink) {
        return {
            statusCode: 404,
            body: 'Magic Link not found'
        }
    }

    if (Date.now() > magicLink.expires) {
        return {
            statusCode: 404,
            body: 'Magic Link expired'
        }
    }

    if (magicLink.linkUsed) {
        return {
            statusCode: 200,
            body: 'Magic Link already used'
        }
    }

    /**
     * Create session
     */
    const sessionId = crypto.randomBytes(16).toString('hex')
    await set({
        pk: 'session_' + sessionId,
        sk: 'meta',
        userId: magicLink.userId,
        expires: Date.now() + 1000 * 60 * 60 * 24
    })

    /**
     * Return html
     */
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: `<html>
        
            <p>Signing in...</p>
            <script>
                window.localStorage.setItem('sessionId', '${sessionId}')
                setTimeout(() => {
                    window.location = '/app'
                }, 2000)
            </script>
        </html>`
    }
}

import {invokeConversation, get} from './aws.mjs'

export const config = {
    url: true,
    timeout: 300,
    env: {
        TABLE: "{@output.coffee-api-customer-infra.TableName}",
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['bedrock:InvokeModel'],
            Resource: "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0"
        },
        {
            Effect: "Allow",
            Action: ["dynamodb:Query", "dynamodb:GetItem"],
            Resource: "{@output.coffee-api-customer-infra.TableArn}",
        },
    ]
}


export const handler = async (event) => {
        if (event.requestContext.http.method === "OPTIONS") {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTION",
            },
        }
    }

    const sessionId = event.headers.authorization
    const session = await get({
        pk: "session_" + sessionId,
        sk: "meta",
    })

    if (!session) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unauthorized",
            }),
        }
    }

    const messages = JSON.parse(event.body).messages
    console.log(JSON.stringify(messages, null, 2))
    const res = await invokeConversation(messages)


    return {
        statusCode: 200,
        body: JSON.stringify({result: res }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        },
    }


}
import { get, list } from "./aws.mjs"

export const config = {
    url:true,
    env: {
        TABLE: "{@output.coffee-api-customer-infra.TableName}",
    },
    permissions: [
        {
            Effect: "Allow",
            Action: ["dynamodb:Query", "dynamodb:GetItem"],
            Resource: "{@output.coffee-api-customer-infra.TableArn}",
        },
    ],
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
    
    console.log('sessionm: ', sessionId)

    if (!session) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unauthorized",
            }),
        }
    }

    const userId = session.userId

    const orders = await list({
        pk: "user_" + userId,
        sk: "order_",
    })

    const xx = orders.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
    return {
        statusCode: 200,
        body: JSON.stringify({orders: xx }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        },
    }
}


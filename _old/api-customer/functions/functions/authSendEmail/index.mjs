import { sendEmail, personalInfoGet, personalInfoSet, set } from "./aws.mjs"
import crypto from "crypto"

export const config = {
    url: "POST /sendLoginEmail",
    env: {
        TABLE: "{@output.coffee-api-customer-infra.TableName}",
        PERSONALINFOTABLE:
            "{@output.coffee-api-customer-infra.PersonalInfoTableName}",
    },
    permissions: [
        {
            Effect: "Allow",
            Action: [
                "dynamodb:Query",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
            ],
            Resource: "{@output.coffee-api-customer-infra.TableArn}",
        },
        {
            Effect: "Allow",
            Action: ["dynamodb:GetItem", "dynamodb:PutItem"],
            Resource:
                "{@output.coffee-api-customer-infra.PersonalInfoTableArn}",
        },
        {
            Effect: "Allow",
            Action: "ses:SendEmail",
            Resource: "*",
        },
    ],
}

export const handler = async (e) => {
    if (e.requestContext.http.method === "OPTIONS") {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTION",
            },
        }
    }

    const data = JSON.parse(e.body)

    /**
     * Make magiclink id
     */
    const magiclinkId = Math.floor(Math.random() * 10000)
        .toString()
        .slice(0, 4)

    /**
     * Get emails userId
     */
    let userId = await personalInfoGet({
        pk: data.email,
        sk: "id",
    })

    if (!userId) {
        userId = crypto.randomBytes(16).toString("hex")
        await personalInfoSet({
            pk: data.email,
            sk: "id",
            id: userId,
        })
    }

    /**
     * Recording Magic Link in DB
     */
    await set({
        pk: "magiclink_" + magiclinkId,
        sk: "meta",
        userId: userId,
        expires: Date.now() + 1000 * 60 * 5,
        linkUsed: false,
    })

    /**
     * Send email
     */
    const FROM = "garysjennings@gmail.com"
    const email = await sendEmail({
        to: data.email,
        from: FROM,
        subject: "Magic Link Test",
        body: `<div>
    <p>Here is your Magic Link:</p>
    <p>${magiclinkId}</p>
<div>`,
    })
    return {
        statusCode: 200,
        body: JSON.stringify({ email }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        },
    }
}

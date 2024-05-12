import { sendEmail, personalInfoGet, personalInfoSet, set } from './aws.mjs'
import crypto from 'crypto'

export const config = {
    url: 'POST /sendLoginEmail',
    env: {
        DOMAIN: 'https://8tvi0qpja3.execute-api.us-east-1.amazonaws.com',
        TABLE: '{@output.coffee24-customer-infra.TableName}',
        PERSONALINFOTABLE:
            '{@output.coffee24-customer-infra.PersonalInfoTableName}'
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
        },
        {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem', 'dynamodb:PutItem'],
            Resource: '{@output.coffee24-customer-infra.PersonalInfoTableArn}'
        },
        {
            Effect: 'Allow',
            Action: 'ses:SendEmail',
            Resource: '*'
        }
    ]
}

export const handler = async (e) => {
    const data = JSON.parse(e.body)

    /**
     * Make magiclink id
     */
    const magiclinkId = crypto.randomBytes(16).toString('hex')

    /**
     * Get emails userId
     */
    let userId = await personalInfoGet({
        pk: data.email,
        sk: 'id'
    })
    if (!userId) {
        userId = crypto.randomBytes(16).toString('hex')
        await personalInfoSet({
            pk: data.email,
            sk: 'id',
            id: userId
        })
    }

    /**
     * Recording Magic Link in DB
     */
    await set({
        pk: 'magiclink_' + magiclinkId,
        sk: 'meta',
        userId: userId,
        expires: Date.now() + 1000 * 60 * 5,
        linkUsed: false
    })

    /**
     * Send email
     */
    const FROM = 'garysjenningsrise@gmail.com'
    const email = await sendEmail({
        to: data.email,
        from: FROM,
        subject: 'Magic Link Test',
        body: `<div>
            <p>Here is your Magic Link:</p>
            <a href="${config.env.DOMAIN}/magiclink?token=${magiclinkId}">Magic Link</a>
        <div>`
    })
    return { email }
}

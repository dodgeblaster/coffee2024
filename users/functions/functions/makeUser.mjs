import {
	CognitoIdentityProviderClient,
	AdminCreateUserCommand,
	InitiateAuthCommand,
	RespondToAuthChallengeCommand,
	GlobalSignOutCommand
} from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient();

export const config = {
	//  eventRule: {
    //     source: 'coffee-general',
    //     event: 'create-user-requested',
    //     eventBus: 'defualt' // optional, Defaults to "default"
    // }
    url: true,
    env: {
    	POOL_ID: 'us-east-1_9GPrcV1Bk',
    	CLIENT_ID: '2jnnliiogrs4000eac8fv1sb5s'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: [
            	'cognito-idp:AdminCreateUser',
            ],
            Resource: 'arn:aws:cognito-idp:us-east-1:251256923172:userpool/us-east-1_9GPrcV1Bk'
        },
        {
            Effect: 'Allow',
            Action: [
				"cognito-idp:GlobalSignOut",
				"cognito-idp:RespondToAuthChallenge",
				"cognito-idp:InitiateAuth"
            ],
            Resource: '*'
        }
    ]

}


async function makeUser({email}) {
	const input = {
	  "DesiredDeliveryMediums": [
	    "SMS"
	  ],
	  "MessageAction": "SUPPRESS",
	  "TemporaryPassword": "Password@1001",
	  "UserAttributes": [
	    {
	      "Name": "name",
	      "Value": email
	    },
	    {
	      "Name": "email",
	      "Value": email
	    }
	  ],
	  "UserPoolId": process.env.POOL_ID,
	  "Username": email
	}

	const command = new AdminCreateUserCommand(input);
	const response = await client.send(command);
	return response
}

async function login({email, password}) {
	const input = { 
	  AuthFlow: 'USER_PASSWORD_AUTH',
	  AuthParameters: { 
		"PASSWORD": password,
    	"USERNAME": email
	  }, 
	  ClientId: process.env.CLIENT_ID, 
	
	};
	const command = new InitiateAuthCommand(input);
	const response = await client.send(command);
	
	if (response.ChallengeName && response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
		return {
			type: 'NEW_PASSWORD_REQUIRED',
			session: response.Session,
		}
	}
	
	return {
		type: 'SUCCESS',
		accessToken: response.AuthenticationResult.AccessToken,
		idToken: response.AuthenticationResult.IdToken,
		refreshToken: response.AuthenticationResult.RefreshToken
	}
}

async function handleNewPassword({session, email, newPassword}) {
		const input = { 
			ClientId: process.env.CLIENT_ID, 
		  	ChallengeName: "NEW_PASSWORD_REQUIRED", 
		  	Session: session,
		  	ChallengeResponses: {
		  		"NEW_PASSWORD": newPassword, 
		  		"USERNAME": email
		  	},
		};
		const command = new RespondToAuthChallengeCommand(input);
		const response = await client.send(command);
		

		return {
			type: 'SUCCESS',
			accessToken: response.AuthenticationResult.AccessToken,
			idToken: response.AuthenticationResult.IdToken,
			refreshToken: response.AuthenticationResult.RefreshToken
		}

}

async function logout({accessToken}) {
	const input = { 
	  AccessToken: accessToken, 
	};
	const command = new GlobalSignOutCommand(input);
	return await client.send(command);
}


const http = {
	success: x => ({
        statusCode: 200,
        body: JSON.stringify(x),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        },
    }),
    options: () => ({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        },
    })
}
export const handler = async (event) => {
	if (event.requestContext.http.method === "OPTIONS") {
        return http.options()
    }

    const data = JSON.parse(event.body)

    if (data.action && data.action === 'login') {
    	const res =  await login({
			email: data.email,
			password: data.password
		})
		return http.success(res)
    }

    if (data.action && data.action === 'newPassword') {
    	const res =  await handleNewPassword({
    		session: data.session,
			email: data.email,
			newPassword: data.newPassword
		})
		return http.success(res)
    }

    if (data.action && data.action === 'logout') {
    	const res =  await logout({
    		accessToken: data.accessToken
		})
		return http.success(res)
    }

    if (data.action && data.action === 'makeUser') {
    	const res =  await makeUser({
    		email: data.email,
		})
		return http.success(res)
    }

	return {
        statusCode: 400,
        body: JSON.stringify({message: 'Invalid command'}),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTION",
        }
    }
}












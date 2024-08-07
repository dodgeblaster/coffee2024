import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    PutCommand,
    GetCommand,
    DynamoDBDocumentClient,
    QueryCommand
} from '@aws-sdk/lib-dynamodb'

const dbClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dbClient)


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


const sonnet = "anthropic.claude-3-5-sonnet-20240620-v1:0"


const exampleInput = { // ConverseRequest
  modelId: "STRING_VALUE", // required
  messages: [ // Messages // required
    { // Message
      role: "user" || "assistant", // required
      content: [ // ContentBlocks // required
        { // ContentBlock Union: only one key present
          text: "STRING_VALUE",
          image: { // ImageBlock
            format: "png" || "jpeg" || "gif" || "webp", // required
            source: { // ImageSource Union: only one key present
              bytes: new Uint8Array(), // e.g. Buffer.from("") or new TextEncoder().encode("")
            },
          },
          toolUse: { // ToolUseBlock
            toolUseId: "STRING_VALUE", // required
            name: "STRING_VALUE", // required
            input: "DOCUMENT_VALUE", // required
          },
          toolResult: { // ToolResultBlock
            toolUseId: "STRING_VALUE", // required
            content: [ // ToolResultContentBlocks // required
              { // ToolResultContentBlock Union: only one key present
                json: "DOCUMENT_VALUE",
                text: "STRING_VALUE",
                image: {
                  format: "png" || "jpeg" || "gif" || "webp", // required
                  source: {//  Union: only one key present
                    bytes: new Uint8Array(), // e.g. Buffer.from("") or new TextEncoder().encode("")
                  },
                },
              },
            ],
            status: "success" || "error",
          },
        },
      ],
    },
  ],
  system: [ // SystemContentBlocks
    { // SystemContentBlock Union: only one key present
      text: "STRING_VALUE",
    },
  ],
  inferenceConfig: { // InferenceConfiguration
    maxTokens: Number("int"),
    temperature: Number("float"),
    topP: Number("float"),
    stopSequences: [ // NonEmptyStringList
      "STRING_VALUE",
    ],
  },
  toolConfig: { // ToolConfiguration
    tools: [ // Tools // required
      { // Tool Union: only one key present
        toolSpec: { // ToolSpecification
          name: "STRING_VALUE", // required
          description: "STRING_VALUE",
          inputSchema: { // ToolInputSchema Union: only one key present
            json: "DOCUMENT_VALUE",
          },
        },
      },
    ],
    toolChoice: { // ToolChoice Union: only one key present
      auto: {},
      any: {},
      tool: { // SpecificToolChoice
        name: "STRING_VALUE", // required
      },
    },
  },
  additionalModelRequestFields: "DOCUMENT_VALUE",
  additionalModelResponseFieldPaths: [ // AdditionalModelResponseFieldPaths
    "STRING_VALUE",
  ],
};


export const invokeModel = async (
    prompt,
    modelId = sonnet,
    temperature = 0.1,
    start = '',
    end = '') => {
    // Create a new Bedrock Runtime client instance.
    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    // Prepare the payload for the model.
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
        temperature
    };



    if (end) {
        payload.inferenceConfig = {
            stopSequences: [end]
        }
    }

    if (start) {
        payload.messages.push({
            role: 'assistant',
            content: [{ type: 'text', text: start}]
        })
    }
    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId,
    });
    const apiResponse = await client.send(command);

    // Decode and return the response(s)
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    /** @type {MessagesResponseBody} */
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
}

export const invokeConversation = async (
    messages,
    temperature = 0.1,
    start = '',
    end = '') => {
    // Create a new Bedrock Runtime client instance.
    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    // Prepare the payload for the model.
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: messages,
        temperature
    };

    if (end) {
        payload.inferenceConfig = {
            stopSequences: [end]
        }
    }

    if (start) {
        payload.messages.push({
            role: 'assistant',
            content: [{ type: 'text', text: start}]
        })
    }
    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: sonnet
    });
    const apiResponse = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
}



export const invokeConversationWithTools = async ({
    messages,
    tools,
    temperature = 0.1,
    start = '',
    end = ''
}) => {
    // Create a new Bedrock Runtime client instance.
    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    // Prepare the payload for the model.
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: messages,
        temperature,
        tools
    };

    if (end) {
        payload.inferenceConfig = {
            stopSequences: [end]
        }
    }

    if (start) {
        payload.messages.push({
            role: 'assistant',
            content: [{ type: 'text', text: start}]
        })
    }
    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: sonnet
    });
    const apiResponse = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody
}

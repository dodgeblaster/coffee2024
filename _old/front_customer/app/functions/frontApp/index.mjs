import * as fs from 'fs'

export const config = {
    url: 'GET /app'
}

export const handler = async () => {
    const html = fs.readFileSync('index.html', 'utf8')
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: html
    }
}

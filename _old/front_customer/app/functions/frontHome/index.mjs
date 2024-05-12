import * as fs from 'fs'

function file(path) {
    return fs.readFileSync(path, 'utf8')
}

const html = /*html*/ `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            const api = {
                post: (path, data) =>
                    fetch(path, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify(data)
                    })
            }

            window.app = {api};
            ${file('./common/wclogin.js')}
        </script>
    </head>
    <body>
        <wc-login></wc-login>
    </body>
</html>
`

export const config = {
    url: 'GET /'
}

export const handler = async () => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: html
    }
}

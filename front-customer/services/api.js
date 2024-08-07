
const ordersUrl = 'https://lq7afytquo4hl5yssvyksmvdna0cabty.lambda-url.us-east-1.on.aws/'
const aiUrl = 'https://ibiev6aorbfrqf5rpvajfgqysq0heotf.lambda-url.us-east-1.on.aws/'
const makeApiCall = (path) => async (data) =>
    fetch(path, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${await window.localStorage.getItem("sessionId")}`,
        },
        body: JSON.stringify(data),

    })


export default {
    sendMessage: async (data) => makeApiCall(aiUrl)({messages: data.messages}),
    getOrders: async(data) =>  makeApiCall(ordersUrl)({action: 'listOrders', data})

}

import api from "./services/api.js"
function check() {
    const sessionId = window.localStorage.getItem("sessionId")

    if (!sessionId) {
        window.location = "/"
    }
}

check()

async function main() {
    const x = await api.getOrders({})
    const xx = await x.json() 

    document.getElementsByTagName('main')[0].innerHTML = `<p>${JSON.stringify(xx)}</p>`
}

main()

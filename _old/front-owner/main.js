// Components
import './components/orderList.js'

// Pages
import './pages/home.js'

// Services
import api from "./services/api.js"
import router from './services/router.js'


window.app = {}
app.router = router

window.addEventListener('DOMContentLoaded', () => {
    app.router.init()
    //loadData()
})


function check() {
    const sessionId = window.localStorage.getItem("sessionId")

    if (!sessionId) {
        window.location = "/"
    }
}

check()


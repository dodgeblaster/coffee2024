// Components
import './components/orderList.js'
import './components/chat.js'
import './components/orderStatus.js'
import './components/featuredDrinks.js'

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




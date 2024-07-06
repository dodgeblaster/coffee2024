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


function check() {
    const sessionId = window.localStorage.getItem("sessionId")

    if (!sessionId) {
        window.location = "/"
    }
}

check()


 document.addEventListener("DOMContentLoaded", (event) => {
        // Order status
        const orderstatus = document.getElementById('order-status')
        setTimeout(() => {
            orderstatus.set({
                summary: 'hi',
                total: '$3.99',
                progress: '24%'
            })
        }, 2000)
      
        //
        const chat = document.getElementById('chat')
        chat.addBaristaMessage('Hi, I have lots of ingredients and can use them to make many drinks. What would you like?')
        chat.addOptions([
            {
                name: 'Show Featured Drinks',
                id: 'featureddrink',
                value: 'featureddrink'
            },
            {
                name: 'Show Common Drinks',
                id: 'commondrink',
                value: 'commondrink'
            },
            {
                name: 'Let\'s make a drink',
                id: 'makedrink',
                value: 'makedrink'
            }
        ])
      


        

        let messages = [
            { role: "user", content: [{ type: 'text', text: 'Hi, I am a customer looking for some coffee'}]},
            { role: "assistant", content: [{ type: 'text', text: 'Hi, I am a Barista and have lots of ingredients and can use them to make many drinks. What would you like?'}]}
        ]

        let selection = 'none'
        let size = 'none'

        const sendMessage = async (message) => {
             messages.push({ role: "user", content: [{ type: 'text', text: message}]})
         
            const result = await api.sendMessage({messages})
            const resultJson = await result.json()

            messages.push({ role: "assistant", content: [{ type: 'text', text: resultJson.result}]})
            chat.addBaristaMessage(resultJson.result)
        }

        chat.addEventListener('action', ({detail}) => {
            const action = detail.value
       
            if (action === 'featureddrink') {
                chat.addBaristaMessage('Which drink would you like?')
                chat.addOptions([
                    {
                        name: 'Dark Coffee',
                        id: 'selection-darkcoffee',
                        value: 'selection-darkcoffee'
                    },
                    {
                        name: 'Mocha',
                        id: 'selection-mocha',
                        value: 'selection-mocha'
                    },
                    {
                        name: 'Latte',
                        id: 'selection-latte',
                        value: 'selection-latte'
                    }
                ])
            }

            if (action === 'commondrink') {
                chat.addBaristaMessage('Which drink would you like?')
                chat.addOptions([
                    {
                        name: 'Dark Coffee',
                        id: 'selection-darkcoffee',
                        value: 'selection-darkcoffee'
                    },
                    {
                        name: 'Light Coffee',
                        id: 'selection-lightcoffee',
                        value: 'selection-lightcoffee'
                    },
                    {
                        name: 'Americano',
                        id: 'selection-americano',
                        value: 'selection-americano'
                    }
                ])
            }

            if (action.startsWith('selection')) {
                const selected = action.split('-')[1]
                selection = selected
                chat.addBaristaMessage('What size?')
                chat.addOptions([
                    {
                        name: 'Small (12oz)',
                        id: 'small',
                        value: 'size-small'
                    },
                    {
                        name: 'Medium (16oz)',
                        id: 'medium',
                        value: 'size-medium'
                    },
                    {
                        name: 'Large (20dox)',
                        id: 'large',
                        value: 'size-large'
                    }
                ])
            }

            if (action.startsWith('size')) {
                const s = action.split('-')[1]
                size = s
                const message = `I would like you to make be a ${selection} in the size of ${size}`
                sendMessage(message)
            }
        })

        chat.addEventListener('submit', async ({detail}) => {
            const message = detail.value

            await sendMessage(message)
            // messages.push({ role: "user", content: [{ type: 'text', text: message}]})
         

            // const result = await api.sendMessage({messages})
            // const resultJson = await result.json()

            // messages.push({ role: "assistant", content: [{ type: 'text', text: resultJson.result}]})
            // chat.addBaristaMessage(resultJson.result)
        
        })

      

    });
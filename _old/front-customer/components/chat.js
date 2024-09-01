class MyChat extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        this.shadowRoot.innerHTML = /* html*/ `
        <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,500&display=swap"
            rel="stylesheet"
          />
        
        <style>

            * {
                
                font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-feature-settings: nor
                line-height: 1.6;
            }



            .container {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 0;
                left: 0;
                right: 0px;
                bottom: 0;
                background: #f0eceb;
            }

            .chat-window {
                display: flex;
                flex-direction: column;
                /* background: green; */
                flex: 1;
                margin-bottom: 10px;
                justify-content: flex-end;
                overflow-y: scroll;
                padding: 0;

            }

            .chat-window-scroll {
                overflow-y: scroll;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }

            .chat-window-scroll::-webkit-scrollbar {
                display: none;
            }

            .chat-input{
                display: flex;
                /* background: red; */
                flex: 0 0 40px;
                padding: 10px;
            }

            .chat-input input {
                border: none;
                border-radius: 10px;
                background: #eaebef;
               
                width: 100%;
                padding: 4px 12px;
                height: 36px;
                background: white;
                margin-right: 30px;
            }

            .chat-input input:focus {
                outline: none;
            }

            .chat-name {
                font-size: 14px;
                margin: 0;
                font-weight: bold;
                opacity: 0.9;
                display: flex;
                align-items: center;
                /* margin-bottom: 5px; */
            }

            .title {
              font-family: "Playfair Display", serif;
              font-weight: 500;
              font-style: italic;
              font-size: 16px;
            }

            .message {
                background: #232429;
                padding: 15px 15px;
                border-radius: 5px;
                /* margin: 10px; */
                font-size: 14px;
                color: white;
                margin-left: 8px;
            }

              .batrista-message {
                background: #232429;
                padding: 15px 15px;
                border-radius: 5px;
                /* margin: 10px; */
                font-size: 14px;
                  color: white;

                  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-feature-settings: nor
            }


            .actor-ai {
    
                background-color: #6d68f3;
                color: white;

                background-color: white;
                color: #000;

                margin: 16px 32px 0px 16px;
                padding: 8px 16px;
                border-radius: 12px;


                
            }

            .actor-me {
               
                background-color: #eaebef;
                color: #31276e;
                color: white;
                   background-color: transparent;
                color: #222;
            }

            /* loading */
            .typing-indicator {
               
                background-color: #ffffff;
                will-change: transform;
                height: 26px;
                width: 40px;
                border-radius: 2px 13px 13px 13px;
                // padding: 20px;
                display: flex;
                flex-flow: row nowrap;
                margin-left: 54px;
                position: relative;
                animation: 2s bulge infinite ease-out;
                justify-content: center;
                align-items: center;
            }
            .typing-indicator    span {
                    height: 6px;
                    width: 6px;
                    margin: 0 1px;
                    background-color: #9E9EA1;
                    display: block;
                    border-radius: 50%;
                    opacity: 0.4;

            }
                    /* @for $i from 1 through 3 {
                    &:nth-of-type(#{$i}) {
                        animation: 1s blink infinite ($i * .3333s);
                    }
                    }
                } */
                .typing-indicator    span:nth-of-type(1) {
                       animation: 1s blink infinite .3333s;
                }
                  .typing-indicator    span:nth-of-type(2) {
                       animation: 1s blink infinite .6666s;
                }
                  .typing-indicator    span:nth-of-type(3) {
                       animation: 1s blink infinite .9999s;
                }

                @keyframes blink {
                50% {
                    opacity: 1;
                }
                }

                @keyframes bulge {
                50% {
                    transform: scale(1.05);
                }}

                /* CODE STYLES */

                
        </style>
        <div class='container' id='container'>
            <div class='chat-window'>
            
            <div class='chat-window-scroll' id='chat-window-scroll'></div>
            </div>
            <div class='chat-input'>
                <input id='chat' placeholder='Chat...'/>
            </div>
        </div>
        `
    }

       connectedCallback() {
        this.shadowRoot
            .getElementById('chat')
            .addEventListener('keydown', (e) => {
                //

                if (e.key === 'Enter') {
                    const myEvent = new CustomEvent('submit', {
                        bubbles: true,
                        cancelable: true,
                        composed: false,
                        detail: {
                            value: this.shadowRoot.getElementById('chat').value
                        }
                    })

                    this.addMessage(
                       
                        this.shadowRoot.getElementById('chat').value
                    )

                    this.dispatchEvent(myEvent)

                    const div = document.createElement('div')
                    div.setAttribute('id', 'loading')
                    div.style.width = '100%'

                    div.innerHTML = `<div class='typing-indicator'><span></span>
  <span></span>
  <span></span></div>`
                    this.shadowRoot
                        .querySelector('.chat-window-scroll')
                        .appendChild(div)

                    this.shadowRoot.getElementById('chat').value = ''
                }
            })

        this.shadowRoot.getElementById('chat').focus()

        this.shadowRoot.getElementById('container').style.right = '-30px'
    }


    addBaristaMessage(text) {
        const loading = this.shadowRoot.getElementById('loading') 
        if (loading) {
            loading.remove()
        }

        const actor = 'actor-ai'
        const msg = document.createElement('div')

        msg.innerHTML = `<p class='chat-name title'> 
          
            ${actor === 'actor-ai' ? 'Barista' : 'You'}</p>
        <p style='margin: 0; font-size: 14px; line-height: 20px;'>${text}</p>`
        msg.classList.add('barista-message')
        msg.classList.add(actor)
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(msg)

        const t = document.createElement('p')
        t.innerHTML = formatTime()
        t.style.fontSize = '12px'
        t.style.opacity = '0.3'
        t.style.marginLeft = actor === 'actor-ai' ? '30px' : '40px'
        t.style.marginTop = '5px'
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(t)

        this.scrollDown()

     
    }

    addMessage( text) {
        const actor = 'actor-me'
        const msg = document.createElement('div')

    

        msg.innerHTML = `<p class='chat-name title'>You</p>
        <p style='margin: 0'>${text}</p>`
        msg.classList.add('message')
        msg.classList.add(actor)
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(msg)

        const t = document.createElement('p')
        t.innerHTML = formatTime()
        t.style.fontSize = '12px'
        t.style.opacity = '0.3'
        t.style.marginLeft = actor === 'actor-ai' ? '10px' : '40px'
        t.style.marginTop = '-5px'
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(t)

        this.scrollDown()

        
    }

    scrollDown = () => {
        // Queueing a microtask allows the dom elements to be attached before performing this action.
        window.queueMicrotask(() => {
            const chatWindow = this.shadowRoot.querySelector('.chat-window-scroll')
            chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight 
        })    
    }


    currentAction = false

    addOptions(options) {
        const id = Math.floor(Math.random() * 10000)

        this.currentAction = id

        const msg = document.createElement('div')
        msg.setAttribute('id', 'action-' + this.currentAction)
        msg.style = 'margin: 16px 32px 0px 16px;'
        const buttonStyle = `padding: 16px 8px; margin-right: 2px; margin-bottom: 4px; background: rgb(22, 101, 52); color: white; border: 2px solid rgb(22, 101, 52); border-radius: 6px; display: block; width: 100%; `

        let html = ''
        options.forEach(o => {
            html = html + `<button id='${o.id}' style="${buttonStyle}">${o.name}</button>`
        })

        msg.innerHTML = html
        
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(msg)

        const chatWindow = this.shadowRoot.querySelector('.chat-window-scroll')
        chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight


        options.forEach(o => {
              const myEvent = new CustomEvent('action', {
                bubbles: true,
                cancelable: true,
                composed: false,
                detail: {
                    value: o.value
                }
            })

            const container = this.shadowRoot.getElementById('action-' + this.currentAction)
            const buttons = container.children

            const thisButton = Array.from(buttons).filter(b => b.getAttribute('id') === o.id)[0]
              const otherButtons = Array.from(buttons).filter(b => b.getAttribute('id') !== o.id)


             const onClick = () => {
                this.dispatchEvent(myEvent)
               
               // thisButton.style.border = '2px solid rgb(12, 91, 42)'
                thisButton.setAttribute('disabled', true)
                otherButtons.forEach(b => {
                    b.style.background = 'rgb(194 209 200)'
                    b.style.border = '2px solid rgb(194 209 200)'
                    b.setAttribute('disabled', true)
                })

            }

            this.shadowRoot.getElementById(o.id).addEventListener('click', onClick)
        })

        this.scrollDown()

    }
}

/**
 * Function that takes Date.now() and turns it into format 7.23pm
 */
function formatTime() {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const hours12 = hours % 12 || 12
    const minutes12 = minutes < 10 ? `0${minutes}` : minutes
    return `${hours12}:${minutes12}${ampm}`
}

customElements.define('barista-chat', MyChat)
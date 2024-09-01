import api from '../services/api.js'

const styles = `<style>
* {
    box-sizing: border-box;
    font-family: sans-serif;
    margin: 0;
    padding: 0;

}</style>
`

class HomePage extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            ${styles}
            <div>
                <order-list></order-list>
                <div id='orders'></div>
            </div>
        `
        this.initData()
    }

    initData = async () => {

         const x = await api.getOrders({})
        const xx = await x.json() 

        this.shadowRoot.getElementById('orders').innerHTML = `<p>${JSON.stringify(xx)}</p>`
    }
}


customElements.define('home-page', HomePage)
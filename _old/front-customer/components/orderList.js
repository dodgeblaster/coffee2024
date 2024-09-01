const styles = `<style>
* {
    box-sizing: border-box;
    font-family: sans-serif;
    margin: 0;
    padding: 0;

}</style>
`

class OrderList extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `${styles}<p>OrderList</p>`
    }
}


customElements.define('order-list', OrderList)
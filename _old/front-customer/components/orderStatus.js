const styles = `<style>
* {
    box-sizing: border-box;
    font-family: sans-serif;
    margin: 0;
    padding: 0;

}



</style>
`

class OrderStatus extends HTMLElement {
    constructor() {
        super()
        //this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
    
        this.innerHTML = ` <div class='bg-white shadow p-4 rounded-xl w-[346px]'>
            <p class='title'>Your Order</p>
            <p class='text-xs' id='order-status-summary'>Summary: <span id='order-status-summary-value'></span></p>
            <p class='text-xs' id='order-status-total'>Total: <span id='order-status-total-value'></span></p>
            <p class='text-xs' id='order-status-progress-text'>Progress: <span id='order-status-progress-text-value'></span></p>
            <div class='flex rounded-full overflow-hidden w-full mt-4 bg-zinc-200 h-2 relative' id='order-status-progress'>
                <div class='absolute top-0 left-0 h-2 bg-green-800' id='order-status-progress-value'></div>
            </div>
         </div>`


         this.set({
            summary: 'None'
         })

    }

    set = (input) => {
        // Elements
        const summary = document.getElementById('order-status-summary')
        const total = document.getElementById('order-status-total')
        const progress = document.getElementById('order-status-progress')
        const progressText = document.getElementById('order-status-progress-text')


        // Values
        const summaryValue = document.getElementById('order-status-summary-value')
        const totalValue = document.getElementById('order-status-total-value')
        const progressTextValue = document.getElementById('order-status-progress-text-value')
        const progressValue = document.getElementById('order-status-progress-value')

        if (input.summary) {
            summary.style.display = 'block'
            summaryValue.textContent = input.summary
        } else {
            summary.style.display = 'none'
        }

        if (input.total) {
            total.style.display = 'block'
            totalValue.textContent = input.total
        } else {
            total.style.display = 'none'
        }

        if (input.progress) {
            progress.style.display = 'block'
            progressValue.style.width = input.progress
        } else {
            progress.style.display = 'none'
        }

          if (input.progressText) {
            progressText.style.display = 'block'
            progressTextValue.textContent = input.progressText
        } else {
            progressText.style.display = 'none'
        }
      
    }
}


customElements.define('order-status', OrderStatus)
const styles = `<style>
* {
    box-sizing: border-box;
    font-family: sans-serif;
    margin: 0;
    padding: 0;

}

.section {
    background: white;
    padding: 4px 8px;
      border-radius: 12px;
}

.card {
   overflow: hidden;
    border-radius: 12px;
    margin-bottom: 8px;
    display: flex;

}

.content {
     padding: 4px 8px;
}

.img {
    background-size: cover;
    height: 40px;
    width: 40px;
}


</style>
`

const featured = [
    {
        name: 'Drink 1',
        image: '',
        cost: [100,200,300]
    },
    {
        name: 'Drink 2',
        image: '',
        cost: [100,200,300]
    },
    {
        name: 'Drink 3',
        image: '',
        cost: [100,200,300]
    }
]

function makeItem(data) {
    return `
        <div class='card section'>
            <div class='img' style='background-image: url("/assets/cover.jpeg");'></div>
            <div class='content'>
                <p>${data.name}</p>
                <p>${data.cost[0]}</p>
            </div>
        </div>
    `
}

class FeaturedDrinks extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `${styles}
        <div class='sectio'>
        <p>Featured Drinks</p>
        ${featured.map(f => makeItem(f)).join('')}
        </div>`
    }
}


customElements.define('featured-drinks', FeaturedDrinks)
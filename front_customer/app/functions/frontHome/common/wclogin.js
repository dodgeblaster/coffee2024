class Login extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <div class="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
            <p>SLS Coffee</p>
            <button id="button" class="rounded px-4 py-2 bg-zinc-800 text-zinc-100 w-[200px] mb-2">
                Signin
            </button>
            <div id="signinresult"></div>
        </div>`

        const button = document.getElementById('button')
        const signinresult = document.getElementById('signinresult')

        button.addEventListener('click', async () => {
            const x = await app.api.post('/sendLoginEmail', {
                email: 'garysjenningsrise@gmail.com'
            })
            const xx = await x.json()

            signinresult.innerHTML = JSON.stringify(xx)
        })
    }
}

window.customElements.define('wc-login', Login)

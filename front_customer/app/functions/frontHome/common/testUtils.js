const render = (tag, attributes = {}) => {
    const htmlAttributes = Object.entries(attributes).reduce(
        (previous, current) => previous + ` ${current[0]}="${current[1]}"`,
        ''
    )
    document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`
    const requestComponent = (r) =>
        document.querySelector(tag)
            ? r(document.querySelector(tag))
            : window.requestAnimationFrame((r) => requestComponent(r))

    return new Promise(requestComponent)
}

const pass = (name = '') =>
    (document.body.innerHTML =
        document.body.innerHTML +
        /* HTML */ `
            <div class="mx-2 mb-1 rounded px-4 w-full">
                <span class="text-green-600 font-mono">✔ PASS </span>${name}
            </div>
        `)

const fail = (name) =>
    (document.body.innerHTML =
        document.body.innerHTML +
        /* HTML */ `
            <div class="mx-2 mb-1 rounded px-4  w-full">
                <span class="text-red-600 font-mono">● FAIL </span>${name}
            </div>
        `)

const next = () =>
    new Promise((r) =>
        setTimeout(() => {
            r()
        }, 0)
    )

let passResults = []
let failResults = []
const test = async (name, fn) => {
    try {
        await fn((x) => {
            if (!x) {
                throw new Error('fail')
            }
        })
        passResults.push(name)
    } catch (e) {
        failResults.push(name)
    }
}

const printResults = (name) => {
    document.body.innerHTML = `<h1 class='w-full font-bold text-white'>${name}</h1>`
    document.body.className = `h-screen w-[780px] m-auto flex items-center justify-center flex-col font-mono`
    document.body.style = 'background: #272c34; color: #5f6872;'
    passResults.forEach(pass)
    failResults.forEach(fail)
}
export default {
    render,
    fail,
    pass,
    next,
    test,
    printResults
}

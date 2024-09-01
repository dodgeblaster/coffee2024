const routes = {
    '/app': 'home-page',
    '/orders': 'order-page',
    '/not-found': 'not-found-page'
}



const Router = {
    init: () => {
        document.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', (event) => {
                event.preventDefault()
                const href = event.target.getAttribute('href')
                Router.go(href)
            })
        })

        window.addEventListener('popstate', (event) => {
            Router.go(event.state.route, false)
        })

        Router.go(location.pathname)
    },
    go: (route, addToHistory = true) => {
        if (addToHistory) {
            history.pushState({ route }, '', route)
        }
        let pageElement = null

        if (routes[route]) {
            pageElement = document.createElement(routes[route])
        }

        if (pageElement) {
            document.querySelector('main').innerHTML = ''
            document.querySelector('main').appendChild(pageElement)
        }

        window.scrollX = 0
    }
}

export default Router
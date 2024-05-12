barista (store service)

-   opens store
-   closes store
-   starts order
-   finishes order
-   cancels order
-   updates availabilty of item on menu
-   sees orders

menu (store service)

-   sees menu

store
pk: store*{id} sk: meta
barista
pk: store*{id} sk: barista\_{email} //this gets projected, and allows them to login
storestate
pk: store\*{id} sk: state state: OPEN

owner (owner service (over all stores))
This could include managers, who just see their own store

-   sets menu for all stores(add, remove, update) (gets projected into stores service)
-   adds barista to store
-   removes barista from store
-   sees money stats on all stores
-   sees barista average times

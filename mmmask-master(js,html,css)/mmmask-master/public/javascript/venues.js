const createVenue = document.getElementById('create')


createVenue.onclick = (event) => {
    window.location.assign('/venues/create')
}

function rowOnClick() {
    let table = document.getElementById('venueTable')
    let rows = table.rows
    for (let i = 1; i < rows.length; i++) {
        rows[i].onclick = (function () {
            return function () {
                const id = rows[i].id
                window.location.assign(`/venues/${id}`)
            }
        })(i)
    }
}

function init() {
    rowOnClick()
}
window.onload = init
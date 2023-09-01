const createConcertBtn = document.getElementById('createConcert')
const bandsSelector = document.getElementById('bands')
const statesSelector = document.getElementById('states')

createConcertBtn.onclick = (event) => {
    window.location.assign('/concerts/create')
}

bandsSelector.onchange = statesSelector.onchange = (event) => {
    sortTable(bandsSelector.value, statesSelector.value)
}

function rowOnClick() {
    let table = document.getElementById('concertTable')
    let rows = table.rows
    for (let i = 1; i < rows.length; i++) {
        rows[i].onclick = (function () {
            return function () {
                const id = rows[i].id
                window.location.assign(`/concerts/${id}`)
            }
        })(i)
    }
}

function init() {
    rowOnClick()
}
window.onload = init

function sortTable(bandName, state) {
    const rows = document.getElementsByTagName('tr')
    for (let index = 1; index < rows.length; index++) {
        const element = rows[index]
        const rowBandName = rows[index].childNodes[3].innerText
        const rowState = rows[index].childNodes[9].innerText
        if ((rowBandName === bandName || !bandName) && (rowState === state || !state))
            element.classList.remove('hidden')
        else element.classList.add('hidden')
    }
}

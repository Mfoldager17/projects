const toursTableRows = document.getElementsByClassName('tour')
const removeButtons = document.getElementsByClassName('remove')
const nameInput = document.getElementById('nameInput')
const bandSelect = document.getElementById('bandSelect')
const createButton = document.getElementById('create')

document.addEventListener('DOMContentLoaded', () => {
    for (const element of toursTableRows) {
        const childNodesNotRemove = element.getElementsByTagName('td')
        for (const el of childNodesNotRemove) {
            el.onclick = (event) => {
                const { id } = event.target.parentNode
                window.location.assign(`tours/${id}`)
            }
        }
    }

    for (const element of removeButtons) {
        element.onclick = async (event) => {
            const { id } = event.target.parentNode
            await deLete('/api/tours/' + id)
            event.target.parentNode.remove()
            showSnackbar('Tour slettet')
        }
    }

    createButton.onclick = async () => {
        if (!bandSelect.value) {
            showSnackbar('Vælg band')
            return
        }
        const newTour = {
            name: nameInput.value,
            band: bandSelect.value,
        }
        await post('/api/tours', newTour)
        showSnackbar('Tour oprettet')
        window.location.reload()
    }
})

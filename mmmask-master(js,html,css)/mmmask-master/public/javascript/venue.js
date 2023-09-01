const backBtn = document.getElementById('back')
const createBtn = document.getElementById('create')
const saveBtn = document.getElementById('save')
const deleteBtn = document.getElementById('delete')
const id = window.location.pathname.replace('/venues/', '')

backBtn.onclick = function () {
    window.location.assign(`/venues`)
}

deleteBtn.onclick = async function () {
    await deLete('/api/venues/' + id)
    window.location.assign(`/venues`)
}

saveBtn.onclick = async () => {
    const venue = {
        name: document.getElementById('name').value,
        address: {
            streetAndNumber: document.getElementById('street').value,
            zipAndCity: document.getElementById('zipAndCity').value
        }
    }
    try {
        await update('/api/venues/' + id, venue)
        showSnackbar('Spillested opdateret')
        window.location.assign('/venues')
    } catch (error) {
        showSnackbar('Der skete en fejl')
        console.log(error)
    }
}

createBtn.onclick = async () => {
    const venue = {
        name: document.getElementById('name').value,
        address: {
            streetAndNumber: document.getElementById('street').value,
            zipAndCity: document.getElementById('zipAndCity').value
        }
    }
    try {
        await post('/api/venues/create', venue)
        showSnackbar('Spillested oprettet')
        window.location.assign('/venues')
    } catch (error) {
        showSnackbar('Der skete en fejl')
        console.log(error)
    }
}
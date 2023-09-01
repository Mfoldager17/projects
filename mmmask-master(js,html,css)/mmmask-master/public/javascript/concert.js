const backBtn = document.getElementById('backButton')
const createBtn = document.getElementById('createButton')
const saveBtn = document.getElementById('saveButton')
const deleteBtn = document.getElementById('deleteButton')
const id = window.location.pathname.replace('/concerts/', '')

// BuTTONS

backBtn.onclick = function () {
    window.location.assign(`/concerts`)
}

createBtn.onclick = async () => {
    let bandIndex = document.getElementById('bands').selectedIndex
    let bandId = document.getElementById('bands')[bandIndex].id

    let promoterIndex = document.getElementById('promoters').selectedIndex
    let promoterId = document.getElementById('promoters')[promoterIndex].id

    const concertData = {
        band: bandId,
        promoter: promoterId,
        venue: {
            name: document.getElementById('venue').value,
            address: {
                streetAndNumber: document.getElementById('address').value,
                zipCodeAndCity: document.getElementById('zipCity').value
            }
        },
        time: {
            date: document.getElementById('date').value,
            start: document.getElementById('time').value,
            duration: document.getElementById('duration').value
        },
        capacity: document.getElementById('capacity').value,
        memo: document.getElementById('memo').value,
        state: document.getElementById('state').value
    }

    try {
        const tourId = new URLSearchParams(window.location.search).get('tourId')
        const concert = await post('/api/concerts/create', concertData)

        // If URL has tourId redirect to that tour else "refresh" concerts
        if (tourId) {
            await post(`/api/tours/${tourId}/concerts/${concert._id}`)
            window.location.assign(`/tours/${tourId}`)
        } else window.location.assign('/concerts')
    } catch (error) {
        console.log(error)
    }
}

saveBtn.onclick = async () => {
    const concert = {
        venue: {
            name: document.getElementById('venue').value,
            address: {
                streetAndNumber: document.getElementById('address').value,
                zipCodeAndCity: document.getElementById('zipCity').value
            }
        },
        time: {
            date: document.getElementById('date').value,
            start: document.getElementById('time').value,
            duration: document.getElementById('duration').value
        },
        capacity: document.getElementById('capacity').value,
        memo: document.getElementById('memo').value,
        state: document.getElementById('state').value
    }
    try {
        await update('/api/concerts/' + id, concert)
        window.location.assign('/concerts')
    } catch (error) {
        console.log(error)
    }
}

deleteBtn.onclick = async function () {
    await deLete('/api/concerts/' + id)
    window.location.assign(`/concerts`)
}

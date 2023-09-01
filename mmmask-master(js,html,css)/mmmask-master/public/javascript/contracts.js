const contractsTableRows = document.getElementsByClassName('contract')
const createButton = document.getElementById('create')

for (const element of contractsTableRows) {
    element.onclick = (event) => {
        const id = event.target.parentNode.id
        if (event.target.className === 'remove') remove(id)
        else window.location.assign(`contracts/${id}`)
    }
}

createButton.onclick = () => {
    window.location.assign(`contracts/create/new`)
}

// Replace 

async function remove(id) {
    await deLete('/api/contract/' + id)
    window.location.assign(`contracts`) // TODO: Muligvis nok bare fjern row
}

// DELETE
async function deLete(url) {
    const respons = await fetch(url, {
        method: 'DELETE'
    })
    if (respons.status !== 200) throw new Error(respons.status)
    return await respons.json()
}

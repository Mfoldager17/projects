////////////////// Show/Edit/Update
const backBtn = document.getElementById('back')
const editBtn = document.getElementById('edit')
const submitBtn = document.getElementById('submit')
const deleteBtn = document.getElementById('delete')
const buttonsField = document.getElementById('buttons')
const idElem = document.getElementById('band-id')

// Added before learning about contenteditable (see tour as example for future improvement)
let canEdit = true

/**
 *
 * When page is ready
 *
 * bind following buttons:
 *
 * 1. edit
 * 2. submit
 * 3. delete
 * 4. back
 *
 */
document.addEventListener('DOMContentLoaded', () => {
    if (editBtn) {
        editBtn.onclick = () => {
            canEdit = !canEdit
            setEditable(canEdit)
        }
    }
    submitBtn.onclick = () => submit()
    deleteBtn.onclick = () => remove()
    backBtn.onclick = () => window.location.assign(`/bands`)
})

/**
 * setEditable toggles inputfields on/off
 *
 * @param {Boolean} canEdit true for on
 */
function setEditable(canEdit) {
    const inputFields = document.querySelectorAll('input')
    inputFields.forEach((inputField) => (inputField.disabled = canEdit))
    if (buttonsField) buttonsField.classList.toggle('invisible', canEdit)
}

/**
 * getBand from the inputs
 *
 * @returns {Band}
 */
function getBand() {
    const id = idElem.value
    const band = {
        name: document.getElementById('name').value,
        companyName: document.getElementById('companyName').value,
        members: document.getElementById('members').value,
        "address.streetAndNumber": document.getElementById('address.streetAndNumber').value,
        "address.zipCodeAndCity": document.getElementById('address.zipCodeAndCity').value,
        cvrNr: document.getElementById('cvr').value,
        accNr: document.getElementById('accNr').value,
        regNr: document.getElementById('regNr').value,
        "contactPerson.name": document.getElementById('contactPerson.name').value,
        "contactPerson.phoneNr": document.getElementById('contactPerson.phoneNr').value,
        "contactPerson.mail": document.getElementById('contactPerson.mail').value
    }
    if (id) band.id = id
    return band
}

/**
 * submit the band as the fields is
 *
 * if successful message is show
 * else error is shown
 */
async function submit() {
    try {
        const band = getBand()
        let url = '/api/bands'
        if (band.id) {
            url += '/' + band.id
            await update(url, band)
        } else
            await post(url, band)
        setEditable(true)
        showSnackbar('Band oprettet/opdateteret')
        window.location.assign(`/bands`)
    } catch (error) {
        showSnackbar('Noget gik galt!')
    }
    // alert('Noget gik galt!')
}

/**
 * removes the band currently viewed,
 * if successful returns user to list of bands
 * else shows error
 */
async function remove() {
    const response = deLete('/api/bands/' + idElem.value)
    if (response) window.location.assign(`/bands`)
    else showSnackbar('Noget gik galt!')
}


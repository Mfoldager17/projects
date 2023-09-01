// const { get } = require("mongoose")

const idElement = document.getElementById('_id')
const backButton = document.getElementById('backButton')
const createButton = document.getElementById('createButton')
const editButton = document.getElementById('editButton')
const createInvoiceBtn = document.getElementById('createInvoice')
const saveButton = document.getElementById('saveButton')
const inputElements = document.querySelectorAll('#contract-info input')
const textareaElements = document.querySelectorAll('textarea')
const concertSelection = document.getElementById('concertSelect')
// BUTTONS
async function createInvoiceEvent() {
    if (createInvoiceBtn) {
        createInvoice.onclick = async () => {
            try {
                window.location.assign(`/invoices/create/${idElement.innerHTML}`)
            } catch (error) {
                console.log(error)
            }
        }
    }
}

// Back
backButton.onclick = () => {
    window.location.assign('/contracts')
}

// Create
createButton.onclick = async () => {
    if (changeList.length === 0) return
    const contract = createObject()
    try {
        await post('/api/contract/create', contract)
        backButton.click()
    } catch (error) {
        showSnackbar('Mangler kontraktnr og koncert eller ukent fejl')
        console.log(error)
    }
}

// Edit
editButton.onclick = () => {
    editButton.disabled = true
    saveButton.disabled = false
    setDisableOnAllEditableElements(false)
}

// Save
saveButton.onclick = async () => {
    if (changeList.length === 0) backButton.click()
    const id = idElement.innerHTML
    const contract = createContractObject()
    try {
        await update('/api/contract/edit/' + id, contract)
        backButton.click()
    } catch (error) {
        showSnackbar('Mangler kontraktnr og koncert eller ukent fejl')
        console.log(error)
    }
}

// SETUP

// Check if create new or edit
if (!idElement.innerHTML) setupNew()
else setupEdit()

// If create new
function setupNew() {
    editButton.style.display = 'none'
    saveButton.style.display = 'none'
    setDisableOnAllEditableElements(false)
    concertsSelections()
}

// If edit
async function setupEdit() {
    createButton.style.display = 'none'
    saveButton.disabled = true
    concertSelection.style.display = 'none'
    setDisableOnAllEditableElements(true)
    createInvoiceEvent()
}

// MISC

// If input field is changed, add to changeList + try to remove autocomplete
const changeList = []
for (const element of inputElements) {
    element.autocomplete = 'new-password'
    element.onchange = (event) => {
        changeList.push(event.target)
    }
}

// If textarea is clicked, add to changeList + try to remove autocomplete
for (const element of textareaElements) {
    element.autocomplete = 'new-password'
    element.onclick = (event) => {
        changeList.push(event.target)
    }
    element.oninput() // To update size according to input
}

// Disable or enable all editable elements
function setDisableOnAllEditableElements(boolean) {
    for (const element of inputElements) {
        element.disabled = boolean
    }
    for (const element of textareaElements) {
        element.disabled = boolean
    }
    concertSelection.disabled = boolean
}

// Returns contract object with changed properties
function createContractObject() {
    const contract = {}
    for (const element of changeList) {
        contract[element.id] = element.value
    }
    concertSelection.selectedIndex !== 0
        ? contract.concert = concertSelection.value
        : contract.concert = null
    return contract
}

// Populates selector
async function concertsSelections() {
    const concerts = await get('/api/concerts') // Kunne evt. hentes igennem handlebars
    concertSelection.onchange = (event) => {
        const index = event.target.selectedIndex
        if (!index) {
            clearElements(document.getElementsByClassName('promoter'))
            clearElements(document.getElementsByClassName('band'))
            clearElements(document.getElementsByClassName('concert'))
        } else updateElements(concerts[index - 1], 'concert.')
        // Workaround to update id taken fields
        document.getElementById('concert.band.address.streetAndNumber2').innerHTML = document.getElementById(
            'concert.band.address.streetAndNumber'
        ).innerHTML
        document.getElementById('concert.band.address.zipCodeAndCity2').innerHTML = document.getElementById(
            'concert.band.address.zipCodeAndCity'
        ).innerHTML
    }
}

// Recursive function to update html elements with given obj
function updateElements(obj, path) {
    for (const key of Object.keys(obj)) {
        if (obj[key] instanceof Object) updateElements(obj[key], path + key + '.')
        else changeElementValue(path + key, obj[key])
    }
}

function changeElementValue(id, value) {
    const element = document.getElementById(id)
    if (element) element.innerHTML = value
}

function clearElements(elements) {
    for (const element of elements) {
        element.innerHTML = ''
    }
}

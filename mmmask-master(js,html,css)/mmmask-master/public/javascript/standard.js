const saveBtn = document.getElementById('save-standard')
const inputElements = document.querySelectorAll('input')
const textareaElements = document.querySelectorAll('textarea')
const idElement = document.getElementById('_id')
const backButton = document.getElementById('back')

const changeList = []

// Returns standard object with changed properties
function createStandardObject() {
    const standard = {}
    for (const element of changeList) {
        standard[element.id] = element.value
    }
    return standard
}

function init() {
    // Save function
    saveBtn.onclick = async () => {
        if (changeList.length === 0) window.location.assign('invoices')
        const id = idElement.innerHTML
        const standard = createStandardObject()
        try {
            await update('/api/standard/' + id, standard)
            window.location.assign('invoices')
        } catch (error) {
            console.log(error)
        }
    }
    // If textarea is clicked, add to changeList + try to remove autocomplete
    for (const element of textareaElements) {
        element.autocomplete = 'new-password'
        element.onclick = (event) => {
            changeList.push(event.target)
        }
        element.oninput()
    }
    // If input field is changed, add to changeList + try to remove autocomplete
    for (const element of inputElements) {
        element.autocomplete = 'new-password'
        element.onchange = (event) => {
            changeList.push(event.target)
        }
    }
    // Back
    backButton.onclick = () => {
        window.location.assign('/invoices')
    }
}

window.onload = init

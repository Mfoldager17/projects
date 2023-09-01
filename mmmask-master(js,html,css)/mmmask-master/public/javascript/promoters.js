const createBtn = document.getElementById('create')
const createPromoterForm = document.getElementById('id-create-promoter')
const regretPromoters = new Map()

document.addEventListener('DOMContentLoaded', () => {
    // Select each promoter -> add toggle expand onclick
    document.querySelectorAll('.promoters .promoter').forEach((promoterElem) => {
        enableImgExpand(promoterElem)
    })

    // Select each promoter "submit" btn -> onclick edit
    document.querySelectorAll('.promoters .promoter #submit-or-edit').forEach((promoterSubmitBtn) => {
        promoterSubmitBtn.onclick = (elem) => {
            const promoterElem = promoterSubmitBtn.parentElement.parentElement.parentElement
            promoterEditClicked(promoterElem)
        }
    })

    // TODO: renskriv kommentaren her!! Select each promoter "submit" btn -> onclick edit
    document.querySelectorAll('.promoters .promoter #cancel-or-delete').forEach((promoterSubmitBtn) => {
        promoterSubmitBtn.onclick = (elem) => {
            const promoterElem = promoterSubmitBtn.parentElement.parentElement.parentElement
            promoterDeleteClicked(promoterElem)
        }
    })

    // Create promoter form toggle
    createBtn.onclick = () => togglePromoterForm()
    createPromoterForm.onclick = (elem) => (elem.target === createPromoterForm ? togglePromoterForm() : '')
    togglePromoterButtons(createPromoterForm, true)

    // Lastly deal with URL specifics
    handleURL()
})

/**
 * enableImgExpand
 * 
 * Enables img onclick to expand promoter element
 * Switches between the collapse/expand png
 */
function enableImgExpand(promoterElem) {
    promoterElem.querySelector('.img-expand-collapse').onclick = (event) => {
        if (event.target.parentElement === promoterElem) {
            togglePromoterExpand(promoterElem)
            const img = event.target
            img.src = img.src.match(/expand\.png/) ? '/images/collapse.png' : '/images/expand.png'
        }
    }
}


/**
 * togglePromoterButtons.
 *
 * Toggles promoter buttons between: Rediger/Gem and Slet/Fortryd
 * Toggle button action between: edit/save and delete/cancel
 */
function togglePromoterButtons(promoterElem, isEditable) {
    const submitOrEditBtn = promoterElem.querySelector('#submit-or-edit')
    const cancelOrDeleteBtn = promoterElem.querySelector('#cancel-or-delete')

    submitOrEditBtn.innerHTML = isEditable ? 'Gem' : 'Rediger'
    cancelOrDeleteBtn.innerHTML = isEditable ? 'Fortryd' : 'Slet'

    submitOrEditBtn.onclick = () =>
        isEditable ? promoterSubmitClicked(promoterElem) : promoterEditClicked(promoterElem)
    cancelOrDeleteBtn.onclick = () =>
        isEditable ? promoterCancelClicked(promoterElem) : promoterDeleteClicked(promoterElem)
}

/**
 * Called when cancel button is clicked
 *
 * Changes:
 *  1) buttons from edit,delete (bottom of frame)
 *  2) re-enables promoter expand toggle
 *  3) disables all input fields
 *
 * @param {Node} promoterElem
 */
function promoterCancelClicked(promoterElem) {
    togglePromoterButtons(promoterElem, false)

    setPromoterExpandDisabled(promoterElem, false)
    promoterElem.querySelectorAll('input').forEach((input) => (input.disabled = true))

    resetForm(promoterElem, regretPromoters)
}

/**
 * Called with the promoterElement to be deleted
 *
 * prompts user to confirm, simple alert if error
 *
 * @param {Node} promoterElem to delete
 */
async function promoterDeleteClicked(promoterElem) {
    const promoter = getEditedPromoter(promoterElem)
    const hasConfirmed = confirm(`Ønsker ud at slette ${promoter.name}?`)
    if (hasConfirmed) {
        const response = await fetch('/api/promoters/' + promoter._id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) window.location.reload()
        else alert('Sletning fejlede, prøv igen')
    }
}

/**
 * Called when edit button is clicked
 *
 * Changes:
 *  1) buttons from edit,delete (bottom of frame)
 *  2) enables all input fields
 *  3) disable promoter expand toggle
 *
 * @param {Edit} promoterElem
 */
function promoterEditClicked(promoterElem) {
    togglePromoterButtons(promoterElem, true)
    promoterElem.querySelectorAll('input').forEach((input) => (input.disabled = false))
    setPromoterExpandDisabled(promoterElem, true)
    saveRegret(promoterElem)
}

/**
 * Dis-/enables the toggle feature for given element.
 *
 * @param {Node} promoterElem
 * @param {Boolean} isDisabled if true promoterElem can't be toggle expanded
 */
function setPromoterExpandDisabled(promoterElem, isDisabled) {
    (isDisabled) ? null : enableImgExpand(promoterElem)
}

/**
 * Called when submit button is clicked.
 *
 *
 *
 * @param {Node} promoterElem
 */
async function promoterSubmitClicked(promoterElem) {
    // Begin by resetting hiding old errors (optimistic user expectation)
    const errorElem = document.querySelector(`#${promoterElem.id} #errors`)
    errorElem.classList.toggle('hidden', true)

    const promoter = getEditedPromoter(promoterElem)

    const modelledPromoter = {
        _id: promoter._id,
        name: promoter.name,
        address: {
            streetAndNumber: promoter.streetAndNumber,
            zipCodeAndCity: promoter.zipCodeAndCity
        },
        contactPerson: {
            name: promoter.attendant,
            phoneNr: promoter.phoneNr,
            mail: promoter.mail
        }
    }

    const errorList = validationErros(modelledPromoter)

    if (errorList.length > 0) {
        // TODO: Here
        setErrors(promoterElem, errorElem, errorList)
    } else {
        // TODO: reuse setErrors
        const serverError = await submitPromoter(modelledPromoter)
        if (serverError) {
            errorElem.innerHTML = ''
            errorElem.classList.toggle('hidden', false)
            errorElem.innerHTML = 'Server error (try again): ' + serverError
        } else window.location.reload()
    }
}

/**
 * Sets given errors to the promoter
 *
 * Reason errorElem is passed, is because it's read already and thus
 * saves a DOM read (but adds extra lines of code - remove?)
 *
 * @param {} promoterElem to style from
 * @param {} errorElem to put the paragraph of error message(s)
 * @param {Array} errors consisting of object with properties {selectorId, message}
 */
function setErrors(promoterElem, errorElem, errors) {
    // Part 1: Clean all previous errors
    errorElem.innerHTML = ''
    errorElem.classList.toggle('hidden', false)
    promoterElem.querySelectorAll('input.error').forEach((inputWithError) => {
        inputWithError.classList.remove('error')
    })

    // Part 2: No errors, no more work!
    if (!errors) return

    // Part 3: For each and every error add corrosponding message and css "error" class
    errors.forEach((error) => {
        const errorInput = document.querySelector(`#${promoterElem.id} #${error.selectorId}`)
        errorInput.classList.add('error')
        errorElem.innerHTML += error.message + '\n'
    })
}

function validationErros(promoter) {
    const errors = []
    if (promoter.name.length === 0)
        errors.push({
            selectorId: 'name',
            message: 'Navn skal udfyldes'
        })

    return errors
}

async function submitPromoter(promoter) {
    // submit request to patch endpoint
    const method = promoter._id ? 'PUT' : 'POST'
    const url = '/api/promoters/' + (promoter._id ? promoter._id : '')

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(promoter)
    })

    const hasError = !(response.status === 201 || response.status === 200)

    return hasError ? response.statusText : false
}

function getEditedPromoter(promoterElem) {
    const name = promoterElem.querySelector('#name').value
    const streetAndNumber = promoterElem.querySelector('#streetAndNumber').value
    // zipCodeAndCity
    const zipCodeAndCity = promoterElem.querySelector('#zipCodeAndCity').value
    const attendant = promoterElem.querySelector('#attendant').value
    const phoneNr = promoterElem.querySelector('#phoneNr').value
    const mail = promoterElem.querySelector('#mail').value

    const promoter = {
        name,
        streetAndNumber,
        zipCodeAndCity,
        attendant,
        phoneNr,
        mail
    }
    if (promoterElem.id !== 'id-create-promoter') promoter._id = promoterElem.id.substring(3)
    return promoter
}

/**
 * Toggles the promoter between expanded and minimized
 *
 * @param {Node} promoterElem to toggle
 * @param {Boolean=} isExpanded true if set to expand, if no value toggles current
 */
function togglePromoterExpand(promoterElem, isExpanded) {
    promoterElem.classList.toggle('expanded', isExpanded)
}

function togglePromoterForm() {
    const isCreating = !createPromoterForm.classList.toggle('expanded')
    createBtn.innerHTML = isCreating ? 'Opret' : 'Afbryd'
    resetForm(createPromoterForm)
}
/**
 * handleURL
 *
 * TODO: what's the proper name for this
 *
 * handles:
 *	- /create
 *	- /edit?id=:id			- id required
 */
function handleURL() {
    const windowLocation = window.location.pathname

    // Endpoint: /create
    if (windowLocation.match('/create$')) togglePromoterForm()

    // Endpoint: /edit
    if (windowLocation.match('/edit')) {
        const promoterId = new URL(window.location.href).searchParams.get('id')
        if (promoterId) togglePromoterExpand(document.getElementById('id-' + promoterId))
    }
}

function saveRegret(promoterElem) {
    regretPromoters.set(promoterElem.id, getEditedPromoter(promoterElem))
}

function resetForm(promoterElem) {
    regretPromoter = regretPromoters.get(promoterElem.id)
    promoterElem.querySelectorAll('input').forEach((input) => {
        input.value = regretPromoter ? regretPromoter[input.id] : ''
    })
    setErrors(promoterElem, promoterElem.querySelector(`#${promoterElem.id} #errors`), null)
}

const tourId = document.getElementById('tourId').innerHTML
const bandId = document.getElementById('bandId').innerHTML
const tourName = document.getElementById('tourName')
const backButton = document.getElementById('back')
const saveButton = document.getElementById('save')
const dropdownButton = document.getElementById('dropbtn')
const tourDaysTable = document.getElementById('tourDaysTable')
const addDatesButton = document.getElementById('addDates')
const bruttoTable = document.getElementById('bruttoTable')
const bruttoPopupTable = document.getElementById('bruttoPopupTable')
const addBruttoButton = document.getElementById('addBrutto')
const venueCloseButtonPopup = document.getElementById('close-popup')
const addVenueToBrutto = document.getElementById('add-venues-bruttolist')

document.addEventListener('DOMContentLoaded', () => {
    backButton.onclick = () => window.location.assign('/tours')
    saveButton.onclick = async () => await saveTour()
    addDatesButton.onclick = () => addTourDatesToTable()
    addBruttoButton.onclick = () => toggleVenuesPopup()
    dropdownButton.onclick = () => toggleDatesDropdown()
    venueCloseButtonPopup.onclick = () => toggleVenuesPopup()
    addVenueToBrutto.onclick = () => {
        updateBruttoListWithSelected()
        toggleVenuesPopup()
    }

    finishTourDayTable()
    finishBruttoListTable()
})

///////////// Tour day table ///////////////

/**
 * finishTourDayTable.
 *
 * For each row:
 *	1. format date
 *	2. add onclick to edit button
 *	3. add onclick to delete button
 *
 *	After:
 *	1. sort table
 */
function finishTourDayTable() {
    const tourDayRows = tourDaysTable.querySelectorAll('tbody tr')

    tourDayRows.forEach((row) => {
        // 1. format date
        const dateTd = row.querySelector('.date')
        const date = new Date(dateTd.innerHTML.trim())
        if (date.getDate()) dateTd.innerHTML = getDateString(date)
        // 2. add link if associated
        const concertId = row.getAttribute('data-concertid')
        if (concertId) {
            row.querySelector('.edit').onclick = () => window.location.assign(`/concerts/${concertId}`)
        }
        // 3.
        row.querySelector('.remove').onclick = (element) => element.target.parentElement.parentElement.remove()
    })
    sortTourTable()
}

function addTourDatesToTable() {
    const startDateValue = document.getElementById('startDate').value
    const endDateValue = document.getElementById('endDate').value
    const selected = document.querySelectorAll('#weekDays option:checked')

    if (!startDateValue || !endDateValue || selected.length < 1) {
        showSnackbar('Mangler input')
        return
    }

    const daysOfWeek = Array.from(selected).map((el) => el.value)

    const dates = getDatesBetween(startDateValue, endDateValue, daysOfWeek)
    dates.forEach((date) => addDateToTourTable(date))
    sortTourTable(tourDaysTable)
    toggleDatesDropdown()
    showSnackbar('Datoer tilføjet')
}

/**
 * getDatesBetween.
 *
 * @param {} startDateStr
 * @param {} endDateStr
 * @param {} daysOfWeek
 * @Returns {Array} of days between start and end
 */
function getDatesBetween(startDateStr, endDateStr, daysOfWeek) {
    const list = []
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    while (startDate <= endDate) {
        const date = new Date(startDate)
        if (daysOfWeek.includes(date.getDay().toString())) list.push(date)
        startDate.setDate(startDate.getDate() + 1)
    }
    return list
}

/**
 * addDateToTourTable.
 *
 * adds date to tour table
 *
 * @param {} date
 */
function addDateToTourTable(date) {
    const row = document.getElementById('tourDayRow').cloneNode(true)
    row.id = ''
    row.style.display = 'table-row'
    row.querySelector('.date').innerHTML = getDateString(date)
    row.onclick = (element) => element.target.parentElement.parentElement.remove()
    tourDaysTable.querySelector('tbody').appendChild(row)
}

function sortTourTable() {
    const getDate = (row) =>
        new Date(
            row
                .querySelector('.date')
                .innerHTML.trim()
                .split(/^\w*, /u)[1]
        )

    const table = document.querySelector('#tourDaysTable tbody')

    Array.from(table.querySelectorAll('tr'))
        .sort((row1, row2) => getDate(row1) - getDate(row2))
        .forEach((tr) => table.appendChild(tr))
}

function toggleDatesDropdown() {
    document.getElementById('dropdown-dates').classList.toggle('show')
}
///////////// BruttoList ///////////////
/**
 * finishBruttoListTable
 *
 * For each venue/row:
 *	1. Add onclick to remove btn
 *	2. Add onclick to create venue
 */
function finishBruttoListTable() {
    const bruttoListRows = bruttoTable.querySelectorAll('tbody tr') // aka: venues
    bruttoListRows.forEach((row) => addOnClickToBruttoButtons(row))
}

function addOnClickToBruttoButtons(row) {
    // 1. Remove Button
    row.querySelector('.remove').onclick = () => removeVenueFromBruttoList(row)
    // 2. Create Venue button
    addGotoConcertWithData(row.querySelector('.sendVenueButton'), row.getAttribute('data-id'))
}

/**
 * removeVenueFromBruttoList.
 *
 * Removes the venue from the Tour (db) and the table
 *
 * @param {} venueRow from the BruttoListTable
 */
function removeVenueFromBruttoList(venueRow) {
    venueRow.remove()
    moveVenue(bruttoPopupTable, venueRow)
}

function moveVenue(toTbl, venueRow) {
    const actionCell = toTbl.querySelector('tbody tr:first-child .action').cloneNode(true)
    venueRow.querySelector('.action').innerHTML = actionCell.innerHTML
    toTbl.querySelector('tbody').appendChild(venueRow)
    if (toTbl === bruttoTable) {
        addOnClickToBruttoButtons(venueRow)
    }
}

function updateBruttoListWithSelected() {
    // Get all selected rows
    const selectedRows = Array.from(
        document.getElementById('bruttoPopupTable').querySelectorAll('input[type=checkbox]:checked')
    ).map((cbox) => cbox.parentElement.parentElement)

    // Remove from popup then move to tour table
    selectedRows.forEach((venueRow) => {
        venueRow.remove()
        moveVenue(bruttoTable, venueRow)
    })
}

///////////// Tour modeling ///////////////

async function saveTour() {
    const tour = {
        name: tourName.innerHTML,
        tourDays: getTourDaysFromTable(),
        bruttoList: getVenuesFromBruttoListTable()
    }
    try {
        await update('/api/tours/' + tourId, tour)
        showSnackbar('Gemt')
    } catch (error) {
        showSnackbar('Fejl, prøv igen')
        console.log(error)
    }
}

function getTourDaysFromTable() {
    const tourDays = []

    tourDaysTable.querySelectorAll('tbody tr').forEach((row) => {
        const id = row.getAttribute('data-id')
        const note = row.querySelector('.notes').textContent
        const concertId = row.getAttribute('data-concertId')
        const date = !concertId ? row.querySelector('.date').innerHTML.trim() : undefined
        tourDays.push({ id, note, concert: concertId, date })
    })
    return tourDays
}

function getVenuesFromBruttoListTable() {
    return Array.from(bruttoTable.querySelectorAll('tbody tr')).map((row) => row.getAttribute('data-id'))
}

///////////// Helpers ///////////////

function getDateString(date) {
    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
}

function toggleVenuesPopup() {
    document.getElementById('popup-venues').classList.toggle('hidden')
}

function addGotoConcertWithData(element, venueId) {
    element.onclick = () => {
        window.location.assign(`/concerts/create?bandId=${bandId}&venueId=${venueId}&tourId=${tourId}`)
    }
}

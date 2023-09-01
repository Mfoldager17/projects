/*
 App.js
 Accessable through the entire app! (Like a global - https://youtu.be/s__rX_WL100)
 */

function copyToClipboard(value) {
    const clipboardFake = document.createElement('textarea')
    clipboardFake.value = value
    clipboardFake.setAttribute('readonly', '')
    document.body.appendChild(clipboardFake)
    clipboardFake.select()
    clipboardFake.setSelectionRange(0, 99999) // Mobile support
    document.execCommand('copy')
    clipboardFake.remove()
}

////////////////////////////////
//      "Global" variables  	//

const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
const months = [
    'Januar',
    'Februar',
    'Marts',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'December'
]

////////////////////////////////
//        HTTP METHODS				//

// GET
async function get(url) {
  const respons = await fetch(url)
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

// POST
async function post(url, data) {
  const respons = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  if (respons.status !== 201 && respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

// UPDATE/PUT
async function update(url, data) {
  const respons = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

// DELETE
async function deLete(url) {
  const respons = await fetch(url, {
    method: "DELETE"
  })
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

// SNACKBAR
const snackbar = document.getElementById("snackbar")

// Show text on snackbar at bottom of page
function showSnackbar(text) {
  snackbar.innerHTML = text
  snackbar.className = "show"
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "")
  }, 3000)
}

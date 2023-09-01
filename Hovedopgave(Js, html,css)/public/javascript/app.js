/////////////////////////////////////////////////////
///////////////// HTTP HELP METHODS /////////////////

/**
 * @param {String} url of API 
 * @param {Object} data 
 * @returns created profile to the API and DB
 */
async function post(url, data) {
  const respons = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  if (respons.status !== 201 && respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

/**
* @param {String} url of API
* @returns The Json object from the HTTP call.
*/
async function get(url) {
  const respons = await fetch(url)
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

async function update(url, data) {
  const respons = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

async function deLete(url) {
  const respons = await fetch(url, {
    method: "DELETE"
  })
  if (respons.status !== 200) throw new Error(respons.status)
  return await respons.json()
}

/////////////////////////////////////////////////////


/**
 * Used to show snackbar in the bottom of a webside
 * Remember to create a div#snackbar in your HTML file for this to work on the specifik page
 * @param {String} text is the text inside the snackbar
 */
function getSnackbar(text) {

  var snackbar = document.getElementById("snackbar");

  // Set the text of snackbar
  snackbar.innerHTML = text

  // Add the "show" class to DIV
  snackbar.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 7000);
}


const bandlistElem = document.getElementById('bandlist')
const createBtn = document.getElementById('create')

bandlistElem.onclick = (event) => {
   const id = event.target.id
   window.location.assign(`/bands/edit?id=${id}`)
}

createBtn.onclick = (event) => {
   window.location.assign('/bands/create')
}

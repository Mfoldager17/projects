const createBtn = document.getElementById('create')
const editStandardBtn = document.getElementById('edit-standard')

/**
 * rowOnClick.
 * Function sets functionality to all invoice elements in the table
 */
function rowOnClick() {
    let table = document.getElementById('invoice-list')
    let rows = table.rows
    for (let i = 1; i < rows.length; i++) {
        rows[i].onclick = (function () {
            return function () {
                const id = rows[i].id
                console.log(id)
                window.location.assign(`/invoices/${id}`)
            }
        })(i)
    }
}

/**
 * init on page load
 */
function init() {
    rowOnClick()
    createBtn.onclick = () => {
        try {
            window.location.assign('/invoices/create')
        } catch (error) {
            console.log(error)
        }
        
    }
    editStandardBtn.onclick = () => {
        window.location.assign('standards')
    }
}

window.onload = init
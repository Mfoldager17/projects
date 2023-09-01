const createBtn = document.getElementById('create')
const addProduct = document.getElementById('addProduct')
const backButton = document.getElementById('back')
const productTable = document.getElementById('productTable')
// =============== invoice elements
const id = document.getElementById('_id')
// Top part of the document
const elemInvoiceTitle = document.getElementById('invoiceTitle')
const elemCustomerName = document.getElementById('customer-name')
const elemCustomerStreetAndNumber = document.getElementById('customer-streetAndNumber')
const elemCustommerZipAndCity = document.getElementById('customer-zipAndCity')
const elemCustomerAttendant = document.getElementById('customer-attendant')
const elemExtraDescription = document.getElementById('extra-description')
const elemOtherRef = document.getElementById('other-ref')
// Middle part of the document
const elemTaxFreeAmount = document.getElementById('tax-free-amount')
const elemTaxedAmount = document.getElementById('taxed-amount')
const elemSubtotal = document.getElementById('subtotal')
const elemTotalTax = document.getElementById('total-tax')
const elemTotalPrice = document.getElementById('total-price')
const elemNettoDays = document.getElementById('nettoDays')
const elemPaymentDescription = document.getElementById('payment-description')
const elemPaymentRegNo = document.getElementById('payment-regNo')
const elemPaymentAccountNo = document.getElementById('payment-accountNo')
const elemRequirementDescription = document.getElementById('requirement-description')
// Agent part of the document
const elemAgenturName = document.getElementById('agent-name')
const elemAgentStreetAndNumber = document.getElementById('agent-streetAndNumber')
const elemAgentZipAndCity = document.getElementById('agent-zipAndCity')
const elemAgentCountry = document.getElementById('agent-country')
const elemAgentCVR = document.getElementById('agent-cvr-number')
const elemAgentTelephone = document.getElementById('telephone')
const elemAgentEmail = document.getElementById('email')
const elemAgentWebpage = document.getElementById('webpage')
const elemAgentBank = document.getElementById('agent-bank')
const elemAgentRegNo = document.getElementById('agent-regNo')
const elemAgentAccountNo = document.getElementById('agent-accountNo')
// ===============
// Used for tax and total calculations
let calcTaxList = []

/**
 * generateDate.
 * Generates a date to be used as the invoice date.
 * It formats the date to the danish standard
 */
function generateDate() {
    let date = new Date()
    let dd = date.getDate()
    let mm = date.getMonth() + 1
    let y = date.getFullYear()
    return dd + '-' + mm + '-' + y
}
/**
 * generateDueDate.
 * Generates an invoice due date calculated by the input field nettoDays
 * It formats the date to the danish standard
 */
function generateDueDate(nettoDays) {
    let date = new Date()
    date.setDate(date.getDate() + parseInt(nettoDays))
    let dd = date.getDate()
    let mm = date.getMonth() + 1
    let y = date.getFullYear()
    return dd + '-' + mm + '-' + y
}

// =================================== TABLE AND ECONOMY FUNCTIONS

/**
 * createProductList.
 * Generates a list of products from the table inputs.
 */
function createProductList() {
    const products = document.querySelectorAll('.productInvoice')
    let productList = []
    let i = 1
    for (const product of products) {
        if (
            product.children[1].innerHTML == '' ||
            product.children[2].innerHTML == '' ||
            product.children[3].innerHTML == ''
        )
            return false

        const quantityString = product.children[1].innerHTML.trim().match(/[\d,.]*/)
        const priceString = product.children[2].innerHTML.trim().match(/[\d,.]*/)
        const priceWithTaxString = product.children[3].innerHTML.trim().match(/[\d,.]*/)

        const quantity = parseFloat(
            quantityString[0].replace(/[,.]/g, function ($1) {
                return $1 == '.' ? '' : '.'
            })
        )
        const price = parseFloat(
            priceString[0].replace(/[,.]/g, function ($1) {
                return $1 == '.' ? '' : '.'
            })
        )
        const priceWithTax = parseFloat(
            priceWithTaxString[0].replace(/[,.]/g, function ($1) {
                return $1 == '.' ? '' : '.'
            })
        )

        const productObject = {
            productId: i,
            productSpec: product.children[0].innerHTML,
            quantity: quantity,
            price: price,
            priceWithTax: priceWithTax
        }
        productList.push(productObject)
        i++
    }
    calcTaxList = productList
    return productList
}

/**
 * calcTaxFreeAmount.
 * Calculates the total price-amount that is not taxed.
 */
function calcTaxFreeAmount() {
    let taxFreeAmount = 0.0
    for (const p of calcTaxList) {
        if (p.quantity * p.price === p.priceWithTax) taxFreeAmount += p.quantity * p.price
    }
    return taxFreeAmount
}

/**
 * calcTaxAmount.
 * Calculates the total price-amount that is taxed.
 */
function calcTaxedAmount() {
    let taxedAmount = 0.0
    for (const p of calcTaxList) {
        if (p.quantity * p.price !== p.priceWithTax) taxedAmount += p.quantity * p.price
    }
    return taxedAmount
}

/**
 * calcSubTotal.
 * Calculates the subtotal.
 */
function calcSubtotal() {
    return calcTaxFreeAmount() + calcTaxedAmount()
}

/**
 * calcSubTotal.
 * Calculates the tax.
 */
function calcTax() {
    return calcTaxedAmount() * 1.25 - calcTaxedAmount()
}

/**
 * calcSubTotal.
 * Calculates the total amount to be paid.
 */
function calcTotalPrice() {
    return calcTaxedAmount() * 1.25 + calcTaxFreeAmount()
}

/**
 * updateEconomyInput.
 * Updates the economy fields according to the table value.
 */
function updateEconomyInput() {
    const update = createProductList()
    if (update) {
        elemTaxFreeAmount.value = calcTaxFreeAmount().toFixed(2) + ' DKK'
        elemTaxedAmount.value = calcTaxedAmount().toFixed(2) + ' DKK'
        elemSubtotal.value = calcSubtotal().toFixed(2) + ',-'
        elemTotalTax.value = calcTax().toFixed(2) + ',-'
        elemTotalPrice.value = calcTotalPrice().toFixed(2) + ',-'
    } else {
        elemTaxFreeAmount.value = 'Mangler felt i tabellen'
        elemTaxedAmount.value = 'Mangler felt i tabellen'
        elemSubtotal.value = 'Mangler felt i tabellen'
        elemTotalTax.value = 'Mangler felt i tabellen'
        elemTotalPrice.value = 'Mangler felt i tabellen'
    }
}

// =================================== Thickest create object function!

/**
 * createInvoiceObject.
 * Creates an invoice object to parsed to the create post's body
 */
function createInvoiceObject() {
    // Generate date for invoice and set due date according to set netto date
    const invoiceDate = generateDate()
    const dueDate = generateDueDate(elemNettoDays.value)
    const productList = createProductList()

    const invoice = {
        invoiceTitle: elemInvoiceTitle.value,
        customerInfo: {
            name: elemCustomerName.value,
            address: {
                streetAndNumber: elemCustomerStreetAndNumber.value,
                zipAndCity: elemCustommerZipAndCity.value
            },
            attendant: elemCustomerAttendant.value
        },
        extraDescription: elemExtraDescription.value,
        invoiceDetails: {
            invoiceDate: invoiceDate,
            ref: elemOtherRef.value
        },
        productList: productList,
        taxInfo: {
            taxFreeAmount: calcTaxFreeAmount().toFixed(3),
            taxAmount: calcTaxedAmount().toFixed(3)
        },
        totalPriceWithTax: {
            subtotal: calcSubtotal().toFixed(3),
            tax: calcTax().toFixed(3),
            totalPrice: calcTotalPrice().toFixed(3)
        },
        paymentDetails: {
            conditions: {
                daysToPay: elemNettoDays.value,
                inDueDate: dueDate
            },
            bankDetails: {
                description: elemPaymentDescription.value,
                regNo: elemPaymentRegNo.value,
                accountNo: elemPaymentAccountNo.value
            },
            paymentRequirement: {
                description: elemRequirementDescription.value
            }
        },
        agentInformation: {
            companyDetails: {
                name: elemAgenturName.value,
                address: {
                    streetAndNumber: elemAgentStreetAndNumber.value,
                    zipAndCity: elemAgentZipAndCity.value,
                    country: elemAgentCountry.value
                },
                CVR: elemAgentCVR.value
            },
            contactInformation: {
                telephone: elemAgentTelephone.value,
                email: elemAgentEmail.value,
                web: elemAgentWebpage.value
            },
            bankInformation: {
                bank: elemAgentBank.value,
                accountDetails: {
                    regNo: elemAgentRegNo.value,
                    accountNo: elemAgentAccountNo.value
                }
            }
        }
    }
    return invoice
}

// Add onclick to remove from lists
function addRemoveOnclick() {
    const removeClassElements = document.getElementsByClassName('remove')

    for (const element of removeClassElements) {
        element.onclick = () => {
            element.parentElement.parentElement.remove()
            updateEconomyInput()
        }
    }
}

/**
 * addCreateEvent
 * Creates an invoice according to the information placed in the input fields
 */
function addCreateEvent() {
    createBtn.onclick = async () => {
        const invoice = createInvoiceObject()
        try {
            await post('/api/invoices/create', invoice)
            backButton.click()
        } catch (error) {
            console.log(error)
        }
    }
}

/**
 * onNewLoad.
 * If theres an invoice passed with the hbs it'll lock all editable fields
 * If there's not it'll create functionality for the creating invoices and adding products to the product-table
 */
function onNewLoad() {
    backButton.onclick = () => {
        window.location.assign('/invoices')
    }
    if (id) {
        const allTextareas = document.querySelectorAll('textarea')
        const allInputs = document.querySelectorAll('input')
        for (const textarea of allTextareas) textarea.readOnly = true
        for (const inputs of allInputs) inputs.readOnly = true
        return
    }
    addCreateEvent()
    updateEconomyInput()
    addProduct.onclick = () => {
        let row
        row = `<tr class ="productInvoice">
                <td class="product" contenteditable onblur="updateEconomyInput()"></td>
                <td class="quantity" contenteditable onblur="updateEconomyInput()"></td>
                <td class="price" contenteditable onblur="updateEconomyInput()"></td>
                <td class="total-with-tax" contenteditable onblur="updateEconomyInput()"></td>
                <td><button class="remove" >Slet</button></td></tr>`
        productTable.innerHTML += row
        addRemoveOnclick()
        updateEconomyInput()
    }
}

// Setup
window.onload = onNewLoad

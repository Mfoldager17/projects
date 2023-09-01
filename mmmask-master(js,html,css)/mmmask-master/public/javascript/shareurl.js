const shareBtn = document.getElementById('shareurl')
const expirationForm = document.getElementById('form-expiration')
const expirationInDays = document.getElementById('expirationInDays')
const tooltip = document.getElementById('myTooltip')

async function getToken(urlpath) {
    const token = await post('/api/token', { urlpath: urlpath, expirationInDays: 50 })
    return token
}

async function getUrlWithToken() {
    const url = window.location
    return url + `?token=${await getToken(url.pathname)}`
}

function closeShare() {
    shareBtn.innerHTML = 'Del side'
    tooltip.innerHTML = 'Kopier til udklipsholder'
    expirationForm.classList.toggle('visible', false)
}

document.addEventListener('DOMContentLoaded', () => {
    tooltip.innerHTML = 'Kopier til udklipsholder'
    shareBtn.onclick = async () => {
        if (shareBtn.innerHTML === 'Kopiér link') {
            copyToClipboard(await getUrlWithToken())
            closeShare()
            tooltip.innerHTML = 'Kopiéret'
        } else {
            tooltip.innerHTML = 'Udfyld gyldighedsperiode, i dage!'
            shareBtn.innerHTML = 'Kopiér link'
            expirationForm.classList.toggle('visible', true)
        }
    }

    shareBtn.onmouseout = () => {}
})

const name = document.querySelector('#name')
const password = document.querySelector('#password')
const login = document.querySelector('#login')
const logout = document.querySelector('#logout')
// TODO: Rename til noName/noPassword
const noName = document.querySelector('#noName')
const noPassword = document.querySelector('#noPassword')

if (login) {
    login.onclick = async () => {
        try {
            if (!name.value) {
                noName.innerText = 'Brugernavn mangler'
                noName.classList.toggle('hidden', false)
            } else noName.classList.toggle('hidden', true)
            if (!password.value) {
                noPassword.classList.toggle('hidden', false)
            } else noPassword.classList.toggle('hidden', true)
            if (name.value && password.value) {
                const res = await post('/login', { name: name.value, password: password.value })
                // noName.classList.toggle('hidden', true)
                // noPassword.classList.toggle('hidden', true)
                if (res.authenticated === true) {
                    const windowLocation = window.location.pathname
                    if (windowLocation === '/login') window.location.assign('/')
                    else window.location.reload()
                }
            }
        } catch (e) {
            console.log(e)
            password.value = ''
            noName.innerText = 'Forkert brugernavn eller password'
            noName.classList.toggle('hidden', false)
        }
    }
}

if (logout) {
    logout.onclick = () => {
        window.location.assign('/login/logout')
    }
}

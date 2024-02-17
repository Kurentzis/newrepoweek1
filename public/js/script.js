console.log('loaded')
function shwPass(btn) {
    console.log('Hi!')
    let password = document.getElementById('account_password')
    if(password.type == 'password') {
        password.setAttribute('type', 'text')
        btn.innerText = 'Hide password'
    } else {
        password.setAttribute('type', 'password')
        btn.innerText = 'Show password'
    }
}

function checkValidity(element) {
    console.log('Hi!')
    if (element.validity.valid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
    }
}

// const inputFields = document.querySelectorAll('.input');







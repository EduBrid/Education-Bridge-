 
// Regex that checks if the Email is valid.
function checkEmail(email) {
    const regexEmail = new RegExp(/^(?!\.)\w{0,20}(\.\w{1,2})?\w{0,20}(?<!\.)@edu\.ma$/)
    if(regexEmail.test(email)) {
        return true
    }
    return false
}

// Regex that checks if the Password is valid.
function checkPassword(password) {
    const regexPass = new RegExp(/^[\w\W]{8,}$/)
    if(regexPass.test(password)) {
        return true
    }
    return false
}

// Function to hide and show password content
function hideAndShowPassword(passwordRef, eyeIcon) {
    eyeIcon.addEventListener('click', function (e) {
        const type = passwordRef.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordRef.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    })
}
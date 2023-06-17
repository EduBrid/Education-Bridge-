isLogedin()

const emailRef = document.getElementById('email')
const passwordRef = document.getElementById('password')
const eyeIcon = document.getElementById('eye-icon')

hideAndShowPassword(passwordRef, eyeIcon)

function checkAndExecute() {

    const divErrorMsg = document.getElementById('errorMsg')

    const email = emailRef.value
    const password = passwordRef.value

    // Send an AJAX request to PHP script if Email and Password are valid.
    if (!checkEmail(email)) {
        divErrorMsg.style.display = "block"
        divErrorMsg.innerHTML = "Invalid Email!"
    } else if(!checkPassword(password)) {
        divErrorMsg.style.display = "block"
        divErrorMsg.innerHTML = "Invalid Password! Password at least contains 8 characers one digit and one uppercase character"
    } 
    else {
        $.ajax({
            type: 'GET',
            url: "login.php",
            data: {action_num: 1, email: email, password: password},
            success: (response) => {
                console.log(response)
                if(response == "-1") {
                    passwordRef.value = ""
                    divErrorMsg.style.display = "block"
                    divErrorMsg.innerHTML = "Incorrect Email or Password!"
                } else {
                    let adminData = JSON.parse(response)
                    console.log(adminData.first_name)
                    // Open the admin main page.
                    window.location.href = "dashboard.html"
                }
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }
}

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "login.php",
        data: {action_num: 0},
        success: (response) => {
            console.log(response)
            if(response == '0') {
                window.location.href = "dashboard.html"
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}
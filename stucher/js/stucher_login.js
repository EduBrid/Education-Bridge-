isLogedin()

var userType = 'teachers'

const emailRef = document.getElementById('email')
const passwordRef = document.getElementById('password')
const eyeIcon = document.getElementById('eye-icon')
const student = document.getElementById('btn-student')
const teacher = document.getElementById('btn-teacher')

hideAndShowPassword(passwordRef, eyeIcon)

student.addEventListener('click', function(){
    student.setAttribute('class', "active")
    teacher.setAttribute('class', "")
    userType = 'students'
})

teacher.addEventListener('click', function(){
    teacher.setAttribute('class', "active")
    student.setAttribute('class', "")
    userType = 'teachers'
})

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
        divErrorMsg.innerHTML = "Invalid Password!"
    } else {
        $.ajax({
            type: 'GET',
            url: "stucher_login.php",
            data: {action_num: 1, email: email, password: password, user_type: userType},
            success: (response) => {
                console.log(response)
                if(response == "-1") {
                    passwordRef.value = ""
                    divErrorMsg.style.display = "block"
                    divErrorMsg.innerHTML = "Incorrect Email or Password!"
                } else {
                    let data = JSON.parse(response)
                    if(userType == "teachers") {
                        window.location.href = "teacher_profile.html"
                    } else {
                        window.location.href = "student_profile.html"
                    }
                    
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
        url: "stucher_login.php",
        data: {action_num: 0},
        success: (response) => {
            // console.log(response)
            if(response == '0') {
                window.location.href = "teacher_profile.html"
            } else if(response == '1') {
                window.location.href = "student_profile.html"
            } 
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}
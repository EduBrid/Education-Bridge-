
$('#btn-edit-profile').click(function() {
    $('#edit-profile-modal').modal('show')
    $('#old-password').val('')
    $('#new-password').val('')
    $('#confirm-password').val('')

})
$('#btn-cancel-edit').click(function() { $('#edit-profile-modal').modal('hide') })
$('#btn-close-edit').click(function() { $('#edit-profile-modal').modal('hide') })
$('#btn-save-edit').click(function() { 
    console.log('btn is clicked!')
    if($('#new-password').val() === $('#confirm-password').val()) {
        myData = {
            action_num: 2,
            password: $('#old-password').val(),
            password_confirm: $('#new-password').val()
        }
        updatePassword(myData)
    } else {
        console.log("passwords are not similars!")
    }
    
})

getStudentInfo()

function getStudentInfo() {
    $.ajax({
        type: 'GET',
        url: "student_profile.php",
        data: {action_num: 1},
        success: (response) => {
            // console.log(response)
            setStudentInfo(JSON.parse(response))
    
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function setStudentInfo(data) {
    console.log(data)
    $('#full-name').text(`${data['first_name']} ${data['last_name']}`)
    $('#email').text(data['email'])
    $('#gender').text(data['gender'])
    $('#birth-date').text(data['birth_date'])
    $('#student-id').text(data['student_id'])
    $('#student-class').text(data['class'])

}

function updatePassword(data) {
    $.ajax({
        type: 'GET',
        url: "student_profile.php",
        data: data,
        success: (response) => {
            console.log(response)
            if(response == "-1") {
                console.log('your password is wrong')
            } else if(response == "-2") {
                console.log('something went wrong')
            } else {
                console.log('update is success')
                $('#edit-profile-modal').modal('hide') 
                // setAdminInfo(JSON.parse(response))
            }
    
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}



isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "student_profile.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                getStudentInfo()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}
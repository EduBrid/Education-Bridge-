

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
            password: $('#password').val(),
            password_confirm: $('#new-password').val()
        }
        updatePassword(myData)
    } else {
        console.log("passwords are not similars!")
    }
    
})


function getTeacherInfo() {
    $.ajax({
        type: 'GET',
        url: "teacher_profile.php",
        data: {action_num: 1},
        success: (response) => {
    
            setTeacherInfo(JSON.parse(response))
    
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function setTeacherInfo(data) {
    console.log(data)
    $('#full-name').text(`${data['first_name']} ${data['last_name']}`)
    $('#email').text(data['email'])
    $('#gender').text(data['gender'])
    $('#birth-date').text(data['birth_date'])

    let subjects = data['subjects']
    let subjectsSpans = ""
    Object.keys(subjects).forEach(function(key) {
        var value = subjects[key]
        subjectsSpans += `<span>${value}</span>`
    })
    $('#subjects-list li').html(subjectsSpans)
    
    let classes = data['classes']
    let classesSpans = ""
    Object.keys(classes).forEach(function(key) {
        var value = classes[key]
        classesSpans += `<span>${value}</span>`
    })
    $('#classes-list li').html(classesSpans)



}

function updatePassword(data) {
    $.ajax({
        type: 'GET',
        url: "teacher_profile.php",
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
        url: "teacher_profile.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                getTeacherInfo()

            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

isLogedin()

$('#div-edit-password').hide()
$('#label').hide()
var adminInfo = []
var isEdit = true

$('#btn-edit-password').click(function() {

    if(isEdit) {
        $('#password').attr('placeholder', 'old password')
        $('#div-edit-password').show()
        $('#label').show()
        $('#btn-edit-password').text('Cancel')
        console.log('if: change password as well')
        isEdit = false
    } else {
        $('#password').attr('placeholder', 'password')
        $('#div-edit-password').hide()
        $('#label').hide()
        $('#btn-edit-password').text('Edit')
        console.log('else: do not change password')
        isEdit = true
    }
    
}) 

$('#btn-edit-profile').click(function() { 
    $('#edit-profile-modal').modal('show') 

    $('#edit-email').val(adminInfo.email)
    $('#edit-first-name').val(adminInfo.first_name)
    $('#edit-last-name').val(adminInfo.last_name)

    $('#password').val('')
    $('#new-password').val('')
    $('#confirm-password').val('')
    $('#div-edit-password').hide()
    $('#label').hide()
    $('#btn-edit-password').text('Edit')
    $('#password').attr('placeholder', 'password')
    isEdit = true


})


$('#btn-cancel-edit').click(function() { $('#edit-profile-modal').modal('hide') })
$('#btn-close-edit').click(function() { $('#edit-profile-modal').modal('hide') })
$('#btn-save-edit').click(function() { 
    myData = {
        action_num: 4,
        first_name: $('#edit-first-name').val(),
        last_name: $('#edit-last-name').val(),
        email: $('#edit-email').val(),
        password: $('#password').val(),
    }
    if(isEdit) {
        updateAdminInfo(myData)
        console.log('if is called')
    } else {
        console.log('else is called')
        if($('#new-password').val() === $('#confirm-password').val()) {
            console.log($('#new-password').val())
            myData['action_num'] = 5
            myData['password_confirm'] = $('#new-password').val()
            console.log(myData)
            updateAdminInfo(myData)
        } else {
            console.log("passwords are not similar!")
        }

    }
})




function getAdminInfo() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 1},
        success: (response) => {
    
            setAdminInfo(JSON.parse(response))
    
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function getNumOfTeachers() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 2},
        success: (response) => {
            console.log(response)
            $('#num-teachers').text(response)
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function getNumOfStudents() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 3},
        success: (response) => {
            console.log(response)
            $('#num-students').text(response)
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function getNumOfFiles() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 6},
        success: (response) => {
            console.log(response)
            $('#num-files').text(response)
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function getNumOfVideos() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 7},
        success: (response) => {
            console.log(response)
            $('#num-videos').text(response)
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                getAdminInfo()
                getNumOfTeachers()
                getNumOfStudents()
                getNumOfFiles()
                getNumOfVideos()

            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function updateAdminInfo(data) {
    $.ajax({
        type: 'GET',
        url: "dashboard.php",
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
                setAdminInfo(JSON.parse(response))
            }
    
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}

function setAdminInfo(data) {
    adminInfo = data
    $('#email').text(adminInfo.email)
    $('#first-name').text(adminInfo.first_name)
    $('#last-name').text(adminInfo.last_name)
}






  



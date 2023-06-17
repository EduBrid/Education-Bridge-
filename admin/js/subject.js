class MySubject extends Main {

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    setRows(subjects) {

        let tableBody = ""
    
        let subjectsLen = Object.keys(subjects).length
    
        for(let i = 0; i < subjectsLen; i++) {
            tableBody += `<tr>
                        <td class="td-${i}">${i+1}</td>
                        <td class="td-${i}">${subjects[i].subject}</td>
                        <td id="operation">
                            <a id="edit-${i}" class="edit" onclick="editClick(this)">
                            <i class="fa-solid fa-pencil fa-fw" data-toggle="tooltip"
                                title="Edit"></i>
                            </a>
                            <a id="delete-${i}" class="delete" onclick="delClick(this)">
                            <i class="fa-solid fa-remove fa-fw" data-toggle="tooltip"
                                title="Delete"></i>
                            </a>
                        </td>
                    </tr>`              
        }
    
        $(this.tbodyPath).html(tableBody)
        
    }
}


var isAdd = true
var subjectToDel = ""
var subjectToEdit = ""

var mySubject = new MySubject('subject.php', '#subjects-table tbody')

isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "subject.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                mySubject.getNumOfRows()

            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}


// Handling Clicks -------------------------------------------- //

$('#btn-add-new-subject').click(function() { 
    $('#add-subject-modal').modal('show') 
    $('#btn-add-subject').text('Add')
    $('#h5-add-subject').text('Add New Subject')
    $('#subject').val('')
    isAdd = true
})
$('#btn-cancel-subject').click(function() { $('#add-subject-modal').modal('hide') })
$('#btn-close-subject').click(function() { $('#add-subject-modal').modal('hide') })

$('#btn-add-subject').click(function() {
    if(isAdd) {
        mySubject.addClassSubject($('#subject').val().toUpperCase(), '#add-subject-modal')
    } else {
        mySubject.updateClassSubject(subjectToEdit, $('#subject').val().toUpperCase(), '#add-subject-modal')
    }
    
})

    // Delete:
$('#btn-cancel-delete').click(function() { $('#delete-subject-modal').modal('hide') })
$('#btn-close-delete').click(function() { $('#delete-subject-modal').modal('hide') })
$('#btn-delete-subject').click(function() {
    mySubject.deleteRow(subjectToDel, '#delete-subject-modal')
})

// ----------------------------------------------------------------------------------------- //

function delClick(icon) {
    subjectToDel = $(`.td-${icon.id[7]}`).eq(1).text()
    $('#delete-subject-modal').modal('show')
}

function editClick(icon) {
    subjectToEdit = $(`.td-${icon.id[5]}`).eq(1).text()
    $('#add-subject-modal').modal('show')
    $('#btn-add-subject').text('Update')
    $('#h5-add-subject').text('Update Subject')
    $('#subject').val(subjectToEdit)
    isAdd = false
}



//---------- Log Out Modal ------------------------------------------
// $('#log-out-li').click(function() { $('#log-out-modal').modal('show') })

// $('#btn-cancel-log-out').click(function() { $('#log-out-modal').modal('hide') })
// $('#btn-close-log-out').click(function() { $('#log-out-modal').modal('hide') })
// $('#btn-log-out').click(function() { 
//     logout()
//     $('#log-out-modal').modal('hide') 
// })
//------------------------------------------------------------------------
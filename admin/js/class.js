class MyClass extends Main {

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    setRows(classes) {

        let tableBody = ""
    
        let classesLen = Object.keys(classes).length
    
        for(let i = 0; i < classesLen; i++) {
            tableBody += `<tr>
                        <td class="td-${i}">${i+1}</td>
                        <td class="td-${i}">${classes[i].class}</td>
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
var classToDel = ""
var classToEdit = ""

var myClass = new MyClass('class.php', '#classes-table tbody')

isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "class.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                myClass.getNumOfRows()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}





// Handling Clicks -------------------------------------------- //

$('#btn-add-new-class').click(function() { 
    $('#add-class-modal').modal('show') 
    $('#btn-add-class').text('Add')
    $('#h5-add-class').text('Add New Class')
    $('#class').val('')
    isAdd = true
})
$('#btn-cancel-class').click(function() { $('#add-class-modal').modal('hide') })
$('#btn-close-class').click(function() { $('#add-class-modal').modal('hide') })

$('#btn-add-class').click(function() {
    if(isAdd) {
        myClass.addClassSubject($('#class').val().toUpperCase(), '#add-class-modal')
    } else {
        myClass.updateClassSubject(classToEdit, $('#class').val().toUpperCase(), '#add-class-modal')
    }
    
    
})

    // Delete:
$('#btn-cancel-delete').click(function() { $('#delete-class-modal').modal('hide') })
$('#btn-close-delete').click(function() { $('#delete-class-modal').modal('hide') })
$('#btn-delete-class').click(function() {
    myClass.deleteRow(classToDel, '#delete-class-modal')
})

// ----------------------------------------------------------------------------------------- //


function delClick(icon) {
    classToDel = $(`.td-${icon.id[7]}`).eq(1).text()
    $('#delete-class-modal').modal('show')
}

function editClick(icon) {
    classToEdit = $(`.td-${icon.id[5]}`).eq(1).text()
    $('#add-class-modal').modal('show')
    $('#btn-add-class').text('Update')
    $('#h5-add-class').text('Update Class')
    $('#class').val(classToEdit)
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
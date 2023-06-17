class Student extends Main {

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    getAllClasses() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 6},
            success: (response) => {

                let classes = JSON.parse(response)
                console.log("getAllClasss = ", classes)
                this.setSelectClass(classes)
        
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    setSelectClass(classes) {

        let options = this.classSelectOptions(classes)

        $('#class-filter').html('<option value="none" selected>All</option>'+options)
        $('#student-class').html('<option value="none" selected>Select Class</option>'+options)

        
    }

    setRows(students) {

        let tableBody = ""

        let studentsLen = Object.keys(students).length
    
        for(let i = 0; i < studentsLen; i++) {

            tableBody += `<tr class="tr-${i}">
                        <td class="td-${i}">${i+1}</td>
                        <td class="td-${i}">${students[i].student_id}</td>
                        <td class="td-${i}">${students[i].first_name}</td>
                        <td class="td-${i}">${students[i].last_name}</td>
                        <td class="td-${i}">${students[i].birth_date}</td>
                        <td class="td-${i}">${capitalize(students[i].gender)}</td>
                        <td class="td-${i}">${students[i].class}</td>
                        <td class="td-${i}" hidden>${students[i].class_id}</td>
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

    addStudent(data) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: data,
            success: (response) => {
                if(response == '-1') {
                    /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the class already exists!")
                } else {
                    $('#add-student-modal').modal('hide') 
                    this.activeLi = 1
                    this.getNumOfRows()
                    console.log('add is success!')
                }
            },
            error: function(xhr, status, error) {
                // Handle any errors that occur during the AJAX request
                console.error(error);
            }
        });
            
    }

    updateStudent(data) {
    
        $.ajax({
            type: 'GET',
            url: this.url,
            data: data,
            success: (response) => {
                if(response =='-1') {
                     /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the student already exists!")
                } else {
                    $('#add-student-modal').modal('hide')             
                    this.activeLi = 1
                    this.getNumOfRows()
                }
                
            },
            error: function(xhr, status, error) {
                // Handle any errors that occur during the AJAX request
                console.error(error);
            }
        });
    }

    getNumOfFilteredStudents(option, classNum = 0, full_name = "") {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 7, option: option, class_id: classNum, name: full_name},
            success: (response) => {
                if(response > 0) {
                    let numOfPages = Math.ceil(response / 5)
                    this.paginationCreate(numOfPages)
                    this.getFilteredStudents(0, option, classNum, full_name)
                } else {
                    $(this.tbodyPath).empty()
                    $('#pagination').empty()
                }
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    getFilteredStudents(startingRow, option, classNum = 0, full_name = "") {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 8, row: startingRow, limit: 5, option: option, class_id: classNum, name: full_name},
            success: (response) => {
                console.log(response)
                let rows = JSON.parse(response)
                
                this.setRows(rows)
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }




}


var isAdd = true
var studentToDel = ""
var studentToEdit = ""

var student = new Student('student.php', '#students-table tbody')

isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "student.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                student.getNumOfRows()
                student.getAllClasses()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}





// Handling Click for Showing And Hiding modals -------------------------------------------- //

// Add Student Modal
$('#btn-add-new-student').click(function() { 
    $('#add-student-modal').modal('show') 
    $('#btn-add-student').text('Add')
    $('#h5-add-student').text('Add New Student')
    $('#student-id').prop('disabled', false)
    emptyModal()
    isAdd = true
})
$('#btn-cancel-add').click(function() { $('#add-student-modal').modal('hide') })
$('#btn-close-add').click(function() { $('#add-student-modal').modal('hide') })
$('#btn-add-student').click(function() {

    let myData = {action_num: 3, 
        student_id: $('#student-id').val().toUpperCase(),
        first_name: capitalize($('#first-name').val()),
        last_name: capitalize($('#last-name').val()),
        birth_date: $('#student-birth').val(),
        gender: $('#student-gender').val(),
        class_id: parseInt($('#student-class').val())
    }

    if(isAdd) {
        
        student.addStudent(myData)

    } else {
        myData['action_num'] = 5
        student.updateStudent(myData)
    }
    
    
})

// Delete:
$('#btn-cancel-delete').click(function() { $('#delete-student-modal').modal('hide') })
$('#btn-close-delete').click(function() { $('#delete-student-modal').modal('hide') })
$('#btn-delete-student').click(function() {
    student.deleteRow(studentToDel, '#delete-student-modal')
})

// select filter
$('#class-filter').change(function() { 
    $('#search-filter').val('')
    if($('#class-filter').val() == 'none') {
        student.getNumOfRows()
    } else {
        student.getNumOfFilteredStudents(2, parseInt($('#class-filter').val()))
        console.log(parseInt($('#class-filter').val()))
    }

})

$('#btn-search').click(function() { 
    $('#class-filter').val('none')
    if($('#search-filter').val() == '') {
        // student.getNumOfFilteredStudents(1)
        student.getNumOfRows()
    } else {
        student.getNumOfFilteredStudents(3,'', $('#search-filter').val())
    }

})


// ----------------------------------------------------------------------------------------- //




function delClick(icon) {
    studentToDel = $(`.td-${icon.id[7]}`).eq(1).text()
    console.log(studentToDel)
    $('#delete-student-modal').modal('show')
}



function editClick(icon) {
    let tds = $(`.td-${icon.id[5]}`)
    studentToEdit = tds.eq(1).text()
    console.log(studentToEdit)
    $('#add-student-modal').modal('show')
    $('#btn-add-student').text('Update')
    $('#h5-add-student').text('Update Student')
    $('#student-id').prop('disabled', true)
    $('#student-id').val(studentToEdit)
    $('#first-name').val(tds.eq(2).text())
    $('#last-name').val(tds.eq(3).text())
    $('#student-birth').val(tds.eq(4).text())
    $('#student-gender').val(tds.eq(5).text().toLowerCase())
    $('#student-class').val(tds.eq(7).text())
    isAdd = false
}


function emptyModal() {
    $('#student-id').val('')
    $('#first-name').val('')
    $('#last-name').val('')
    $('#student-birth').val('')
    $('#student-gender').val('male')
    $('#student-class').val('none')
}


// //---------- Log Out Modal ------------------------------------------
// $('#log-out-li').click(function() { $('#log-out-modal').modal('show') })

// $('#btn-cancel-log-out').click(function() { $('#log-out-modal').modal('hide') })
// $('#btn-close-log-out').click(function() { $('#log-out-modal').modal('hide') })
// $('#btn-log-out').click(function() { 
//     logout()
//     $('#log-out-modal').modal('hide') 
// })
// //------------------------------------------------------------------------
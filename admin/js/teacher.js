class Teacher extends Main {

    static classes
    static subjects

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    setRows(teachers) {

        let tableBody = ""

        let teachersLen = Object.keys(teachers).length
    
        for(let i = 0; i < teachersLen; i++) {
            tableBody += `<tr>
                        <td class="td-${i}">${i+1}</td>
                        <td class="td-${i}">${teachers[i].teacher_id}</td>
                        <td class="td-${i}">${teachers[i].first_name}</td>
                        <td class="td-${i}">${teachers[i].last_name}</td>
                        <td class="td-${i}">${teachers[i].birth_date}</td>
                        <td class="td-${i}">${capitalize(teachers[i].gender)}</td>
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

    addTeacher(data) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: data,
            success: (response) => {
                console.log(response)
                if(response == '-1') {
                    /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the teacher id already exists!")
                } else {
                    $('#add-teacher-modal').modal('hide') 
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

    updateTeacher(data) {
    
        $.ajax({
            type: 'GET',
            url: this.url,
            data: data,
            success: (response) => {
                console.log(response)
                if(response =='-1') {
                     /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the student already exists!")
                } else {
                    $('#add-teacher-modal').modal('hide')             
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

    getAllClasses() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 6},
            success: (response) => {

                Teacher.classes = JSON.parse(response)
                // console.log("getAllClasss = ", Teacher.classes)
                this.setSelectClass(Teacher.classes)
                this.setMultiSelectClasses(Teacher.classes)
        
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    setSelectClass(classes) {
        let options = this.classSelectOptions(classes)
        $('#class-filter').html('<option value="none" selected>All</option>'+options)
    }

    getAllSubjects() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 10},
            success: (response) => {
                Teacher.subjects = JSON.parse(response)
                this.setSelectSubject(Teacher.subjects)
                this.setMultiSelectSubjects(Teacher.subjects)
        
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    subjectSelectOptions(subjects) {

        let subjectsLen = Object.keys(subjects).length
    
        let options = ""

        for(let i = 0; i < subjectsLen; i++) {
            options += `<option value="${subjects[i].subject_id}">${subjects[i].subject}</option>`             
        }

        return options

    }

    setSelectSubject(subjects) {
        let options = this.subjectSelectOptions(subjects)
        $('#subject-filter').html('<option value="none" selected>All</option>'+options)        
    }

    setMultiSelectClasses(classes) {
        let options = this.classSelectOptions(classes)
        $('#teacher-classes').html(options)
        VirtualSelect.init({ 
            ele: '#teacher-classes' 
          })  
    }

    setMultiSelectSubjects(subjects) {
        let options = this.subjectSelectOptions(subjects)
        $('#teacher-subjects').html(options)
        VirtualSelect.init({ 
            ele: '#teacher-subjects' 
          })        
    }

    getTeacherClasses(teacherId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 11, teacher_id: teacherId},
            success: (response) => {

                let teacherClasses = JSON.parse(response)

                console.log('teacher_classes = ', teacherClasses)

                // $('#teacher-classes option:selected').prop('selected', false)
                let values = []

                for(let i = 0; teacherClasses.length > i; i++) {
                    // $(`#teacher-classes option[value="${teacherClasses[i].class_id}"]`).prop('selected', true)
                    values.push(teacherClasses[i].class_id)

                }

                // $('#teacher-classes').trigger('change')


                document.getElementById('teacher-classes').setValue(values)


                this.getTeacherSubjects(teacherId)

                
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    getTeacherSubjects(teacherId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 12, teacher_id: teacherId},
            success: (response) => {

                // console.log(response)

                let teacherSubjects = JSON.parse(response)

                console.log('teacher_subjects = ', teacherSubjects)

                // $('#teacher-subjects option:selected').prop('selected', false)

                let values = []

                for(let i = 0; teacherSubjects.length > i; i++) {
                    // $(`#teacher-subjects option[value="${teacherSubjects[i].subject_id}"]`).prop('selected', true)
                    // console.log(teacherSubjects[i].subject)
                    values.push(teacherSubjects[i].subject_id)
                }

                // $('#teacher-subjects').trigger('change')

                document.getElementById('teacher-subjects').setValue(values)
                
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }


}

var isAdd = true
var teacherToDel = ""
var teacherToEdit = ""

var teacher = new Teacher('teacher.php', '#teachers-table tbody')

isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "teacher.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                teacher.getNumOfRows()
                teacher.getAllClasses()
                teacher.getAllSubjects()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}




// Handling Click for Showing And Hiding modals -------------------------------------------- //

// Add Student Modal
$('#btn-add-new-teacher').click(function() { 
    $('#add-teacher-modal').modal('show') 
    $('#btn-add-teacher').text('Add')
    $('#h5-add-teacher').text('Add New Teacher')
    $('#teacher-classes').show()
    $('#teacher-subjects').show()
    $('#teacher-id').prop('disabled', false)

    document.getElementById('teacher-classes').reset()
    document.getElementById('teacher-subjects').reset()

    emptyModal()

    isAdd = true
})
$('#btn-cancel-add').click(function() { $('#add-teacher-modal').modal('hide') })
$('#btn-close-add').click(function() { $('#add-teacher-modal').modal('hide') })
$('#btn-add-teacher').click(function() {

    

    console.log($('#teacher-classes').val())
    console.log($('#teacher-subjects').val())

    let myData = {action_num: 3, 
        teacher_id: $('#teacher-id').val().toUpperCase(),
        first_name: capitalize($('#first-name').val()),
        last_name: capitalize($('#last-name').val()),
        birth_date: $('#teacher-birth').val(),
        gender: $('#teacher-gender').val(),
        classes: $('#teacher-classes').val(),
        subjects: $('#teacher-subjects').val()
    }

    if(isAdd) {
        
        teacher.addTeacher(myData)

    } else {
        myData['action_num'] = 5
        teacher.updateTeacher(myData)
    }

    
    
})

// Delete:
$('#btn-cancel-delete').click(function() { $('#delete-teacher-modal').modal('hide') })
$('#btn-close-delete').click(function() { $('#delete-teacher-modal').modal('hide') })
$('#btn-delete-teacher').click(function() {
    teacher.deleteRow(teacherToDel, '#delete-teacher-modal')
})

// select filter
$('#class-filter').change(function() { 
    $('#search-filter').val('')
    if($('#class-filter').val() == 'none') {
        teacher.getNumOfFilteredStudents(1)
    } else {
        teacher.getNumOfFilteredStudents(2, $('#class-filter').val())
    }

})

$('#btn-search').click(function() { 
    $('#class-filter').val('none')
    if($('#search-filter').val() == '') {
        teacher.getNumOfFilteredStudents(1)
    } else {
        teacher.getNumOfFilteredStudents(3,'', $('#search-filter').val())
    }

})


// ----------------------------------------------------------------------------------------- //

function delClick(icon) {
    teacherToDel = $(`.td-${icon.id[7]}`).eq(1).text()
    console.log(teacherToDel)
    $('#delete-teacher-modal').modal('show')
}



function editClick(icon) {
    let tds = $(`.td-${icon.id[5]}`)
    teacherToEdit = tds.eq(1).text()
    console.log(teacherToEdit)
    $('#add-teacher-modal').modal('show')
    $('#btn-add-teacher').text('Update')
    $('#h5-add-teacher').text('Update Teacher')
    $('#teacher-id').val(teacherToEdit)
    $('#teacher-id').prop('disabled', true)
    $('#first-name').val(tds.eq(2).text())
    $('#last-name').val(tds.eq(3).text())
    $('#teacher-birth').val(tds.eq(4).text())
    $('#teacher-gender').val(tds.eq(5).text().toLowerCase())
    // $('#teacher-classes').hide()
    // $('#teacher-subjects').hide()


    teacher.getTeacherClasses(teacherToEdit)
    // teacher.getTeacherSubjects(teacherToEdit)

    // VirtualSelect.init({ 
    //     ele: '.multi-select'
    //   })
    isAdd = false
}



function emptyModal() {
    $('#teacher-id').val('')
    $('#first-name').val('')
    $('#last-name').val('')
    $('#teacher-birth').val('')
    $('#teacher-gender').val('male')
    $('#teacher-class').val('none')
}


function checkTeacherId(id) {
    const myRegex = new RegExp(/^[a-bA-Z]{2}[0-9]{6}$/)
    if(myRegex.test(id)) {
        return true
    }
    return false
}

function checkFirtName(name) {
    const myRegex = new RegExp(/^[a-bA-Z]{3,15}$/)
    if(myRegex.test(name)) {
        return true
    }
    return false
}

function checkLastName(name) {
    const myRegex = new RegExp(/^[a-bA-Z\s]{3,20}$/)
    if(myRegex.test(name)) {
        return true
    }
    return false
}


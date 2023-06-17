class TeacherFiles extends Main {

    static classes
    static subjects

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    setRows(files) {

        let tableBody = ""

        let filesLen = Object.keys(files).length
    
        for(let i = 0; i < filesLen; i++) {
            tableBody += `<tr>
                        <td class="td-${i}">${i+1}</td>
                        <td class="td-${i}" hidden>${files[i].videoId}</td>
                        <td class="td-${i}">${files[i].videoName}</td>
                        <td class="td-${i}">${files[i].description}</td>
                        <td class="td-${i}" hidden>${files[i].subjectId}</td>
                        <td class="td-${i}">${files[i].subject}</td>
                        
                        <td id="operation">
                            <a id="edit-${i}" href="#" class="edit" onclick="editClick(this)">
                                <i class="fa-solid fa-pencil fa-fw" data-toggle="tooltip"
                                    title="Edit"></i>
                            </a>
                            <a id="delete-${i}" href="#" class="delete" onclick="delClick(this)">
                                <i class="fa-solid fa-remove fa-fw" data-toggle="tooltip"
                                    title="Delete"></i>
                            </a>
                            <a href="#" class="read" onclick="playVideo('${files[i].videoId}')">
                                <i class="fa-solid fa-eye fa-fw" data-toggle="tooltip"
                                    title="read"></i>
                            </a>
                        </td>
                    </tr>`  
            // console.log(files[i].video)
        }
    
        $(this.tbodyPath).html(tableBody)
        
    }

    addFile(data) {

        
        $.ajax({
            type: 'POST',
            url: 'upload_video.php',
            data: data,
            
            processData: false,
            contentType: false,
            success: (response) => {
                console.log(response)
                if(response == '-1') {
                    /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the teacher id already exists!")
                } else {
                    $('#add-file-modal').modal('hide') 
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

    updateFile(data) {
    
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
                    $('#add-file-modal').modal('hide')             
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

    getTeacherClasses() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 6},
            success: (response) => {
                TeacherFiles.classes = JSON.parse(response)
                this.setSelectClass(TeacherFiles.classes)
                this.setMultiSelectClasses(TeacherFiles.classes)
        
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

    getTeacherSubjects() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 10},
            success: (response) => {
                TeacherFiles.subjects = JSON.parse(response)
                this.setSelectSubject(TeacherFiles.subjects)
        
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
        $('#teacher-subjects').html('<option value="none" selected>Select Subject</option>'+options)        
      
    }

    setMultiSelectClasses(classes) {
        let options = this.classSelectOptions(classes)
        
        $('#teacher-classes').html(options)
        VirtualSelect.init({ 
            ele: '#teacher-classes' 
        })  
    }


    getFileClasses(fileId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 11, video_id: fileId},
            success: (response) => {
                console.log(response)
                let fileClasses = JSON.parse(response)

                // $('#teacher-classes option:selected').prop('selected', false)
                let values = []

                for(let i = 0; fileClasses.length > i; i++) {
                    // $(`#teacher-classes option[value="${teacherClasses[i].class_id}"]`).prop('selected', true)
                    values.push(fileClasses[i].class_id)

                }

                document.getElementById('teacher-classes').setValue(values)


                // this.getTeacherSubjects(teacherId)

                
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

}

var isAdd = true
var fileToDel = ""
var fileToEdit = ""

var teacherFiles = new TeacherFiles('teacher_videos.php', '#teacher-files tbody')

isLogedin()




function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "teacher_videos.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                teacherFiles.getTeacherClasses()
                teacherFiles.getTeacherSubjects()
                teacherFiles.getNumOfRows()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}



// Handling Click for Showing And Hiding modals -------------------------------------------- //

// Add Student Modal
$('#btn-add-new-file').click(function() { 
    $('#add-file-modal').modal('show') 
    $('#btn-add-file').text('Add')
    $('#h5-add-file').text('Add New Video')
    $('#file').show()


    document.getElementById('teacher-classes').reset()
    $('#teacher-subjects').val('none')
    $('#file-description').val('')

    isAdd = true
})
$('#btn-cancel-add').click(function() { $('#add-file-modal').modal('hide') })
$('#btn-close-add').click(function() { $('#add-file-modal').modal('hide') })
$('#btn-add-file').click(function() {

    let fileInput = document.getElementById('file');
    let formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('action_num', 1);
    formData.append('classes', $('#teacher-classes').val());
    formData.append('subject', $('#teacher-subjects').val());
    formData.append('description', $('#file-description').val());


    if(isAdd) {
        teacherFiles.addFile(formData)
    } else {
        myData = {
            action_num: 5,
            video_id: fileToEdit,
            classes: $('#teacher-classes').val(),
            subject: $('#teacher-subjects').val(),
            description: $('#file-description').val()
        }        
        teacherFiles.updateFile(myData)
    }

    
    
})

// Delete:
$('#btn-cancel-delete').click(function() { $('#delete-file-modal').modal('hide') })
$('#btn-close-delete').click(function() { $('#delete-file-modal').modal('hide') })
$('#btn-delete-file').click(function() {
    teacherFiles.deleteRow(fileToDel, '#delete-file-modal')
})

// select filter
// $('#class-filter').change(function() { 
//     $('#search-filter').val('')
//     if($('#class-filter').val() == 'none') {
//         teacherFiles.getNumOfFilteredStudents(1)
//     } else {
//         teacherFiles.getNumOfFilteredStudents(2, $('#class-filter').val())
//     }

// })

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
    fileToDel = $(`.td-${icon.id[7]}`).eq(1).text()
    console.log(fileToDel)
    $('#delete-file-modal').modal('show')
}



function editClick(icon) {
    
    $('#file').hide()

    let tds = $(`.td-${icon.id[5]}`)
    fileToEdit = tds.eq(1).text()
    console.log(fileToEdit)
    $('#add-file-modal').modal('show')
    $('#btn-add-file').text('Update')
    $('#h5-add-file').text('Update Video')
    
    $('#file-description').val(tds.eq(3).text())
    console.log(tds.eq(2).text())
    console.log(tds.eq(3).text())
    $('#teacher-subjects').val(tds.eq(4).text())

    teacherFiles.getFileClasses(fileToEdit)
    
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




function playVideo(videoId) {
    localStorage.setItem('video_id', videoId)
    const newPageUrl = 'videoPlayer.html'
    window.open(newPageUrl, '_blank')
}
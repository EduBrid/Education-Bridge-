class TeacherClasses extends Main {

    constructor(url, tbodyPath) {
        super(url, tbodyPath)
    }

    getAllClasses() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 3},
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
        // $('#student-class').html('<option value="none" selected>Select Class</option>'+options)

        
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
                    </tr>`              
        }
    
        $(this.tbodyPath).html(tableBody)
        
    }


    getNumOfFilteredStudents(classNum) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 4, class_id: classNum},
            success: (response) => {
                if(response > 0) {
                    let numOfPages = Math.ceil(response / 5)
                    this.paginationCreate(numOfPages)
                    this.getFilteredStudents(0, classNum)
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

    getFilteredStudents(startingRow, classNum) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 5, row: startingRow, limit: 5, class_id: classNum},
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


var teacherClasses = new TeacherClasses('teacher_classes.php', '#classes-table tbody')




// select filter
$('#class-filter').change(function() { 
    if($('#class-filter').val() == 'none') {
        teacherClasses.getNumOfRows()
    } else {
        teacherClasses.getNumOfFilteredStudents(parseInt($('#class-filter').val()))
        console.log(parseInt($('#class-filter').val()))
    }

})



isLogedin()

function isLogedin() {
    $.ajax({
        type: 'GET',
        url: "teacher_classes.php",
        data: {action_num: 0},
        success: (response) => {
            if('-1' == response) {
                window.location.href = "login.html"
            } else {
                teacherClasses.getNumOfRows()
                teacherClasses.getAllClasses()
            }
           
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}
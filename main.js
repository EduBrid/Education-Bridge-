class Main {

    static activeLi = 1

    constructor(url, tbodyPath) {
        this.url = url
        this.tbodyPath = tbodyPath

    }

    paginationCreate(numOfPages) {

        let paginationHtml = `<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>`
        for(let i = 1; i <= numOfPages; i++) {
            let a = ""
            if(i == 1) {
                a = " active"
            }
            paginationHtml += `<li class="page-item${a}"><a class="page-link" href="#">${i}</a></li>`
        }
        paginationHtml += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`
        $('#pagination').html(paginationHtml)
    
        this.disablePreAndNext(numOfPages)
    
        this.paginationClick(numOfPages)
    
    }

    paginationClick(numOfPages) {
        let self = this
        $('.page-item').on('click', function() {
            if (!$(this).hasClass("disabled")) {
                if($(this).text() == 'Next') {
                    if(Main.activeLi < numOfPages) {
                        $(`.page-item:eq(${Main.activeLi})`).removeClass('active')
                        Main.activeLi++
                        $(`.page-item:eq(${Main.activeLi})`).addClass('active')
                    }
                    
                } else if($(this).text() == 'Previous') {
                    if(Main.activeLi > 1) {
                        $(`.page-item:eq(${Main.activeLi})`).removeClass('active')
                        Main.activeLi--
                        $(`.page-item:eq(${Main.activeLi})`).addClass('active')
                    }
                } else {
                    let clickedPage = parseInt($(this).text())
                    if(Main.activeLi !== clickedPage) {
                        $(`.page-item:eq(${Main.activeLi})`).removeClass('active')
                        Main.activeLi = clickedPage
                        $(`.page-item:eq(${Main.activeLi})`).addClass('active')
                    }
                }
                self.disablePreAndNext(numOfPages)
                self.getRows((Main.activeLi-1)*5)
            }
        })
    }

    disablePreAndNext(pages) {
        if(pages == 1) {
            $('.page-item:eq(0)').addClass('disabled')
            $('.page-item:eq(2)').addClass('disabled')
        } else if(Main.activeLi == 1) {
            $('.page-item:eq(0)').addClass('disabled')
            $(`.page-item:eq(${pages+1})`).removeClass('disabled')
        }  else if(Main.activeLi == pages) {
            $('.page-item:eq(0)').removeClass('disabled')
            $(`.page-item:eq(${pages+1})`).addClass('disabled')
        } else {
            $('.page-item:eq(0)').removeClass('disabled')
            $(`.page-item:eq(${pages+1})`).removeClass('disabled')
        }
    
    }

    getNumOfRows() {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 1},
            success: (response) => {
                // console.log(response)
                if(response > 0) {
                    let numOfPages = Math.ceil(response / 5)
                    this.paginationCreate(numOfPages)
                    this.getRows(0)
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

    getRows(startingRow) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 2, row: startingRow, limit: 5},
            success: (response) => {
                // console.log(response)

                let rows = JSON.parse(response)
                // console.log(rows)
                this.setRows(rows)
        
            },
            error: function(xhr, status, error) {
                console.error(error)
            }
        })
    }

    setRows(rows) {
        console.log("This function is gonna be overwritted in the children classes")
        console.log("rows = ", rows)
    }

    addClassSubject(value, modalId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 3, value: value},
            success: (response) => {
                if(response == '-1') {
                    /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the class already exists!")
                } else {
                    $(modalId).modal('hide') 
                    Main.activeLi = 1
                    this.getNumOfRows()
                }
            },
            error: function(xhr, status, error) {
                // Handle any errors that occur during the AJAX request
                console.error(error);
            }
        });
            
    }

    deleteRow(value, modalId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 4, value: value},
            success: (response) => {
                $(modalId).modal('hide') 
                Main.activeLi = 1
                this.getNumOfRows()
            },
            error: function(xhr, status, error) {
                // Handle any errors that occur during the AJAX request
                console.error(error);
            }
        });
    }

    updateClassSubject(oldValue, newValue, modalId) {
        $.ajax({
            type: 'GET',
            url: this.url,
            data: {action_num: 5, old_value: oldValue, new_value: newValue},
            success: (response) => {
                if(response =='-1') {
                     /* 
                        -- TODO --
                        Here you need to tell the admin the class is already exists using css and html/
                    */
                    alert("the class already exists!")
                } else {
                    $(modalId).modal('hide')             
                    Main.activeLi = 1
                    this.getNumOfRows()
                }
                
            },
            error: function(xhr, status, error) {
                // Handle any errors that occur during the AJAX request
                console.error(error);
            }
        });
    }

    

    classSelectOptions(classes) {

        let classesLen = Object.keys(classes).length
    
        let options = ""

        for(let i = 0; i < classesLen; i++) {
            options += `<option value="${classes[i].class_id}">${classes[i].class}</option>`             
        }

        return options

    }

    

}




//---------- Log Out Li ------------------------------------------
$('#log-out-li').click(function() { $('#log-out-modal').modal('show') })

$('#btn-cancel-log-out').click(function() { $('#log-out-modal').modal('hide') })
$('#btn-close-log-out').click(function() { $('#log-out-modal').modal('hide') })
$('#btn-log-out').click(function() { 
    logout()
    $('#log-out-modal').modal('hide') 
})
//------------------------------------------------------------------------

//---------- Log Out Icon ------------------------------------------
$('#log-out-icon').click(function() { $('#log-out-modal').modal('show') })

$('#btn-cancel-log-out').click(function() { $('#log-out-modal').modal('hide') })
$('#btn-close-log-out').click(function() { $('#log-out-modal').modal('hide') })
$('#btn-log-out').click(function() { 
    console.log('btn is clicked!')
    logout()
    $('#log-out-modal').modal('hide') 

})
//------------------------------------------------------------------------

function capitalize(word) {
    var firstLetter = word.charAt(0).toUpperCase();
    var restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
}

function logout() {
    $.ajax({
        type: 'GET',
        url: "logout.php",
        success: (response) => {
            window.location.href = "login.html"
        },
        error: function(xhr, status, error) {
            console.error(error)
        }
    })
}
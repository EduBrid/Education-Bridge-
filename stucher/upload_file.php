<?php

    include('../config.php');

    session_start();

    $actionNum = $_POST['action_num'];
    // echo $actionNum;
    switch($actionNum) {
        case 1:
            addFile($conn);
            break;
    }

    // addFile($conn);


    function addFile($conn) {
        
       


        try {
                
            $subject = $_POST['subject'];
            $classes = explode(',', $_POST['classes']);
            $description = $_POST['description'];
    
            $fileName = $_FILES['file']['name'];
            $fileType = $_FILES['file']['type'];
            $fileData = file_get_contents($_FILES['file']["tmp_name"]);

            $q1 = "INSERT INTO files(file, file_name, file_type, description, subject_id, teacher_id) 
            VALUES(:file, :fileName, :fileType, :description, :subjectId, :teacherId)";

            $stmt1 = $conn->prepare($q1);
            $stmt1->bindParam(':file', $fileData);
            $stmt1->bindParam(':fileName', $fileName);
            $stmt1->bindParam(':fileType', $fileType);
            $stmt1->bindParam(':description', $description);
            $stmt1->bindParam(':subjectId', $subject);
            $stmt1->bindParam(':teacherId', $_SESSION['teacher_id']);

            $q2 = "insert into file_classes(file_id, class_id) VALUES(?, ?)";
            $stmt2 = $conn->prepare($q2);
            $conn->beginTransaction();


            $stmt1->execute();

            $fileId = $conn->lastInsertId();

            print_r($classes);

            foreach($classes as $class) {
                $stmt2->execute([$fileId, $class]);
            }


            $conn->commit();

            
        } catch(PDOEXCEPTION $e) {
            $conn->rollBack();
            echo $e;
        }


    }

?>
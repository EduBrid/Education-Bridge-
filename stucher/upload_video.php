<?php

    include('../config.php');

    session_start();

    $actionNum = $_POST['action_num'];
    // echo $actionNum;
    switch($actionNum) {
        case 1:
            addVideo($conn);
            break;
    }

    // addFile($conn);


    function addVideo($conn) {

        try {
                
            $subject = $_POST['subject'];
            $classes = explode(',', $_POST['classes']);
            $description = $_POST['description'];
    
            $videoName = $_FILES['file']['name'];
            $videoType = $_FILES['file']['type'];
            $videoData = file_get_contents($_FILES['file']["tmp_name"]);

            $q1 = "INSERT INTO videos(video, video_name, video_type, description, subject_id, teacher_id) 
            VALUES(:video, :videoName, :videoType, :description, :subjectId, :teacherId)";

            $stmt1 = $conn->prepare($q1);
            $stmt1->bindParam(':video', $videoData);
            $stmt1->bindParam(':videoName', $videoName);
            $stmt1->bindParam(':videoType', $videoType);
            $stmt1->bindParam(':description', $description);
            $stmt1->bindParam(':subjectId', $subject);
            $stmt1->bindParam(':teacherId', $_SESSION['teacher_id']);

            $q2 = "insert into video_classes(video_id, class_id) VALUES(?, ?)";
            $stmt2 = $conn->prepare($q2);
            $conn->beginTransaction();


            $stmt1->execute();

            $videoId = $conn->lastInsertId();

            print_r($classes);

            foreach($classes as $class) {
                $stmt2->execute([$videoId, $class]);
            }


            $conn->commit();

            
        } catch(PDOEXCEPTION $e) {
            $conn->rollBack();
            echo $e;
        }


    }

?>
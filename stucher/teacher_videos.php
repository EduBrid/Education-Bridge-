<?php

    include('../database.php');

    session_start();

    class Teachervideos extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getNumOfvideos() {
    
            $q = "SELECT COUNT(video_id) AS count FROM videos WHERE teacher_id = :teacherId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $numOfvideos = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfvideos;
        }

        function getvideos() {

            $startingRow = @$_GET['row'];
            $limit = @$_GET['limit'];
    
            $q = "SELECT videos.video_id, videos.video_name, videos.video_type, videos.description, videos.subject_id, subjects.subject FROM videos JOIN subjects ON videos.subject_id = subjects.subject_id
             WHERE videos.teacher_id = :teacherId ORDER BY videos.time_stamp DESC LIMIT $limit OFFSET $startingRow";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
            // echo $_SESSION['teacher_id'];
            $videos = [];
            foreach($rows as $row) {
                array_push($videos, array("videoId"=>$row['video_id'], "videoName"=>$row['video_name'],
                 "description"=>$row['description'], "subjectId"=>$row['subject_id'], "subject"=>$row['subject']));
            }
            // "video"=>"data:". $row['video_type'].";base64,".base64_encode($row['video']),
            echo json_encode($videos);
        }

        function getTeacherClasses() {

            $q = "SELECT classes.class_id, classes.class FROM classes JOIN teacher_classes ON teacher_classes.class_id = classes.class_id
             WHERE teacher_classes.teacher_id = :teacherId ORDER BY time_stamp DESC";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);

            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }

        function getTeacherSubjects() {

            $q = "SELECT subjects.subject_id, subjects.subject FROM subjects JOIN teacher_subjects ON teacher_subjects.subject_id = subjects.subject_id
             WHERE teacher_subjects.teacher_id = :teacherId ORDER BY time_stamp DESC";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);

            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }
        
        function getVideoClasses() {

            $videoId = @$_GET['video_id'];
    
            $q = "SELECT video_classes.class_id, classes.class FROM video_classes JOIN classes ON classes.class_id = video_classes.class_id
             WHERE video_classes.video_id = :videoId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':videoId', $videoId);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }
        

        function updateVideo() {

            try {
    
                $videoId = @$_GET['video_id'];
                 
                $subject = $_GET['subject'];
                $classes = $_GET['classes'];
                $description = $_GET['description'];

                $q1 = "UPDATE videos SET description = :description, subject_id = :subjectId WHERE video_id = :videoId";

                $stmt1 = $this->pdo->prepare($q1);
                $stmt1->bindParam(':videoId', $videoId);
                $stmt1->bindParam(':description', $description);
                $stmt1->bindParam(':subjectId', $subject);

                $q2 = "DELETE FROM video_classes WHERE video_id = :videoId";
                $stmt2 = $this->pdo->prepare($q2);
                $stmt2->bindParam(':videoId', $videoId);

                $q3 = "insert into video_classes(video_id, class_id) VALUES(?, ?)";
                $stmt3 = $this->pdo->prepare($q3);

                $this->pdo->beginTransaction();

                $stmt1->execute();
                $stmt2->execute();

                foreach($classes as $class) {
                    $stmt3->execute([$videoId, $class]);
                }
               
                $this->pdo->commit();    
                
            } catch(PDOEXCEPTION $e) {
                echo $e;
            }
        }


        
    }

    $teachervideos = new Teachervideos('localhost', 'fms4_db', 'root', '');

    $actionNum = -1;

    if($_SERVER['REQUEST_METHOD'] === 'POST') {

        $actionNum = @$_POST['action_num'];
        // echo 'if = '.$actionNum;
    } else {
        $actionNum = @$_GET['action_num'];
        // echo 'else = '.$actionNum;

    }

    // echo $actionNum;

    switch ($actionNum) {
        case 0:
            if (!isset($_SESSION['teacher_id'])) {
                echo "-1";
                exit;
            } else {
                echo "0";
            }
            break;
        case 1:
            $teachervideos->getNumOfvideos();
            break;
        case 2:
            $teachervideos->getvideos();
            break;
        case 4:
            $teachervideos->deleteRow('videos', 'video_id');
            break;
        case 5:
            $teachervideos->updateVideo();
            break;
        case 6:
            $teachervideos->getTeacherClasses();
            break;
        case 7:
            $option = @$_GET['option'];

            if($option == 1) {
                $student->getNumOfRows('students');
            } else if($option == 2) {
                $student->getNumOfFilterStudents();
            } else {
                $student->getNumOfSearchedStudents();
            }
            break;
        case 8:
            $option = @$_GET['option'];
            
            if($option == 2) {
                $student->getFilteredStudents();
            } else {
                $student->getSearchedStudents();
            }
            break;
        case 10:
            $teachervideos->getTeacherSubjects();
            break;
        case 11:
            $teachervideos->getVideoClasses();
            break;
    }

?>
<?php

    include('../database.php');

    session_start();

    class Studentvideos extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getNumOfFiles() {
    
            $q = "SELECT COUNT(videos.video_id) AS count FROM videos JOIN video_classes ON video_classes.video_id = videos.video_id
             WHERE video_classes.class_id = :classId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':classId', $_SESSION['class_id']);
            $stmt->execute();
    
            $numOfFiles = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfFiles;
        }

        function getFiles() {

            $startingRow = @$_GET['row'];
            $limit = @$_GET['limit'];
    
            $q ="SELECT videos.video_id, videos.video_name, videos.video_type, videos.description, videos.subject_id, subjects.subject FROM videos 
            JOIN video_classes ON video_classes.video_id = videos.video_id
            JOIN subjects ON videos.subject_id = subjects.subject_id
            WHERE video_classes.class_id = :classId ORDER BY videos.time_stamp DESC LIMIT $limit OFFSET $startingRow";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':classId', $_SESSION['class_id']);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();

            $files = [];
            foreach($rows as $row) {
                array_push($files, array("videoId"=>$row['video_id'], "videoName"=>$row['video_name'],
                 "description"=>$row['description'], "subjectId"=>$row['subject_id'], "subject"=>$row['subject']));
            }
    
            echo json_encode($files);
        }

        function getVideo() {

            $videoId = @$_GET['video_id'];
    
            $q ="SELECT videos.video, videos.video_type FROM videos WHERE videos.video_id = :videoId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':videoId', $videoId);
            $stmt->execute();
    
            $row = $stmt->fetch();
            if($row > 0) {
                echo json_encode("data:". $row['video_type'].";base64,".base64_encode($row['video']));
            }

    
            // echo json_encode($files);
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
        

        function getNumOfFilterStudents() {

            $class_id = @$_GET['class_id'];

            $q = "SELECT COUNT(*) as count FROM students WHERE class_id = :class_id";
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':class_id', $class_id);
            $stmt->execute();
        
            $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfClasses;
            
        }

        function getFilteredStudents() {

            $startingRow = @$_GET['row'];
            $class_id = @$_GET['class_id'];
    
            // $q = "SELECT * FROM students WHERE class_id = :class_id ORDER BY time_stamp DESC LIMIT 5 OFFSET $startingRow";
            $q = "SELECT students.*, classes.class FROM students JOIN classes ON students.class_id = classes.class_id
             WHERE students.class_id = :class_id ORDER BY students.time_stamp DESC LIMIT 5 OFFSET $startingRow";

            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':class_id', $class_id);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }
        

        

        

        

       

        
    }

    $studentVideos = new StudentVideos('localhost', 'fms4_db', 'root', '');

    $actionNum = -1;

    if($_SERVER['REQUEST_METHOD'] === 'POST') {

        $actionNum = @$_POST['action_num'];
        // echo 'if = '.$actionNum;
    } else {
        $actionNum = @$_GET['action_num'];
        // echo 'else = '.$actionNum;

    }

    switch ($actionNum) {
        case 0:
            if (!isset($_SESSION['student_id'])) {
                echo "-1";
                exit;
            } else {
                echo "0";
            }
            break;
        case 1:
            $studentVideos->getNumOfFiles();
            break;
        case 2:
            $studentVideos->getFiles();
            break;
        case 3:
            $studentVideos->getAll('subjects');
            break;
        case 10:
            $studentVideos->getVideo();
            break;
    }

?>
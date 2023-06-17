<?php

    include('../database.php');

    session_start();

    class TeacherFiles extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getNumOfFiles() {
    
            $q = "SELECT COUNT(file_id) AS count FROM files WHERE teacher_id = :teacherId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $numOfFiles = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfFiles;
        }

        function getFiles() {

            $startingRow = @$_GET['row'];
            $limit = @$_GET['limit'];
    
            $q = "SELECT files.*, subjects.subject FROM files JOIN subjects ON files.subject_id = subjects.subject_id
             WHERE files.teacher_id = :teacherId ORDER BY files.time_stamp DESC LIMIT $limit OFFSET $startingRow";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
            // echo $_SESSION['teacher_id'];
            $files = [];
            foreach($rows as $row) {
                array_push($files, array("fileId"=>$row['file_id'], "fileName"=>$row['file_name'], "file"=>"data:". $row['file_type'].";base64,".base64_encode($row['file']),
                 "description"=>$row['description'], "subjectId"=>$row['subject_id'], "subject"=>$row['subject']));
            }
    
            echo json_encode($files);
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
        
        function getFileClasses() {

            $fileId = @$_GET['file_id'];
    
            $q = "SELECT file_classes.class_id, classes.class FROM file_classes JOIN classes ON classes.class_id = file_classes.class_id
             WHERE file_classes.file_id = :fileId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':fileId', $fileId);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }

        function updateFile() {

            try {
    
                $fileId = @$_GET['file_id'];
                 
                $subject = $_GET['subject'];
                $classes = $_GET['classes'];
                $description = $_GET['description'];

                $q1 = "UPDATE files SET description = :description, subject_id = :subjectId WHERE file_id = :fileId";

                $stmt1 = $this->pdo->prepare($q1);
                $stmt1->bindParam(':fileId', $fileId);
                $stmt1->bindParam(':description', $description);
                $stmt1->bindParam(':subjectId', $subject);

                $q2 = "DELETE FROM file_classes WHERE file_id = :fileId";
                $stmt2 = $this->pdo->prepare($q2);
                $stmt2->bindParam(':fileId', $fileId);

                $q3 = "insert into file_classes(file_id, class_id) VALUES(?, ?)";
                $stmt3 = $this->pdo->prepare($q3);

                $this->pdo->beginTransaction();

                $stmt1->execute();
                $stmt2->execute();

                foreach($classes as $class) {
                    $stmt3->execute([$fileId, $class]);
                }
               
                $this->pdo->commit();    
                
            } catch(PDOEXCEPTION $e) {
                echo $e;
            }
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

        function getNumOfSearchedStudents() {

            $name = @$_GET['name'];

            // echo $name;

            $q = "SELECT COUNT(*) as count FROM students WHERE CONCAT(first_name, last_name) LIKE :full_name";
            $stmt = $this->pdo->prepare($q);
            $value = '%'.$name.'%';
            $stmt->bindParam(':full_name', $value);
            $stmt->execute();
        
            $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfClasses;
            
        }

        function getSearchedStudents() {

            $startingRow = @$_GET['row'];
            $name = @$_GET['name'];
    
            // $q = "SELECT * FROM students WHERE CONCAT(first_name, last_name) LIKE :full_name ORDER BY time_stamp DESC LIMIT 5 OFFSET $startingRow";
            $q = "SELECT students.*, classes.class FROM students JOIN classes ON students.class_id = classes.class_id
             WHERE CONCAT(first_name, last_name) LIKE :full_name ORDER BY students.time_stamp DESC LIMIT 5 OFFSET $startingRow";


            $stmt = $this->pdo->prepare($q);
            $value = '%'.$name.'%';
            $stmt->bindParam(':full_name', $value);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }

        
    }

    $teacherFiles = new TeacherFiles('localhost', 'fms4_db', 'root', '');

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
            $teacherFiles->getNumOfFiles();
            break;
        case 2:
            $teacherFiles->getFiles();
            break;
        case 4:
            $teacherFiles->deleteRow('files', 'file_id');
            break;
        case 5:
            $teacherFiles->updateFile();
            break;
        case 6:
            $teacherFiles->getTeacherClasses();
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

            // if($option == 1) {
            //     $student->getRows('students');
            // } else 
            if($option == 2) {
                $student->getFilteredStudents();
            } else {
                $student->getSearchedStudents();
            }
            break;
        case 10:
            $teacherFiles->getTeacherSubjects();
            break;
        case 11:
            $teacherFiles->getFileClasses();
            break;
    }

?>
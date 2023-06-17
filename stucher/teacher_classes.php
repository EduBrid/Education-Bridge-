<?php

    include('../database.php');

    session_start();

    class TeacherClasses extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getNumOfTeacherStudents() {
    
            $q = "SELECT COUNT(students.student_id) AS count FROM students JOIN classes ON students.class_id = classes.class_id 
            JOIN teacher_classes ON teacher_classes.class_id = students.class_id 
            WHERE teacher_classes.teacher_id = :teacherId";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $numOfStudents = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfStudents;
        }

        function getStudents() {

            // $teacherId = @$_GET['teacher_id'];
            $startingRow = @$_GET['row'];
            $limit = @$_GET['limit'];
    
            $q = "SELECT students.student_id, students.first_name, students.last_name, students.gender, students.birth_date,
            students.class_id, classes.class FROM students JOIN classes ON students.class_id = classes.class_id JOIN teacher_classes
            ON teacher_classes.class_id = students.class_id WHERE teacher_classes.teacher_id = :teacherId
            ORDER BY students.time_stamp DESC LIMIT $startingRow, $limit";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
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

        function getNumOfFilterStudents() {

            $class_id = @$_GET['class_id'];

            $q = "SELECT COUNT(students.student_id) AS count FROM students JOIN classes ON students.class_id = classes.class_id 
            JOIN teacher_classes ON teacher_classes.class_id = students.class_id 
            WHERE teacher_classes.teacher_id = :teacherId AND students.class_id = :class_id";

            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':class_id', $class_id);
            $stmt->bindParam(':teacherId', $_SESSION['teacher_id']);
            $stmt->execute();
        
            $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
            echo $numOfClasses;
            
        }

        function getFilteredStudents() {

            $startingRow = @$_GET['row'];
            $class_id = @$_GET['class_id'];

            $q = "SELECT students.student_id, students.first_name, students.last_name, students.gender, students.birth_date,
            students.class_id, classes.class FROM students JOIN classes ON students.class_id = classes.class_id
             WHERE students.class_id = :class_id ORDER BY students.time_stamp DESC LIMIT 5 OFFSET $startingRow";

            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':class_id', $class_id);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }
        
    }

    $teacherClasses = new TeacherClasses('localhost', 'fms4_db', 'root', '');

    $actionNum = @$_GET['action_num'];

    switch ($actionNum) {
        case 0:
            if (!isset($_SESSION['admin_id'])) {
                echo "-1";
                exit;
            } else {
                echo "0";
            }
            break;
        case 1:
            $teacherClasses->getNumOfTeacherStudents();
            break;
        case 2:
            $teacherClasses->getStudents();
            break;
        case 3:
            $teacherClasses->getTeacherClasses();
            break;
        case 4:
            $teacherClasses->getNumOfFilterStudents();
            break;
        case 5:
            $teacherClasses->getFilteredStudents();
            break;
    }

?>
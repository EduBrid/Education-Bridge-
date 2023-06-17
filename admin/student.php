<?php

    include('../database.php');

    session_start();

    class Student extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getStudents() {

            $startingRow = @$_GET['row'];
            $limit = @$_GET['limit'];
    
            $q = "SELECT students.*, classes.class_id, classes.class FROM students JOIN classes ON students.class_id = classes.class_id
             ORDER BY students.time_stamp DESC LIMIT $startingRow, $limit";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }

        

        function addStudent() {
            try {
                $studentId = @$_GET['student_id'];
    
                $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM students WHERE student_id = :studentId");
                $stmt->bindValue(':studentId', $studentId);
                $stmt->execute();
    
                $count = $stmt->fetchColumn();
    
                if($count > 0 ) {
                    echo "-1";
                } else {
                    
                    $fName = @$_GET['first_name'];
                    $lName = @$_GET['last_name'];
                    $gender = @$_GET['gender'];
                    $birthDate = @$_GET['birth_date'];
                    $class_id = @$_GET['class_id'];
    
                    $email = $fName.$lName."@edu.ma";
                    // $password = ucfirst($lName).$birthDate[5].$birthDate[6].$birthDate[8].$birthDate[8];
                    $encryptedPassword = password_hash($studentId, PASSWORD_DEFAULT);
    
                    $q = "INSERT INTO students(student_id, first_name, last_name, email, password, gender, birth_date, class_id) 
                    VALUES(:id, :fname, :lname, :email, :password, :gender, :birth, :class_id)";
    
                    $stmt = $this->pdo->prepare($q);
                    $stmt->bindParam(':id', $studentId);
                    $stmt->bindParam(':fname', $fName);
                    $stmt->bindParam(':lname', $lName);
                    $stmt->bindParam(':email', strtolower($email));
                    $stmt->bindParam(':password', $encryptedPassword);
                    $stmt->bindParam(':gender', $gender);
                    $stmt->bindParam(':birth', $birthDate);
                    $stmt->bindParam(':class_id', $class_id);
                    $stmt->execute();
    
                }
    
                
            } catch(PDOEXCEPTION $e) {
                echo $e;
            }
        }

        function updateStudent() {

            try {
    
                $studentId = @$_GET['student_id'];
                    
                $fName = @$_GET['first_name'];
                $lName = @$_GET['last_name'];
                $gender = @$_GET['gender'];
                $birthDate = @$_GET['birth_date'];
                $class_id = @$_GET['class_id'];

                $email = $fName.$lName."@edu.ma";

                $q = "UPDATE students SET first_name = :fname, last_name = :lname, email = :email,
                    gender = :gender, birth_date = :birth, class_id = :class_id WHERE student_id = :studentId";

                $stmt = $this->pdo->prepare($q);
                $stmt->bindParam(':studentId', $studentId);
                $stmt->bindParam(':fname', $fName);
                $stmt->bindParam(':lname', $lName);
                $stmt->bindParam(':email', strtolower($email));
                $stmt->bindParam(':gender', $gender);
                $stmt->bindParam(':birth', $birthDate);
                $stmt->bindParam(':class_id', $class_id);
                $stmt->execute();
    
                
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

    $student = new Student('localhost', 'fms4_db', 'root', '');

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
            $student->getNumOfRows('students');
            break;
        case 2:
            // $student->getRows('students', 'student_id');
            $student->getStudents();
            break;
        case 3:
            $student->addStudent();
            break;
        case 4:
            $student->deleteRow('students', 'student_id');
            break;
        case 5:
            $student->updateStudent();
            break;
        case 6:
            $student->getAll('classes');
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
    }

?>
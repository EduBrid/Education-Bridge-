<?php

    include('../database.php');

    session_start();

    class Teacher extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getTeacherClasses() {

            $teacherId = @$_GET['teacher_id'];
    
            $q = "SELECT classes.class_id FROM classes JOIN teacher_classes ON classes.class_id = teacher_classes.class_id
             WHERE teacher_classes.teacher_id = :teacher_id";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacher_id', $teacherId);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }

        function getTeacherSubjects() {

            $teacherId = @$_GET['teacher_id'];
    
            $q = "SELECT subjects.subject_id, subjects.subject FROM subjects JOIN teacher_subjects ON subjects.subject_id = teacher_subjects.subject_id
             WHERE teacher_subjects.teacher_id = :teacher_id";
    
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':teacher_id', $teacherId);
            $stmt->execute();
    
            $rows = $stmt->fetchAll();
    
            echo json_encode($rows);
        }




        function addTeacher() {
            try {
                $teacherId = @$_GET['teacher_id'];
    
                $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM teachers WHERE teacher_id = :teacherId");
                $stmt->bindValue(':teacherId', $teacherId);
                $stmt->execute();
    
                $count = $stmt->fetchColumn();
    
                if($count > 0 ) {
                    echo "-1";
                } else {
                    
                    $fName = @$_GET['first_name'];
                    $lName = @$_GET['last_name'];
                    $gender = @$_GET['gender'];
                    $birthDate = @$_GET['birth_date'];
    
                    $email = strtolower($fName.$lName."@edu.ma");
                    $encryptedPassword = password_hash($teacherId, PASSWORD_DEFAULT);

                    
    
                    $q1 = "INSERT INTO teachers(teacher_id, first_name, last_name, email, password, gender, birth_date) 
                    VALUES(:id, :fname, :lname, :email, :password, :gender, :birth)";
    
                    $stmt1 = $this->pdo->prepare($q1);
                    $stmt1->bindParam(':id', $teacherId);
                    $stmt1->bindParam(':fname', $fName);
                    $stmt1->bindParam(':lname', $lName);
                    $stmt1->bindParam(':email', $email);
                    $stmt1->bindParam(':password', $encryptedPassword);
                    $stmt1->bindParam(':gender', $gender);
                    $stmt1->bindParam(':birth', $birthDate);

                    $q2 = "insert into teacher_classes(teacher_id, class_id) VALUES(?, ?)";
                    $stmt2 = $this->pdo->prepare($q2);

                    $q3 = "insert into teacher_subjects(teacher_id, subject_id) VALUES(?, ?)";
                    $stmt3 = $this->pdo->prepare($q3);

                    $this->pdo->beginTransaction();

                    $stmt1->execute();

                    $classes = @$_GET['classes'];
                    foreach($classes as $class) {
                        $stmt2->execute([$teacherId, $class]);
                    }

                    $subjects = @$_GET['subjects'];
                    foreach($subjects as $subject) {
                        $stmt3->execute([$teacherId, $subject]);
                    }

                    $this->pdo->commit();

                    echo $teacherId."<br>".$encryptedPassword;
                }
    
                
            } catch(PDOEXCEPTION $e) {
                $this->pdo->rollBack();
                echo $e;
            }

            
        }

        function updateTeacher() {

            try {
    
                $teacherId = @$_GET['teacher_id'];
                    
                $fName = @$_GET['first_name'];
                $lName = @$_GET['last_name'];
                $gender = @$_GET['gender'];
                $birthDate = @$_GET['birth_date'];

                $email =  strtolower($fName.$lName."@edu.ma");

                $q1 = "UPDATE teachers SET first_name = :fname, last_name = :lname, email = :email,
                    gender = :gender, birth_date = :birth WHERE teacher_id = :teacherId";

                $stmt1 = $this->pdo->prepare($q1);
                $stmt1->bindParam(':teacherId', $teacherId);
                $stmt1->bindParam(':fname', $fName);
                $stmt1->bindParam(':lname', $lName);
                $stmt1->bindParam(':email', $email);
                $stmt1->bindParam(':gender', $gender);
                $stmt1->bindParam(':birth', $birthDate);

                $q2 = "DELETE FROM teacher_classes WHERE teacher_id = :teacherId";
                $stmt2 = $this->pdo->prepare($q2);
                $stmt2->bindParam(':teacherId', $teacherId);

                $q3 = "DELETE FROM teacher_subjects WHERE teacher_id = :teacherId";
                $stmt3 = $this->pdo->prepare($q3);
                $stmt3->bindParam(':teacherId', $teacherId);

                $q4 = "insert into teacher_classes(teacher_id, class_id) VALUES(?, ?)";
                $stmt4 = $this->pdo->prepare($q4);

                $q5 = "insert into teacher_subjects(teacher_id, subject_id) VALUES(?, ?)";
                $stmt5 = $this->pdo->prepare($q5);

                $this->pdo->beginTransaction();

                $stmt1->execute();
                $stmt2->execute();
                $stmt3->execute();

                $classes = @$_GET['classes'];
                foreach($classes as $class) {
                    $stmt4->execute([$teacherId, $class]);
                }

                $subjects = @$_GET['subjects'];
                foreach($subjects as $subject) {
                    $stmt5->execute([$teacherId, $subject]);
                }

                $this->pdo->commit();
            } catch(PDOEXCEPTION $e) {
                echo $e;
            }
        }

        // function getNumOfFilteredTeachersByClass() {

        //     $class = @$_GET['class_id'];

        //     $q = "SELECT COUNT(*) as count FROM teachers WHERE class = :class";
        //     $stmt = $this->pdo->prepare($q);
        //     $stmt->bindParam(':class', $class);
        //     $stmt->execute();
        
        //     $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        //     echo $numOfClasses;
            
        // }

        // function getNumOfFilteredTeachersBySubject() {

        //     $class = @$_GET['subject_id'];

        //     $q = "SELECT COUNT(*) as count FROM teachers WHERE class = :class";
        //     $stmt = $this->pdo->prepare($q);
        //     $stmt->bindParam(':class', $class);
        //     $stmt->execute();
        
        //     $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        //     echo $numOfClasses;
            
        // }

        // function getFilteredStudents() {

        //     $startingRow = @$_GET['row'];
        //     $class = @$_GET['classe'];
    
        //     $q = "SELECT * FROM students WHERE class = :class ORDER BY id DESC LIMIT 5 OFFSET $startingRow";

        //     $stmt = $this->pdo->prepare($q);
        //     $stmt->bindParam(':class', $class);
        //     $stmt->execute();
    
        //     $rows = $stmt->fetchAll();
    
        //     echo json_encode($rows);
        // }

        // function getNumOfSearchedStudents() {

        //     $name = @$_GET['name'];

        //     // echo $name;

        //     $q = "SELECT COUNT(*) as count FROM students WHERE CONCAT(first_name, last_name) LIKE :full_name";
        //     $stmt = $this->pdo->prepare($q);
        //     $value = '%'.$name.'%';
        //     $stmt->bindParam(':full_name', $value);
        //     $stmt->execute();
        
        //     $numOfClasses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        //     echo $numOfClasses;
            
        // }

        // function getSearchedStudents() {

        //     $startingRow = @$_GET['row'];
        //     $name = @$_GET['name'];
    
        //     $q = "SELECT * FROM students WHERE CONCAT(first_name, last_name) LIKE :full_name ORDER BY id DESC LIMIT 5 OFFSET $startingRow";

        //     $stmt = $this->pdo->prepare($q);
        //     $value = '%'.$name.'%';
        //     $stmt->bindParam(':full_name', $value);
        //     $stmt->execute();
    
        //     $rows = $stmt->fetchAll();
    
        //     echo json_encode($rows);
        // }

        
    }

    $teacher = new Teacher('localhost', 'fms4_db', 'root', '');

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
            $teacher->getNumOfRows('teachers');
            break;
        case 2:
            $teacher->getRows('teachers');
            break;
        case 3:
            $teacher->addTeacher();
            break;
        case 4:
            $teacher->deleteRow('teachers', 'teacher_id');
            break;
        case 5:
            $teacher->updateTeacher();
            break;
        case 6:
            $teacher->getAll('classes');
            break;
        // case 7:
        //     $option = @$_GET['option'];

        //     if($option == 1) {
        //         $student->getNumOfRows('students');
        //     } else if($option == 2) {
        //         $student->getNumOfFilterStudents();
        //     } else {
        //         $student->getNumOfSearchedStudents();
        //     }
        //     break;
        // case 8:
        //     $option = @$_GET['option'];

        //     if($option == 1) {
        //         $student->getRows('students');
        //     } else if($option == 2) {
        //         $student->getFilteredStudents();
        //     } else {
        //         $student->getSearchedStudents();
        //     }
        //     break;
        case 10:
            $teacher->getAll('subjects');
            break;
        case 11:
            $teacher->getTeacherClasses();
            break;
        case 12:
            $teacher->getTeacherSubjects();
            break;
    }

?>
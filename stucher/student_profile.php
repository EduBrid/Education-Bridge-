<?php

    include('../config.php');

    session_start();

    function getStudentInfo($conn) {

        try{

            $q = "SELECT s.student_id, s.first_name, s.last_name, s.email, s.gender, s.birth_date, s.class_id, c.class FROM students AS s
                JOIN classes AS c ON s.class_id = c.class_id WHERE s.student_id = :studentId";

            $stmt = $conn->prepare($q);
            $stmt->bindParam(':studentId', $_SESSION['student_id']);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($row);
            

        } catch(PDOException $e) {
            echo $e;
        }
        
    }

        
    function updatePassword($conn) {

        $password = @$_GET['password'];

        $q = "SELECT password FROM students WHERE student_id = :id";
        $stmt = $conn->prepare($q);
        $stmt->bindParam(':id', $_SESSION['student_id']);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if(password_verify($password, $row['password'])) {  
            try {

                $passwordConfirm = @$_GET['password_confirm'];

                $encryptedPassword = password_hash($passwordConfirm, PASSWORD_DEFAULT);

                $q = "UPDATE students SET password = :password WHERE student_id = :id";
                $stmt = $conn->prepare($q);
                $stmt->bindParam(':password', $encryptedPassword);
                $stmt->bindParam(':id', $_SESSION['student_id']);
                $stmt->execute();

            } catch(PDOException $e) {
                echo '-2';
            }
        } else {
            echo '-1';
        }

    }

    $actionNum = @$_GET['action_num'];

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
            getStudentInfo($conn);
            break;
        case 2:
            updatePassword($conn);
            break;
    }
    


?>
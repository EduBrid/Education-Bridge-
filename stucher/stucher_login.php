<?php

    include("../config.php");

    session_start();

    $actionNum = @$_GET['action_num'];

    switch($actionNum) {
        case 0:
            if(isset($_SESSION['teacher_id'])) {
                echo '0';
            } else if(isset($_SESSION['student_id'])) {
                echo '1';
            }
            break;
        case 1:
            $email = @$_GET['email'];
            $password = @$_GET['password'];
            $userType = @$_GET['user_type'];
            $id = $userType."_id";

            $q = "SELECT * FROM $userType WHERE email = :email";

            $stmt = $conn->prepare($q);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $rows = $stmt->fetchAll();

            if($rows > 0) {
                $isTrue = false;
                foreach($rows as $row) {
                    if(password_verify($password, $row['password'])) {  
                        if($userType == "teachers") {
                            $_SESSION['teacher_id'] = $row['teacher_id'];
                        } else {
                            $_SESSION['student_id'] = $row['student_id'];
                            $_SESSION['class_id'] = $row['class_id'];

                        }
                        $isTrue = true;
                        echo json_encode($row);
                    }
                }
                if(!$isTrue) {
                    echo "-1";
                }
                
                
            } else {
                echo "-1";
            }
            break;
    }

    
 

    
?>
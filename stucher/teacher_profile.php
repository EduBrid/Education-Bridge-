<?php

    include('../config.php');

    session_start();

    function getTeacherInfo($conn) {

        try{

            $q = "SELECT t.first_name, t.last_name, t.email, t.gender, t.birth_date,
                    GROUP_CONCAT(DISTINCT ts.subject_id) AS subject_ids,
                    GROUP_CONCAT(DISTINCT s.subject) AS subjects,
                    GROUP_CONCAT(DISTINCT tc.class_id) AS class_ids,
                    GROUP_CONCAT(DISTINCT c.class) AS classes
                FROM
                    teachers AS t
                    JOIN teacher_subjects AS ts ON t.teacher_id = ts.teacher_id
                    JOIN subjects AS s ON ts.subject_id = s.subject_id
                    JOIN teacher_classes AS tc ON t.teacher_id = tc.teacher_id
                    JOIN classes AS c ON tc.class_id = c.class_id
                WHERE
                    t.teacher_id = :teacher_id
                GROUP BY
                    t.teacher_id,
                    t.first_name,
                    t.last_name,
                    t.email,
                    t.gender,
                    t.birth_date
            ";

            $stmt = $conn->prepare($q);
            $stmt->bindParam(':teacher_id', $_SESSION['teacher_id']);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {

                $subjects = array_combine(explode(',', $row['subject_ids']), explode(',', $row['subjects']));
                $classes = array_combine(explode(',', $row['class_ids']), explode(',', $row['classes']));


                $resultArray = array(
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'email' => $row['email'],
                    'gender' => $row['gender'],
                    'birth_date' => $row['birth_date'],
                    'subjects' => $subjects,
                    'classes' => $classes
                );
                echo json_encode($resultArray);
            } else {
                echo "Teacher not found.";
            }

        } catch(PDOException $e) {
            echo $e;
        }
        
    }

        
    function updatePassword($conn) {

        $password = @$_GET['password'];

        $q = "SELECT password FROM teachers WHERE teacher_id = :id";
        $stmt = $conn->prepare($q);
        $stmt->bindParam(':id', $_SESSION['teacher_id']);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // echo $password."</br>".$row['password'];

        if(password_verify($password, $row['password'])) {  
            try {

                $passwordConfirm = @$_GET['password_confirm'];

                $encryptedPassword = password_hash($passwordConfirm, PASSWORD_DEFAULT);

                $q = "UPDATE teachers SET password = :password WHERE teacher_id = :id";
                $stmt = $conn->prepare($q);
                $stmt->bindParam(':password', $encryptedPassword);
                $stmt->bindParam(':id', $_SESSION['teacher_id']);
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
            if (!isset($_SESSION['teacher_id'])) {
                echo "-1";
                exit;
            } else {
                echo "0";
            }
            break;
        case 1:
            getTeacherInfo($conn);
            break;
        case 2:
            updatePassword($conn);
            break;
    }
    


?>
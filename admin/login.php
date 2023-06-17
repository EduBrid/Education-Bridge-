<?php

    include("../config.php");

    session_start();

    $actionNum = @$_GET['action_num'];

    switch($actionNum) {
        case 0:
            if(isset($_SESSION['admin_id'])) {
                echo '0';
            }
            break;
        case 1:
            $email = @$_GET['email'];
            $password = @$_GET['password'];

            $q = "SELECT * FROM admin WHERE email = :email";

            $stmt = $conn->prepare($q);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($password, $row['password'])) {    
                $_SESSION['admin_id'] = $row['admin_id'];
                echo json_encode($row);
            } else {
                echo '-1';
            }
            break;
    }

   

    
    
    // $salt = password_hash('Admin123', PASSWORD_DEFAULT);
    // echo $salt;
    // echo strlen('$2y$10$qhoe7XUJBO6854NHQI1xT.St9zYZdjuT60c3H9FuaLq/lrgajafga');
    // if(password_verify('Admin123', '$2y$10$qhoe7XUJBO6854NHQI1xT.St9zYZdjuT60c3H9FuaLq/lrgajafga')) {
    //     echo "trrue";
    // } else {
    //     echo "false";
    // }



?>
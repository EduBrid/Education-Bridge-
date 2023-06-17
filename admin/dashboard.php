<?php

    include('../database.php');

    session_start();


    class Dashboard extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        function getAdminInfo() {

            $q = "SELECT first_name, last_name, email FROM admin";

            $stmt = $this->pdo->prepare($q);
            $stmt->execute();

            $row = $stmt->fetch();

            echo json_encode($row);
        }

        function updateAdminInfo() {

            $password = @$_GET['password'];

            $q = "SELECT password From admin WHERE admin_id = :id";
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':id', $_SESSION['admin_id']);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(password_verify($password, $row['password'])) {  
                try {
                    $firstName = @$_GET['first_name'];
                    $lastName = @$_GET['last_name'];
                    $email = @$_GET['email'];

                    $q = "UPDATE admin SET first_name = :firstName, last_name = :lastName, email = :email WHERE admin_id = :id";
                    $stmt = $this->pdo->prepare($q);
                    $stmt->bindParam(':firstName', $firstName);
                    $stmt->bindParam(':lastName', $lastName);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':id', $_SESSION['admin_id']);
                    $stmt->execute();

                    $adminData = array("first_name"=>$firstName, "last_name"=>$lastName, "email"=>$email);
                    echo json_encode($adminData);
                } catch(PDOException $e) {
                    echo '-2';
                }
                

            } else {
                echo '-1';
            }

        }
        function updatePassword() {

            $password = @$_GET['password'];

            $q = "SELECT password From admin WHERE admin_id = :id";
            $stmt = $this->pdo->prepare($q);
            $stmt->bindParam(':id', $_SESSION['admin_id']);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(password_verify($password, $row['password'])) {  
                try {
                    $firstName = @$_GET['first_name'];
                    $lastName = @$_GET['last_name'];
                    $email = @$_GET['email'];
                    $passwordConfirm = @$_GET['password_confirm'];

                    $encryptedPassword = password_hash($passwordConfirm, PASSWORD_DEFAULT);

                    $q = "UPDATE admin SET first_name = :firstName, last_name = :lastName, email = :email, password = :password WHERE admin_id = :id";
                    $stmt = $this->pdo->prepare($q);
                    $stmt->bindParam(':firstName', $firstName);
                    $stmt->bindParam(':lastName', $lastName);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':password', $encryptedPassword);
                    $stmt->bindParam(':id', $_SESSION['admin_id']);
                    $stmt->execute();

                    $adminData = array("first_name"=>$firstName, "last_name"=>$lastName, "email"=>$email);
                    echo json_encode($adminData);
                } catch(PDOException $e) {
                    echo '-2';
                }
            } else {
                echo '-1';
            }

        }

    }

    $dashboard = new Dashboard('localhost', 'fms4_db', 'root', '');


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
            $dashboard->getAdminInfo();
            break;
        case 2:
            $dashboard->getNumOfRows('teachers');
            break;
        case 3:
            $dashboard->getNumOfRows('students');
            break;
        case 4:
            $dashboard->updateAdminInfo();
            break;
        case 5:
            $dashboard->updatePassword();
            break;
        case 6:
            $dashboard->getNumOfRows('files');
            break;
        case 7:
            $dashboard->getNumOfRows('videos');
            break;
    }
    


?>
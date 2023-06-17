<?php

    include('../database.php');

    session_start();

    class MyClass extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        
    }

    $myClass = new MyClass('localhost', 'fms4_db', 'root', '');

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
            $myClass->getNumOfRows('classes');
            break;
        case 2:
            $myClass->getRows('classes');
            break;
        case 3:
            $myClass->addClassSubject('classes', 'class');
            break;
        case 4:
            $myClass->deleteRow('classes', 'class');
            break;
        case 5:
            $myClass->updateClassSubject('classes', 'class');
            break;
    }

?>
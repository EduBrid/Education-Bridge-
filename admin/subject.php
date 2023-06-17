<?php

    include('../database.php');

    session_start();

    class MySubject extends MyDatabase {

        function __construct($host, $dbname, $username, $password) {

            parent::__construct($host, $dbname, $username, $password);

        }

        
    }

    $mySubject = new MySubject('localhost', 'fms4_db', 'root', '');

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
            $mySubject->getNumOfRows('subjects');
            break;
        case 2:
            $mySubject->getRows('subjects');
            break;
        case 3:
            $mySubject->addClassSubject('subjects', 'subject');
            break;
        case 4:
            $mySubject->deleteRow('subjects', 'subject');
            break;
        case 5:
            $mySubject->updateClassSubject('subjects', 'subject');
            break;
    }

?>
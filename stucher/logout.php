<?php
    session_start();
    if(isset($_SESSION['teacher_id'])) {
        unset($_SESSION['teacher_id']);
    }
    if(isset($_SESSION['student_id'])) {
        unset($_SESSION['student_id']);
        unset($_SESSION['class_id']);
    }
    session_destroy();

?>
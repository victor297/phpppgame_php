<?php

$servername = "localhost";
$username = "codingbl_test";
$password = "n56f}{l=U4N4";
$dbname = "codingbl_client";
$conn = mysqli_connect($servername,$username, $password, $dbname);
$conn -> set_charset("utf8");
date_default_timezone_set('Asia/Dhaka'); 

include "class.php";




$php_class = new bqery($conn);


?>
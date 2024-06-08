<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_POST['id']
    ]);
    $response['response'] = -1;
    $response['msg'] = "Something is wrong";
    if($isset){
        $php_class->deleteData([
            "table" => "level",
            "condition" => "id = {$_POST['id']}"
        ]);
        $response['response'] = 1;
        $response['msg'] = "Successfully delete Fruit ";
        
    }
    
    
    echo json_encode($response);



?>
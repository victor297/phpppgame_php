<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_POST['id']
    ]);
    
    if($isset){
        $php_class->updateData([
            "table" => "bg",
            "set" => [
                "active" => 0
            ]
        ]);
        
        $php_class->updateData([
            "table" => "bg",
            "set" => [
                "active" => 1
            ],
            "condition" => "id = {$_POST['id']}"
        ]);
        $response['response'] = 1;
        $response['msg'] = "Game Background Set Successfully !";
    } 
    else{
        $response['response'] = -1;
        $response['msg'] = "Some Filed is missing";
    }
    echo json_encode($response);
?>
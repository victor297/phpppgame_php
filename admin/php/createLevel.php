<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_POST["time"],
        $_POST["id"],
        $_POST["turn"],
        $_POST["goal"]
    ]);
    
    
    if($isset){
        $response['response'] = 1;
        $id = $_POST['id'];
        $array = [
            "table" => "level",
            "set" => [
                "time" => $_POST["time"],
                "turn" => $_POST["turn"],
                "goal" => json_encode(json_decode($_POST["goal"])),
            ]
        ];
        if($_POST["id"] === ""){
            $id = $php_class->insertData($array);
        }else{
            $array['condition'] = "id = $id";
            $php_class->updateData($array);
        }
        $response['msg'] = [
           "id" => $id
        ];
    }else{
        $response['response'] = -1;
        $response['msg'] = "Some Filed is missing";
    }
    echo json_encode($response);
?>
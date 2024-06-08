<?php

    include "config.php";

    $isset = $php_class->isset([
        $_FILES["music"],
        $_POST["id"],
    ]);
    if($isset){
        if($_FILES['error'] !== 0){
            $response['response'] = -1;
            $response['msg'] = "Please Upload a music";
            echo json_encode($response);
            die();
        }
        $src = $php_class->upload($_FILES['music'],"../music/");
        $php_class->updateData([
            "table" => "music",
            "set" => [
                "src" => $src
            ],
            "condition" => "id = {$_POST["id"]}"
        ]);
        
        $response['msg'] = $src;
    }else{
        $response['response'] = -1;
        $response['msg'] = "Some Filed is missing";
    }
    echo json_encode($response);



?>
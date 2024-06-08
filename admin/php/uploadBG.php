<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_FILES['uploadInput']
    ]);
    
    if($isset){
        $response['response'] = 1;
        $array = [
            "table" => "bg",
            "set" => []
        ];
        if($_FILES['uploadInput']['error'] === 0){
            $fname= $php_class->upload($_FILES['uploadInput'],"../background/");
            $array['set']['src'] = $fname;
            $id = $php_class->insertData($array);
            
        }else{
            $response['response'] = -1;
            $response['msg'] = "Please Upload a Background Image";
            echo json_encode($response);
            die();
        }
        
        $response['msg'] = [
           "src" => $fname,
           "id" => $id
        ];
    } 
    else{
        $response['response'] = -1;
        $response['msg'] = "Some Filed is missing";
    }
    
    
    
    echo json_encode($response);



?>
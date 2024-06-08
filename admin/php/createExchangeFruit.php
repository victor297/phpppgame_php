<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_POST["first_fruit"],
        $_POST["id"],
        $_POST["second_fruit"],
        $_POST["second_fruit_ex_val"]
    ]);
    
    
    if($isset){
        $second_fruit_ex_val = (int)$_POST["second_fruit_ex_val"];
        if($second_fruit_ex_val < 2 || $second_fruit_ex_val > 6){
            $response['response'] = -1;
            $response['msg'] = "Exchange Value should be 2 to 6";
            echo json_encode($response);
            die();
        }
        $id = $_POST['id'];
        $array = [
            "table" => "fruiteExchange",
            "set" => [
                "first_fruit" => $_POST["first_fruit"],
                "second_fruit" => $_POST["second_fruit"],
                "second_fruit_ex_val" => $_POST["second_fruit_ex_val"],
            ]
        ];
        $response['response'] = 1;
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
        $response['msg'] = json_encode($_POST);// "Some Filed is missing";
    }
    
    
    
    echo json_encode($response);
    


?>
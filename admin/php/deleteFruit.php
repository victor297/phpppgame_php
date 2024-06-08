<?php

    include "config.php";
    $response = [];
    $isset = $php_class->isset([
        $_POST['id']
    ]);
    $response['response'] = -1;
    $response['msg'] = "Something is wrong";
    if($isset){
       $fname = $php_class->getSingleData([
          "table" => "fruiteList",
          "rows" => "src",
          "condition" => "id = {$_POST['id']}"
       ])['src'];
       
       
       unlink("../upload/" . $fname);
        $php_class->deleteData([
            "table" => "fruiteList",
            "condition" => "id = {$_POST['id']}"
        ]);
        $response['response'] = 1;
        $response['msg'] = "Successfully delete Fruit ";
        
    }
    
    
    echo json_encode($response);



?>
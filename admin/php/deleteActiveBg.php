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
          "table" => "bg",
          "rows" => "src",
          "condition" => "id = {$_POST['id']}"
       ])['src'];
       unlink("../background/" . $fname);
        $php_class->deleteData([
            "table" => "bg",
            "condition" => "id = {$_POST['id']}"
        ]);
        $response['response'] = 1;
        $response['msg'] = "Successfully delete Background ";
        
    }
    
    
    echo json_encode($response);



?>
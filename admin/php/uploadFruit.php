<?php

include "config.php";
$response = [];
$isset = $php_class->isset([
    $_POST["fruitname"],$_FILES['uploadInput'],$_POST['id']
]);


if($isset){
   if($_POST["fruitname"] === ""){
       $response['response'] = -1;
       $response['msg'] = "Please set a fruit name";
       echo json_encode($response);
       die("");
   }
   $id = $_POST['id'];
   $response['response'] = 1;
    $array = [
        "table" => "fruiteList",
        "set" => [
            "name" => $_POST["fruitname"],
        ]
    ];
    
    
    if($_POST['id'] === ""){
        if($_FILES['uploadInput']['error'] === 0){
            $fname= $php_class->upload($_FILES['uploadInput'],"../upload/");
            $array['set']['src'] = $fname;
            $id = $php_class->insertData($array);
            
        }else{
            $response['response'] = -1;
            $response['msg'] = "Please Upload a Fruit Image";
            echo json_encode($response);
            die();
        }
        
    }else{
        $fname = $php_class->getSingleData([
          "table" => "fruiteList",
          "rows" => "src",
          "condition" => "id = {$_POST['id']}"
       ])['src'];
       
       if($_FILES['uploadInput']['error'] === 0){
           unlink("../upload/" . $fname);
           $fname = $php_class->upload($_FILES['uploadInput'],"../upload/");
           $array['set']['src']  = $fname;
       }
        $array['condition'] = "id = $id";
        $php_class->updateData($array);
    }

    
    $response['msg'] = [
       "src" => $fname,
       "name" => $_POST["fruitname"],
       "id" => $id
    ];
    
    
}else{
    $response['response'] = -1;
    $response['msg'] = "Some Filed is missing";
}



echo json_encode($response);



?>
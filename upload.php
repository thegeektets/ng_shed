<?php


if(isset($_FILES['uploadedFile'])){
    //The error validation could be done on the javascript client side.
    $errors= array();        
    $file_name = $_FILES['uploadedFile']['name'];
    $file_size =$_FILES['uploadedFile']['size'];
    $file_tmp =$_FILES['uploadedFile']['tmp_name'];
    $file_type=$_FILES['uploadedFile']['type'];   
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg","jpg","png");        
    if(in_array($file_ext,$extensions )=== false){
     $errors[]="image extension not allowed, please choose a JPEG or PNG file.";
    }
    if($file_size > 2097152){
    $errors[]='File size cannot exceed 2 MB';
    }               
    if(empty($errors)==true){
        move_uploaded_file($file_tmp,"img/".$file_name);
        echo " uploaded file: " . "img/" . $file_name;
    }else{
        print_r($errors);
    }
}
?>
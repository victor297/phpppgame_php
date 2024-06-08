<?php
class bqery{
    private $conn;
    public function __construct($connection){
        $this->conn = $connection;
        $this->arr = ["A"=>"a0z","B"=>"b1y","C"=>"c2x","D"=>"d3w","E"=>"e4v","F"=>"f5u","G"=>"g6t","H"=>"h7s","I"=>"i8r","J"=>"j9q","K"=>"k_p","L"=>"l-o","M"=>"m0n","N"=>"n@m","O"=>"o!l","P"=>"p2k","Q"=>"q*j","R"=>"r1i","S"=>"s2h","T"=>"t3g","U"=>"u4f","V"=>"v5e","W"=>"w6d","X"=>"x7c","X"=>"x8c","Y"=>"x9b","Z"=>"z-a"];
        $this-> b64_mod_arr = ["p"=>"0","k"=>"1","X"=>"2","s"=>"3","7"=>"4","n"=>"5","e"=>"6","K"=>"7","c"=>"8","R"=>"9","h"=>"A","g"=>"B","5"=>"C","y"=>"D","F"=>"E","8"=>"F","S"=>"G","A"=>"H","r"=>"I","v"=>"J","-"=>"K","T"=>"L","1"=>"M","M"=>"N","w"=>"O","C"=>"P","V"=>"Q","m"=>"R","Y"=>"S","E"=>"T","f"=>"U","J"=>"V","U"=>"W","q"=>"X","6"=>"Y","L"=>"Z","O"=>"a","a"=>"b","B"=>"c","3"=>"d","P"=>"e","9"=>"f","H"=>"g","x"=>"h","u"=>"i","z"=>"j","+"=>"k","I"=>"l","t"=>"m","j"=>"n","4"=>"o","W"=>"p","N"=>"q","D"=>"r","l"=>"s","2"=>"t","0"=>"u","o"=>"v","d"=>"w","i"=>"x","G"=>"y","Z"=>"z","Q"=>"-","b"=>"+"];
    }
    public function isset($array){
        for($i = 0; $i < sizeof($array); $i++){
            if(!isset($array[$i])){
                return false;
            }
        }
        return true;
    }
    public function passEnc($str){
        return sha1($str);
    }
    public function passCheck($str,$str2){
        return sha1($str) === $str2;
    }
    public function jbb_encode($array){
        return $this->b_encode(base64_encode(json_encode($array)));
    }
    public function jbb_decode($text){
        return json_decode(base64_decode($this->b_decode($text)),true);
    }
    public function isNumbers($array){
        for($i = 0; $i < sizeof($array); $i++){
            if(!isset($array[$i])){
                return false;
            }
            else if(!is_numeric($array[$i])){
                return false;
            }
        }
        return true;
    }
    public function authentication($auth,$uid){
        if(isset($auth) && isset($uid)){
            $userId = $this->num_dec($this->str_dec($uid)); 
            $auth = json_decode(base64_decode($this->b_decode($auth)),true);
            $isUserValid = $this->getData([
                "rows" => "cookie,unique_id,action",
                "table" => "login",
                "condition" => "lid = $userId"
            ]);
            if(sizeof($isUserValid) != 0){
                $isUserValid = $isUserValid[0];
                if($isUserValid['cookie'] === $auth['cookie'] && $isUserValid['unique_id'] === $auth['unique_id']){
                    $data['uid'] = $userId;
                    $data['action'] = $isUserValid['action'];
                    $data['response'] = true;
                }else{
                    $data['response'] = false;
                }
            }else{
                $data['response'] = false;
            }
        }else{
            $data['response'] = false;
        }
        return $data;
    }
    public function getSingleData($array){
       $data = $this->getData($array);
       if(sizeof($data) !== 0){
           return $this->getData($array)[0];
       }else{
           return null;
       }
    }
    public function getData($array){
        if(!isset($array['sql'])){
            $order = "";
            if(isset($array['order'])){
                $order = " ORDER BY ".$array['order'];
            }
             $cond = "" ;
            if(isset($array['condition'])){
                $cond = " WHERE ".$array['condition'];
            }
            $leftJoin = "";
            if(isset($array['left_join'])){
                $___ = $array['left_join'];
                for($i = 0; $i < sizeof($___); $i++){
                  $leftJoin .=  " LEFT JOIN " .$___[$i]['table'] . " ON " . $___[$i]['table'] . "." . $___[$i]['LTM'] ." = " . $array['table'] . "." . $___[$i]['RTM'] ;
                }
            }
            $limit = "";
            if(isset($array['limit'])){
                $limit = " LIMIT " . $array['limit'][0] . " OFFSET " . $array['limit'][1];
            }
            
            $sql = "SELECT ". $array['rows'] ." FROM " . $array['table']  . $leftJoin .  $cond . $order . $limit;
        }else{
            $sql = $array['sql'];
        }
        $result = mysqli_query($this->conn,$sql) or die("GET {$array['table']} query failed "."\n $sql \n error : {$this->conn->error}");
        $array = [];
        if(mysqli_num_rows($result) > 0){
            while($row = mysqli_fetch_assoc($result)){
                array_push($array,$row);
            }
        }
        return $array;
    }
    public function insertData($array){
        $rows = "";
        $val = "";
        $count = 0;
         $test = "";
        $array_length = sizeof($array['set']);
        foreach ($array['set'] as $key => $value){
            // $test .= $value;{$this->MRES($value)}
            $value = gettype($value) === "string" ? "'{$this->MRES($value)}'" : $value;
            $count++;
            if($count == $array_length){
                $rows .= $key;
                $val .= $value;
            }else{
                $rows .= $key. ",";
                $val .= $value.",";
            }
        }
         $sql = "INSERT INTO {$array['table']}({$rows}) VALUES ({$val})" ;
         mysqli_query($this->conn,$sql) or die("insert {$array['table']} query failed "."\n $sql;\n $test \n error : {$this->conn->error}");
         return mysqli_insert_id($this->conn);;
    }
    public function MRES($str){
        return mysqli_real_escape_string($this->conn,$str);
    }
    public function updateData($array){
        $set = "";
        $count = 0;
        $array_length = sizeof($array['set']);
        foreach ($array['set'] as $key => $value){
            $value = gettype($value) === "string" ? "'{$this->MRES($value)}'" : $value;
            $count++;
            if($count == $array_length){
                $set .= " $key = $value ";
            }else{
                $set .= " $key = $value ,";
            }
        }
         $cond = "" ;
        if(isset($array['condition'])){
            $cond = " WHERE ".$array['condition'];
        }
        $sql = "UPDATE ".$array['table']." SET $set". $cond ;
        mysqli_query($this->conn,$sql) or die("update {$array['table']} query failed "."\n $sql; \n error : {$this->conn->error}");
    }
    public function deleteData($array,$column = null){
         $cond = "" ;
        if(isset($array['condition'])){
            $cond = " WHERE ".$array['condition'];
        }
        $data = [];
        if($column !== null){
            $array["rows"] = $column;
            $data = $this->getData($array);
        }
        $sql = "DELETE FROM ".$array['table']. $cond ;
        mysqli_query($this->conn,$sql) or die("update {$array['table']} query failed "."<br/> $sql");
        return $data;
    }
    public function array_num_add($araay,$ind){
        $value = 0;
        for($i = 0; $i < sizeof($araay); $i++){
            $value += $araay[$i][$ind];
        }
        return $value;
    }
    public function dup_arr_remove($array,$dup_id){
        $arr = [];
        $arr2 = [];
        $arr3 = [];
        for($i = 0; $i < sizeof($array); $i++){
            $val_insert = true;
            for($j = 0; $j < sizeof($arr2); $j ++){
                if($array[$i][$dup_id] == $arr2[$j]){
                    $val_insert = false;
                }
            }
            if($val_insert){
                array_push($arr2,$array[$i][$dup_id]);
                array_push($arr,$array[$i]);
            }
            
            for($j = 0; $j < sizeof($arr2); $j ++){
                if(!isset($arr[$j]["count"])){
                    $arr[$j]["count"] = 0;
                }
                if($array[$i][$dup_id] == $arr2[$j]){
                    $arr[$j]["count"] = $arr[$j]["count"] + 1;
                }
            }
        }
        return $arr;
    }
    public function str_short($str,$num){
        $name = htmlspecialchars_decode($str) ; 
        $name = strlen($name) > $num ? substr($name, 0,$num-3)."..." :   $name ;
        return $name = htmlspecialchars($name);
    }
    public function array_sort($arr,$sort_item,$sort = false){
        if($sort){
            $sort_method = SORT_ASC;
        }else{
            $sort_method = SORT_DESC;
        }
        $price = array_column($arr, $sort_item);
        array_multisort($price, $sort_method, $arr);
        return $arr;
    }
    public function time($timestamp){  
          $time_ago = strtotime($timestamp);  
          $current_time = time();  
          $time_difference = $current_time - $time_ago;  
          $seconds = $time_difference;  
          $minutes      = round($seconds / 60 );           // value 60 is seconds  
          $hours           = round($seconds / 3600);           //value 3600 is 60 minutes * 60 sec  
          $days          = round($seconds / 86400);          //86400 = 24 * 60 * 60;  
          $weeks          = round($seconds / 604800);          // 7*24*60*60;  
          $months          = round($seconds / 2629440);     //((365+365+365+365+366)/5/12)*24*60*60  
          $years          = round($seconds / 31553280);     //(365+365+365+365+366)/5 * 24 * 60 * 60  
          if($seconds <= 60)  return "Just Now";  
          else if($minutes <=60){  
             if($minutes==1)  return "one minute ago";  
             else  return "$minutes minutes ago";  
          }  
          else if($hours <=24){  
            if($hours==1)  return "an hour ago";  
            else  return "$hours hrs ago";
          }  
          else if($days <= 7){  
            if($days==1) return "yesterday";  
            else  return "$days days ago";  
          }  
          else if($weeks <= 4.3){  //4.3 == 52/12  
            if($weeks==1)  return "a week ago";  
            else   return "$weeks weeks ago";  
          }  
          else if($months <=12){  
            if($months==1) return "a month ago"; 
            else  return "$months months ago";  
          }  
          else {  
             if($years==1) return "one year ago";
             else  return "$years years ago";
          }  
     }  
    public function seo_url($url,$uid){
        function sluggify($url,$uid,$php_class){
            # Prep string with some basic normalization
            $url = strtolower($url);
            $url = strip_tags($url);
            $url = stripslashes($url);
            $url = html_entity_decode($url);
            $url = str_replace('\'', '', $url); # Remove quotes (can't, etc.)
            $match = '/[^a-z0-9]+/';  # Replace non-alpha numeric with hyphens
            $replace = '-';
            $url = preg_replace($match, $replace, $url);
            $url = trim($url, '-');
            $url = empty($url) !== true ?  $url : rand_url_gen();
            $url = duplicateURL_check($url,$uid,$php_class);
            return $url ;
        }
        function rand_url_gen(){
          $url = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,x,y,z,_,-,1,2,3,4,5,6,7,8,9,0,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,X,Y,Z";
          $url = explode(",",$url);
          $txt = "";
           for($i = 0; $i < 15; $i++){
                $x = rand(0,sizeof($url) -1);
                $txt .= $url[$x];
           }
          return $txt;
        }
        function checkURL($url,$userId,$php_class){
            $getURL = $php_class->getData([
                "rows" => "url",
                "table" => "post",
                "condition" => "uid = $userId AND url = '$url'"
            ]);
            if(sizeof($getURL) !== 0){
                return false;
            }else{
                return true;
            }
        }
        function duplicateURL_check($url,$userId,$php_class,$count=1){
            $newURL = $count === 1 ? $url : $url.$count;
            if(checkURL($newURL,$userId,$php_class)){
                return $newURL;
            }else{
                $count++;
                return duplicateURL_check($url,$userId,$php_class,$count);
            }
        }

        return sluggify($url,$uid,$this);
    }
    public function num_enc($id){
          $id_str = (string) $id;
          $offset = rand(0, 9);
          $encoded = chr(79 + $offset);
          for ($i = 0, $len = strlen($id_str); $i < $len; ++$i) {
            $encoded .= chr(65 + $id_str[$i] + $offset);
          }
          return $encoded;
    }
    public function float($n,$p=2){
        return number_format((float)$n, $p, '.', '');
    }
    public function num_dec($encoded){
      $offset = ord($encoded[0]) - 79;
      $encoded = substr($encoded, 1);
      for ($i = 0, $len = strlen($encoded); $i < $len; ++$i) {
        $encoded[$i] = ord($encoded[$i]) - $offset - 65;
      }
      return (int) $encoded;
    }
    public function str_enc($txt){
        $array = $this->arr;
       foreach ($array as $key => $value){
          $txt =  str_replace($key,$value,$txt);
       }
       return $txt;
    }
    public function str_dec($txt){
        $array = $this->arr;
       foreach ($array as $key => $value){
          $txt =  str_replace($value,$key,$txt);
       }
       return $txt;
    }
    public function crypto_rand_secure($min, $max){
        $range = $max - $min;
        if ($range < 1) return $min; // not so random...
        $log = ceil(log($range, 2));
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd > $range);
        return $min + $rnd;
    }
    function getToken($length){
        $token = "";
        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet.= "0123456789";
        $max = strlen($codeAlphabet); // edited
    
        for ($i=0; $i < $length; $i++) {
            $token .= $codeAlphabet[$this->crypto_rand_secure(0, $max-1)];
        }
        return $token;
    }

    public function g_str_arr($txt){
        $your_string = trim($txt);
        $split_strings = preg_split('/[\ \n\,]+/', $your_string);
        $split_strings = array_unique($split_strings);
        return $split_strings;
    }
    public function setCooKie($cn,$cv,$t){
        setcookie(
             $cn,
             $value = $cv,
             time() + $t,
             $path = "/",
             $domain = ".codingbijoy.com",
             $secure = true,
             $httponly = false
        );
    }
    public function is_url_image($url){
        $params = array('http' => array(
              'method' => 'HEAD'
         ));
         $ctx = stream_context_create($params);
         $fp = @fopen($url, 'rb', false, $ctx);
         if (!$fp) 
            return false;  // Problem with url
    
        $meta = stream_get_meta_data($fp);
        if ($meta === false)
        {
            fclose($fp);
            return false;  // Problem reading data from url
        }
    
        $wrapper_data = $meta["wrapper_data"];
        if(is_array($wrapper_data)){
          foreach(array_keys($wrapper_data) as $hh){
              if (substr($wrapper_data[$hh], 0, 19) == "Content-Type: image") // strlen("Content-Type: image") == 19 
              {
                fclose($fp);
                return true;
              }
          }
        }
    
        fclose($fp);
        return false;
    }
    public function ext_from_type($ext){
        $ext = strtolower($ext);
        $img_ext = ["png","jpg","jpeg","gif","webp","jfif"];
        $video_ext = ["mp4","avi","mov","mkv","wmv","webm"];
        $audio_ext = ["mp3","wav","ogg","flac"];
        foreach($img_ext as $i_ext){
            if($i_ext === $ext){
                return "image";
            }
        }
        foreach($video_ext as $i_ext){
            if($i_ext === $ext){
                return "video";
            }
        }
        foreach($audio_ext as $i_ext){
            if($i_ext === $ext){
                return "audio";
            }
        }
        if($ext === 'pdf'){
            return "pdf";
        }
        return "unknown";
        
    }
    public function upload($file,$dir,$name=null){
        if(is_array($file['name'])){
            $filenames_array = [];
            $total = count($file['name']);
            for($i = 0; $i < $total; $i++){
                $tmpFilePath = $file['tmp_name'][$i];
                $extension = pathinfo($file['name'][$i], PATHINFO_EXTENSION);
                $basename = pathinfo($file['name'][$i], PATHINFO_FILENAME);
                $filename = time() . "-" . $basename . "-"  . uniqId() . "." . $extension;
                move_uploaded_file($file["tmp_name"][$i], $dir . $filename);
                array_push($filenames_array,array(
                    "name" => $filename,
                    "type" => $this->ext_from_type($extension)
                ));
            }
            return $filenames_array;
        }else{
            list($basename,$extension) = explode(".",$file['name']);
            $filename = $name . "." . $extension;
            if($name === null){
                $filename = time() . "-" . $basename . "-"  . uniqId() . "." . $extension;
            }
            move_uploaded_file($file["tmp_name"], $dir . $filename);
            return $filename;
        }
        
        
        
        
       
    }
    public function b_encode($string){
      $str = "";
      $arr = $this->b64_mod_arr;
      $array = [0,1,2,3,4,5,6,7,8,9];
      $code_arr = str_split($string);
      for($i = 0; $i < sizeof($code_arr); $i++){
        $code_arr[$i] = is_numeric($code_arr[$i]) ? (int)$code_arr[$i] : $code_arr[$i];
    	  foreach($arr as $key => $val){
            if($key === $code_arr[$i]){
                $str.= $val;
            }
        }
      }
      return $str;
    }
    public function b_decode($json){
      $str = "";
      $arr = $this->b64_mod_arr;
      $code_arr = str_split($json);
      for($i = 0; $i < sizeof($code_arr); $i++){
    	foreach($arr as $key => $val){
            if($val == $code_arr[$i]){
                $str.= $key;
            }
        }
      }
      return $str;
    }
}

























?>
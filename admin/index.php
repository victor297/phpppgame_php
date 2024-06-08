<?php
    include "php/config.php";

    $fruitList = $php_class->getData([
        "table" => "fruiteList",
        "rows" => "*"
    ]);

    $exchnageFruit = $php_class->getData([
        "table" => "fruiteExchange",
        "rows" => "*",
    ]);
    $background = $php_class->getData([
        "table" => "bg",
        "rows" => "*",
    ]);
    $level = $php_class->getData([
         "table" => "level",
        "rows" => "*",
    ]);
    $exchangeAvailableFruit = $php_class->getData([
        "sql" => "
            SELECT  fl.*
            FROM (
                SELECT fe1.*
                FROM fruiteExchange fe1
                WHERE fe1.id = (
                    SELECT MIN(fe2.id)
                    FROM fruiteExchange fe2
                    WHERE fe1.first_fruit = fe2.first_fruit
                )
            ) fe
            LEFT JOIN fruiteList fl ON fe.first_fruit = fl.id;
        "
    ]);
    
    $music = $php_class->getData([
        "table" => "music",
        "rows" => "*"
    ]);
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel</title>
        <link rel="stylesheet" href="style.css?v=<?= time(); ?>">
        <link rel="stylesheet" href="../class.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&amp;display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="p-3 flex flex-column gap-3">
            <h2>Fruit List</h2>
            <table id="FruitListTable">
              <tr>
                <th>SI</th>
                <th>Name</th>
                <th>Image</th>
                <th colspan="2"></th>
              </tr>
              <?php 
                $count = 1;
                foreach($fruitList as $fl){ ?>
              <tr>
                <td><?= $count ?></td>
                <td><?= $fl['name'] ?></td>
                <td><img style="object-fit: contain;" class="h-full w-full" src="upload/<?= $fl['src'] ?>" alt="<?= $fl['name'] ?>" /></td>
                <td>
                    <span class="edit_fruit_list_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_fruit_list_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
              </tr>
              <?php $count++; } ?>
            </table>
            <div>
                <button class="button-37 insertFruitBtn" role="button" data-activeTab="addFruitForm">Add New Fruit</button>
            </div>
            
            <h2 class="mt-5">Exchange Fruit</h2>
            <table id="FruitExchangeTable">
              <tr>
                <th>SI</th>
                <th>First Fruit</th>
                <th>Second Fruit</th>
                <th colspan="2"></th>
              </tr>
              <?php 
                $count = 1;
                foreach($exchnageFruit as $fl){ 
                    $fruit_1 = $php_class->getSingleData([
                        "table" => "fruiteList",
                        "rows" => "*",
                        "condition" => "id = {$fl['first_fruit']}"
                    ]);
                    $fruit_2 = $php_class->getSingleData([
                        "table" => "fruiteList",
                        "rows" => "*",
                        "condition" => "id = {$fl['second_fruit']}"
                    ]);
                ?>
              <tr>
                <td><?= $count ?></td>
                <td data-id="<?= $fl['first_fruit'] ?>">
                    <img style="object-fit: contain;" class="h-full w-full" src="upload/<?= $fruit_1['src'] ?>" alt="<?= $fruit_1['name'] ?>" />
                </td>
                <td data-id="<?= $fl['second_fruit'] ?>" data-value="<?= $fl['second_fruit_ex_val'] ?>">
                    <div style="height:30px">
                        <img style="object-fit: contain;width:30px" class="h-full" src="upload/<?= $fruit_2['src'] ?>" alt="<?= $fruit_2['name'] ?>" />
                        <sub>X <?= $fl['second_fruit_ex_val'] ?></sub>
                    </div>
                </td>
                <td>
                    <span class="edit_exchange_fruit_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_exchange_fruit_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
              </tr>
              <?php $count++; } ?>
            </table>
            <div>
                <button class="button-37" role="button" data-activeTab="addExchangeForm" id="createExchangeBtn">Add Exchange Fruit</button>
            </div>
            <h2 class="mt-5">Level</h2>
            <table id="LevelTable">
              <tr>
                <th>LEVEL</th>
                <th>Time</th>
                <th>Turn</th>
                <th>Goal</th>
                <th colspan="2"></th>
              </tr>
              <?php 
                $count = 1;
                foreach($level as $fl){ 
                  $goal = json_decode($fl['goal']);
                  $__goal = [];
                  foreach($goal as $g){
                      $data = $php_class->getSingleData([
                          "table" => "fruiteList",
                          "rows" => "*",
                          "condition" => "id = $g"
                      ]);
                      array_push($__goal,$data);
                  }
                   
                   
                ?>
              <tr>
                <td><?= $count ?></td>
                <td>
                    <?= $fl['time'] ?>
                </td>
                <td>
                    <?= $fl['turn'] ?>
                </td>
                <td>
                    <div class="flex flex-wrap gap-1">
                    <?php foreach($__goal as $g){?>
                    <div class="ex_avaialable" data-id="<?= $g['id'] ?>" style="height:15px;width:15px">
                        <img style="object-fit: contain;width:15px" class="h-full" src="upload/<?= $g['src'] ?>" alt="<?= $g['name'] ?>">
                    </div>
                    <?php } ?>
                    </div>
                </td>
                <td>
                    <span class="edit_level_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_level_btn pointer fs-8" data-id="<?= $fl['id'] ?>">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
              </tr>
              <?php $count++; } ?>
            </table>
            <div>
                <button class="button-37 insertFruitBtn" role="button" data-activeTab="addLevelForm" id="insertLevelBtn">Add New Level</button>
            </div>
            
            <h2>Music</h2>
            <table id="musicTable">
              <tr>
                <th>SI</th>
                <th>Name</th>
                <th>Audio</th>
                <th></th>
              </tr>
              <?php 
                $count = 1;
                foreach($music as $fl){ ?>
              <tr>
                <td><?= $count ?></td>
                <td><?= $fl['name'] ?></td>
                <td>
                    <button class="btn-1 playMusic" data-src="music/<?= $fl['src'] ?>">
                                <span>Play</span>
                    </button>
                    
                </td>
                <td>
                    <span class="edit_music_btn pointer fs-8" data-id="<?= $fl['id'] ?>" data-name="<?= $fl['name'] ?>" data-src="music/<?= $fl['src'] ?>">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
              </tr>
              <?php $count++; } ?>
            </table>
            
            <h2>Background</h2>
            <div>
                <button class="button-37 insertFruitBtn" role="button" data-activetab="addBGForm" id="uploadBgBtn">Upload</button>
                <button class="button-37 insertFruitBtn" role="button"  id="saveBgBtn">Save</button>
                <button class="button-37 insertFruitBtn" role="button" id="deleteBgBtn">Delete</button>
            </div>
            <div class="flex gap-3 flex-wrap" id="backgroundContainer">
                <?php
                    foreach($background as $index => $bg){
                ?>
                <div class="backgroundImgBox" data-id="<?= $bg['id'] ?>">
                    <img class="h-full" style="object-fit:contain" src="./background/<?= $bg['src'] ?>" alt="background-<?= $index + 1 ?>" />
                </div>
                <?php } ?>
            </div>
        </div>
        
        
        
        
        
        
        <div class="overlap">
            <form id="addLevelForm">
                <h2>New Level</h2>
                <input type="hidden" name="id" value="" />
                <div class="flex gap-3 flex-wrap">
                    <?php foreach($exchangeAvailableFruit as $EAF){ ?>
                    <div class="ex_avaialable pointer" id="addFruitBtn" data-id="<?= $EAF['id'] ?>">
                        <img style="object-fit: contain;width:30px" class="h-full" src="upload/<?= $EAF['src'] ?>" alt="<?= $EAF['name'] ?>">
                    </div>
                    <?php } ?>
                </div>
                <div class="flex flex-v-center">
                    <div class="w-half">
                        <label>Goal : </label>
                    </div>
                    <div class="w-half">
                        <div class="flex flex-wrap gap-1 flex-v-center" id="goal_fruit">
    
                        </div>
                    </div>
                </div>
                <div class="flex flex-v-center">
                    <div class="w-half">
                        <label>Time : </label>
                    </div>
                    <div class="w-half">
                        <input type="number" name="time" min="1" required value="5"  />
                    </div>
                </div>
                <div class="flex flex-v-center">
                    <div class="w-half">
                        <label>Turn : </label>
                    </div>
                    <div class="w-half">
                        <input type="number" name="turn" min="1" required value="5"  />
                    </div>
                </div>
                <button class="button-37" role="button">Create</button>
                
                
                <span class="crossBtn">
                    <iconify-icon icon="maki:cross"></iconify-icon>
                </span>
            </form>
            <form id="addExchangeForm">
                <h2>Exchange Fruit</h2>
                <input type="hidden" name="id" value="" />
                <div class="flex flex-v-center flex-h-between">
                    <select id="exchangeFruitFirst" data-custom-select-box name="first_fruit">
                        <?php 
                        shuffle($fruitList);
                        foreach($fruitList as $fl){  ?>
                        <option value="<?= $fl['id'] ?>" data-src="<?= $fl['src'] ?>"><?= $fl['name'] ?></option>
                        <?php } ?>
                    </select>
                    <input type="number" value="1" readonly style="width:80px"  />
                </div>
                <div class="flex flex-v-center flex-h-between">
                    <select id="exchangeFruitSecond" data-custom-select-box name="second_fruit">
                        <?php 
                         shuffle($fruitList);
                        foreach($fruitList as $fl){  ?>
                        <option value="<?= $fl['id'] ?>" data-src="<?= $fl['src'] ?>"><?= $fl['name'] ?></option>
                        <?php } ?>
                    </select>
                    <input type="number" name="second_fruit_ex_val" required value="2" min="2" max="6" style="width:80px" />
                     
                </div>
                <button class="button-37" role="button">Exchnage</button>
                
                
                <span class="crossBtn">
                    <iconify-icon icon="maki:cross"></iconify-icon>
                </span>
            </form>
            <form id="addFruitForm">
                <h2>Upload Fruit</h2>
                <input type="hidden" name="id" value="" />
                <input type="text" name="fruitname" required placeholder="Enter Fruit Name Here" />

                <label for="fruitUploadInput" class="uploadImgContainer flex-center">
                    <img class="w-full h-full" style="object-fit: contain;"  />
                    <span>
                        <iconify-icon icon="ep:upload-filled"></iconify-icon>
                    </span>
                    <input type="file" name="uploadInput" id="fruitUploadInput" accept=".png" hidden />
                </label>
                <button class="button-37" role="button">Upload</button>
                <span class="crossBtn">
                    <iconify-icon icon="maki:cross"></iconify-icon>
                </span>
            </form>
            <form id="addBGForm">
                <h2>Upload Background</h2>
                <input type="hidden" name="id" value="" />
                <label for="BGUploadInput" class="uploadImgContainer BguploadImgContainer flex-center">
                    <img class="w-full h-full" style="object-fit: contain;"  />
                    <span>
                        <iconify-icon icon="ep:upload-filled"></iconify-icon>
                    </span>
                    <input type="file" name="uploadInput" id="BGUploadInput" accept=".png" hidden />
                </label>
                <button class="button-37" role="button">Upload</button>
                <span class="crossBtn">
                    <iconify-icon icon="maki:cross"></iconify-icon>
                </span>
            </form>
            <form id="addMusicForm">
                <h2>Upload Music</h2>
                <input type="hidden" name="id" value="" />
                <input type="text" name="name" readonly value="background" />
                <div class="flex flex-v-center gap-2">
                        <label class="button-37" for="uploadAudio">
                            <iconify-icon icon="ep:upload-filled"></iconify-icon>
                            <input type="file" name="music" accept="audio/*" hidden id="uploadAudio" />
                        </label>
                        <button class="dn"></button>
                    
                    <audio controls="" id="preview_audio">
                      <source src="upload/">
                        Your browser does not support the audio element.
                    </audio>
                </div>
                
                <button class="button-37" role="button">Save</button>
                <span class="crossBtn">
                    <iconify-icon icon="maki:cross"></iconify-icon>
                </span>
            </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script
            src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
        <script src="../short.js?v=<?= time(); ?>"></script>
        <script src="./app.js?v=<?= time(); ?>"></script>
    </body>
</html>
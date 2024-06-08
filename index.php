<?php
    include "admin/php/config.php";
    $fruiteExchange = $php_class->getData([
        "table" => "fruiteExchange",
        "rows" => "*",
        "order" => "first_fruit DESC"
    ]);

    foreach($fruiteExchange as $key => $value){
        $ff = $php_class->getSingleData([
            "table" => "fruiteList",
            "rows" => "name,src",
            "condition" => "id = {$value['first_fruit']}"
        ]);
        $sf = $php_class->getSingleData([
            "table" => "fruiteList",
            "rows" => "name,src",
            "condition" => "id = {$value['second_fruit']}"
        ]);
        $fruiteExchange[$key]['first_fruit'] = $ff;
        $fruiteExchange[$key]['second_fruit'] = $sf;
        
    }


    $fruiteList = $php_class->getData([
        "table" => "fruiteList",
        "rows" => "name,src"
    ]);
    $level = $php_class->getData([
        "table" => "level",
        "rows" => "time,turn,goal"
    ]);
    
    
    foreach($level as $key => $value){
        $goal = json_decode($value['goal']);
        $array = [];
        foreach($goal as $g){
            $g_data = $php_class->getSingleData([
                "table" => "fruiteList",
                "rows" => "name,src",
                "condition" => "id = $g"
            ]);
            array_push($array,$g_data);
        }
        $level[$key]['goal'] = $array;
        
    }

    $activeBg = $php_class->getSingleData([
        "table" => "bg",
        "rows" => "src",
        "condition" => "active = 1"
    ]);
    
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="style.css?v=<?=time()?>">
        <link rel="stylesheet" href="class.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet">
        <script>
            let fruitArray = JSON.parse(`<?= json_encode($fruiteList) ?>`);
            let levelArray = JSON.parse(`<?= json_encode($level) ?>`);
            let exchangeArray = JSON.parse(`<?= json_encode($fruiteExchange) ?>`);
        </script>
        
    </head>
    <body>
        <div class="row" <?php if($activeBg !== null){ 
            echo "style='background: url(./admin/background/{$activeBg['src']});background-size: 100% 100%;'";
        }?>
        >
            <div class="h-full flex flex-column flex-h-between flex-v-center relative" id="homeScreen">
                <div class="flex flex-column flex-h-between flex-v-center" style="height:70%;padding:50px 10px">
                    <div style="width: 250px;">
                        <img class="w-full" src="./assests/Logo.png" />
                    </div>
                    <div style="width: 250px;">
                        <img class="w-full" src="./assests/Message.png" />
                    </div>
                    <div style="height: 80px;" class="w-fit playBtn pointer">
                        <img class="h-full" src="./assests/Play-btn-icon.png" />
                    </div>
                </div>
                <div class="flex w-full flex-v-end flex-h-between p-1 ph-2">
                    <div>
                        <button class="btn-1 instructionBtn pointer pb-2 pt-1" style="font-size: 20px;" data-hide="playGame">
                                <span>How To Play</span>
                        </button>
                    </div>
                    <div style="width: 150px;">
                        <img class="w-full" src="./assests/genzartxt.png" alt="">
                    </div>
                </div>
            </div>
            <div class="h-full dn flex-column flex-h-between flex-v-center relative" id="gameScreen">
                <header class="w-full flex flex-h-between flex-v-center">
                    <div class="logo pointer pauseGame" style="height: 40px;">
                        <img class="h-full" src="./assests/Pause-btn.png" alt>
                    </div>
                    <div class="logo relative" style="height: 45px;">
                        <p class="level_container">Level <span class="levelCount"></span></p>
                        <p class="score_container">Score:<span class="score">256</span></p>
                        <img class="h-full" src="./assests/Score-and-level-txt-container-in-header.png" alt>
                    </div>
                    <div class="flex gap-2 mt-2">
                        <div class="logo" style="height: 30px;">
                            <img class="h-full" src="./assests/tries-icon.png" alt>
                        </div>
                        <div class="logo relative" style="height: 30px;">
                            <img class="h-full" src="./assests/tries-number-container.png" alt>
                            <span class="turnCount">10</span>
                        </div>
                    </div>
                    
                    <div class="logo watch_container" style="height: 40px;">
                        <span class="absolute timeCount fs-4">500</span>
                        <img class="h-full" src="./assests/Stop Watch.png" alt>
                    </div>
                </header>
                <div class="gamefiled">
                    <div class="table">
                        <div class="abslute flex-center firstSwipElement">
                            <img src="" alt="">
                        </div>
                        <div class="abslute flex-center secondSwipElement">
                            <img src="" alt="">
                        </div>
                        <!--data come from JS -->
                    </div>
                </div>
                <footer  class="w-full flex flex-h-between flex-v-center">
                    <div>
                        <p class="bottom_heading">Level Target</p>
                        <div class="logo relative" style="height: 40px;">
                            <div class="flex challengBanana"></div>
                            <img class="h-full" src="./assests/Target-Container.png" alt>
                        </div>
                    </div>
                    
                    <div>
                        <p class="bottom_heading">Exchange Combos</p>
                        <div class="logo relative" style="height: 40px;">
                            <div class="flex gap-1 flex-h-center exchangeFruit pointer" data-hide="goHomeBtn">
                                <img id="exchange_first_fruit">
                                <img src="./assests/Exchnage-icon.png">
                                <div>
                                    <img class="h-full" id="exchange_second_fruit">
                                    <span class="exchange_count">X <span>2</span></span>
                                </div>
                            </div>
                            <img class="h-full" src="./assests/Green-btn.png" alt>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <div class="overlap flex-center deactive">
            <div class="gamePlayContainer glassphomism pos-center">
                <div class="logo" style="width: 100px;">
                    <img class="w-full" src="./assests/Logo.png" alt="">
                </div>
                <ul>
                    <li>
                        <button class="button-82-pushable playBtn" role="button">
                            <span class="button-82-shadow"></span>
                            <span class="button-82-edge"></span>
                            <span class="button-82-front text">
                                Play Game
                            </span>
                        </button>
                    </li>
                    <li>
                        <button class="button-82-pushable instructionBtn" role="button" data-hide="playGame">
                            <span class="button-82-shadow"></span>
                            <span class="button-82-edge"></span>
                            <span class="button-82-front text">
                                Instruction
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
            
            <div class="nextLevelContainer flex-center flex-column gap-2 pos-center">
                <div class="pop_up_container">
                    <div class="heading">
                        <p>Well Done !</p>
                    </div>
                    <div class="content">
                        <div class="result_popup_filed" id="ratingContainer">
                            <img class="h-full" style="object-fit:contain;width: 40px;" src="./assests/Star.png" alt>
                            <img class="h-full" style="object-fit:contain;width: 40px;" src="./assests/Star.png" alt>
                            <img class="h-full" style="object-fit:contain;width: 40px;" src="./assests/Star.png" alt>
                        </div>
                        <p>Score:<span class="score">256</span></p>
                        <div class="bottom_ctrl">
                            <img class="h-full pointer goHomeBtn" style="object-fit:contain;width: 40px;" src="./assests/Home.png" alt>
                            <img class="h-full nextLevelBtn pointer" style="object-fit:contain;width: 40px;" src="./assests/Next.png" alt>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pauseGameContainer flex-center flex-column gap-2 pos-center">
                <div class="pop_up_container">
                    <div class="heading">
                        <p>Pause !</p>
                    </div>
                    <div class="content">
                        <div class="result_popup_filed">
                            <p class="active">Level <span class="levelCount">1</span></p>
                        </div>
                        <div class="bottom_ctrl">
                            <img class="pointer goHomeBtn" style="object-fit:contain;height: 40px;" src="./assests/Home.png" alt>
                            <img class="playGame pointer" style="object-fit:contain;height: 40px;" src="./assests/Play-btn.png" alt>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loseLevelContainer flex-center flex-column gap-2 pos-center">
                <div class="pop_up_container failed">
                    <div class="heading">
                        <p>Try Again !</p>
                    </div>
                    <div class="content">
                        <div class="result_popup_filed flex-center">
                            <p class="active"></p>
                        </div>
                        <div class="bottom_ctrl">
                            <img class="h-full pointer goHomeBtn" style="object-fit:contain;width: 40px;" src="./assests/Home.png" alt>
                            <img class="h-full playBtn pointer" style="object-fit:contain;width: 40px;" src="./assests/retry-btn.png" alt>
                        </div>
                    </div>
                </div>
            </div>
            <div class="levelGoalContainer flex-center flex-column gap-2 pos-center">
                <div class="pop_up_container level">
                    <div class="heading">
                         <p>Level <span class="levelCount"></span></p>
                    </div>
                    <div class="content" style="height: 335px;">
                        <div class="flex flex-column">
                            <div class="result_popup_filed active flex-center" data-text="Objective" style="height: 80px;">
                                <div class="absolute" style="height: 15px;top: 3px;">
                                    <img class="h-full pointer" style="object-fit:contain;" src="./assests/Objective-txt.png" alt>
                                </div>
                                <div class="drawLevelGaol">
                                    
                                </div>
                            </div>
                            <p class="fw-9" style="color:#0059a8;">Exchange combos</p>
                            <div class="result_popup_filed flex flex-wrap gap-1 of_auto flex-h-between ph-3 pv-2" style="height: 120px;color: #7a2c35;padding-right: 22px;">
                                <?php foreach($fruiteExchange as $fe){ ?>
                                <div class="flex gap-1 flex-v-center">
                                    <div style="height:30px;width:30px">
                                        <img class="h-full w-full" 
                                            style="object-fit:contain" 
                                            src="./admin/upload/<?= $fe['first_fruit']['src'] ?>" 
                                            alt="<?= $fe['first_fruit']['name'] ?>"
                                        />
                                    </div>
                                    <iconify-icon icon="iconamoon:sign-equal-bold"></iconify-icon>
                                    <div style="height:30px;width:30px" class="relative">
                                        <img 
                                            class="h-full w-full" 
                                            style="object-fit:contain" 
                                            src="./admin/upload/<?= $fe['second_fruit']['src'] ?>" 
                                            alt="<?= $fe['second_fruit']['name'] ?>"
                                        />
                                        <span style="bottom: 0px;right: -9px;" class="absolute fw-6 fs-5">x<?= $fe['second_fruit_ex_val'] ?></span>
                                    </div>
                                </div>
                                <?php } ?>
                            </div>
                        </div>
                        <div class="bottom_ctrl">
                            <img class="h-full pointer startGameBtn" style="object-fit:contain;width: 120px;" src="./assests/Play-btn.png" alt>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ExchangeFuitContainer flex-center flex-column gap-2 pos-center">
                <div class="pop_up_container exchange">
                    <div class="heading">
                         <p style="font-size: 22px;">Exchange Combos</p>
                    </div>
                    <div class="content" style="height: 196px;">
                        <div class="result_popup_filed flex flex-wrap gap-1 of_auto flex-h-between ph-3 pv-2" style="height: 120px;color: #7a2c35;padding-right: 22px;">
                                    <?php foreach($fruiteExchange as $fe){ ?>
                                    <div class="flex gap-1 flex-v-center">
                                        <div style="height:30px;width:30px">
                                            <img class="h-full w-full" 
                                                style="object-fit:contain" 
                                                src="./admin/upload/<?= $fe['first_fruit']['src'] ?>" 
                                                alt="<?= $fe['first_fruit']['name'] ?>"
                                            />
                                        </div>
                                        <iconify-icon icon="iconamoon:sign-equal-bold"></iconify-icon>
                                        <div style="height:30px;width:30px" class="relative">
                                            <img 
                                                class="h-full w-full" 
                                                style="object-fit:contain" 
                                                src="./admin/upload/<?= $fe['second_fruit']['src'] ?>" 
                                                alt="<?= $fe['second_fruit']['name'] ?>"
                                            />
                                            <span style="bottom: 0px;right: -9px;" class="absolute fw-6 fs-5">x<?= $fe['second_fruit_ex_val'] ?></span>
                                        </div>
                                    </div>
                                    <?php } ?>
                                </div>
                       
                        <div class="bottom_ctrl">
                            <button class="btn-1 playGame">
                                <span>Play</span>
                            </button>
                            <button class="btn-1 goHomeBtn">
                                <span>Back</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-center flex-column gap-2 pos-center completeAllLevel">
                <div class="pop_up_container">
                    <div class="heading">
                        <p>Well Done !</p>
                    </div>
                    <div class="content">
                        <div class="result_popup_filed">
                            <p>You have completed all levels</p>
                        </div>
                        <p>Total Score:<span class="score"></span></p>
                        <div class="bottom_ctrl">
                           <button class="btn-1 refressBtn">
                                <span>Play Again</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dn">
            <?php
                $music = $php_class->getData([
                    "table" => "music",
                    "rows" => "*"
                ]);
            
                foreach($music as $m){
            ?>
            <audio id="<?= $m['name'] ?>">
                <source src="./admin/music/<?= $m['src'] ?>" type="audio/mp3">
                Your browser does not support the audio element.
            </audio>
            <?php } ?>
        </div>
        <script
            src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
        <script src="./short.js"></script>
        <script src="./app.js?v=<?=time()?>"></script>
    </body>
</html>
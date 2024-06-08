const qs = (elm) => document.querySelector(elm);
const qsA = (elm) => document.querySelectorAll(elm);
let level = 1;
let turnCount,
  timeCount,
  timer,
  startGame = false,
  score = 0;
let fruitMatchPerScore = 10;
let bg_music;
let gridColumn = 6;
let gridRow = 7;

let levelFruitChallengeIndex;

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function rating() {
  var used_time = levelArray[level - 1].time - timeCount;
  var perRatingTime = levelArray[level - 1].time / 3;
  let timeRating = 0;
  if (perRatingTime > used_time) {
    timeRating = 3;
  } else if (perRatingTime * 2 > used_time) {
    timeRating = 2;
  } else {
    timeRating = 1;
  }

  var used_turn = levelArray[level - 1].turn - turnCount;
  var perRatingTurn = levelArray[level - 1].turn / 3;
  let turnRating = 0;
  if (perRatingTurn > used_turn) {
    turnRating = 3;
  } else if (perRatingTurn * 2 > used_turn) {
    turnRating = 2;
  } else {
    turnRating = 1;
  }

  return Math.round((timeRating + turnRating) / 2);
}

const lastFruitName = (index) => {
  return levelArray[level - 1].goal[index].name;
};
const random = (length, ignore) => {
  var random__value = Math.floor(Math.random() * length);
  if (random__value === ignore) {
    return random(length, ignore);
  } else {
    return random__value;
  }
};

const zeroAdd = (n) => (n < 10 ? "0" + n : n);
const duplicateString = (str, n, divideStr = "") => {
  var __str = "";
  for (let i = 0; i < n; i++) {
    __str += str + divideStr;
  }
  return __str;
};

// CREATE GAME GRID
let left_ang = 0,
  right_ang = 0;
for (let i = 0; i < gridRow; i++) {
  var tr = _.createElm("div");
  _qs(tr).a_class("tr flex").append(".table");
  for (let j = 0; j < gridColumn; j++) {
    var td = _.createElm("div");
    // SET IDENTIFY DATA ATTRIBUTE
    _qs(td)
      .attr({
        "data-row": i,
        "data-column": j,
        "data-l_ang": left_ang + j,
        "data-r_ang": right_ang + j,
      })
      .a_class("td")
      .append(tr);
  }
  left_ang--;
  right_ang++;
}

const gameEnd = (type) => {
  startGame = false;
  clearInterval(timer);
  musicPlay(qs("#gameover"));

  if (type === "time") {
    _qs(".loseLevelContainer .result_popup_filed p").html("Out Of Time");
  } else {
    _qs(".loseLevelContainer .result_popup_filed p").html("Out Of Turn");
  }
  _qs(".overlap")
    .r_class("deactive")
    .child(".loseLevelContainer")
    .a_class("active");
};
const nextLevel = () => {
  clearInterval(timer);
  startGame = false;
  musicPlay(qs("#nextLevel"));

  _qs("#ratingContainer").html("");
  var ratingImage = ``;
  for (let i = 0; i < rating(); i++) {
    ratingImage += `<img class="h-full" style="object-fit:contain;width: 40px;" src="./assests/Star.png" alt>`;
  }
  _qs("#ratingContainer").html(ratingImage);

  if (levelArray.length <= level) {
    _qs(".overlap")
      .r_class("deactive")
      .child(".completeAllLevel")
      .a_class("active");
  } else {
    _qs(".overlap")
      .r_class("deactive")
      .child(".nextLevelContainer")
      .a_class("active");
  }
};
const timeStart = () => {
  timer = setInterval(() => {
    timeCount--;
    qs(".timeCount").innerHTML = timeCount;
    if (timeCount <= 0) {
      gameEnd("time");
    }
  }, 1000);
};

const drawLevelChallengeFruit = () => {
  qs(".challengBanana").innerHTML = "";
  var __levelFruitArray = levelArray[level - 1].goal;
  __levelFruitArray.forEach((item, index) => {
    if (levelFruitChallengeIndex < index) return;
    _qs(_.createElm("img"))
      .attr({
        src: `./admin/upload/` + item.src,
      })
      .append(".challengBanana");
  });
};

const countFruits = (arr) => {
  const countMap = {};

  arr.forEach((item) => {
    if (countMap[item.name]) {
      countMap[item.name].count++;
    } else {
      countMap[item.name] = { count: 1, src: item.src };
    }
  });

  return Object.keys(countMap).map((key) => ({
    name: key,
    count: countMap[key].count,
    src: countMap[key].src,
  }));
};

const drawLevelGaol = () => {
  qs(".drawLevelGaol").innerHTML = "";
  var goal = countFruits(levelArray[level - 1].goal);
  goal.forEach((item, index) => {
    var __item = _.createElm("div");
    var count = "";
    if (item.count > 1) {
      count += `<span>${item.count}</span>`;
    }
    if (index === 0) {
      _qs(__item)
        .html(
          `
                <img 
                    class="h-full w-full" 
                    style="object-fit:contain;height: 30px;" 
                    src="./admin/upload/${item.src}" 
                    alt="${item.name}" 
                />
                ${count}
            `
        )
        .append(".drawLevelGaol");
    } else {
      _qs(__item)
        .html(
          `
                <span style=" font-size: 30px;"><iconify-icon icon="ic:round-plus"></iconify-icon></span>
            `
        )
        .append(".drawLevelGaol");
      var __item = _.createElm("div");
      _qs(__item)
        .html(
          `
                <img 
                    class="h-full w-full" 
                    style="object-fit:contain;height: 30px;" 
                    src="./admin/upload/${item.src}" 
                    alt="${item.name}" 
                />
                ${count}
            `
        )
        .append(".drawLevelGaol");
    }
  });
};
const challengBanana = () => {
  timeCount = +levelArray[level - 1].time;
  turnCount = +levelArray[level - 1].turn;
  levelFruitChallengeIndex = levelArray[level - 1].goal.length - 1;
  drawLevelChallengeFruit();
  _qs(".score").html(score);
  _qs(".levelCount").html(level);
  qs(".timeCount").innerHTML = timeCount;
  qs(".turnCount").innerHTML = turnCount;
  drawLevelGaol();
  randomFruitFiled(qsA(".gamefiled .td"));
};

const randomFruitFiled = (array, ignoreIndex) => {
  array.forEach((item) => {
    var randomFruit = random(5, ignoreIndex - 1);
    item.innerHTML = `<div class="img_container flex-center"><img src="./admin/upload/${fruitArray[randomFruit].src}" /></div>`;
    _qs(item).attr({ "data-fruit": fruitArray[randomFruit].name });
  });
};

const musicPlay = (audio) => {
  var __audio = _.createElm("audio");
  _qs(__audio).html(audio.innerHTML).append();
  __audio.play();
  __audio.addEventListener("ended", function () {
    __audio.remove();
  });
};

const playGame = () => {
  if (startGame) return;
  startGame = true;
  lastExchangeFruitUpdate();
  timeStart();
  bg_play();
};

const getPointedElement = (x, y) => {
  var containerRect = qs(".gamefiled .table").getBoundingClientRect();
  var returnElement;
  var clientX = x - containerRect.left;
  var clientY = y - containerRect.top;
  qsA(".gamefiled .td .img_container").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementX = rect.left - containerRect.left;
    const elementY = rect.top - containerRect.top;
    if (
      clientX >= elementX &&
      clientX <= elementX + element.offsetWidth &&
      clientY >= elementY &&
      clientY <= elementY + element.offsetHeight
    ) {
      returnElement = element;
    }
  });
  return returnElement;
};
const getPointedElement2 = (x, y) => {
  var containerRect = qs(".gamefiled .table").getBoundingClientRect();
  var returnElement;
  var clientX = x - containerRect.left;
  var clientY = y - containerRect.top;
  qsA(".gamefiled .td").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementX = rect.left - containerRect.left;
    const elementY = rect.top - containerRect.top;
    if (
      clientX >= elementX &&
      clientX <= elementX + element.offsetWidth &&
      clientY >= elementY &&
      clientY <= elementY + element.offsetHeight
    ) {
      returnElement = element;
    }
  });
  return returnElement;
};

const swipeElementTopLeft = (element) => {
  var containerRect = qs(".gamefiled .table").getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
  };
};

let firstElm, secondElm;
let mouseMove = false;

_qs(".gamefiled .table").pressdown((e) => {
  e.preventDefault();
  firstElm = getPointedElement2(e.clientX, e.clientY).querySelector(
    ".img_container"
  );
  firstElm.parentNode.classList.add("active");
  mouseMove = true;
});
_qs(".gamefiled .table").pressmove((e) => {
  if (!mouseMove) return;
  var element = getPointedElement(e.clientX, e.clientY);
  if (element === undefined) return;
  e.preventDefault();
  if (!firstElm.isSameNode(element)) {
    secondElm = getPointedElement(e.clientX, e.clientY);
    firstElm.parentNode.classList.remove("active");
    elementExchange(firstElm.parentNode, secondElm.parentNode);
    mouseMove = false;
    (firstElm = undefined), (secondElm = undefined);
  }
});
_qs(".gamefiled .table").pressup((e) => {
  e.preventDefault();
  mouseMove = false;
  if (firstElm !== undefined) {
    firstElm.parentNode.classList.remove("active");
  }
  (firstElm = undefined), (secondElm = undefined);
});
const bg_play = (play = true) => {
  if (play) {
    qs("#background").play();
    qs("#background").volume = 0.3;
    qs("#background").addEventListener("ended", function () {
      qs("#background").play();
    });
  }
};

const array_index = (array, item) => {
  var array_index;
  array.forEach((element, index) => {
    if (element.isSameNode(item)) {
      array_index = index;
      return;
    }
  });
  return array_index;
};

const get_arranged_element = (allElement, specificElement) => {
  var arranged_row = [];
  var whileLoopContinue = true;
  let rowTargetedElmIndex = array_index(allElement, specificElement);
  let i = rowTargetedElmIndex - 1;
  while (whileLoopContinue && i >= 0) {
    if (
      specificElement.getAttribute("data-fruit") ===
      allElement[i].getAttribute("data-fruit")
    ) {
      arranged_row.push(allElement[i]);
    } else {
      whileLoopContinue = false;
    }
    i--;
  }
  arranged_row = arranged_row.reverse();
  arranged_row.push(specificElement);
  i = rowTargetedElmIndex + 1;
  whileLoopContinue = true;
  while (whileLoopContinue && i < allElement.length) {
    if (
      specificElement.getAttribute("data-fruit") ===
      allElement[i].getAttribute("data-fruit")
    ) {
      arranged_row.push(allElement[i]);
    } else {
      whileLoopContinue = false;
    }
    i++;
  }
  return arranged_row;
};
const findSecondMatchArrangedArray = (mainElm, secondElm, secondElmArray) => {
  var isSecondElmFoundInMainArray = false;
  var array = [];
  mainElm.forEach((item) => {
    if (!isSecondElmFoundInMainArray && item.isSameNode(secondElm)) {
      isSecondElmFoundInMainArray = true;
    }
  });
  if (!isSecondElmFoundInMainArray) {
    let index = 0;
    let whileLoopContinue = true;
    while (index < secondElmArray.length && whileLoopContinue) {
      let loop = true;
      secondElmArray[index].forEach((second) => {
        if (!loop) return;
        mainElm.forEach((main) => {
          if (!loop) return;
          if (main === second) {
            loop = false;
          }
        });
      });
      if (loop) {
        whileLoopContinue = false;
        array = secondElmArray[index];
      } else {
        index++;
      }
    }
  }
  return array;
};
const removeIndexWhenItemLengthOne = (array) => {
  var arr = [];
  array.forEach((item) => {
    if (item.length > 1) {
      arr.push(item);
    }
  });
  return arr;
};

function removeDuplicateArrays(arrays) {
  const seen = new Set();
  const result = [];

  arrays.forEach((array) => {
    const serialized = JSON.stringify(array);
    if (!seen.has(serialized)) {
      seen.add(serialized);
      result.push(array);
    }
  });

  return result;
}

const removeIndexFromArray = (array, index) => {
  __array = [];
  array.forEach((item, i) => {
    if (i !== index) {
      __array.push(item);
    }
  });
  return __array;
};

const lastExchangeFruitUpdate = () => {
  if (levelFruitChallengeIndex < 0) return;
  let goalLastFruitName = lastFruitName(levelFruitChallengeIndex);
  shuffle(exchangeArray);
  let loop = true;
  let findArray;
  exchangeArray.forEach((item) => {
    if (!loop) return;
    if (item.first_fruit.name === goalLastFruitName) {
      loop = false;
      findArray = item;
    }
  });
  _qs("#exchange_first_fruit").attr({
    src: "./admin/upload/" + findArray.first_fruit.src,
    alt: findArray.first_fruit.name,
  });
  _qs("#exchange_second_fruit").attr({
    src: "./admin/upload/" + findArray.second_fruit.src,
    alt: findArray.second_fruit.name,
  });
  _qs(".exchange_count span").html(findArray.second_fruit_ex_val);
};

const goalLastFruitExchangeMatch = (name, length) => {
  let GoalLastFruitName = lastFruitName(levelFruitChallengeIndex);
  let lastFruitExchangeArray = [];
  exchangeArray.forEach((item) => {
    if (item.first_fruit.name === GoalLastFruitName) {
      lastFruitExchangeArray.push(item);
    }
  });

  let found = -1;
  lastFruitExchangeArray.forEach((item) => {
    if (item.second_fruit.name === name && item.second_fruit_ex_val <= length) {
      found = item.second_fruit_ex_val;
    }
  });

  return found;
};

const search_match_arrang = (firstElm, secondElm) => {
  var firstElmValue = _qs(firstElm).get_attr({
    fruit: "data-fruit",
    row: "data-row",
    column: "data-column",
    left_ang: "data-l_ang",
    right_ang: "data-r_ang",
  });
  var secondElmValue = _qs(secondElm).get_attr({
    fruit: "data-fruit",
    row: "data-row",
    column: "data-column",
    left_ang: "data-l_ang",
    right_ang: "data-r_ang",
  });

  let firstElmArray = [
    get_arranged_element(
      _qs(`.gamefiled [data-row='${firstElmValue.row}']`).get_elm(),
      firstElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-column='${firstElmValue.column}']`).get_elm(),
      firstElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-l_ang='${firstElmValue.left_ang}']`).get_elm(),
      firstElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-r_ang='${firstElmValue.right_ang}']`).get_elm(),
      firstElm
    ),
  ];
  let secondElmArray = [
    get_arranged_element(
      _qs(`.gamefiled [data-row='${secondElmValue.row}']`).get_elm(),
      secondElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-column='${secondElmValue.column}']`).get_elm(),
      secondElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-l_ang='${secondElmValue.left_ang}']`).get_elm(),
      secondElm
    ),
    get_arranged_element(
      _qs(`.gamefiled [data-r_ang='${secondElmValue.right_ang}']`).get_elm(),
      secondElm
    ),
  ];

  let matchArray = firstElmArray.concat(secondElmArray);
  matchArray = removeIndexWhenItemLengthOne(matchArray);
  matchArray = removeDuplicateArrays(matchArray);
  matchArray.sort((a, b) => b.length - a.length);

  var firstMatchFruit = false;
  var firstMatchArray = [];
  var firstMatchArrayFound = false;
  var secondMatchArray = [];
  var __main__loop__continue = true;
  matchArray.forEach((fruitElmArray) => {
    if (!__main__loop__continue) return;
    var ___loop__continue = true;
    firstMatchArray.forEach((FMA) => {
      fruitElmArray.forEach((FEA) => {
        if (FEA.isSameNode(FMA)) {
          ___loop__continue = false;
        }
      });
    });
    if (!___loop__continue) return;
    let resFruitLength = goalLastFruitExchangeMatch(
      fruitElmArray[0].getAttribute("data-fruit"),
      fruitElmArray.length
    );
    if (resFruitLength > 1) {
      var f_index = array_index(fruitElmArray, firstElm);
      var l_index = array_index(fruitElmArray, secondElm);
      var maxIndex = Math.max(f_index, l_index);
      var minIndex = Math.min(f_index, l_index);
      var midPoint = Math.round(fruitElmArray.length / 2);
      var makeFruitArray = [];
      let matchFruitSwipe;
      levelFruitChallengeIndex--;
      musicPlay(qs("#success"));

      if (levelFruitChallengeIndex < 0) {
        __main__loop__continue = false;
      }
      if (f_index !== undefined && l_index !== undefined) {
        makeFruitArray.push(firstElm);
        makeFruitArray.push(secondElm);
        matchFruitSwipe = swipeElementWithMatchFruit(
          minIndex,
          maxIndex,
          fruitElmArray,
          resFruitLength,
          makeFruitArray
        );
      } else if (l_index === undefined) {
        makeFruitArray.push(firstElm);
        matchFruitSwipe = swipeElementWithMatchFruit(
          f_index,
          f_index,
          fruitElmArray,
          resFruitLength,
          makeFruitArray
        );
      } else {
        makeFruitArray.push(secondElm);
        matchFruitSwipe = swipeElementWithMatchFruit(
          l_index,
          l_index,
          fruitElmArray,
          resFruitLength,
          makeFruitArray
        );
      }
      matchFruitSwipe.forEach((item) => {
        item.classList.add("fired");
      });
      score += fruitMatchPerScore * matchFruitSwipe.length;
      _qs(".score").html(score);
      randomFruitFiled(matchFruitSwipe, undefined);
      if (!firstMatchArrayFound) {
        firstMatchArray = matchFruitSwipe;
        firstMatchArrayFound = true;
      } else {
        __main__loop__continue = false;
      }
    }
  });

  if (levelFruitChallengeIndex < 0) {
    nextLevel();
  } else if (turnCount <= 0) {
    gameEnd("turn");
  } else {
    drawLevelChallengeFruit();
  }

  _.timeout(0.3, () => {
    _qs(".gamefiled .td.fired").r_class("fired");
  });
};

function swipeElementWithMatchFruit(
  minIndex,
  maxIndex,
  fruitElmArray,
  resFruitLength,
  makeFruitArray
) {
  var loopContinue = true;
  var index = minIndex - 1;
  while (index >= 0 && loopContinue) {
    if (makeFruitArray.length === resFruitLength) {
      loopContinue = false;
    } else {
      makeFruitArray.push(fruitElmArray[index]);
    }
    index--;
  }
  if (loopContinue) {
    var index = maxIndex + 1;
    while (index < fruitElmArray.length && loopContinue) {
      if (makeFruitArray.length === resFruitLength) {
        loopContinue = false;
      } else {
        makeFruitArray.push(fruitElmArray[index]);
      }
      index++;
    }
  }

  return makeFruitArray;
}

function elementExchange(firstElm, secondElm) {
  musicPlay(qs("#swipe"));
  turnCount--;
  qs(".turnCount").innerHTML = turnCount;
  _qs(firstElm).child("img").a_class("v_hidden");
  _qs(secondElm).child("img").a_class("v_hidden");

  var firstElmTopLeft = swipeElementTopLeft(firstElm);
  var secondElmTopLeft = swipeElementTopLeft(secondElm);

  var f_html = firstElm.innerHTML;
  var f_fruit = _qs(firstElm).get_attr({
    fruit: "data-fruit",
  })["fruit"];
  var l_fruit = _qs(secondElm).get_attr({
    fruit: "data-fruit",
  })["fruit"];
  var l_html = secondElm.innerHTML;

  _qs(".firstSwipElement")
    .child("img")
    .css({
      width: _qs(firstElm).child("img").width() + "px",
      height: _qs(firstElm).child("img").height() + "px",
    })
    .attr({
      src: _qs(firstElm).child("img").get_attr({ src: "src" })["src"],
    });
  _qs(".secondSwipElement")
    .child("img")
    .css({
      width: _qs(secondElm).child("img").width() + "px",
      height: _qs(secondElm).child("img").height() + "px",
    })
    .attr({
      src: _qs(secondElm).child("img").get_attr({ src: "src" })["src"],
    });

  _qs(".firstSwipElement")
    .css({
      top: firstElmTopLeft.y + 0 + "px",
      left: firstElmTopLeft.x + 0 + "px",
      height: firstElm.offsetHeight + "px",
      width: firstElm.offsetWidth + "px",
      translate: `${secondElmTopLeft.x - firstElmTopLeft.x}px ${
        secondElmTopLeft.y - firstElmTopLeft.y
      }px`,
    })
    .a_class("active");
  _qs(".secondSwipElement")
    .css({
      top: secondElmTopLeft.y + 0 + "px",
      left: secondElmTopLeft.x + 0 + "px",
      height: firstElm.offsetHeight + "px",
      width: firstElm.offsetWidth + "px",
      translate: `${firstElmTopLeft.x - secondElmTopLeft.x}px ${
        firstElmTopLeft.y - secondElmTopLeft.y
      }px`,
    })
    .a_class("active");

  _.timeout(0.3, () => {
    _qs(".firstSwipElement").r_class("active").attr({ style: "" });
    _qs(".secondSwipElement").r_class("active").attr({ style: "" });
    _qs(firstElm).child("img").r_class("v_hidden");
    _qs(secondElm).child("img").r_class("v_hidden");

    // because i change only src.not replace thats why i swipe first and second
    search_match_arrang(secondElm, firstElm); //this function match fruit and get challenge fruit //here also logic game win lose
    lastExchangeFruitUpdate();
  });

  _qs(firstElm).html(l_html).attr({ "data-fruit": l_fruit });
  _qs(secondElm).html(f_html).attr({ "data-fruit": f_fruit });
}

qs(".refressBtn").onclick = () => {
  location.reload();
};

_qs(".playBtn").on("click", () => {
  challengBanana();
  _qs("#homeScreen").a_class("dn").r_class("flex");
  _qs(".overlap").r_class("deactive");
  _qs(".levelGoalContainer ").a_class("active");
});

qs(".startGameBtn").onclick = () => {
  _qs(".overlap").a_class("deactive").child(".pos-center").r_class("active");
  _qs("#gameScreen").r_class("dn").a_class("flex");
  playGame();
};

qs(".nextLevelBtn").onclick = () => {
  _qs(".overlap").r_class("deactive").child(".pos-center").r_class("active");
  level++;
  challengBanana();
  _qs(".levelGoalContainer ").a_class("active");
};

_qs(".goHomeBtn").on("click", () => {
  level = 1;
  _qs(".overlap").a_class("deactive").child(".pos-center").r_class("active");
  _qs("#homeScreen").a_class("flex").r_class("dn");
  _qs("#gameScreen").r_class("flex").a_class("dn");
});

qs(".pauseGame").onclick = () => {
  _qs(".overlap").r_class("deactive").child(".pos-center").r_class("active");
  qs(".pauseGameContainer").classList.add("active");
  clearInterval(timer);
};
_qs(".playGame").on("click", () => {
  _qs(".overlap").a_class("deactive").child(".pos-center").r_class("active");
  timeStart();
});

_qs(".instructionBtn,.exchangeFruit").on("click", function () {
  clearInterval(timer);
  _qs(".overlap").r_class("deactive").child(".pos-center").r_class("active");
  _qs(".ExchangeFuitContainer")
    .a_class("active")
    .child(".bottom_ctrl .btn-1")
    .r_class("dn");
  _qs(
    `.ExchangeFuitContainer .bottom_ctrl .btn-1.${this.getAttribute(
      "data-hide"
    )}`
  ).a_class("dn");
});

(function () {
  // Loop through all images on the page adding necessary styles and
  // event listener to prevent images from opening the context menu.
  document.querySelectorAll("img").forEach((img) => {
    img.style.webkitUserSelect = "none";
    img.style.webkitTouchCallout = "none";
    img.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      return false;
    });
  });
})();

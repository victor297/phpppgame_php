const qs = elm => document.querySelector(elm);
const qsA = elm => document.querySelectorAll(elm);
const fetchApi = (url,data,cb,cb2=null) => {
     var xhr = new XMLHttpRequest();
     var formData = new FormData();
     for (const property in data) {
        formData.append(property,data[property]);
     }
     xhr.open("POST", url, true);
     if(cb2 !== null){
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                cb2(progress);
            }
         });
     }
     xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = _.json(xhr.responseText);
                if(data.response === -1){
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        html: data.msg,
                    });
                }else{
                    cb(data.msg);
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: `Something is wrong !`,
                });
            }
        }
    };
    
    xhr.send(formData);
}
qsA("[data-custom-select-box]").forEach(item=>{
    var custom_select = document.createElement("div");
    custom_select.classList.add("custom_select");
    var html = 
    `
        <div class="title">
            <div class="flex flex-v-center gap-2 h-full"></div>
            <iconify-icon icon="uiw:down"></iconify-icon>
        </div>
        <div class="content">
            <ul class="ls-none"> 
            </ul>
        </div>
   `;
    custom_select.innerHTML = html;
    item.style.display = "none";
    var option_checked = 0;
    item.querySelectorAll("option").forEach((item2,index)=>{
        if(item2.selected){
            option_checked = index;
        }
    });
    item.querySelectorAll("option").forEach((item2,index)=>{
        var li = document.createElement("li");
        li.setAttribute("data-value",item2.value);
        if(option_checked === index){
           li.classList.add("active");
           custom_select.querySelector(".title div").innerHTML = `
           
           `;
           
           _qs(custom_select).child(".title div").html(`
               <img style="object-fit: contain;width:30px" class="h-full w-full" src="upload/${item2.getAttribute("data-src")}" alt="${item2.innerHTML}">
               <span>${item2.innerHTML}</span>
           `)
        }
        li.innerHTML = `
            <img style="object-fit: contain;width:30px" class="h-full" src="upload/${item2.getAttribute("data-src")}" alt="${item2.innerHTML}">
            <span>${item2.innerHTML}</span>
        `;
        custom_select.querySelector(".content ul").appendChild(li);
    });
    item.parentNode.replaceChild(custom_select, item);
    custom_select.appendChild(item);

    custom_select.querySelector(".title").onclick = () => {
        custom_select.classList.toggle("active");
    }
    const updateFunc = (item2) => {
        custom_select.classList.remove("active");
        custom_select.querySelectorAll(".content ul li").forEach(item3=>{
                item3.classList.remove("active");
        });
        _qs(custom_select).child(".title div").html(`
           ${item2.innerHTML}
       `);
        item2.classList.add("active");
    }
    custom_select.querySelectorAll(".content ul li").forEach(item2=>{
        item2.onclick = () => {
            _qs(custom_select).child("select").updateFunc(item2.getAttribute("data-value"),"change");
        }
    });  
    _qs(custom_select).child("select").on("change",function(){
        updateFunc(_qs(custom_select).child(".content ul li").index(this.selectedIndex).get_elm()[0])
    });
});
_qs(`[data-activeTab]`).on("click",function(){
    var getAttr = _qs(this).get_attr({activeTab:"data-activeTab"}).activeTab;
    _qs(".overlap").a_class("active");
    _qs(".overlap > *").r_class("active");
    _qs("#" + getAttr).a_class("active");
});
const clossOverLap = () =>{
    _qs(".overlap > *").r_class("active");
    _qs(".overlap").r_class("active");
}
const openOverLap = (id) => {
    _qs(".overlap").a_class("active");
    _qs(".overlap > *").r_class("active");
    _qs("#" + id).a_class("active");
}


const editExchangeFruit = array => {
    array.forEach(item=>{
        item.onclick = () => {
            var parent = _qs(item).parent("tr").get_elm();
            _qs("#exchangeFruitFirst").updateFunc(_qs(parent).child("td").index(1).get_attr({id:"data-id"}).id,"change");
            _qs("#exchangeFruitSecond").updateFunc(_qs(parent).child("td").index(2).get_attr({id:"data-id"}).id,"change");
            _qs(`#addExchangeForm [name='second_fruit_ex_val']`).val(_qs(parent).child("td").index(2).get_attr({value:"data-value"}).value);
            _qs(`#addExchangeForm [name='id']`).val(_qs(item).get_attr({id:"data-id"}).id);
            openOverLap("addExchangeForm");
        }
    });
}
const deleteExchangeFruit = array =>{
    array.forEach(item=>{
        item.onclick = () => {
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              fetchApi("php/deleteExchange.php", {
                id: _qs(item).get_attr({id:"data-id"}).id,
              }, (result) => {
                Swal.fire({
                  title: "Delete!",
                  text: result,
                  icon: "success"
                });
               _qs(item).parent("tr").get_elm()[0].remove();
              });
            }
          });
        }
    })
}
editExchangeFruit(_qs(".edit_exchange_fruit_btn ").get_elm());
deleteExchangeFruit(_qs(".delete_exchange_fruit_btn").get_elm());
const editFruitList = (array) => {
    array.forEach(item=> {
        item.onclick = () =>{
            _qs("#addFruitForm [name='id']").val(_qs(item).get_attr({id:"data-id"}).id);
            var parent =  _qs(item).parent("tr").get_elm()[0];
            _qs("#addFruitForm [name='fruitname']").val(_qs(parent).child("td").index(1).html());
            _qs(".uploadImgContainer").a_class("active").child("img").attr({
                   src: _qs(parent).child("img").get_attr({src:"src"}).src
            });
           openOverLap("addFruitForm");
        }
    })
}
const deleteFruitList = array =>{
    array.forEach(item=>{
        item.onclick = () => {
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              fetchApi("php/deleteFruit.php", {
                id: _qs(item).get_attr({id:"data-id"}).id,
              }, (result) => {
                Swal.fire({
                  title: "Delete!",
                  text: result,
                  icon: "success"
                });
               _qs(item).parent("tr").get_elm()[0].remove();
              });
            }
          });
        }
    })
}
deleteFruitList(_qs("#FruitListTable tbody .delete_fruit_list_btn").get_elm());
editFruitList(_qs("#FruitListTable tbody .edit_fruit_list_btn").get_elm());
const deleteLevel = array => {
    array.forEach(item=>{
        item.onclick = () =>{
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              fetchApi("php/deleteLevel.php", {
                id: _qs(item).get_attr({id:"data-id"}).id,
              }, (result) => {
                Swal.fire({
                  title: "Delete!",
                  text: result,
                  icon: "success"
                });
               _qs(item).parent("tr").get_elm()[0].remove();
              });
            }
          });
        }
    })
}
const editLevel = array => {
    array.forEach(item=>{
        item.onclick = () => {
            openOverLap("addLevelForm");
            _qs("#addLevelForm [name='id']").val(item.getAttribute("data-id"));
            
            var parent = _qs(item).parent("tr").get_elm()[0];
            _qs("#addLevelForm [name='time']").val(
                +_qs(parent).child("td").index(1).html()
            );
            _qs("#addLevelForm [name='turn']").val(
                +_qs(parent).child("td").index(2).html()
            );
            _qs("#goal_fruit").html("");
            _qs(parent).child(".ex_avaialable").get_elm().forEach(item=>{
                var img = _qs(item).child("img").get_attr({
                    src : "src",
                    alt : "alt"
                })
                var div = _.createElm("div");
                _qs(div).a_class("ex_avaialable relative").attr({
                    "data-id" : item.getAttribute("data-id")
                }).html(`
                    <img style="object-fit: contain;width:30px" class="h-full" src="${img.src}" alt="${img.alt}">
                    <span class="ex_crossBtn">
                        <iconify-icon icon="maki:cross"></iconify-icon>
                    </span>
                 `).append("#goal_fruit").child(".ex_crossBtn").on("click",()=>{
                     div.remove();
                 });
            });
        }
    });
}
editLevel(_qs("#LevelTable tbody .edit_level_btn").get_elm());
deleteLevel(_qs("#LevelTable tbody .delete_level_btn ").get_elm());



const editMusic = array => {
    array.forEach(item=>{
        item.onclick = () => {
            openOverLap("addMusicForm");
            _qs("#addMusicForm [name='id']").val(item.getAttribute("data-id"));
            _qs("#addMusicForm [name='name']").val(item.getAttribute("data-name"));
            _qs("#addMusicForm #preview_audio source").attr({
                src : item.getAttribute("data-src")
            });
            qs("#addMusicForm #preview_audio").load();
        }
    })
}


editMusic(_qs("#musicTable tbody .edit_music_btn").get_elm());


const bgImgSelect = (array) => {
    array.forEach(item=>{
        item.onclick = () => {
            _qs("#backgroundContainer .backgroundImgBox").r_class("active");
            _qs(item).a_class("active");
        }
    })
}
bgImgSelect(_qs("#backgroundContainer .backgroundImgBox").get_elm());

_qs("#uploadAudio").on("change",(e)=>{
    const audioPreview = document.getElementById('preview_audio');
    const file = event.target.files[0];
    if (audioPreview.src) {
        URL.revokeObjectURL(audioPreview.src);
    }
    const url = URL.createObjectURL(file);
    audioPreview.src = url;
    audioPreview.load();
});

_qs("#addMusicForm").submit(data=>{
    fetchApi("php/uploadMusic.php",data,res=>{
        _qs(`.edit_music_btn[data-id='${data.id}']`).parent("tr").child("audio source").attr({src:"music/" + res});
        _qs(`.edit_music_btn[data-id='${data.id}']`).parent("tr").child("audio").get_elm()[0].load();
        clossOverLap()
    });
})



_qs(".crossBtn").on("click",function(){
     clossOverLap();
});
_qs("#fruitUploadInput").on("change",function(e){
    if(e.target.files.length === 0) return 
    var file = e.target.files[0];
     _qs(".uploadImgContainer").a_class("active").child("img").attr({
            src : URL.createObjectURL(file)
    });
});
_qs("#BGUploadInput").on("change",function(e){
    if(e.target.files.length === 0) return 
    var file = e.target.files[0];
     _qs(".BguploadImgContainer").a_class("active").child("img").attr({
            src : URL.createObjectURL(file)
    });
});
_qs("#addBGForm").submit(data=>{
    fetchApi("php/uploadBG.php",data,response=>{
        clossOverLap();
        let element = _qs(`#backgroundContainer .backgroundImgBox`).get_elm();
        var item = _.createElm("div");
        _qs(item).a_class("backgroundImgBox").html(
            `<img class="h-full" style="object-fit:contain" src="./background/${response.src}" alt="background-${element.length}">`)
            .attr({"data-id" : response.id}).append("#backgroundContainer");
        bgImgSelect([item]);
    })
})

_qs("#saveBgBtn").on("click",()=> {
    let element = _qs(`#backgroundContainer .backgroundImgBox.active`).get_elm();
    if(element.length === 0){
         Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Please Select First",
        });
        return
    }
    fetchApi("php/saveActiveBg.php",{
        id : element[0].getAttribute("data-id")
    },response=>{
        Swal.fire({
          title: "Save!",
          text: response,
          icon: "success"
        });
    });
})
_qs("#deleteBgBtn").on("click",()=> {
    let element = _qs(`#backgroundContainer .backgroundImgBox.active`).get_elm();
    if(element.length === 0){
         Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Please Select First",
        });
        return
    }
    Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!"
          }).then((result) => {
              if (result.isConfirmed) {
                  fetchApi("php/deleteActiveBg.php",{
                    id : element[0].getAttribute("data-id")
                  },response=>{
                    element[0].remove();
                    Swal.fire({
                      title: "Delete!",
                      text: response,
                      icon: "success"
                    });
                  });
              }
          });
    
})


_qs("#addFruitForm").submit(data=>{
    fetchApi("php/uploadFruit.php",data,response=>{
        clossOverLap();
        let element = _qs(`#FruitListTable tbody .edit_fruit_list_btn[data-id='${response.id}']`).get_elm();
        if(element.length === 0){
            var si = _qs("#FruitListTable tbody tr").get_elm().length;
            var tr = _.createElm("tr");
            _qs(tr).append("#FruitListTable tbody").html(`
                <td>${si}</td>
                <td>${response.name}</td>
                <td><img style="object-fit: contain;" class="h-full w-full" src="upload/${response.src}" alt="${response.name}"></td>
                <td>
                    <span class="edit_fruit_list_btn pointer fs-8" data-id="${response.id}">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_fruit_list_btn pointer fs-8" data-id="${response.id}">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
            `);
            editFruitList(_qs(tr).child(".edit_fruit_list_btn").get_elm());
            deleteFruitList(_qs(tr).child(".delete_fruit_list_btn").get_elm());
        }else{
            _qs(element).parent("tr").child("img").attr({
                src : "upload/" + response.src,
                alt : response.name
            });
            _qs(element).parent("tr").child("td").index(1).html(response.name)
        }
    })
    
});
_qs("#addExchangeForm").submit(data=>{
     fetchApi("php/createExchangeFruit.php",data,response=>{
         clossOverLap();
         var exchangeFruitFirst = _qs(qs("#exchangeFruitFirst").selectedOptions[0]).get_attr({src:"data-src",id:"value"});
         var exchangeFruitSecond = _qs(qs("#exchangeFruitSecond").selectedOptions[0]).get_attr({src:"data-src",id:"value"});
         var second_fruit_ex_val = _qs("[name='second_fruit_ex_val']").val();
         if(data.id === ""){
             var si = _qs("#FruitExchangeTable tbody tr").get_elm().length;
             var tr = _.createElm("tr");
             _qs(tr).append("#FruitExchangeTable tbody").html(`
                <td>${si}</td>
                <td data-id="${exchangeFruitFirst.id}">
                    <img style="object-fit: contain;" 
                        class="h-full w-full" src="upload/${exchangeFruitFirst.src}" 
                        alt="${qs("#exchangeFruitFirst").selectedOptions[0].innerHTML}">
                </td>
                <td data-id="${exchangeFruitSecond.id}" data-value="${second_fruit_ex_val}">
                    <div style="height:30px">
                        <img style="object-fit: contain;width:30px" 
                            class="h-full" src="upload/${exchangeFruitSecond.src}" 
                            alt="${qs("#exchangeFruitSecond").selectedOptions[0].innerHTML}">
                        <sub>X ${second_fruit_ex_val}</sub>
                    </div>
                </td>
                <td>
                    <span class="edit_exchange_fruit_btn pointer fs-8" data-id="${response.id}">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_exchange_fruit_btn pointer fs-8" data-id="${response.id}">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
            `);
            editExchangeFruit(_qs(tr).child(".edit_exchange_fruit_btn").get_elm());
            deleteExchangeFruit(_qs(tr).child(".delete_exchange_fruit_btn").get_elm());
         }else{
             let parent = _qs(`#FruitExchangeTable tbody .edit_exchange_fruit_btn[data-id='${response.id}']`).parent("tr").get_elm()[0];
             _qs(parent).child("td").index(1).attr({
                 "data-id" : exchangeFruitFirst.id
             }).child("img").attr({
                 src:`upload/${exchangeFruitFirst.src}`,
                 alt:qs("#exchangeFruitFirst").selectedOptions[0].innerHTML
             });
             _qs(parent).child("td").index(2).attr({
                 "data-id" : exchangeFruitSecond.id,
                 "data-value" : second_fruit_ex_val
             }).html(`
                <div style="height:30px">
                    <img style="object-fit: contain;width:30px" 
                        class="h-full" src="upload/${exchangeFruitSecond.src}" 
                        alt="${qs("#exchangeFruitSecond").selectedOptions[0].innerHTML}">
                    <sub>X ${second_fruit_ex_val}</sub>
                </div>
             `);
         }
     })
})
_qs("#createExchangeBtn").on("click",()=>{
    _qs("#addExchangeForm [name='id']").val('');
});
_qs(".insertFruitBtn").on('click',function(){
    var activetab = this.getAttribute("data-activetab");
   _qs("#addFruitForm [name]").val("");
   _qs("#fruitUploadInput").attr({
       type:"text",
       value:"",
       type:"file"
   })
   _qs(".uploadImgContainer").r_class("active");
});
_qs("#addFruitBtn").on("click",function(){
    var div = _.createElm("div");
    _qs(div).html(`${this.innerHTML}
        <span class="ex_crossBtn">
            <iconify-icon icon="maki:cross"></iconify-icon>
        </span>
    `).a_class("ex_avaialable relative").append("#goal_fruit").attr({
        "data-id" : this.getAttribute("data-id")
    }).child(".ex_crossBtn").on("click",function(){
        div.remove();
    });
    
});
_qs("#addLevelForm").submit(data=>{
    if(_qs("#goal_fruit .ex_avaialable").get_elm().length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            html: `Add Minimum One Fruit`,
        });
        return
    }
    var goalFruit = [];
    qsA("#goal_fruit .ex_avaialable").forEach(item=>{
        goalFruit.push(item.getAttribute('data-id'));
    });
    data.goal = JSON.stringify(goalFruit);
    fetchApi("php/createLevel.php", data, (result) => {
        clossOverLap();
        var goalFruit = "";
        qsA("#goal_fruit .ex_avaialable").forEach(item=>{
            var img = _qs(item).child("img").get_attr({src:"src",alt:"alt"});
            goalFruit += `
                    <div class="ex_avaialable" data-id="${item.getAttribute("data-id")}" style="height:15px;width:15px">
                        <img style="object-fit: contain;width:15px" class="h-full" src="${img.src}" alt="${img.alt}">
                    </div>`;
        });
        if(data.id === ""){
            var si = _qs("#LevelTable tbody tr").get_elm().length;
            var tr = _.createElm("tr");
            
            _qs(tr).html(`
                <td>${si}</td>
                <td>${data.time}</td>
                <td>${data.turn}</td>
                <td>
                    <div class="flex flex-wrap gap-1">
                        ${goalFruit}
                     </div>
                </td>
                <td>
                    <span class="edit_level_btn pointer fs-8" data-id="${result.id}">
                        <iconify-icon icon="akar-icons:edit"></iconify-icon>
                    </span>
                </td>
                <td>
                    <span class="delete_level_btn pointer fs-8" data-id="${result.id}">
                        <iconify-icon icon="ic:baseline-delete"></iconify-icon>
                    </span>
                </td>
            `).append("#LevelTable");
            editLevel(_qs(tr).child(".edit_level_btn").get_elm());
            deleteLevel(_qs(tr).child(".delete_level_btn").get_elm());
            
            
        }else{
            let parent = _qs(`#LevelTable tbody .edit_level_btn[data-id='${result.id}']`).parent("tr").get_elm()[0];
            _qs(parent).child("td").index(3).child("div").html(goalFruit);
            _qs(parent).child("td").index(2).html(data.turn);
            _qs(parent).child("td").index(1).html(data.time);
        }
    });
})
_qs("#insertLevelBtn").on("click",()=>{
    _qs("#addLevelForm [name='id']").val("");
    _qs("#goal_fruit").html("");
    _qs("[name='turn']").val("");
    _qs("[name='time']").val("");
})




_qs(".playMusic").on("click",function(){
    var audio = new Audio();
    audio.src = this.getAttribute("data-src");
    audio.play()
});






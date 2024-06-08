class ShortJS {
    constructor(elm) {
        this.device = navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i) ? "mobile" : "destop";

        this.elm = elm;
    }
    log(t){
        console.log(t);
    }
    error(t){
        console.error(t);
    }
    warn(t){
        console.warn(t);
    }
    ES_error(){
        if(this.elm.length === 0){
            this.error("Selected Element Not Found");
            return false;
        }
        return true;
    }
    __common__event__(event,cb){
        // console.log(event)
        if(this.device === "destop"){
            for (let i = 0; i < this.elm.length; i++) {
                this.elm[i].addEventListener([event[0]],function (e) {
                    cb(e);
                });
            }
        }else{
            for (let i = 0; i < this.elm.length; i++) {
                this.elm[i].addEventListener([event[1]],function (e) {
                    var __e = e.touches[0];
                    for (const property in __e) {
                        if(property !== "target") {
                            e[property] = __e[property];
                        }
                    }
                    cb(e);
                })
            }
        }
    }
    __value__set__(property,value){
        if(this.elm === undefined) return this;
        if(this.elm.length === 1){
           if(value === undefined) return this.elm[0][property];
           else{
            this.elm[0][property] = value;
            return this;
           }
        }else{
            var array = [];
            this.elm.forEach(elm => {
                if(value === undefined) array.push(elm[property]);
                else elm[property] = value;
            });
           if(value === undefined) return array;
           else return this;
        }
    }
    updateFunc(value,name){
        this.elm.forEach(item=>{
            item.value = value;
            item.dispatchEvent(new Event(name));
        });
        return this;
    }
    index(i){
        this.elm = [this.elm[i]];
        return this;
    }
    json(t){
        return JSON.parse(t)
    }
    html(t){
        if(!this.ES_error()) return;
        return this.__value__set__("innerHTML",t);
    }
    text(t){
        if(!this.ES_error()) return;
        return this.__value__set__("textContent",t);
    }
    attr(t){
        if(!this.ES_error()) return;
        for (let e = 0; e < this.elm.length; e++){
            for (var [r,l] of Object.entries(t)){
                this.elm[e].setAttribute(r,l);
            }
        }
        return this
    }
    get_attr(t,def_val=""){
        if(t === "") {
            this.error("Please provide attribute name");
            return true;
        }
        if(!this.ES_error()) return;
        var array = [];
        for (let e = 0; e < this.elm.length; e++){
            var obj = {};
            for (var [r,l] of Object.entries(t)){
                obj[r] = this.elm[e].getAttribute(l) === null ?  def_val : this.elm[e].getAttribute(l);
            }
            array.push(obj);
        }
        return array.length === 1 ? array[0] : array;
    }
    val(t){
        if(!this.ES_error()) return;
        return this.__value__set__("value",t);
    }
    css(t){
        if(!this.ES_error()) return;
        for (let e = 0; e < this.elm.length; e++){
            for (var [r,l] of Object.entries(t)){
                this.elm[e].style[r] = l;
            }
        }
        return this    
    }
    timeout(time,cb){
        setTimeout(()=>{
            cb()
        },time * 1000)
    }
    get_elm(){
        return this.elm
    }
    createElm(n){
       return document.createElement(n);
    }
    height(){
        return this.elm[0].offsetHeight
    }
    width(){
        return this.elm[0].offsetWidth
    }
    a_class(r) {
        r.split(" ").forEach(cls=>{
            this.elm.forEach(elm=>{
                elm.classList.add(cls.trim());
            });
        })
        return this
    }
    r_class(r) {
        r.split(" ").forEach(cls=>{
            this.elm.forEach(elm=>{
                elm.classList.remove(cls.trim());
            });
        })
        return this
    }
    t_class(r) {
        r.split(" ").forEach(cls=>{
            this.elm.forEach(elm=>{
                elm.classList.toggle(cls.trim());
            });
        })
        return this
    }
    get_css(t,def_val=""){
        if(t === "") {
            this.error("Please provide attribute name");
            return true;
        }
        if(!this.ES_error()) return;
        
        
        var array = [];
        for (let e = 0; e < this.elm.length; e++){
            let css_obj = getComputedStyle(this.elm[e]);
            var obj = {};
            for (var [r,l] of Object.entries(t)){
                var cssFound = false;
                for (let i = 0; i < css_obj.length; i++) {
                    if(!cssFound){
                        var __dumy__element = document.createElement("div");
                        __dumy__element.style[css_obj[i]] = css_obj.getPropertyValue(css_obj[i]);
                        if(__dumy__element.style[l] !== ""){
                            cssFound = true;
                            obj[r] = __dumy__element.style[l];
                        }
                        __dumy__element.remove();
                    }
                }
                if(!cssFound){
                    obj[r] = this.elm[e].style[l] !== "" ? this.elm[e].style[l] :  def_val;
                }

                
            }
            array.push(obj);
        }
        
        return array.length === 1 ? array[0] : array;
    }
    position(nth,parent="body"){
        if(!this.ES_error()) return;
        if(nth < 0){
            this.error("child position cant be negetive number")
        }
        var this_elm = this.elm;
        var parent_pos =  document.querySelector(parent);
        var parent_pos__child = this.qs(parent_pos).child("*");
        let sp2;
        if (parent_pos__child.length >= nth) {
            sp2 = parent_pos__child[nth];
        }else{
            sp2 = parent_pos__child[parent_pos__child.length];
            this.warn(`maximum child is ${parent_pos__child.length}`)
        }
        this.elm = this_elm;
        this.elm.forEach(elm=>{
            parent_pos.insertBefore(elm, sp2);
        });
        return this
    }
    createElm (n){
        return document.createElement(n);
    }
    append(parent="body"){
        if(!this.ES_error()) return;
        if(typeof parent === "string"){
            parent = document.querySelector(parent);
        }
        this.elm.forEach(elm=>{
            parent.appendChild(elm)
        });
        return this;
    }
    parent(t) {
        if(!this.ES_error()) return;
        if (t !== undefined){
            var element = this.elm[0].closest(t);
            if(element === null){
                this.error("any element not found");
                return this
            }
            this.elm = [this.elm[0].closest(t)];
            return this;
        }else  this.error("Please add a parameter in parent function")
    }
    child(t) {
        if(!this.ES_error()) return;
        this.elm = [...this.elm[0].querySelectorAll(t)];
        return this;
    }
    pressdown(cb){
        if(!this.ES_error()) return;
        this.__common__event__(["mousedown","touchstart"],(data)=>{
            cb(data);
        })
    }
    pressup(cb){
        if(!this.ES_error()) return;
        this.__common__event__(["mouseup","touchend"],(data)=>{
            cb(data);
        })
    }
    pressmove(cb){
        if(!this.ES_error()) return;
        this.__common__event__(["mousemove","touchmove"],(data)=>{
            cb(data);
        })
    }
    submit(fun) {
        for (let i = 0; i < this.elm.length; i++) {
          this.elm[i].addEventListener("submit", function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            var checkbox = this.querySelectorAll("input[type='checkbox'][name]");
            
            checkbox.forEach(item=>{
                data[item.name] = item.checked;
            });
            fun(data);
          })
        }
        return this;
    }
    on(r, l, e=!1) {
        var s = this.elm
          , n = this;
        for (let t = 0; t < this.elm.length; t++)
            if (e)
                if (Array.isArray(r))
                    for (let e = 0; e < r.length; e++)
                        this.elm[t].addEventListener(r[e], function(e) {
                            e = {
                                e: e,
                                elements: s,
                                element: [this],
                                elm_r_elms: n.array_ind_remove(s, t),
                                position: t
                            };
                            l(e)
                        });
                else
                    this.elm[t].addEventListener(r, function(e) {
                        e = {
                            e: e,
                            elements: s,
                            element: [this],
                            elm_r_elms: n.array_ind_remove(s, t),
                            position: t
                        };
                        l(e)
                    });
            else if (Array.isArray(r))
                for (let e = 0; e < r.length; e++)
                    this.elm[t].addEventListener(r[e], l);
            else
                this.elm[t].addEventListener(r, l);
        return this
    }
}
var _qs = (e) =>{
        var element = [];
        var elms =  Array.isArray(e) ? [...e] : [e];
        elms.forEach(elm=>{
        if(typeof elm === "string"){
            var str_elms = elm.split(",");
            str_elms.forEach(str_elm=>{
                element.push(...document.querySelectorAll(str_elm.trim()))
            });
        }else element.push(elm)
        });
        return new ShortJS(element);
}
var _ = new ShortJS([]);



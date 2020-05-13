/* eslint-env es6 */
const BASE_FIREFLY_COUNT = 0;
const BASE_JAR_COUNT = 0;
const BASE_JAR_PRICE = 20;
const BASE_FARM_COUNT = 0;
const BASE_FARM_PRICE = 1000;

const JAR = 1;
const FARM = 2;
const NEXTUPGRADE = 3;


var firefly_count = BASE_FIREFLY_COUNT;

var jar_count = BASE_JAR_COUNT;
var jar_price = BASE_JAR_PRICE;

var farm_count = BASE_FARM_COUNT;
var farm_price = BASE_FARM_PRICE;





function save() {

    if (isNaN(firefly_count) || isNaN(jar_count) || isNaN(jar_price) ||
        firefly_count == null || jar_count == null || jar_price == null) {
        // don't save
    } else {
            localStorage.setItem("firefly_count", firefly_count);
            localStorage.setItem("jar_count", jar_count);
            localStorage.setItem("jar_price", jar_price);
        
            localStorage.setItem("farm_count", farm_count);
            localStorage.setItem("farm_price", farm_price);
    }
}

function load() {
    var temp = parseInt(localStorage.getItem("firefly_count"));
    if (!isNaN(temp)) {
        firefly_count = temp;
    }

    temp = parseInt(localStorage.getItem("jar_count"));
    if (!isNaN(temp)) {
        jar_count = temp;
    }

    temp = parseInt(localStorage.getItem("jar_price"));
    if (!isNaN(temp)) {
        jar_price = temp;
    }
    
    temp = parseInt(localStorage.getItem("farm_count"));
    if (!isNaN(temp)) {
        farm_count = temp;
    }

    temp = parseInt(localStorage.getItem("farm_price"));
    if (!isNaN(temp)) {
        farm_price = temp;
    }

    // LOAD FIREFLIES
    if (isNaN(firefly_count) || firefly_count === null) {
        // do nothing
    } else {
        var counter = document.getElementById("firefly_counter");
        counter.value = firefly_count;
        document.title = "Emberfly, Inc. : " + firefly_count + " fireflies";
        update_width(counter);
    }

    // LOAD JARS
    if (isNaN(jar_count) || jar_count === null || isNaN(jar_price) || jar_price === null) {
        // do nothing
    } else {
        var counter = document.getElementById("jar_counter");
        var price_counter = document.getElementById("jar_price");
        counter.value = jar_count;
        price_counter.value = jar_price;
        update_width(counter);
        update_width(price_counter);
    }
    
    // LOAD FARMS
    if (isNaN(farm_count) || farm_count === null || isNaN(farm_price) || farm_price === null) {
        // do nothing
    } else {
        var counter = document.getElementById("farm_counter");
        var price_counter = document.getElementById("farm_price");
        counter.value = farm_count;
        price_counter.value = farm_price;
        update_width(counter);
        update_width(price_counter);
    }

}


function update() {
    var counter = document.getElementById("firefly_counter");
    counter.value = Math.floor(firefly_count);
    document.title = "Emberfly, Inc. : " + Math.floor(firefly_count) + " fireflies";
    update_width(counter);


    counter = document.getElementById("jar_counter");
    counter.value = jar_count;
    update_width(counter);

    counter = document.getElementById("jar_price");
    counter.value = jar_price;
    update_width(counter);

    counter = document.getElementById("farm_counter");
    counter.value = farm_count;
    update_width(counter);

    counter = document.getElementById("farm_price");
    counter.value = farm_price;
    update_width(counter);
    update_brightness();
    save();
}




function add() {
    firefly_count += 1;
    update();
    save();
}



function buy(category) {
    if (category == JAR) {
        if (firefly_count >= jar_price) {

            firefly_count -= jar_price;
            jar_count += 1;
            jar_price = Math.round(Math.pow(jar_price, 1.01));
            update();
        } else {
            // can't purchase. do nothing.
        }
    } else if (category == FARM) {
        if(firefly_count >= farm_price) {

            firefly_count -= farm_price;
            farm_count += 1;
            farm_price = Math.round(Math.pow(farm_price, 1.01));
            update();
        }
        else {
            // can't purchase. do nothing.
        }
    }
}

function update_width(thing) {
    thing.style.width = thing.value.length + 1 + "ch";
}

function update_brightness() {
    
    var percent = firefly_count/100;
    
    if(percent > 3){
        percent = 3;
    }
    
    percent = percent / 10;
    
    
    var wrapper = document.getElementById("wrapper");    
    
    wrapper.style.backgroundImage = "-moz-radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
    wrapper.style.backgroundImage = "-webkit-radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
    wrapper.style.backgroundImage = "-ms-radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
    wrapper.style.backgroundImage = "radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";     
}

function reset() {
    var answer = confirm("Are you sure you want to reset? Your progress will be deleted.")
    if(answer == true) {
        firefly_count = BASE_FIREFLY_COUNT;
        jar_count = BASE_JAR_COUNT;
        jar_price = BASE_JAR_PRICE;
        farm_count = BASE_FARM_COUNT;
        farm_price = BASE_FARM_PRICE;
        update();
    }
}



function timer() {
    firefly_count = firefly_count + 0.25 * jar_count + 2.5 * farm_count;

    update();
}
setInterval(timer, 250);


if ('addEventListener' in window) {
            window.addEventListener('load', load());
        }
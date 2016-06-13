function AccuracyToPercent(rating) {
    return (94.9 * rating) / (4707 + rating);
    //return (94.9927 * rating) / (7027.7634 + rating);
}

function PenetrationToPercent(rating) {
    return (94.9 * rating) / (4707 + rating);
    //return (94.9927 * rating) / (7027.7634 + rating);
}

function CritToPercent(rating) {
    return (97 * rating) / (3578 + rating);
    //return (96.9968 * rating) / (7262.7054 + rating);
}

function CritDamageToPercent(rating) {
    return 125 + (291 * rating) / (4315 + rating);
    //return 125 + (96.9809 * rating) / (9154.9301 + rating);
}

function calculateResult(row, value) {
    switch(row) {
        case 0:
            return value;
        case 1:
            return AccuracyToPercent(value);
        case 2:
            return PenetrationToPercent(value);
        case 3:
            return CritToPercent(value);
        case 4:
            return CritDamageToPercent(value);
        default:
            return 0;
    }
}

function Hit(n) {
    var total = document.getElementById("percent"+n).getElementsByTagName("input");
    var skillMulti = document.getElementById("DPS1").getElementsByTagName("input")[0].value;
    var defenseCoefficient = 0.9 + parseFloat(total[2].value) / 100;
    if(defenseCoefficient > 1) defenseCoefficient = 1; 
    
    var value = parseFloat(total[0].value) * defenseCoefficient * skillMulti;
    
    document.getElementById("Hit"+n).value = Math.round(value * 100) / 100;
}

function Crit(n) {
    var total = document.getElementById("percent"+n).getElementsByTagName("input");
    var skillMulti = document.getElementById("DPS1").getElementsByTagName("input")[0].value;
    var defenseCoefficient = 0.9 + parseFloat(total[2].value) / 100;
    if(defenseCoefficient > 1) defenseCoefficient = 1; 
    
    var value = parseFloat(total[0].value) * defenseCoefficient * parseFloat(total[4].value) / 100 * skillMulti; 
    
    document.getElementById("Crit"+n).value = Math.round(value* 100) / 100;
}

function Average(n) {
    var total = document.getElementById("percent"+n).getElementsByTagName("input");
    var skillMulti = document.getElementById("DPS1").getElementsByTagName("input")[0].value;
    var defenseCoefficient = 0.9 + parseFloat(total[2].value) / 100;
    if(defenseCoefficient > 1) defenseCoefficient = 1; 
    
    var value = parseFloat(total[0].value) * defenseCoefficient * skillMulti + parseFloat(total[0].value) * defenseCoefficient * (parseFloat(total[4].value)-100) / 100 * parseFloat(total[3].value ) / 100 * skillMulti;
    
    document.getElementById("Avg"+n).value = Math.round(value * 100) / 100;
    updateCSS();
}

function updateInput(element, type, name, n, row){    
    var value = element.value
    var base = 0;
    var target = type + name + n;
    
    if(name != "Base") {
        base = parseFloat(document.getElementById(type+"Base").value);
    } else if (name == "Base") {
        Cookies.set(typeMap[row], value, {expires: 365, path: ''});
    }    
    
    document.getElementById(target).value = base + parseFloat(value);
    updateResult((parseFloat(document.getElementById(type+"Base").value) + parseFloat(document.getElementById(type+"Item"+1).value)),type,name,1,row);
    updateResult((parseFloat(document.getElementById(type+"Base").value) + parseFloat(document.getElementById(type+"Item"+2).value)),type,name,2,row);
}

function updateResult(value, type, name, n, row){    
    var target = type + 'Percent' + n;    
    value = Math.round(calculateResult(row,value)*100)/100;
    var elem = document.getElementById(target);
    elem.value = value;
    if(type != typeMap[0]) {
        elem.value = elem.value + "%";
    }
    Hit(n);
    Crit(n);
    Average(n);
}

function updateCSS() {
    var hit1 = document.getElementById("Hit1");
    var crit1 = document.getElementById("Crit1");
    var avg1 = document.getElementById("Avg1");
    var hit2 = document.getElementById("Hit2");
    var crit2 = document.getElementById("Crit2");
    var avg2 = document.getElementById("Avg2");
    var elem = document.getElementById("advice");
        
    if(avg1.value > avg2.value) {
        avg1.style.borderColor = 'green';
        avg2.style.borderColor = 'red';
        elem.innerText = "Item 1 is better by ~ " + Math.round((avg1.value / avg2.value *100 - 100) *100) /100 + "%";
    } else if (avg2.value > avg1.value) {
        avg2.style.borderColor = 'green';
        avg1.style.borderColor = 'red';
        elem.innerText = "Item 2 is better by ~ " + Math.round((avg2.value / avg1.value *100 - 100) *100) /100 + "%";
    } else {
        avg1.style.borderColor = 'yellow';
        avg2.style.borderColor = 'yellow';
        elem.innerText = "Items are equal";
    }
}

window.onload = function() {
    var base = document.getElementById("base").getElementsByTagName("input");
    var item1 = document.getElementById("item1").getElementsByTagName("input");
    var item2 = document.getElementById("item2").getElementsByTagName("input");
    var total1 = document.getElementById("total1").getElementsByTagName("input");
    var total2 = document.getElementById("total2").getElementsByTagName("input");
    var ckys = Cookies.get();
    
    for (var i = 0; i < total1.length; i += 1) {
        if(ckys[typeMap[i]]) {
            base[i].value = ckys[typeMap[i]];
        }
        var baseValue = parseFloat(base[i].value);
        total1[i].value = baseValue + parseFloat(item1[i].value);
        total2[i].value = baseValue + parseFloat(item2[i].value);
    }
    console.log("initialized");
    for (var i = 0; i < total1.length; i+= 1) {        
        updateResult(parseFloat(total1[i].value), typeMap[i], "", 1, i);
        updateResult(parseFloat(total2[i].value), typeMap[i], "", 2, i);
    }
}

var typeMap = ["AttackPower","Accuracy","Penetration","Critical","CriticalDamage"]
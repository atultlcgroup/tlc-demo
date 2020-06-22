
const excelToJson = require('convert-excel-to-json');
const fs=require('fs');
let routesPath='./uploads';


fs.readdirSync(routesPath).forEach(function (file){  
const result = excelToJson({  
    source: fs.readFileSync(`${routesPath}/${file}`)});
console.log(result);

})




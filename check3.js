let summaryByLevel = {
    "Name":'Atul',
    "Wedding Bundling":2837
}
if(summaryByLevel["Wedding Bundling"] || summaryByLevel[("Wedding Bundling").toLocaleLowerCase()])
console.log(summaryByLevel["Wedding Bundling"])
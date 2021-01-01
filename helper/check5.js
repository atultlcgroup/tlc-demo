
const Promise = require('bluebird');
let pdfName = `check_DSR_Report.pdf`
const pdf = Promise.promisifyAll(require('html-pdf'));
var options = {
    "format": 'Letter',
    "orientation": "portrait",
    "header": {
    "contents": "<img src='logo-tlc.png' />",
        "height": "30mm"
  },
  "footer": {
    "contents": {
        "contents": `Footer footer`,
            "height": "30mm"
      }
  }
}

let data = pdf.createAsync(`<html><body><h2>Hi  </h2><div id="pageFooter">"${options}"</div></body></html>`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}`, "footer": {
    "contents": {
        "contents": `Footer`,
            "height": "30mm"
      }
  } })
console.log(pdfName);

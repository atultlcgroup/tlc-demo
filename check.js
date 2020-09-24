let generatePdf = require("./helper/generatePdfForPayments")
let generateExcel = require("./helper/generateExcelForPayments")

let pdf = async()=>{
    let pdfData = await generatePdf.generatePDF()
    console.log(pdfData)
    // let excelData = await generateExcel.generateExcel();
    // console.log(excelData)
 }
 pdf()




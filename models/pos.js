const { writeFileSync } = require("fs");
const pool = require("../db").pool
let uploadExcel = async (file, fileName, body) => {
    try {
        const data = writeFileSync(`./uploads/${fileName}`, `${file}`, { encoding: "base64" })
        updatePOSTracking(body, fileName)
        return data;
    } catch (e) {
        console.log(e)
        return e
    }
}


let updatePOSTracking = (body, fileName) => {
    try {
        pool.query(`INSERT INTO tlcsalesforce.pos_tracking(
             brand_name, property_name, program_name, outlet_name, status, file_name, error_description, file_uploaded_by,created_date)
            VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now())`)
    } catch (e) {
        return e;
    }


}


let getPosData=async()=>{
    try{
        console.log('get Pos data api called');
        const result=await pool.query(`select file_name from tlcsalesforce.pos_tracking where status='UPLOADED'`);
        return (result) ? result.rows : null;
    }catch( e ){
        return e;
    }


}

module.exports = {
    uploadExcel,
    getPosData
}
const fs = require('fs');
const dirName = __dirname
// const contents = fs.readFileSync(`${dirName}/response6.pdf`,'utf8');
// console.log((contents))
// fs.writeFileSync(`DSRBatchFile.txt`, contents , 'utf8')

// console.log( contents)


// let btoa = require('btoa')

try{
let multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    console.log(file)
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
let data = fs.readFileSync(`${dirName}/response6.pdf`,'utf8')
console.log(upload.single(data))

}catch(e){
    console.log(e)
}

// function b64EncodeUnicode(str) {
//     // first we use encodeURIComponent to get percent-encoded UTF-8,
//     // then we convert the percent encodings into raw bytes which
//     // can be fed into btoa.
//     // console.log(str)
//     return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
//         function toSolidBytes(match, p1) {
//             return String.fromCharCode('0x' + p1);
//     }));
// }

// let base64Str = b64EncodeUnicode(fs.readFileSync(`${dirName}/response6.pdf`,'utf8')); // "4pyTIMOgIGxhIG1vZGU="
// console.log(base64Str)
// fs.writeFileSync(`DSRBatchFile.pdf`, base64Str , {encoding:'base64'})


// var fs = require('fs');
// const detectCharacterEncoding = require('detect-character-encoding'); //npm install detect-character-encoding
// var buffer = fs.readFileSync(`${dirName}/response6.pdf`);
// var originalEncoding = detectCharacterEncoding(buffer);
// var file = fs.readFileSync(`${dirName}/response6.pdf`, originalEncoding.encoding);
// fs.writeFileSync('filename.pdf', file, 'UTF-8');


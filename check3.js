var js2xmlparser = require("js2xmlparser");
let fs = require('fs')
var obj = {
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": new Date(1964, 7, 26),
    "address": {
        "@": {
            "type": "home"
        },
        "streetAddress": "3212 22nd St",
        "city": "Chicago",
        "state": "Illinois",
        "zip": 10000
    },
    "phone": [
        {
            "@": {
                "type": "home"
            },
            "#": "123-555-4567"
        },
        {
            "@": {
                "type": "cell"
            },
            "#": "890-555-1234"
        },
        {
            "@": {
                "type": "work"
            },
            "#": "567-555-8901"
        }
    ],
    "email": "john@smith.com"
};

console.log(js2xmlparser.parse("person", obj));
 
fs.writeFileSync('a.xml' , js2xmlparser.parse("person", obj) )
// console.log(xml);
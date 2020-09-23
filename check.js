const Cryptr = require('cryptr');
const cryptr = new Cryptr('B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcR');
 
const encryptedString = cryptr.encrypt('a186D000000NA7jQAG');
const decryptedString = cryptr.decrypt(encryptedString);
 
console.log(encryptedString); // e7b75a472b65bc4a42e7b3f78833a4d00040beba796062bf7c13d9533b149e5ec3784813dc20348fdf248d28a2982df85b83d1109623bce45f08238f6ea9bd9bb5f406427b2a40f969802635b8907a0a57944f2c12f334bd081d5143a357c173a611e1b64a
console.log(decryptedString); // bacon



const bcrypt = require('bcrypt');
const saltRounds = 1;
const myPlaintextPassword = 'B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcR';
const someOtherPlaintextPassword = 'a186D000000NA7jQAG';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
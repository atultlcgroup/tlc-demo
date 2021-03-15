let email = ``
if(email.lastIndexOf('@') > -1)
console.log(`${'*'.repeat(email.lastIndexOf('@') - 1)}${email.substr(email.lastIndexOf('@'))}`)
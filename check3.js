let currentTime = new Date();
let ISTTime = new Date((new Date()).getTime() + 330*60000 - (10 * 60 * 60 * 1000));

// ISTTime now represents the time in IST coordinates
console.log(ISTTime)

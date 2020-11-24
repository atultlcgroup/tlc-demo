

function getLetter(s) {
    let letter;
    // Write your code here
    let char = s.charAt(0);
    let arr = ['A','B','C','D']
    let strArr = ['aeiou','bcdfg','hjklm','npqrstvwxyz']
    switch(true){
    case (strArr[0].includes(s)):
    letter=arr[0]
    break   
    case (strArr[1].includes(s)):
    letter=arr[1]
    break    
    case (strArr[2].includes(s)):
    letter=arr[2]
    break   
    case (strArr[3].includes(s)):
    letter=arr[3]
    break   
    }
    return letter;
}

console.log(getLetter('zjh'))

let cityOBJ = {"35" : "Andaman and Nicobar Islands",
"28" : "Andhra Pradesh",
"37" : "Andhra Pradesh (New)",
"12" : "Arunachal Pradesh",
"18" : "Assam",
"10" : "Bihar",
"04" : "Chandigarh",
"22" : "Chattisgarh",
"26" : "Dadra and Nagar Haveli",
"25" : "Daman and Diu",
"07" : "Delhi",
"30" : "Goa",
"24" : "Gujarat",
"06" : "Haryana",
"02" : "Himachal Pradesh",
"01" : "Jammu and Kashmir",
"20" : "Jharkhand",
"29" : "Karnataka",
"32" : "Kerala",
"38" : "Ladakh",
"31" : "Lakshadweep Islands",
"23" : "Madhya Pradesh",
"27" : "Maharashtra",
"14" : "Manipur",
"17" : "Meghalaya",
"15" : "Mizoram",
"13" : "Nagaland",
"21" : "Odisha",
"34" : "Pondicherry",
"03" : "Punjab",
"08" : "Rajasthan",
"11" : "Sikkim",
"33" : "Tamil Nadu",
"36" : "Telangana",
"16" : "Tripura",
"09" : "Uttar Pradesh",
"05" : "Uttarakhand",
"19" : "West Bengal"}


let GSTState = cityOBJ[`068shhsghdfu`.substring(0,2)];
if(GSTState){
    console.log(GSTState)
}else{
        console.log(`GSTState=${GSTState}`)
}
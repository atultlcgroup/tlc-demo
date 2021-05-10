let express = require('express')
let body_parser = require('body-parser')
let app = express()


app.use(body_parser())
app.get('/getData',(req, res)=>{
  console.log(req)
  res.status(200).send({code :200 , msg : `Success`})
})

app.listen(2000,()=>{
  console.log(`Server is running on port 2000`)
})
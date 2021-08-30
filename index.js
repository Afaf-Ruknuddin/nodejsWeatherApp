const http = require('http')
const fs = require('fs')
var request = require('requests')

const replaceVal=(tempVal,curVal)=>{
    let temperature = tempVal.replace('{%tempval%}',curVal.main.temp);
    temperature=temperature.replace('{%tempmin%}',curVal.main.temp_min);
    temperature=temperature.replace('{%tempmax%}',curVal.main.temp_max);
    temperature=temperature.replace('{%location%}',curVal.name);
    temperature=temperature.replace('{%country%}',curVal.sys.country);
    temperature=temperature.replace('{%tempstatus%}',curVal.weather[0].main);
    return temperature;
}

const homeFile = fs.readFileSync('home.html','utf-8');
const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        request('http://api.openweathermap.org/data/2.5/weather?q=bhatkal&appid=53536bdff6c9b28ff4e0b2f53c966578')
.on('data',(chunk)=> {
    const objData = JSON.parse(chunk)
    const arrData = [objData]
//   console.log(arrData[0].main.temp)

    const realTimeDate = arrData.map(val=>replaceVal(homeFile,val))
    .join('');
    res.write(realTimeDate);
    // console.log(realTimeDate);
})
.on('end',(err) =>{
  if (err) return console.log('connection closed due to errors', err);
 res.end()
});
    }
})

server.listen(8000,"127.0.0.1")
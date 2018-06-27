const express = require(`express`);
const app = express();
const bodyParser = require('body-parser') ;
const path=require(`path`);

const fs = require(`fs`);/**File system module */

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const allObjects =[];
const expressValidator = require(`express-validator`);
const util = require(`util`);

app.locals.allObjects= require(`./data.json`);


app.use(express.json());
app.use(expressValidator());

app.use(express.static(path.join(__dirname, `public`)));
app.use(`/bootstrap` ,express.static(__dirname+`/node_modules/bootstrap/dist/css/`));
app.use(`/js` ,express.static(__dirname+`/public/js/pug.js`));
/**express.static,funcion de middleware para el servicio de archivos estaticos*/

app.set(`views`,path.join(__dirname,`views`));
app.set(`view engine`,`pug`);



app.get(`/ping`,(req, res) =>{
   res.send(`pong`); 
});
app.get(`/user/form`,(req, res) =>{
   res.sendFile(`form.html`, {root: path.join(__dirname, `./`)} ) ;
   
});

app.post(`/user`, urlencodedParser,(req, res)=>{
	
	req.checkBody(`firstn`,`Invalid name`).isLength({max:30});
	req.checkBody(`surname`,`Invalid surname`).isLength({max:30});
	req.checkBody(`mobile`,`Just enter numbers`).isInt();
	req.checkBody(`email`,`Invalid email adress`).isEmail();
	
	const errors = req.validationErrors();
	const data = req.body;
     	
    if (errors) {
    res.status(400).send(`There have been validation errors:` + util.inspect(errors));
    return;
     }
     else{  

     	const data= { 	
		firstn:  req.body.firstn,
	   surname:  req.body.surname,
		mobile:  req.body.mobile,
		 email:  req.body.email
		                  };
		 allObjects.push(data);
        const word = JSON.stringify(allObjects, null, 2);  
        fs.writeFile(`data.json`, word, (error)=>{
         console.log("error");
    } );
      
	res.redirect(`/user/list`);
}

 
  });
        
/**app.method(path,handler) */
app.get(`/user/list`,(req, res) =>{
	
  res.render(`list`);
});

const port = process.env.PORT || 3000;/**Inicia el servidor,escuchando las conexiones en el puerto 3000
o en el puerto que sea asignado */
app.listen(port, () => console.log(`Listening on port ${port}...`));
 

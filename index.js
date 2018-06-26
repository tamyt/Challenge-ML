const express = require(`express`);
const app = express();
const bodyParser = require('body-parser') ;
const path=require(`path`);

const fs = require(`fs`);

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

app.set(`views`,path.join(__dirname,`views`));
app.set(`view engine`,`pug`);


app.get(`/ping`,(req, res) =>{
   res.send(`pong`); 
});
app.get(`/user/form`,(req, res) =>{
   res.sendFile(`form.html`, {root: path.join(__dirname, `./`)} ) ;
   
});

app.post(`/user`, urlencodedParser,(req, res, next)=>{
	
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
     		id:  allObjects.length + 1,
		firstn:  req.body.firstn,
	   surname:  req.body.surname,
		mobile:  req.body.mobile,
		 email:  req.body.email
		                  };
		 allObjects.push(data);
        const word = JSON.stringify(allObjects, null, 2);  
        fs.writeFile(`data.json`, word, (error)=>{

    } );
      
	res.redirect(`/user/list`);
}

  next();
  });
        

app.get(`/user/list`,(req, res) =>{
	
  res.render(`list`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
 

const express=require("express");
const app=express();
const port=3000;
const { faker, tr } = require('@faker-js/faker');
const mysql = require('mysql2');
const path=require("path");
const methodOverride = require('method-override')
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));



// all done with requiring the tools and framework 

// build connection of node with sql 
const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'pakApp',
    password: 'Lakhan@69'
});

// genrate fake random data using faker 

let RandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password()

    ];
}

// now making connection with database
 
// let q="insert into user (id,name,email,password) values ?";
// // now inserting the data into user table
// let data=[];

// for(let i=1; i<=100;i++){
//     data.push(RandomUser());
// }

// implementation of the connection between node and sql 

// try {
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         console.log(result.length);
//         console.log(result[0]);
//         console.log(result[1]);
//     })
    
// } catch (error) {
//     console.log(error);
    
// }

// connection.end();




// live server

app.listen(port,()=>{
    console.log(`app is listening at the port ${port}`);
})
 
// our home page 

app.get("",(req,res)=>{
    res.send("get response is working")
})

// total no of users in db 

app.get("/home",(req,res)=>{
    let q= "select count(*) from user";
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            let count=result[0][`count(*)`];
            res.render("home.ejs",{count});
        })
        
    } catch (error) {

        // console.log("some error in the DB");
        console.log(error);
        res.send(`some error in the DB`);
    }
})

// now show root where users show

app.get("/home/users",(req,res)=>{
    let q= "select * from user";
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result);
            // let count=result[0][`*`];
            res.render("users.ejs",{result});
        })
        
    } catch (error) {

        // console.log("some error in the DB");
        console.log(error);
        res.send(`some error in the DB`);
    }
    
})

// now edit route we can edit user name 

app.get("/home/users/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(id);
            // console.log(result);
            let user=result[0];
            res.render("edit.ejs",{user});
        })
        
    } catch (error) {

        // console.log("some error in the DB");
        console.log(error);
        res.send(`some error in the DB`);
    }
    
})

// update route here updation of data 

app.patch("/home/users/:id",(req,res)=>{
    let {id}=req.params;
    let{password : formpass , name :newname}=req.body;
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(id);
            // console.log(result);
            let user=result[0];

            if(formpass!=user.password){
                res.send("wrong password")
            }else{
                let q2=`update user set name='${newname}' where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    res.redirect("http://localhost:3000/home/users");

                })
            }
            // res.render("edit.ejs",{user});
            // res.send(user);
        })
        
    } catch (error) {

        // console.log("some error in the DB");
        console.log(error);
        res.send(`some error in the DB`);
    }


})


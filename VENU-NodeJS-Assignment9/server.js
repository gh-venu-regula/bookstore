const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs');
const mysql=require('mysql2');
require('dotenv').config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/home',(req,res)=>{
    res.render('index');
});
app.get('/home/book-:id',(req,res)=>{
    console.log(req.params.id);
    res.render('details');
});
const mydb=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    uri:process.env.URI
});
mydb.connect((err)=>{
    if(err){
        console.error(err);
    }
    else{
        console.log("database is connected");
    }
});
app.get('/books',(req,res)=>{
    const sqlquery='select * from books';
    mydb.query(sqlquery,(err,result)=>{
        if(err){
            res.status(500).json({error:'query not executed'});
        }
        res.status(200).json(result);
    });
});
app.get('/books/:id',(req,res)=>{
    const sqlquery='select * from books where id=?';
    mydb.query(sqlquery,[req.params.id],(err,result)=>{
        if(err){
            res.status(500).json({error : err.message});
        }
        if(result.length===0){
            res.status(404).send("book with specified id is not found");
        }
        else{
            res.status(200).json(result);
        }
    });
});
app.post('/books',(req,res)=>{
    const {title,author,genre,publication_year,language,price,isbn,publisher,rating,url}=req.body;
    const sqlquery='insert into books(title,author,genre,publication_year,language,price,isbn,publisher,rating,url) values(?,?,?,?,?,?,?,?,?,?)';
    const values = [title, author, genre,publication_year, language, price, isbn, publisher, rating,url];
    mydb.query(sqlquery,values,(err,result)=>{
        if(err){
            res.status(500).json({error:err.message});
        }
        else{
            res.status(200).send({status:true});
        }
    });
});
app.put('/books/:id',(req,res)=>{
    console.log(req.body);
    const {title,author,genre,publication_year,language,price,isbn,publisher,rating,url}=req.body;
    const sqlquery='update books set title=?,author=?,genre=?,publication_year=?,language=?,price=?,isbn=?,publisher=?,rating=?,url=? where id=?';
    const values=[title,author,genre,publication_year,language,price,isbn,publisher,rating,url,req.params.id];
    mydb.query(sqlquery,values,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).json({error:err.message});
        }
        if(result.affectedRows===0){
            console.log("hello");
            res.status(404).json({status:'book with specified id is not available'});
        }
        else{
            console.log("ok");
            res.status(200).json({status:true});
        }
    });
});
app.delete('/books/:id',(req,res)=>{
    const sqlquery='delete from books where id=?';
    mydb.query(sqlquery,[req.params.id],(err,result)=>{
        if(err){
            res.status(500).json({status:err.message});
        }
        if(result.affectedRows===0){
            res.status(404).json({status:'the book you are trying to delete is not found'});
            //res.writeHead(200,{'Content-Type':'text/plain'});
            //res.send('<h1>the book you are trying to delete is not found</h1>');
        }
        else{
            res.status(200).json({status:true});
        }
    });
});
app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running");
});

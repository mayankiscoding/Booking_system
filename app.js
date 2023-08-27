import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import alert from 'alert'
import {AddData,DeleteData,AddBooking,DelBooking,checkExist,getData,getData1,getData2,AddSemData,DeleteSemData, AddSemBooking,SemSort2,DelSemBooking,checkSemExist,SemSort1} from "./DataBases/database.js"
import { stat } from "fs";





const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)




const port = 3000
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.get("/",(req,res) => {
  res.render("main.ejs")
})



// <------------------------CLASSES RELATED STREAMS------------------------>

// DATABASE RELATED FUNCTIONS
app.get("/data",(req,res) =>{
  res.render("DataBaseEntry.ejs")
})

app.post("/data",(req,res) =>{

  var table = req.body.day
  var room = req.body.class
  var slot = req.body.slot

  AddData(table,room,slot)
  res.redirect("/data")
})

app.get("/data/del",(req,res) =>{
  res.render("DelDataBaseEntry.ejs")
})

app.post("/data/del",(req,res) =>{

  var table = req.body.day
  var room = req.body.class
  var slot = req.body.slot

  DeleteData(table,room,slot)
  res.redirect("/data/del")
})


// BOOKING RELATED FUNCTIONS 
app.get("/class/book",(req,res) =>{
  res.render("BookClass.ejs")
})

app.post("/class/book",(req,res) =>{
  
  var table = req.body.day
  var room = req.body.class
  var slot = req.body.slot
  var course = req.body.course
  var sem = req.body.semester
  var sub = req.body.subject 
  
  var check = checkExist(table,room,slot)
  check.then(result => {
    if(result === 1)
    {
      AddBooking(table,room,slot,course,sem,sub)
    }
    else
    {
      alert("Room is ALREADY BOOKED")
    }
  })
  res.redirect("/class/book")
})


app.get("/class/del",(req,res) =>{
  res.render("DelBook.ejs")
})

app.post("/class/del",(req,res) =>{
  
  var table = req.body.day
  var room = req.body.class
  var slot = req.body.slot
  
  var check = checkExist(table,room,slot)
  check.then(result => {
    if(result === 0)
    {
      DelBooking(table,room,slot)
    }
    else
    {
      alert("Room is NOT BOOKED yet")
    }
  })
  res.redirect("/class/del")
})

// SHOW FUNCTIONS
app.get("/show/stat", (req,res) => {
  res.render("stat.ejs")
})

app.post("/show/stat" , (req,res) =>{
  var status = req.body.status
  var table = req.body.day

  if(status === "*")
  {
    const data = getData(table)
    data.then(result => {
      const Results = result
      res.render("stat.ejs",{Result:Results})
    })
  }
  else
  {
    const data = getData1(table,"Status",status)
    data.then(result => {
      const Results = result
      res.render("stat.ejs",{Result:Results})
    })

  }
})

app.get("/show/floor",(req,res) =>{
  res.render("floor.ejs")
})

app.post("/show/floor" ,(req,res) =>{

  var table = req.body.day
  var floor = req.body.Floor
  var stat = req.body.status

  if(stat === "*")
  {
    const data = getData1(table,"Floor_No",floor)
    data.then(result => {
      
      res.render("floor.ejs" , {Result:result})
    })
  }
  else
  {
    const data = getData2(table,"Floor_No",floor,"Status",stat)
    data.then(result => {
      
      res.render("floor.ejs" , {Result:result})
    })
  }
})
// <-----------------------------XXXXXXXXXX----------------------------->



// <------------------------SEMINAR HALL RELATED STREAMS------------------------>

// DATABASE RELATEED FUNCTION (SEMINAR)
app.get("/seminar/data/add" , (req,res) => {
  res.render("SeminarDBadd.ejs")
})
app.post("/seminar/data/add",(req,res) => {
  var date = req.body.date
  var room = req.body.room

  AddSemData(date,room)
  res.redirect("/seminar/data/add")
})

app.get("/seminar/data/del" , (req,res) => {
  res.render("SeminarDBdel.ejs")
})
app.post("/seminar/data/del",(req,res) => {
  var date = req.body.date
  var room = req.body.room
    
  DeleteSemData(date,room)
  res.redirect("/seminar/data/del")
})

// BOOKING RELATED FUNCTIONS (SEMINAR)
app.get("/seminar/book" , (req,res) => {
  res.render("BookSeminar.ejs")
})
app.post("/seminar/book",(req,res) => {

  var act = req.body.act
  var date = req.body.date
  var room = req.body.room
  
  var check = checkSemExist(date,room)
  check.then(result => {
    if(result === 1)
    {
      AddSemBooking(date,room,act)
    }
    else
    {
      alert("SEMINAR HALL ALREADY BOOKED")
    }
  })
  res.redirect("/seminar/book")
})


app.get("/seminar/unbook" , (req,res) => {
  res.render("UNBookSeminar.ejs")
})
app.post("/seminar/unbook",(req,res) => {

  var date = req.body.date
  var room = req.body.room
  
  var check = checkSemExist(date,room)
  check.then(result => {
    if(result === 0)
    {
      DelSemBooking(date,room)
    }
    else
    {
      alert("SEMINAR HALL NOT BOOKED YET")
    }
  })
  res.redirect("/seminar/unbook")
})


app.get("/seminar/show/stat", (req,res) => {
  res.render("semSort.ejs")
})

app.post("/seminar/show/stat" , (req,res) =>{
  var month = req.body.month
  var status = req.body.status

  if(status === "*")
  {
    const data = SemSort1(month)
    data.then(result =>{

      res.render("semSort.ejs",{Result:result})
    })
  }
  else
  {
    const data = SemSort2(month,"Status",status)
    data.then(result =>{

      res.render("semSort.ejs",{Result:result})
    })
  }
})

// <-----------------------------XXXXXXXXXX----------------------------->

app.listen(port , function(){
  console.log(`Server started at ${port}`);
})

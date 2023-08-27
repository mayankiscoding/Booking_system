import mysql  from "mysql2"
import dotenv from "dotenv"
import alert from 'alert'

dotenv.config()

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password : 'password',
  database : 'booking_system'
}).promise()


//COMMON FUNCTIONS (SEMINAR AND CLASSES)
export async function getData(table){
  const data = await pool.query(`SELECT * FROM ${table}`)
  return data
}

export async function getData1(table,attr,val){
  const data = await pool.query(`SELECT * FROM ${table} 
  WHERE ${attr} = "${val}"`)
  return data
}

export async function getData2(table,attr,val,attr2,val2){
  const data = await pool.query(`SELECT * FROM ${table} 
  WHERE ${attr} = "${val}"
  AND   ${attr2} = "${val2}"`)
  
  return data
}

export async function getEntriesTriple(attr,val,attr2,val2,attr3,val3){
  const data = await pool.query(`SELECT * FROM classData 
  WHERE ${attr} = "${val}"
  AND   ${attr2} = "${val2}"
  AND   ${attr3} = "${val3}"`)
  return data
}

// <--------------------CLASS RELATED FUNCTION-------------------->

// DATABASE RELATED FUNCTIONS
export async function AddData(table,room,time){
  await pool.query(`
  INSERT INTO ${table}(Room_No,Time_Slot,Status) 
  VALUES (
    '${room}',
    '${time}',
    'Not Booked'
  )`)




  alert(`Data entered in ${table}`)
}

export async function DeleteData(table,room,slot)
{
    await pool.query(`DELETE FROM ${table} 
      WHERE Room_No = "${room}"
      AND Time_Slot = "${slot}"`)

  alert(`Data delted ${table}`)
    
}

// BOOKING RELATED FUNCTIONS
export async function checkExist(table,room,slot){
  const data = await pool.query(`SELECT Status from ${table}
    WHERE 
    Room_No= '${room}' AND 
    Time_Slot = '${slot}'`)
    
    const status = data[0][0]["Status"]
    var flag = 0

    if(status === "Not Booked")
    {
      flag = 1
    }

    else
    {
      flag = 0
    }

    return flag
}

export async function AddBooking(table,room,slot,course,sem,subject)
{
    await pool.query(`UPDATE ${table}
      SET status = "Booked", course = "${course}" , Semester ="${sem}" , Subject = "${subject}"
      WHERE Room_No = "${room}"
      AND Time_Slot = "${slot}"`)
    
  alert(`Room Booked`)
}

export async function DelBooking(table,room,slot)
{
    await pool.query(`UPDATE ${table}
      SET status = "Not Booked", course = "NULL" , Semester ="NULL" ,Subject = "NULL"
      WHERE Room_No = "${room}"
      AND Time_Slot = "${slot}"`)
      
    alert(`Room Unbooked`)
}

// <--------------------SEMINAR HALL RELATED FUNCTION-------------------->

// DATABASE RELATED FUNCTIONS
export async function AddSemData(date,room){
  await pool.query(`
  INSERT INTO Halls(Date,Room_No,Status) 
  VALUES (
    '${date}',
    '${room}',
    'Not Booked'
  )`)

  alert(`Slot entered for SEMINAR`)
}

export async function DeleteSemData(date,room)
{
    await pool.query(`DELETE FROM Halls
      WHERE Date = "${date}"
      AND Room_No = "${room}"`)

  alert(`Slot deleted for SEMINAR`)
    
}

// BOOKING RELATED FUNCTIONS
export async function checkSemExist(date,room){
  const data = await pool.query(`SELECT Status from halls
    WHERE 
    Date= '${date}' AND
    Room_No = '${room}'`)
    
    const status = data[0][0]["Status"]
    var flag = 0

    if(status === "Not Booked")
    {
      flag = 1
    }

    else
    {
      flag = 0
    }

    return flag
}


export async function AddSemBooking(date,room,event)
{
    await pool.query(`UPDATE halls
      SET Status = "Booked", Event = "${event}"
      WHERE date = "${date}"
      AND Room_No = "${room}"`)
    
  alert(`SEMINAR HALL BOOKED SUCCESSFULLY`)
}

export async function DelSemBooking(date,room)
{
    await pool.query(`UPDATE Halls  
      SET status = "Not Booked", Event = "NULL"
      WHERE Date = "${date}"
      AND Room_No = "${room}"`)
      
    alert(`SEMINAR HALL UNBOOKED SUCCESSFULLY`)
}

export async function SemSort2(Month,attr,val)
{

    const data = await pool.query(`SELECT * FROM halls 
    WHERE  Date LIKE '%-${Month}-%'
    AND ${attr} = "${val}"`)

    return data
    
}

export async function SemSort1(Month)
{

    const data = await pool.query(`SELECT * FROM halls 
    WHERE  Date LIKE '%-${Month}-%'`)

    return data
    
}


const db = require('./dbusingpgpromise.js')

exports.handler = async function (event, context) {

  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
    };
  }
  else {
    console.log(event.httpMethod)
    console.log(process.env.DB_URL)
    let json_msg = new Object();
    try {
      const result = await db.query("select a.anper, (select count(*) from tickets where status='OPEN' and anper=a.anper) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and anper=a.anper) as INPROGRESS, (select count(*) from tickets where status='DONE' and anper=a.anper) as DONE FROM (select distinct anper from tickets) a order by a.anper")
      console.log(result)
      json_msg.all = new Object();
      if (result.length > 0) {
        json_msg.all = result;
      }
      else {
        item = new Object();
        item.anper = "anper"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.all.push(item)
      }

      const askrindoresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='Askrindo') a order by a.handler_username")
      console.log(askrindoresult)
      json_msg.askrindo = new Object();
      if (askrindoresult.length > 0) {
        json_msg.askrindo = askrindoresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.askrindo.push(item)
      }

      const bavresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='BAV') a order by a.handler_username")
      console.log(bavresult)
      json_msg.bav = new Object();
      if (bavresult.length > 0) {
        json_msg.bav = bavresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.bav.push(item)
      }

      const bkiresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='BKI') a order by a.handler_username")
      console.log(bkiresult)
      json_msg.bki = new Object();
      if (bkiresult.length > 0) {
        json_msg.bki = bkiresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.bki.push(item)
      }    

      const bsresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='BS') a order by a.handler_username")
      console.log(bsresult)
      json_msg.bs = new Object();
      if (bsresult.length > 0) {
        json_msg.bs = bsresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.bs.push(item)
      }

      const btimresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='BTIM') a order by a.handler_username")
      console.log(btimresult)
      json_msg.btim = new Object();
      if (btimresult.length > 0) {
        json_msg.btim = btimresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.btim.push(item)
      }      

      const gnturesult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='GNTU') a order by a.handler_username")
      console.log(gnturesult)
      json_msg.gntu = new Object();
      if (gnturesult.length > 0) {
        json_msg.gntu = gnturesult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.gntu.push(item)
      }       

      const ifgresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='IFG Holding') a order by a.handler_username")
      console.log(ifgresult)
      json_msg.ifg = new Object();
      if (ifgresult.length > 0) {
        json_msg.ifg = ifgresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.ifg.push(item)
      }       

      const ifgliferesult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='IFG Life') a order by a.handler_username")
      console.log(ifgliferesult)
      json_msg.ifglife = new Object();
      if (ifgliferesult.length > 0) {
        json_msg.ifglife = ifgliferesult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.ifglife.push(item)
      }       

      const jamkrindoresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='Jamkrindo') a order by a.handler_username")
      console.log(jamkrindoresult)
      json_msg.jamkrindo = new Object();
      if (jamkrindoresult.length > 0) {
        json_msg.jamkrindo = jamkrindoresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.jamkrindo.push(item)
      }       

      const jasaraharjaresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='Jasa Raharja') a order by a.handler_username")
      console.log(jasaraharjaresult)
      json_msg.jasaraharja = new Object();
      if (jasaraharjaresult.length > 0) {
        json_msg.jasaraharja = jasaraharjaresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.jasaraharja.push(item)
      }       

      const jasindoresult = await db.query("select a.handler_username, (select count(*) from tickets where status='OPEN' and handler_username=a.handler_username) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and handler_username=a.handler_username) as INPROGRESS, 	(select count(*) from tickets where status='DONE' and handler_username=a.handler_username) as DONE FROM (select distinct handler_username from tickets where anper='Jasindo') a order by a.handler_username")
      console.log(jasindoresult)
      json_msg.jasindo = new Object();
      if (jasindoresult.length > 0) {
        json_msg.jasindo = jasindoresult;
      }
      else {
        item = new Object();
        item.handler_username = "handler_username"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.jasindo.push(item)
      }       
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error "+e
      console.log("Server Error "+e)
      //json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
}
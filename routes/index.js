
const data = '#1=$1+$3';
const data2= '(,$1,+,$3,),+,(,$2,i,+,$4,i,)';
process_front =(data)=>{
  const re = /[#$]?[0-9]+|[a-z]+|[()]|[+-/*//]/g;
  // let tmp = [...data.matchAll(re)];
  let result = [];
  // console.log(data.matchAll(re).length);
  for (const match of data.matchAll(re)) {
    // console.log(match);
    result.push(match[0]);
  }
  // let result = [];
  // for ( let i in tmp){
  //   result.push(tmp[i][0])
  // }
  // console.log(result);
  // console.log(result.join(','));
  return result.join(',');
};
process_front(data);
process_db = (data)=>{
  //console.log(data.replace(/,/g,''));
  return data.replace(/,/g,'')
};
process_db2 = (data)=>{
  //console.log(data.replace(/,/g,''));
  let tmp_data = data.replace(',','=');
  return tmp_data.replace(/,/g,'')
};
const mysql = require('mysql');
const mysqlConf = {
  host : '47.252.83.229',
  user : 'yihao',
  port:'3306',
  password : '960404',
  database : 'test_database'
};
// 用于保存数据连接实例
let db = null;
let pingInterval;

// 如果数据连接出错，则重新连接
function handleError(err) {
  console.info(err.stack || err);
  connect();
}

// 建立数据库连接
function connect() {
  if (db !== null) {
    db.destroy();
    db = null;
  }

  db = mysql.createConnection(mysqlConf);
  db.connect(function (err) {
    if (err) {
      console.info("error when connecting to db,reConnecting after 2 seconds:", err);
      setTimeout(connect, 2000);
    }
    else{
      console.log('连接成功 id ' + db.threadId);
    }
  });
  db.on("error", handleError);

  // 每个小时ping一次数据库，保持数据库连接状态
  clearInterval(pingInterval);
  pingInterval = setInterval(() => {
    console.log('ping...');
    db.ping((err) => {
      if (err) {
        console.log('ping error: ' + JSON.stringify(err));
      }
    });
  }, 3600000);
}
connect();
//connect to mysql
// let db = mysql.createConnection({
//   host : '47.252.83.229',
//   user : 'yihao',
//   port:'3306',
//   password : '960404',
//   database : 'test_database'
// });
// db.connect(function(err) {
//   if (err) {
//     console.error('连接失败: ' + err.stack);
//     throw(err);
//   }
//   else{
//     console.log('连接成功 id ' + db.threadId);
//   }
//
// });


module.exports = function (app) {
  //url: http://localhost:8080
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    if(req.method==="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
  });
  //GET return all the info from DB
  //POST create a new record to DB
  //PUT update the record in DB
  //API for problems
  app.get("/problem/:id", function (req, res) {
    //GET problem by id
    let id = req.params.id;
    let sql = `SELECT * FROM problem WHERE id = ${id}`;
    db.query(sql, (err, data) => {
      if (err) {
        console.log("error!", err);
      } else {
        console.log("success!", data);
        let processed_data = JSON.stringify(data);
        processed_data = JSON.parse(processed_data);
        for(let i in processed_data){
          processed_data[i].start_format = process_db(processed_data[i].start_format)
        }
        res.send(processed_data);
      }
    });
  });
  app.get("/problem", function (req, res) {
    let sql = `SELECT * FROM problem`;
    db.query(sql, (err, data) => {
      if (err) {
        console.log("error!", err);
      } else {
        console.log("success!", data);
        //res.writeHead(200, {"Content-Type": "application/json"});

        let processed_data = JSON.stringify(data);
        processed_data = JSON.parse(processed_data);
        for(let i in processed_data){
          processed_data[i].start_format = process_db(processed_data[i].start_format)
        }
        res.send(processed_data);
      }
    });
  });


  app.put("/problem", function (req, res) {

    req.on('data',function(data){

      //const body = JSON.parse(data);

      let processed_body = JSON.parse(data);

      processed_body.start_format = process_front(processed_body.start_format);

      let sql = `UPDATE problem 
                 SET name = '${processed_body.name}', 
                     description = '${processed_body.description}', 
                     parameter_number = ${processed_body.parameter_number},
                     start_format = '${processed_body.start_format}'
                 WHERE (id = '${processed_body.id}');`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to update');
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }

      });
    })


  });
  app.post("/problem", function (req, res) {

    req.on('data',function(data){

      //const body = JSON.parse(data);
      let processed_body = JSON.parse(data);

      processed_body.start_format = process_front(processed_body.start_format);
      console.log(processed_body.start_format);
      let sql = `INSERT INTO problem (name, description, parameter_number, start_format)
               VALUES
               ('${processed_body.name}', '${processed_body.description}', ${processed_body.parameter_number}, '${processed_body.start_format}');`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to insert');
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }

      });
    })
  });


  //API for second level parameter
  app.post("/second_level_parameter", function (req, res) {
    req.on('data',function(data){
      const body = JSON.parse(data);
      let sql = `SELECT * FROM second_level_parameter WHERE problem_ID = ${body.problem_ID}`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
        } else {
          console.log("success!", data);
          let processed_data = JSON.stringify(data);
          processed_data = JSON.parse(processed_data);
          for(let i in processed_data){
            processed_data[i].format = process_db2(processed_data[i].format)
          }
          res.send(processed_data);
        }
      });
    });
  });

  app.put("/second_level_parameter", function (req, res) {
    req.on('data',function(data){

      //const body = JSON.parse(data);
      let processed_body = JSON.parse(data);

      processed_body.format = process_front(processed_body.format);
      let sql = `UPDATE second_level_parameter 
                 SET 
                   problem_ID = ${processed_body.problem_ID},
                   format = '${processed_body.format}' 
                 WHERE (id = ${processed_body.id});`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to update');
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }
      });
    })
  });
  app.post("/second_level_parameter_create", function (req, res) {
    req.on('data',function(data){

      let processed_body = JSON.parse(data);
      //console.log(processed_body);

      processed_body.format = process_front(processed_body.format);
      //console.log(processed_body);
      let sql = `INSERT INTO second_level_parameter (problem_ID, format)
               VALUES
               (${processed_body.problem_ID}, '${processed_body.format}');`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to insert');
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }

      });
    })
  });


  //API for step information
  app.post("/step", function (req, res) {
    req.on('data',function(data){
      const body = JSON.parse(data);
      console.log(body.problem_ID);
      let sql = `SELECT * FROM step_info WHERE problem_ID = ${body.problem_ID}`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
        } else {
          console.log("success!", data);
          let processed_data = JSON.stringify(data);
          processed_data = JSON.parse(processed_data);
          for(let i in processed_data){
            processed_data[i].format = process_db(processed_data[i].format)
          }
          res.send(processed_data);
        }
      });
    });
  });
  app.put("/step", function (req, res) {
    req.on('data',function(data){

      let processed_body = JSON.parse(data);
      processed_body.format = process_front(processed_body.format);

      let sql = `UPDATE step_info 
                 SET 
                     problem_ID = ${processed_body.problem_ID},
                     name = '${processed_body.name}', 
                     feed_back = '${processed_body.feedback}', 
                     step_number = ${processed_body.step_number},
                     type = ${processed_body.type},
                     finish = ${processed_body.finish},
                     format = '${processed_body.format}'
                 WHERE (id = ${processed_body.id});`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to update');
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }

      });
    })
  });
  app.post("/step_create", function (req, res) {
    req.on('data',function(data){

      let processed_body = JSON.parse(data);
      processed_body.format = process_front(processed_body.format);
      let sql = `INSERT INTO step_info (problem_ID, name, feed_back, step_number, type, finish, format)
               VALUES
               (${processed_body.problem_ID}, '${processed_body.name}', '${processed_body.feed_back}', ${processed_body.step_number}, ${processed_body.type}, ${processed_body.finish}, '${processed_body.format}');`;
      db.query(sql, (err, data) => {
        if (err) {
          console.log("error!", err);
          res.send('Fail to insert' + err);
        } else {
          console.log("success!", data);
          res.send( JSON.stringify(data));
        }

      });
    })
  });

};

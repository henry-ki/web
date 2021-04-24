var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rldndals',
  database : 'opentutorials'
});
db.connect();

/*var template = {//객체의 하나하나의 값 : property 라 부름
   HTML : function(title, list, body, control){
     return `
       <!doctype html>
       <html>
       <head>
         <title>WEB1 - ${title}</title>
         <meta charset="utf-8">
       </head>
       <body>
         <h1><a href="/">WEB</a></h1>
         ${list}
         ${control}
         ${body}
       </body>
       </html>

     `;
   },
  List : function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list +  `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }

}*/

//아래것을 위에로 객체로 만들어줌->***리팩토링
/*function templateHTML(title, list, body, control){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>

  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list +  `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}*/

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
        if(title === undefined){
          /*fs.readdir('./data', function(err,filelist){
            var title = 'Welcome';
            var description = 'Main HomePage';
            var list = template.List(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
          })*/

          //위의 코드를 DB를 사용해 표현
          db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것
            console.log(topics);
            var title = 'Welcome';
            var description = 'Main HomePage';
            var list = template.List(topics);//원랜 이거:var list = template.List(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
          });

        }
        else{
          /*fs.readdir('./data', function(err,filelist){
            var filteredId = path.parse(title).base;

            fs.readFile(`data/${filteredId}`, 'utf8', function(err, data){
              // var title = queryData.id;
              var description = data;
              var sanitizedTitle = sanitizeHtml(title);
              var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
              });
              //sanitizeHtml을 통해 받은 정보를 살균(살균 : description 란에 스크립트 태그와 같이 정보를 핸들링 할 수 있는 태그를 내쳐버리고 출력해줌)
              var list = template.List(filelist);
              var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2> <p>${sanitizedDescription}</p>`,
              `<a href="/create">create</a>
               <a href="/update?id=${sanitizedTitle}">update</a>
               <form action="/delete_process" method = "post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
               </form>`); // control = <a href="/create">create</a> <a href="/update">update</a>
              response.writeHead(200);
              response.end(html);
            });
          });*/

          db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것
            if(err) throw err;
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id =?`, [title], function(err2,topic){//id값을 드러내면 매우 위험할 수 있으니 ?,[id 받을 변수] 로 표현하는게 안전
                if(err2) throw err2;
                console.log(topic);
                var title = topic[0].title;//var title = 'Welcome';
                var description = topic[0].description; //var description = 'Main HomePage';
                var list = template.List(topics);//원랜 이거:var list = template.List(filelist);
                var html = template.HTML(title, list,
                  `
                  <h2>${title}</h2>
                  <p>${description}</p>
                  by ${topic[0].name}
                  `,
                  `<a href="/create">create</a>
                   <a href="/update?id=${queryData.id}">update</a>
                   <form action="/delete_process" method = "post">
                      <input type="hidden" name="id" value="${queryData.id}">
                      <input type="submit" value="delete">
                   </form>`
                );
                response.writeHead(200);
                response.end(html);
              })
            });


        }
      }
    else if(pathname === '/create'){
      /*fs.readdir('./data', function(err,filelist){
        var title = 'Web - create';
        var list = template.List(filelist);
        var html = template.HTML(title, list,
          `
            <form action="/create_process" method = "post">
            <p><input type="text" name="title" placeholder="제목"></p>
            <p>
              <textarea name="description" placeholder="글작성" ></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          `,'');
        response.writeHead(200);
        response.end(html);
      })*/

      db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것
        db.query(`SELECT * FROM author`, function(err2, authors){//저자 목록 기능
          console.log(authors);
          /*template으로 보내버림
          var tag = '';
          var i = 0;
          while(i<authors.length){
            tag = tag + `<option value=${authors[i].id}>${authors[i].name}</option>`
            i++;
          }*/

          var title = 'Create';
          var list = template.List(topics);//원랜:var list = template.List(filelist);
          var html = template.HTML(title, list,
            `
              <form action="/create_process" method = "post">
              <p><input type="text" name="title" placeholder="제목"></p>
              <p>
                <textarea name="description" placeholder="글작성" ></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            `,
            `<a href="/create">create</a>`
          );//select 태그:콤보 박스 태그->탬플릿화 해서 ${template.authorSelect(authors)}로 변경됨
          response.writeHead(200);
          response.end(html);
        });
      });

    }
    else if(pathname === '/create_process'){
      //post 방식으로 들어온 데이터를 처리하는 방법
      var body = '';
      request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){//이벤트라고 불림
        var post = qs.parse(body);
      /*  // var title = post.title;
        // var description = post.description;
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
          if(err){
            console.log(err);
          }
          else{
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end();
          }
        })*/
        console.log(post);
        db.query(`
          INSERT INTO topic (title,description,created,author_id) VALUES(?,?,NOW(),?)`,
          [post.title, post.description,post.author],
          function(err,results){
            if(err) throw err;
            response.writeHead(302, {Location : `/?id=${results.insertId}`});//results.insertId : 테이블에 삽입된 데이터의 id값을 갖고오는 약속
            response.end();
          }
        )
      });
    }
    else if(pathname === '/update'){
      /*fs.readdir('./data', function(err,filelist){
        var filteredId = path.parse(title).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, data){
          // var title = queryData.id;
          var description = data;
          var list = template.List(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method = "post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="제목" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="글작성">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`); // control = <a href="/create">create</a> <a href="/update">update</a>

          //<input type="hidden" name="id" value="${title}">부분:유저가 내용을 수정하기 전의 값을hidden으로 숨기고 id 라는 이름으로 value 값을 넘겨준다.
          //그리고 title,description으로 새로운 값을 받는다
          response.writeHead(200);
          response.end(html);
        });
      });*/

      db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것

        if(err) throw err;
        db.query(`SELECT * FROM topic WHERE id =?`, [title], function(err2,topic){//id값을 드러내면 매우 위험할 수 있으니 ?,[id 받을 변수] 로 표현하는게 안전
            if(err2) throw err2;
            db.query(`SELECT * FROM author`, function(err2, authors){
              console.log(topic);
              // var title = topic[0].title;//여기 이해가 잘 안가네;;
              // var description = topic[0].description;
              var list = template.List(topics);//원랜 이거:var list = template.List(filelist);
              var html = template.HTML(topic[0].title, list,
                `
                  <form action="/update_process" method = "post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="제목" value="${topic[0].title}"></p>
                  <p>
                    <textarea name="description" placeholder="글작성">${topic[0].description}</textarea>
                  </p>
                  <p>
                    ${template.authorSelect(authors, topic[0].author_id)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                `,
                `<a href="/create">create</a>
                <a href="/update?id=${topic[0].id}">update</a>`
              );//topic[0].author_id:현재 선택한 수정페이지에서의 저자 id
              response.writeHead(200);
              response.end(html);
            })

          })
        });

    }
    else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){ //post방식으로 데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){//이벤트라고 불림
        var post = qs.parse(body);
        // var id = post.id;
        // var title = post.title;
        // var description = post.description;
        console.log(post);
        /*fs.rename(`./data/${id}`,`./data/${title}`, function(err){
          fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
            if(err){
              console.log(err);
            }
            else{
              response.writeHead(302, {Location : `/?id=${title}`});
              response.end();
            }
          })
        });*/
        db.query(`
          UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
          [post.title,post.description,post.author,post.id],
          function(err,results){
            if(err) throw err;
            response.writeHead(302, {Location : `/?id=${post.id}`});
            response.end();
          }
          )

      });
    }
    else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){//이벤트라고 불림
        var post = qs.parse(body);
        /*var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`./data/${filteredId}`,function(err){
          response.writeHead(302, {Location : `/`});
          response.end();
        });*/

        db.query(`DELETE FROM topic WHERE id =?`,[post.id],
          function(err,results){
            if(err) throw err;
            response.writeHead(302, {Location : `/`});
            response.end();
          }
        )

      });
    }
    else{
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);

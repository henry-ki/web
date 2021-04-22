var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
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
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
        if(title === undefined){
          fs.readdir('./data', function(err,filelist){
            var title = 'Welcome';
            var description = 'Main HomePage';
            var list = templateList(filelist);
            var template = templateHTML(title, list,
              `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(template);
          })


        }
        else{
          fs.readdir('./data', function(err,filelist){
            fs.readFile(`data/${title}`, 'utf8', function(err, data){
              // var title = queryData.id;
              var description = data;
              var list = templateList(filelist);
              var template = templateHTML(title, list,
                `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="/delete_process" method = "post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
               </form>`); // control = <a href="/create">create</a> <a href="/update">update</a>
              response.writeHead(200);
              response.end(template);
            });
          });
        }
      }
    else if(pathname === '/create'){
      fs.readdir('./data', function(err,filelist){
        var title = 'Web - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list,
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
        response.end(template);
      })
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
        var title = post.title;
        var description = post.description;
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
          if(err){
            console.log(err);
          }
          else{
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end();
          }
        })
      });
    }
    else if(pathname === '/update'){
      fs.readdir('./data', function(err,filelist){
        fs.readFile(`data/${title}`, 'utf8', function(err, data){
          // var title = queryData.id;
          var description = data;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
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
          response.end(template);
        });
      });
    }
    else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){//이벤트라고 불림
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        console.log(post);
        fs.rename(`./data/${id}`,`./data/${title}`, function(err){
          fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
            if(err){
              console.log(err);
            }
            else{
              response.writeHead(302, {Location : `/?id=${title}`});
              response.end();
            }
          })
        });

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
        var id = post.id;
        fs.unlink(`./data/${id}`,function(err){
          response.writeHead(302, {Location : `/`});
          response.end();
        });

      });
    }
    else{
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);

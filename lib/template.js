module.exports = {//객체의 하나하나의 값 : property 라 부름
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
  List : function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list +  `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  authorSelect:function(authors, author_id){//현재 페이지에서의 author id 값:
    var tag = '';
    var i = 0;
    while(i<authors.length){
      var selected='';
      if(authors[i].id === author_id){
        selected = ' selected';
      }
      tag = tag + `<option value=${authors[i].id}${selected}>${authors[i].name}</option>`
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  }//select 태그:콤보 박스 태그

  /*원랜 이거
    List : function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list +  `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }*/

}

// module.exports = template; 이게 너무 기니까 위에 변수 부분처럼 해줘도 됨

//객체, 객체지향이란 것의 기초그림
// -> 코드의 복잡성을 낮추고 간단하게 정리정돈하는 것이 기본

var o = {
  v1:'v1',
  v2:'v2',
  f1 : function(){
    // console.log(o.v1);
    console.log(this.v1);
  },
  f2 : function(){
    // console.log(o.v2);
    console.log(this.v2);
  }
}


o.f1();
o.f2();

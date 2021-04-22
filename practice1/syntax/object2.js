var f = function(){
  console.log(1+1);
  console.log(1+2);
}//데이터를 처리하는 것을 담는 함수도 자바스크립트에선 값이 될 수 있다.->object로 이어서

var a = [f]; //배열에 담길수도 있음
a[0]();


var object = {//함수는 객체에 많이 담음. 왜? func 와 같은 이름이 있기 떄문에. 담아놓은 함수를 이름으로 꺼내기 좋음
  func : f
}
o.func();

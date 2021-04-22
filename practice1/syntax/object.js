//배열
var members = ['rldndals', 'rlwnsdud', 'wjdalgid', 'rldnrud'];
var i = 0;
while(i < members.length){
  console.log('array loop', members[i]);
  i = i + 1;
}

var roles = {
  'programmer' : 'rldndals',
  'soldier' : 'rlwnsdud',
  'nurse' : 'wjdalgid',
  'ceo' : 'rldnrud'
}
//'programmer'(key) : 'rldndals'(value)
for(var n in roles){
  console.log('object => ', n, 'value => ', roles[n]);
}

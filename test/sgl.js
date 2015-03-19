
  var handler = require('./../sgl.js');
handler.visitor("belief @person hypothesis {@amenity:cinema}40 {@shop}50 {@cinema,@shop}30 model @shop{+20} @cinema{+30} @hola:eso_quiero{day{7:21},week{2:32}} ");
handler.syntax();
console.log(handler.q);
//      handler.list(tx,response,params,grid,pg);


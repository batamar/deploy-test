(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8702],{28392:function(e,n,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/settings/users",function(){return s(68286)}])},57194:function(e,n,s){"use strict";s.d(n,{Z:function(){return i}});var t=s(73463);function i(e){let{title:n,message:s,onAnswer:i}=e;(0,t.y)({title:n,message:s,onAnswer:i})}},68286:function(e,n,s){"use strict";s.r(n);var t=s(85893),i=s(30381),r=s.n(i),l=s(67294),c=s(86427),a=s(69417),d=s(72882),o=s(90629),h=s(7906),u=s(53184),x=s(53816),j=s(53252),Z=s(295),f=s(82414),m=s(69708),_=s(62724),g=s(57194);n.default=()=>{let[e,n]=(0,l.useState)(!1),[s,i]=(0,l.useState)([]),[p,y]=(0,l.useState)(null),[E,N]=(0,l.useState)(!1),v=()=>{n(!0),(0,f.Gy)({path:"/users",method:"GET"}).then(e=>{n(!1),e.error||i(e)})},w=async e=>{n(!0);try{await (0,f.Gy)({path:"/users/manage",method:"POST",data:{action:"remove",_id:e}}),n(!1),v()}catch(e){(0,m.Z)(e)}n(!0)};return(0,l.useEffect)(()=>{v()},[]),(0,t.jsxs)(c.Z,{title:"Users",isLoading:e,children:[(0,t.jsx)("div",{style:{float:"right"},children:(0,t.jsx)(a.Z,{onClick:()=>{N(!0),y(null)},variant:"contained",children:"+ Add user"})}),(0,t.jsx)("div",{style:{clear:"both"}}),(0,t.jsx)("br",{}),E?(0,t.jsx)(_.default,{user:p,open:E,onClose:()=>N(!1),onSuccess:()=>{N(!1),v()}}):null,(0,t.jsx)(d.Z,{component:o.Z,children:(0,t.jsxs)(h.Z,{sx:{minWidth:650},children:[(0,t.jsx)(u.Z,{children:(0,t.jsxs)(x.Z,{children:[(0,t.jsx)(j.Z,{children:"#"}),(0,t.jsx)(j.Z,{children:"Name"}),(0,t.jsx)(j.Z,{children:"Role"}),(0,t.jsx)(j.Z,{children:"Title"}),(0,t.jsx)(j.Z,{children:"Email"}),(0,t.jsx)(j.Z,{children:"Phone"}),(0,t.jsx)(j.Z,{children:"Last login"}),(0,t.jsx)(j.Z,{})]})}),(0,t.jsx)(Z.Z,{children:s.map((e,n)=>(0,t.jsxs)(x.Z,{children:[(0,t.jsx)(j.Z,{children:n+1}),(0,t.jsxs)(j.Z,{children:[e.firstName," ",e.lastName]}),(0,t.jsx)(j.Z,{children:e.role}),(0,t.jsx)(j.Z,{children:e.title}),(0,t.jsx)(j.Z,{children:e.email}),(0,t.jsx)(j.Z,{children:e.phone}),(0,t.jsx)(j.Z,{children:e.lastLoginAt?r()(e.lastLoginAt).format("MM-DD-YYYY hh:mm a"):"N/A"}),(0,t.jsxs)(j.Z,{sx:{textAlign:"right"},children:[(0,t.jsx)(a.Z,{variant:"contained",color:"inherit",onClick:()=>{N(!0),y(e)},children:"Edit"})," ",(0,t.jsx)(a.Z,{variant:"contained",color:"error",onClick:()=>{(0,g.Z)({title:"Are you sure to delete",message:"This action cannot be undone",onAnswer:async n=>{n&&w(e._id)}})},children:"Delete"})]})]},e._id))})]})})]})}}},function(e){e.O(0,[4885,2840,8360,8584,7994,6326,7231,1956,5968,8118,8491,9729,1829,6427,2724,2888,9774,179],function(){return e(e.s=28392)}),_N_E=e.O()}]);
//# sourceMappingURL=users-8e8f468bfe68777d.js.map
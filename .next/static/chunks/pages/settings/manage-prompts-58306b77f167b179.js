(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[818],{72882:function(e,t,n){"use strict";n.d(t,{Z:function(){return m}});var r=n(32793),s=n(1048),i=n(67294),a=n(90512),l=n(58510),o=n(71657),c=n(90948),d=n(1977),u=n(8027);function h(e){return(0,u.ZP)("MuiTableContainer",e)}(0,d.Z)("MuiTableContainer",["root"]);var x=n(85893);let f=["className","component"],Z=e=>{let{classes:t}=e;return(0,l.Z)({root:["root"]},h,t)},p=(0,c.ZP)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:(e,t)=>t.root})({width:"100%",overflowX:"auto"});var m=i.forwardRef(function(e,t){let n=(0,o.Z)({props:e,name:"MuiTableContainer"}),{className:i,component:l="div"}=n,c=(0,s.Z)(n,f),d=(0,r.Z)({},n,{component:l}),u=Z(d);return(0,x.jsx)(p,(0,r.Z)({ref:t,as:l,className:(0,a.Z)(u.root,i),ownerState:d},c))})},53184:function(e,t,n){"use strict";n.d(t,{Z:function(){return v}});var r=n(32793),s=n(1048),i=n(67294),a=n(90512),l=n(58510),o=n(44063),c=n(71657),d=n(90948),u=n(1977),h=n(8027);function x(e){return(0,h.ZP)("MuiTableHead",e)}(0,u.Z)("MuiTableHead",["root"]);var f=n(85893);let Z=["className","component"],p=e=>{let{classes:t}=e;return(0,l.Z)({root:["root"]},x,t)},m=(0,d.ZP)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"table-header-group"}),j={variant:"head"},g="thead";var v=i.forwardRef(function(e,t){let n=(0,c.Z)({props:e,name:"MuiTableHead"}),{className:i,component:l=g}=n,d=(0,s.Z)(n,Z),u=(0,r.Z)({},n,{component:l}),h=p(u);return(0,f.jsx)(o.Z.Provider,{value:j,children:(0,f.jsx)(m,(0,r.Z)({as:l,className:(0,a.Z)(h.root,i),ref:t,role:l===g?null:"rowgroup",ownerState:u},d))})})},93300:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/settings/manage-prompts",function(){return n(45305)}])},40063:function(e,t,n){"use strict";n.d(t,{FQ:function(){return h},KY:function(){return d},fF:function(){return o},fM:function(){return l},lS:function(){return u}});var r=n(85893),s=n(86886),i=n(40476),a=n(15054);let l=e=>{let{label:t,renderControl:n,isCompact:a=!1,required:l=!1}=e;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(s.ZP,{container:!0,children:[(0,r.jsx)(s.ZP,{item:!0,flex:1,id:"label-".concat(t),children:(0,r.jsx)(i.Z,{sx:{color:"#000",fontWeight:"bold"},required:l,children:t})}),(0,r.jsx)(s.ZP,{item:!0,flex:a?6:4,children:n()})]}),(0,r.jsx)("br",{}),(0,r.jsx)("br",{})]})},o=e=>{let{router:t,totalCount:n,page:s,extraQueryParams:i={}}=e;return(0,r.jsx)(a.Z,{count:Math.ceil(n/10),page:parseInt(s,10),onChange:(e,n)=>{t.push({query:{page:n,...i}})},color:"primary",sx:{marginTop:"20px",display:"flex",justifyContent:"center"}})},c=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",d=e=>{let t="inherit",n="#fff";return"active"===e.status&&(t="#4a6cbd"),"lead"===e.status&&(t="rgb(251, 249, 185)",n="#000"),["onHold","canceled","closed"].includes(e.status)&&(t="rgb(200, 105, 80)"),"filled"===e.status&&(t="rgb(221, 160, 221)"),(0,r.jsx)("span",{style:{borderRadius:"5px",backgroundColor:t,color:n,width:"90px",padding:"2px 4px"},children:c(e.status)})},u=e=>{let t="#FA8072";return e.status||(e.status="active"),"active"===e.status&&(t="#4a6cbd"),(0,r.jsx)("span",{style:{borderRadius:"5px",backgroundColor:t,color:"#fff",width:"90px",padding:"2px 4px"},children:c(e.status)})},h=(e,t)=>(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(s.ZP,{container:!0,children:[(0,r.jsx)(s.ZP,{item:!0,flex:3,id:"label-".concat(e),children:e}),(0,r.jsx)(s.ZP,{item:!0,flex:4,children:t})]}),(0,r.jsx)("br",{})]})},57194:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(73463);function s(e){let{title:t,message:n,onAnswer:s}=e;(0,r.y)({title:t,message:n,onAnswer:s})}},69708:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(61889);function s(e){(0,r.l)({message:e.message||e.toString()})}},33062:function(e,t,n){"use strict";n.r(t);var r=n(85893),s=n(67294),i=n(61903),a=n(50657),l=n(37645),o=n(5616),c=n(93946),d=n(69417),u=n(6514),h=n(50594),x=n(69708),f=n(82414),Z=n(40063);t.default=e=>{let{open:t,onClose:n,onSuccess:p,prompt:m}=e,j=m||{_id:null,system:"",user:"",name:"",prompt:""},[g,v]=(0,s.useState)(j.system),[b,y]=(0,s.useState)(j.user),[w,C]=(0,s.useState)(j.name),[S,_]=(0,s.useState)(!1),P=async()=>{_(!0);try{await (0,f.Gy)({path:"/prompts/manage",method:"POST",data:{_id:j._id,system:g,user:b,name:w}}),p(),_(!1)}catch(e){_(!1),(0,x.Z)(e)}},T=(e,t,n,s,a,l)=>(0,r.jsx)(r.Fragment,{children:(0,Z.fM)({label:t,renderControl:()=>(0,r.jsx)(i.Z,{fullWidth:!0,value:e,onChange:e=>n(e.target.value),type:s,multiline:a,minRows:l})})});return(0,r.jsxs)(a.Z,{onClose:n,"aria-labelledby":"modal-title",open:t,fullScreen:!0,style:{width:"60%",left:"inherit"},children:[(0,r.jsx)(l.Z,{id:"modal-title",children:(0,r.jsxs)(o.Z,{display:"flex",alignItems:"center",children:[(0,r.jsx)(o.Z,{flexGrow:1,children:j._id?"Edit prompt":"Create a new prompt"}),(0,r.jsxs)(o.Z,{children:[(0,r.jsx)(c.Z,{onClick:n,children:(0,r.jsx)(h.Z,{})}),(0,r.jsx)(d.Z,{variant:"contained",color:"success",onClick:P,disabled:S,children:"Save"})]})]})}),(0,r.jsxs)(u.Z,{style:{backgroundColor:"#f8f8f8"},children:[(0,r.jsx)("br",{}),T(w,"Name",C),T(g,"System",v,"textarea",!0,10),T(b,"User",y,"textarea",!0,10)]})]})}},45305:function(e,t,n){"use strict";n.r(t);var r=n(85893),s=n(67294),i=n(86427),a=n(69417),l=n(72882),o=n(90629),c=n(7906),d=n(53184),u=n(53816),h=n(53252),x=n(295),f=n(82414),Z=n(69708),p=n(33062),m=n(57194);t.default=()=>{let[e,t]=(0,s.useState)(!1),[n,j]=(0,s.useState)([]),[g,v]=(0,s.useState)(null),[b,y]=(0,s.useState)(!1),w=()=>{t(!0),(0,f.Gy)({path:"/prompts",method:"GET"}).then(e=>{t(!1),e.error||j(e)})},C=async e=>{t(!0);try{await (0,f.Gy)({path:"/prompts/manage",method:"POST",data:{action:"remove",_id:e}}),t(!1),w()}catch(e){(0,Z.Z)(e)}t(!0)};return(0,s.useEffect)(()=>{w()},[]),(0,r.jsxs)(i.Z,{title:"Manage prompts",isLoading:e,children:[(0,r.jsx)("div",{style:{float:"right"},children:(0,r.jsx)(a.Z,{onClick:()=>{y(!0),v(null)},variant:"contained",children:"+ Add prompt"})}),(0,r.jsx)("div",{style:{clear:"both"}}),(0,r.jsx)("br",{}),b?(0,r.jsx)(p.default,{prompt:g,open:b,onClose:()=>y(!1),onSuccess:()=>{y(!1),w()}}):null,(0,r.jsx)(l.Z,{component:o.Z,children:(0,r.jsxs)(c.Z,{sx:{minWidth:650},children:[(0,r.jsx)(d.Z,{children:(0,r.jsxs)(u.Z,{children:[(0,r.jsx)(h.Z,{children:"#"}),(0,r.jsx)(h.Z,{children:"Name"}),(0,r.jsx)(h.Z,{children:"System"}),(0,r.jsx)(h.Z,{children:"User"}),(0,r.jsx)(h.Z,{})]})}),(0,r.jsx)(x.Z,{children:n.map((e,t)=>(0,r.jsxs)(u.Z,{children:[(0,r.jsx)(h.Z,{children:t+1}),(0,r.jsx)(h.Z,{children:e.name}),(0,r.jsx)(h.Z,{children:e.system.slice(0,50)+(e.system.length>50?"...":"")}),(0,r.jsx)(h.Z,{children:e.user.slice(0,50)+(e.user.length>50?"...":"")}),(0,r.jsxs)(h.Z,{sx:{textAlign:"right"},children:[(0,r.jsx)(a.Z,{variant:"contained",color:"inherit",onClick:()=>{y(!0),v(e)},children:"Edit"})," ",(0,r.jsx)(a.Z,{variant:"contained",color:"error",onClick:()=>{(0,m.Z)({title:"Are you sure to delete",message:"This action cannot be undone",onAnswer:async t=>{t&&C(e._id)}})},children:"Delete"})]})]},e._id))})]})})]})}}},function(e){e.O(0,[2840,8360,8584,7994,6326,7231,1956,5968,8118,6427,2888,9774,179],function(){return e(e.s=93300)}),_N_E=e.O()}]);
//# sourceMappingURL=manage-prompts-58306b77f167b179.js.map
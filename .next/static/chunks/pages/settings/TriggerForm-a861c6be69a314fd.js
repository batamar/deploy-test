(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3376],{50594:function(e,t,r){"use strict";var n=r(91941);t.Z=void 0;var i=n(r(64938)),l=r(85893);t.Z=(0,i.default)((0,l.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},93946:function(e,t,r){"use strict";r.d(t,{Z:function(){return Z}});var n=r(1048),i=r(32793),l=r(67294),o=r(90512),a=r(58510),s=r(2101),d=r(90948),c=r(71657),u=r(49990),p=r(98216),f=r(1977),h=r(8027);function g(e){return(0,h.ZP)("MuiIconButton",e)}let x=(0,f.Z)("MuiIconButton",["root","disabled","colorInherit","colorPrimary","colorSecondary","colorError","colorInfo","colorSuccess","colorWarning","edgeStart","edgeEnd","sizeSmall","sizeMedium","sizeLarge"]);var b=r(85893);let v=["edge","children","className","color","disabled","disableFocusRipple","size"],m=e=>{let{classes:t,disabled:r,color:n,edge:i,size:l}=e,o={root:["root",r&&"disabled","default"!==n&&`color${(0,p.Z)(n)}`,i&&`edge${(0,p.Z)(i)}`,`size${(0,p.Z)(l)}`]};return(0,a.Z)(o,g,t)},j=(0,d.ZP)(u.Z,{name:"MuiIconButton",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,"default"!==r.color&&t[`color${(0,p.Z)(r.color)}`],r.edge&&t[`edge${(0,p.Z)(r.edge)}`],t[`size${(0,p.Z)(r.size)}`]]}})(({theme:e,ownerState:t})=>(0,i.Z)({textAlign:"center",flex:"0 0 auto",fontSize:e.typography.pxToRem(24),padding:8,borderRadius:"50%",overflow:"visible",color:(e.vars||e).palette.action.active,transition:e.transitions.create("background-color",{duration:e.transitions.duration.shortest})},!t.disableRipple&&{"&:hover":{backgroundColor:e.vars?`rgba(${e.vars.palette.action.activeChannel} / ${e.vars.palette.action.hoverOpacity})`:(0,s.Fq)(e.palette.action.active,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"start"===t.edge&&{marginLeft:"small"===t.size?-3:-12},"end"===t.edge&&{marginRight:"small"===t.size?-3:-12}),({theme:e,ownerState:t})=>{var r;let n=null==(r=(e.vars||e).palette)?void 0:r[t.color];return(0,i.Z)({},"inherit"===t.color&&{color:"inherit"},"inherit"!==t.color&&"default"!==t.color&&(0,i.Z)({color:null==n?void 0:n.main},!t.disableRipple&&{"&:hover":(0,i.Z)({},n&&{backgroundColor:e.vars?`rgba(${n.mainChannel} / ${e.vars.palette.action.hoverOpacity})`:(0,s.Fq)(n.main,e.palette.action.hoverOpacity)},{"@media (hover: none)":{backgroundColor:"transparent"}})}),"small"===t.size&&{padding:5,fontSize:e.typography.pxToRem(18)},"large"===t.size&&{padding:12,fontSize:e.typography.pxToRem(28)},{[`&.${x.disabled}`]:{backgroundColor:"transparent",color:(e.vars||e).palette.action.disabled}})});var Z=l.forwardRef(function(e,t){let r=(0,c.Z)({props:e,name:"MuiIconButton"}),{edge:l=!1,children:a,className:s,color:d="default",disabled:u=!1,disableFocusRipple:p=!1,size:f="medium"}=r,h=(0,n.Z)(r,v),g=(0,i.Z)({},r,{edge:l,color:d,disabled:u,disableFocusRipple:p,size:f}),x=m(g);return(0,b.jsx)(j,(0,i.Z)({className:(0,o.Z)(x.root,s),centerRipple:!0,focusRipple:!p,disabled:u,ref:t},h,{ownerState:g,children:a}))})},82869:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/settings/TriggerForm",function(){return r(85387)}])},87478:function(e,t,r){"use strict";var n=r(75766),i=r(85893),l=r(67294),o=r(5152),a=r.n(o);r(8645);let s=a()(async()=>{let{default:e}=await Promise.all([r.e(2937),r.e(939),r.e(7127)]).then(r.t.bind(r,71167,23)),t=e.Quill,o=t.import("blots/block/embed");class a extends o{static create(e){return super.create(e)}}return(0,n._)(a,"blotName","divider"),(0,n._)(a,"tagName","hr"),t.register({"formats/hr":a}),t=>{let{...r}=t,n=(0,l.useRef)(null),{renderExtraContent:o}=r;return r.modules={toolbar:[[{header:[1,2,!1]}],["bold","italic","underline","strike"],["blockquote","code-block"],[{list:"ordered"},{list:"bullet"}],["link","image"],["clean"]]},r.formats=["header","bold","italic","underline","strike","blockquote","code-block","list","bullet","link","image","hr","divider"],(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e,{ref:n,...r}),o&&o(n)]})}},{loadableGenerated:{webpack:()=>[71167]},ssr:!1});t.Z=s},56344:function(e,t,r){"use strict";r.d(t,{Fv:function(){return s},JU:function(){return a},bq:function(){return d}});var n=r(85893),i=r(67294),l=r(28627),o=r(82414);let a=e=>({backgroundColor:e.isDraggingOver?"#ffffff":"inherit"}),s=(e,t)=>(0,n.jsx)(l.bK,{droppableId:e,children:(e,r)=>(0,n.jsxs)("div",{ref:e.innerRef,...e.droppableProps,children:[t(r),e.placeholder]})}),d=(e,t)=>{let r=e.destination,{draggableId:n}=e;if(r){let{droppableId:e}=r;if("droppable-editor"===e&&t&&t.current){let e=t.current.getEditor(),r=e.getSelection(),i=e.getLength();r&&(i=e.getSelection().index),e.insertText(i,n)}}};t.ZP=()=>{let[e,t]=(0,i.useState)([]);(0,i.useEffect)(()=>{(0,o.Gy)({path:"/candidates/statuses/tags",method:"GET"}).then(e=>{t(e.tags)})},[]);let r=()=>(0,n.jsx)(n.Fragment,{children:e.map((e,t)=>(0,n.jsx)(l._l,{draggableId:e.value,index:t,children:t=>(0,n.jsx)("div",{ref:t.innerRef,...t.draggableProps,...t.dragHandleProps,children:(0,n.jsx)("div",{style:{backgroundColor:"#f8f8f8",padding:"5px",borderBottom:"1px solid #e0e0e0",cursor:"grab"},children:e.text})})}))});return(0,n.jsx)(n.Fragment,{children:s("initial",()=>(0,n.jsx)(n.Fragment,{children:r()}))})}},40063:function(e,t,r){"use strict";r.d(t,{FQ:function(){return p},KY:function(){return c},fF:function(){return s},fM:function(){return a},lS:function(){return u}});var n=r(85893),i=r(86886),l=r(40476),o=r(15054);let a=e=>{let{label:t,renderControl:r,isCompact:o=!1,required:a=!1}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(i.ZP,{container:!0,children:[(0,n.jsx)(i.ZP,{item:!0,flex:1,id:"label-".concat(t),children:(0,n.jsx)(l.Z,{sx:{color:"#000",fontWeight:"bold"},required:a,children:t})}),(0,n.jsx)(i.ZP,{item:!0,flex:o?6:4,children:r()})]}),(0,n.jsx)("br",{}),(0,n.jsx)("br",{})]})},s=e=>{let{router:t,totalCount:r,page:i,extraQueryParams:l={}}=e;return(0,n.jsx)(o.Z,{count:Math.ceil(r/10),page:parseInt(i,10),onChange:(e,r)=>{t.push({query:{page:r,...l}})},color:"primary",sx:{marginTop:"20px",display:"flex",justifyContent:"center"}})},d=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",c=e=>{let t="inherit",r="#fff";return"active"===e.status&&(t="#4a6cbd"),"lead"===e.status&&(t="rgb(251, 249, 185)",r="#000"),["onHold","canceled","closed"].includes(e.status)&&(t="rgb(200, 105, 80)"),"filled"===e.status&&(t="rgb(221, 160, 221)"),(0,n.jsx)("span",{style:{borderRadius:"5px",backgroundColor:t,color:r,width:"90px",padding:"2px 4px"},children:d(e.status)})},u=e=>{let t="#FA8072";return e.status||(e.status="active"),"active"===e.status&&(t="#4a6cbd"),(0,n.jsx)("span",{style:{borderRadius:"5px",backgroundColor:t,color:"#fff",width:"90px",padding:"2px 4px"},children:d(e.status)})},p=(e,t)=>(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(i.ZP,{container:!0,children:[(0,n.jsx)(i.ZP,{item:!0,flex:3,id:"label-".concat(e),children:e}),(0,n.jsx)(i.ZP,{item:!0,flex:4,children:t})]}),(0,n.jsx)("br",{})]})},69708:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(61889);function i(e){(0,n.l)({message:e.message||e.toString()})}},85387:function(e,t,r){"use strict";r.r(t);var n=r(85893),i=r(67294),l=r(61903),o=r(50657),a=r(37645),s=r(5616),d=r(93946),c=r(69417),u=r(6514),p=r(28627),f=r(50594),h=r(69708),g=r(82414),x=r(40063),b=r(87478),v=r(56344);t.default=e=>{let{onClose:t,onSuccess:r,statusId:m,trigger:j}=e,[Z,y]=(0,i.useState)((null==j?void 0:j.description)||""),[C,k]=(0,i.useState)((null==j?void 0:j.bcc)||""),[S,R]=(0,i.useState)((null==j?void 0:j.subject)||""),[F,w]=(0,i.useState)((null==j?void 0:j.body)||""),[P,_]=(0,i.useState)(!1),z=(0,i.useRef)(null),T=(0,i.useRef)(null),E=(0,i.useRef)(null),$=async()=>{if(!C||!S){(0,h.Z)("Please fill the required fields");return}_(!0);try{await (0,g.Gy)({path:"/candidates/statuses/manage-triggers",method:"POST",data:{_id:null==j?void 0:j._id,statusId:m,description:Z,bcc:C,subject:S,body:F}}),r(),_(!1)}catch(e){(0,h.Z)(e)}},I=function(e,t,r){let i,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return"To (BCC)"===t&&(i=z),"Subject"===t&&(i=T),(0,n.jsx)(n.Fragment,{children:(0,x.fM)({label:t,required:a,renderControl:()=>(0,n.jsx)(l.Z,{fullWidth:!0,value:e,onChange:e=>r(e.target.value),style:o,inputRef:i,inputProps:{autoFocus:!0}})})})};return(0,n.jsxs)(o.Z,{onClose:t,"aria-labelledby":"modal-title",fullScreen:!0,open:!0,sx:{width:"60%",left:"inherit"},children:[(0,n.jsx)(a.Z,{id:"modal-title",children:(0,n.jsxs)(s.Z,{display:"flex",alignItems:"center",children:[(0,n.jsx)(s.Z,{flexGrow:1,children:"Add trigger"}),(0,n.jsxs)(s.Z,{children:[(0,n.jsx)(d.Z,{onClick:t,children:(0,n.jsx)(f.Z,{})}),(0,n.jsx)(c.Z,{variant:"contained",color:"success",onClick:$,disabled:P,children:"Save"})]})]})}),(0,n.jsxs)(u.Z,{sx:{backgroundColor:"#f8f8f8"},children:[(0,n.jsx)("br",{}),(0,n.jsxs)(p.Z5,{onDragEnd:e=>{let t=e.destination,{draggableId:r}=e;if(t){let{droppableId:n}=t;(0,v.bq)(e,E),"droppable-bcc"===n&&(k("".concat(C).concat(r)),z&&z.current&&z.current.click()),"droppable-subject"===n&&(R("".concat(S).concat(r)),T&&T.current&&T.current.focus())}},children:[(0,v.Fv)("initial",()=>(0,n.jsxs)("div",{style:{width:"38%",float:"right",marginTop:"-20px",fontSize:"12px"},children:[(0,n.jsx)("h3",{children:"Tags"}),(0,n.jsx)("div",{style:{height:"800px",overflow:"scroll"},children:(0,n.jsx)(v.ZP,{})})]})),(0,n.jsxs)("div",{style:{width:"60%",float:"left"},children:[I(Z,"Description",y),(0,n.jsx)("hr",{})," ",(0,n.jsx)("br",{}),(0,v.Fv)("droppable-bcc",e=>I(C,"To (BCC)",k,(0,v.JU)(e),!0)),(0,v.Fv)("droppable-subject",e=>I(S,"Subject",R,(0,v.JU)(e),!0)),(0,v.Fv)("droppable-editor",e=>(0,n.jsx)(n.Fragment,{children:(0,x.fM)({label:"Body",renderControl:()=>(0,n.jsx)(b.Z,{style:{height:"300px",...(0,v.JU)(e)},value:F,onChange:e=>w(e),renderExtraContent:e=>(E=e,null)})})}))]})]})]})]})}}},function(e){e.O(0,[5062,2840,8360,8584,7994,7231,8762,9704,2888,9774,179],function(){return e(e.s=82869)}),_N_E=e.O()}]);
//# sourceMappingURL=TriggerForm-a861c6be69a314fd.js.map
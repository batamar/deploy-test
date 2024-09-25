exports.id=5387,exports.ids=[5387],exports.modules={87478:(e,t,r)=>{"use strict";r.d(t,{Z:()=>d});var l=r(20997),n=r(16689),a=r(5152),s=r.n(a);r(1791);let d=s()(async()=>{let{default:e}=await Promise.resolve().then(r.t.bind(r,12586,23)),t=e.Quill,a=t.import("blots/block/embed");class s extends a{static create(e){return super.create(e)}static blotName="divider";static tagName="hr"}return t.register({"formats/hr":s}),({...t})=>{let r=(0,n.useRef)(null),{renderExtraContent:a}=t;return t.modules={toolbar:[[{header:[1,2,!1]}],["bold","italic","underline","strike"],["blockquote","code-block"],[{list:"ordered"},{list:"bullet"}],["link","image"],["clean"]]},t.formats=["header","bold","italic","underline","strike","blockquote","code-block","list","bullet","link","image","hr","divider"],(0,l.jsxs)(l.Fragment,{children:[l.jsx(e,{ref:r,...t}),a&&a(r)]})}},{loadableGenerated:{modules:["../components/common/Editor.tsx -> react-quill"]},ssr:!1})},56344:(e,t,r)=>{"use strict";r.a(e,async(e,l)=>{try{r.d(t,{Fv:()=>c,JU:()=>o,ZP:()=>f,bq:()=>u});var n=r(20997),a=r(16689),s=r(97885),d=r(62553),i=e([d]);d=(i.then?(await i)():i)[0];let o=e=>({backgroundColor:e.isDraggingOver?"#ffffff":"inherit"}),c=(e,t)=>n.jsx(s.Droppable,{droppableId:e,children:(e,r)=>(0,n.jsxs)("div",{ref:e.innerRef,...e.droppableProps,children:[t(r),e.placeholder]})}),u=(e,t)=>{let r=e.destination,{draggableId:l}=e;if(r){let{droppableId:e}=r;if("droppable-editor"===e&&t&&t.current){let e=t.current.getEditor(),r=e.getSelection(),n=e.getLength();r&&(n=e.getSelection().index),e.insertText(n,l)}}},f=()=>{let[e,t]=(0,a.useState)([]);(0,a.useEffect)(()=>{(0,d.Gy)({path:"/candidates/statuses/tags",method:"GET"}).then(e=>{t(e.tags)})},[]);let r=()=>n.jsx(n.Fragment,{children:e.map((e,t)=>n.jsx(s.Draggable,{draggableId:e.value,index:t,children:t=>n.jsx("div",{ref:t.innerRef,...t.draggableProps,...t.dragHandleProps,children:n.jsx("div",{style:{backgroundColor:"#f8f8f8",padding:"5px",borderBottom:"1px solid #e0e0e0",cursor:"grab"},children:e.text})})}))});return n.jsx(n.Fragment,{children:c("initial",()=>n.jsx(n.Fragment,{children:r()}))})};l()}catch(e){l(e)}})},69708:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var l=r(42134);function n(e){(0,l.l)({message:e.message||e.toString()})}},83841:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{noSSR:function(){return d},default:function(){return i}});let l=r(50167),n=r(20997);r(16689);let a=l._(r(74830));function s(e){return{default:(null==e?void 0:e.default)||e}}function d(e,t){delete t.webpack,delete t.modules;let r=t.loading;return()=>(0,n.jsx)(r,{error:null,isLoading:!0,pastDelay:!1,timedOut:!1})}function i(e,t){let r=a.default,l={loading:e=>{let{error:t,isLoading:r,pastDelay:l}=e;return null}};e instanceof Promise?l.loader=()=>e:"function"==typeof e?l.loader=e:"object"==typeof e&&(l={...l,...e});let n=(l={...l,...t}).loader;return(l.loadableGenerated&&(l={...l,...l.loadableGenerated},delete l.loadableGenerated),"boolean"!=typeof l.ssr||l.ssr)?r({...l,loader:()=>null!=n?n().then(s):Promise.resolve(s(()=>null))}):(delete l.webpack,delete l.modules,d(r,l))}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},85387:(e,t,r)=>{"use strict";r.a(e,async(e,l)=>{try{r.r(t),r.d(t,{default:()=>D});var n=r(20997),a=r(16689),s=r(7988),d=r.n(s),i=r(53456),o=r.n(i),c=r(17155),u=r.n(c),f=r(9285),b=r.n(f),p=r(86024),h=r.n(p),x=r(86096),g=r.n(x),j=r(45845),m=r.n(j),v=r(97885),y=r(4173),k=r.n(y),S=r(69708),C=r(62553),P=r(40063),F=r(87478),w=r(56344),_=e([C,w]);[C,w]=_.then?(await _)():_;let D=({onClose:e,onSuccess:t,statusId:r,trigger:l})=>{let[s,i]=(0,a.useState)(l?.description||""),[c,f]=(0,a.useState)(l?.bcc||""),[p,x]=(0,a.useState)(l?.subject||""),[j,y]=(0,a.useState)(l?.body||""),[_,D]=(0,a.useState)(!1),G=(0,a.useRef)(null),R=(0,a.useRef)(null),O=(0,a.useRef)(null),T=async()=>{if(!c||!p){(0,S.Z)("Please fill the required fields");return}D(!0);try{await (0,C.Gy)({path:"/candidates/statuses/manage-triggers",method:"POST",data:{_id:l?._id,statusId:r,description:s,bcc:c,subject:p,body:j}}),t(),D(!1)}catch(e){(0,S.Z)(e)}},Z=(e,t,r,l={},a=!1)=>{let s;return"To (BCC)"===t&&(s=G),"Subject"===t&&(s=R),n.jsx(n.Fragment,{children:(0,P.fM)({label:t,required:a,renderControl:()=>n.jsx(d(),{fullWidth:!0,value:e,onChange:e=>r(e.target.value),style:l,inputRef:s,inputProps:{autoFocus:!0}})})})};return(0,n.jsxs)(o(),{onClose:e,"aria-labelledby":"modal-title",fullScreen:!0,open:!0,sx:{width:"60%",left:"inherit"},children:[n.jsx(u(),{id:"modal-title",children:(0,n.jsxs)(b(),{display:"flex",alignItems:"center",children:[n.jsx(b(),{flexGrow:1,children:"Add trigger"}),(0,n.jsxs)(b(),{children:[n.jsx(h(),{onClick:e,children:n.jsx(k(),{})}),n.jsx(g(),{variant:"contained",color:"success",onClick:T,disabled:_,children:"Save"})]})]})}),(0,n.jsxs)(m(),{sx:{backgroundColor:"#f8f8f8"},children:[n.jsx("br",{}),(0,n.jsxs)(v.DragDropContext,{onDragEnd:e=>{let t=e.destination,{draggableId:r}=e;if(t){let{droppableId:l}=t;(0,w.bq)(e,O),"droppable-bcc"===l&&(f(`${c}${r}`),G&&G.current&&G.current.click()),"droppable-subject"===l&&(x(`${p}${r}`),R&&R.current&&R.current.focus())}},children:[(0,w.Fv)("initial",()=>(0,n.jsxs)("div",{style:{width:"38%",float:"right",marginTop:"-20px",fontSize:"12px"},children:[n.jsx("h3",{children:"Tags"}),n.jsx("div",{style:{height:"800px",overflow:"scroll"},children:n.jsx(w.ZP,{})})]})),(0,n.jsxs)("div",{style:{width:"60%",float:"left"},children:[Z(s,"Description",i),n.jsx("hr",{})," ",n.jsx("br",{}),(0,w.Fv)("droppable-bcc",e=>Z(c,"To (BCC)",f,(0,w.JU)(e),!0)),(0,w.Fv)("droppable-subject",e=>Z(p,"Subject",x,(0,w.JU)(e),!0)),(0,w.Fv)("droppable-editor",e=>n.jsx(n.Fragment,{children:(0,P.fM)({label:"Body",renderControl:()=>n.jsx(F.Z,{style:{height:"300px",...(0,w.JU)(e)},value:j,onChange:e=>y(e),renderExtraContent:e=>(O=e,null)})})}))]})]})]})]})};l()}catch(e){l(e)}})},1791:()=>{},74830:(e,t,r)=>{"use strict";e.exports=r(87093).vendored.contexts.Loadable},5152:(e,t,r)=>{e.exports=r(83841)}};
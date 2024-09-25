exports.id=6424,exports.ids=[6424],exports.modules={70405:(e,t,s)=>{"use strict";s.a(e,async(e,r)=>{try{s.d(t,{e:()=>h,k:()=>d});var n=s(20997),a=s(11163),i=s(16689),o=s(62553),l=e([o]);o=(l.then?(await l)():l)[0];let c=(0,i.createContext)(void 0),d=()=>(0,i.useContext)(c),h=({children:e})=>{(0,a.useRouter)();let[t,s]=(0,i.useState)(null),[r,l]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{(async()=>{try{let e=await (0,o.DE)();e.user&&s(e.user),l(!1)}catch(e){}})()},[]),n.jsx(c.Provider,{value:{user:t,loadingUser:r},children:e})};r()}catch(e){r(e)}})},90433:(e,t,s)=>{"use strict";let r;s.d(t,{Z:()=>b,y:()=>r});var n=s(20997),a=s(53819),i=s.n(a),o=s(8611),l=s.n(o),c=s(29404),d=s.n(c),h=s(1094),p=s.n(h),u=s(32268),x=s.n(u),m=s(52468),y=s.n(m),f=s(16689),j=s.n(f);class g extends j().Component{constructor(e){super(e),this.state={open:!1,title:"Are you sure?",message:"",onAnswer:null},r=this.openConfirmDialog}render(){return(0,n.jsxs)(l(),{open:this.state.open,onClose:this.handleClose,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",children:[n.jsx(y(),{id:"alert-dialog-title",children:this.state.title}),n.jsx(p(),{children:n.jsx(x(),{id:"alert-dialog-description",children:this.state.message})}),(0,n.jsxs)(d(),{style:{padding:"10px"},children:[n.jsx(i(),{onClick:this.handleClose,variant:"contained",color:"inherit",autoFocus:!0,children:"Cancel"}),n.jsx(i(),{onClick:this.handleYes,variant:"contained",color:"primary",children:"OK"})]})]})}handleClose=()=>{this.setState({open:!1}),this.state.onAnswer(!1)};handleYes=()=>{this.setState({open:!1}),this.state.onAnswer(!0)};openConfirmDialog=({title:e,message:t,onAnswer:s})=>{this.setState({open:!0,title:e,message:t,onAnswer:s})}}let b=g},42134:(e,t,s)=>{"use strict";let r;s.d(t,{Z:()=>d,l:()=>r});var n=s(20997),a=s(79174),i=s.n(a),o=s(16689),l=s.n(o);class c extends l().PureComponent{constructor(e){super(e),r=this.openSnackbar,this.state={open:!1,message:""}}render(){let e=n.jsx("span",{id:"snackbar-message-id",dangerouslySetInnerHTML:{__html:this.state.message}});return n.jsx(i(),{anchorOrigin:{vertical:"top",horizontal:"right"},message:e,autoHideDuration:5e3,onClose:this.handleSnackbarClose,open:this.state.open,ContentProps:{"aria-describedby":"snackbar-message-id"}})}handleSnackbarClose=()=>{this.setState({open:!1,message:""})};openSnackbar=({message:e})=>{this.setState({open:!0,message:e})}}let d=c},40063:(e,t,s)=>{"use strict";s.d(t,{FQ:()=>m,KY:()=>u,fF:()=>h,fM:()=>d,lS:()=>x});var r=s(20997),n=s(17373),a=s.n(n),i=s(48301),o=s.n(i),l=s(85886),c=s.n(l);let d=({label:e,renderControl:t,isCompact:s=!1,required:n=!1})=>(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(a(),{container:!0,children:[r.jsx(a(),{item:!0,flex:1,id:`label-${e}`,children:r.jsx(o(),{sx:{color:"#000",fontWeight:"bold"},required:n,children:e})}),r.jsx(a(),{item:!0,flex:s?6:4,children:t()})]}),r.jsx("br",{}),r.jsx("br",{})]}),h=({router:e,totalCount:t,page:s,extraQueryParams:n={}})=>r.jsx(c(),{count:Math.ceil(t/10),page:parseInt(s,10),onChange:(t,s)=>{e.push({query:{page:s,...n}})},color:"primary",sx:{marginTop:"20px",display:"flex",justifyContent:"center"}}),p=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",u=e=>{let t="inherit",s="#fff";return"active"===e.status&&(t="#4a6cbd"),"lead"===e.status&&(t="rgb(251, 249, 185)",s="#000"),["onHold","canceled","closed"].includes(e.status)&&(t="rgb(200, 105, 80)"),"filled"===e.status&&(t="rgb(221, 160, 221)"),r.jsx("span",{style:{borderRadius:"5px",backgroundColor:t,color:s,width:"90px",padding:"2px 4px"},children:p(e.status)})},x=e=>{let t="#FA8072";return e.status||(e.status="active"),"active"===e.status&&(t="#4a6cbd"),r.jsx("span",{style:{borderRadius:"5px",backgroundColor:t,color:"#fff",width:"90px",padding:"2px 4px"},children:p(e.status)})},m=(e,t)=>(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(a(),{container:!0,children:[r.jsx(a(),{item:!0,flex:3,id:`label-${e}`,children:e}),r.jsx(a(),{item:!0,flex:4,children:t})]}),r.jsx("br",{})]})},99727:(e,t,s)=>{"use strict";function r(e){return Object.keys(e).filter(t=>!!e[t]).map(t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`).join("&")}s.d(t,{m:()=>r})},62553:(e,t,s)=>{"use strict";s.a(e,async(e,r)=>{try{s.d(t,{Ap:()=>c,DE:()=>o,Gy:()=>l,pJ:()=>d,zH:()=>i});var n=s(40186),a=e([n]);n=(a.then?(await a)():a)[0];let i=e=>e?e.headers.host:"",o=()=>(0,n.Z)("/get-user",{method:"GET"}),l=({path:e,data:t,method:s="POST"})=>(0,n.Z)(e,{method:s,body:t&&JSON.stringify(t)}),c=e=>fetch(`${i()}/upload-file`,{method:"post",body:e,credentials:"include"}),d=e=>e&&e.includes("http")?e:`${i()}/read-file?key=${e}`;r()}catch(e){r(e)}})},40186:(e,t,s)=>{"use strict";s.a(e,async(e,r)=>{try{s.d(t,{Z:()=>l});var n=s(12134),a=s(99727),i=s(62553),o=e([n,i]);async function l(e,t={}){let s=Object.assign({},t.headers||{},t.externalServer?{}:{"Content-type":"application/json; charset=UTF-8"}),{request:r}=t;r&&r.headers&&r.headers.cookie&&(s.cookie=r.headers.cookie);let n=t.qs&&`?${(0,a.m)(t.qs)}`||"",o=await fetch(t.externalServer?`${e}${n}`:`${(0,i.zH)()}${e}${n}`,Object.assign({method:"POST",credentials:"include"},t,{headers:s})),l=await o.text();if(o.status>=400)throw Error(l);try{return JSON.parse(l)}catch(e){if(e instanceof SyntaxError)return l;throw e}}[n,i]=o.then?(await o)():o,r()}catch(e){r(e)}})},46232:(e,t,s)=>{"use strict";s.d(t,{H:()=>a,Q:()=>i});var r=s(18442);let n={},a=(0,r.createTheme)({components:n,palette:{mode:"dark",background:{default:"#0d1117"},text:{primary:"#c9d1d9"}},typography:{fontFamily:"IBM Plex Mono,monospace",button:{textTransform:"none"}}}),i=(0,r.createTheme)({components:n,palette:{mode:"light",background:{default:"#f6f9fc"},text:{primary:"#222"}},typography:{fontFamily:"IBM Plex Mono,monospace",button:{textTransform:"none"},fontSize:13}})},61484:(e,t,s)=>{"use strict";s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{default:()=>m});var n=s(20997),a=s(16689),i=s(11163),o=s(18442),l=s(94960),c=s.n(l);s(39605),s(81688),s(68434);var d=s(70405),h=s(42134),p=s(90433),u=s(46232),x=e([d]);d=(x.then?(await x)():x)[0];let m=({Component:e,pageProps:t})=>{let s=(0,i.useRouter)();return(0,a.useEffect)(()=>{},[s]),n.jsx(d.e,{children:(0,n.jsxs)(o.ThemeProvider,{theme:u.Q,children:[n.jsx(c(),{}),n.jsx(e,{...t}),n.jsx(h.Z,{}),n.jsx(p.Z,{})]})})};r()}catch(e){r(e)}})},36100:(e,t,s)=>{"use strict";s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{default:()=>u});var n=s(20997),a=s(56859),i=s.n(a),o=s(16689),l=s.n(o),c=s(730),d=s(8440),h=e([c,d]);[c,d]=h.then?(await h)():h;class p extends i(){static getInitialProps=async e=>{let t=e.renderPage,s=(0,d.default)({key:"css"}),{extractCriticalToChunks:r}=(0,c.default)(s);e.renderPage=()=>t({enhanceApp:e=>t=>n.jsx(e,{emotionCache:s,...t})});let a=await i().getInitialProps(e),o=r(a.html).styles.map(e=>n.jsx("style",{"data-emotion":`${e.key} ${e.ids.join(" ")}`,dangerouslySetInnerHTML:{__html:e.css}},e.key));return{...a,styles:[...l().Children.toArray(a.styles),...o]}};render(){return(0,n.jsxs)(a.Html,{lang:"en",children:[(0,n.jsxs)(a.Head,{children:[n.jsx("meta",{charSet:"utf-8"}),n.jsx("meta",{name:"theme-color",content:"#303030"}),n.jsx("link",{rel:"shortcut icon",href:"/favicon-32x32.png"}),n.jsx("link",{rel:"stylesheet",href:"/fonts/server.css"}),n.jsx("link",{rel:"stylesheet",href:"pdf_viewer.min.css"}),n.jsx("link",{rel:"stylesheet",href:"https://prosemirror.net/css/editor.css"}),n.jsx("script",{src:"scripts/pdf.min.js"})]}),(0,n.jsxs)("body",{children:[n.jsx(a.Main,{}),n.jsx(a.NextScript,{})]})]})}}let u=p;r()}catch(e){r(e)}})},39605:()=>{}};
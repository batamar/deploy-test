(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9610],{31432:function(e,t,l){(window.__NEXT_P=window.__NEXT_P||[]).push(["/client",function(){return l(41989)}])},83841:function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var l in t)Object.defineProperty(e,l,{enumerable:!0,get:t[l]})}(t,{noSSR:function(){return s},default:function(){return i}});let a=l(38754);l(85893),l(67294);let n=a._(l(28354));function r(e){return{default:(null==e?void 0:e.default)||e}}function s(e,t){return delete t.webpack,delete t.modules,e(t)}function i(e,t){let l=n.default,a={loading:e=>{let{error:t,isLoading:l,pastDelay:a}=e;return null}};e instanceof Promise?a.loader=()=>e:"function"==typeof e?a.loader=e:"object"==typeof e&&(a={...a,...e});let i=(a={...a,...t}).loader;return(a.loadableGenerated&&(a={...a,...a.loadableGenerated},delete a.loadableGenerated),"boolean"!=typeof a.ssr||a.ssr)?l({...a,loader:()=>null!=i?i().then(r):Promise.resolve(r(()=>null))}):(delete a.webpack,delete a.modules,s(l,a))}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},77309:function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return a}});let a=l(38754)._(l(67294)).default.createContext(null)},28354:function(e,t,l){"use strict";/**
@copyright (c) 2017-present James Kyle <me@thejameskyle.com>
 MIT License
 Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
*/Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return h}});let a=l(38754)._(l(67294)),n=l(77309),r=[],s=[],i=!1;function o(e){let t=e(),l={loading:!0,loaded:null,error:null};return l.promise=t.then(e=>(l.loading=!1,l.loaded=e,e)).catch(e=>{throw l.loading=!1,l.error=e,e}),l}class d{promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};let{_res:e,_opts:t}=this;e.loading&&("number"==typeof t.delay&&(0===t.delay?this._state.pastDelay=!0:this._delay=setTimeout(()=>{this._update({pastDelay:!0})},t.delay)),"number"==typeof t.timeout&&(this._timeout=setTimeout(()=>{this._update({timedOut:!0})},t.timeout))),this._res.promise.then(()=>{this._update({}),this._clearTimeouts()}).catch(e=>{this._update({}),this._clearTimeouts()}),this._update({})}_update(e){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...e},this._callbacks.forEach(e=>e())}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(e){return this._callbacks.add(e),()=>{this._callbacks.delete(e)}}constructor(e,t){this._loadFn=e,this._opts=t,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}}function u(e){return function(e,t){let l=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},t),r=null;function o(){if(!r){let t=new d(e,l);r={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return r.promise()}if(!i){let e=l.webpack?l.webpack():l.modules;e&&s.push(t=>{for(let l of e)if(t.includes(l))return o()})}function u(e,t){!function(){o();let e=a.default.useContext(n.LoadableContext);e&&Array.isArray(l.modules)&&l.modules.forEach(t=>{e(t)})}();let s=a.default.useSyncExternalStore(r.subscribe,r.getCurrentValue,r.getCurrentValue);return a.default.useImperativeHandle(t,()=>({retry:r.retry}),[]),a.default.useMemo(()=>{var t;return s.loading||s.error?a.default.createElement(l.loading,{isLoading:s.loading,pastDelay:s.pastDelay,timedOut:s.timedOut,error:s.error,retry:r.retry}):s.loaded?a.default.createElement((t=s.loaded)&&t.default?t.default:t,e):null},[e,s])}return u.preload=()=>o(),u.displayName="LoadableComponent",a.default.forwardRef(u)}(o,e)}function c(e,t){let l=[];for(;e.length;){let a=e.pop();l.push(a(t))}return Promise.all(l).then(()=>{if(e.length)return c(e,t)})}u.preloadAll=()=>new Promise((e,t)=>{c(r).then(e,t)}),u.preloadReady=e=>(void 0===e&&(e=[]),new Promise(t=>{let l=()=>(i=!0,t());c(s,e).then(l,l)})),window.__NEXT_PRELOADREADY=u.preloadReady;let h=u},41989:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return k}});var a=l(85893),n=l(67294),r=l(30381),s=l.n(r),i=l(11163),o=l(86427),d=l(90629),u=l(61903),c=l(18360),h=l(22224),f=l(86886),p=l(69417),m=l(82414),x=l(87478),b=l(87535),j=l(94296),y=l(69708),_=l(66062),g=l(40063),v=l(41664),Z=l.n(v),C=l(81458),S=l(72882),P=l(7906),w=l(295),E=l(53816),O=l(53252),T=e=>{let{clientId:t,onChange:l}=e,[r,s]=(0,n.useState)(!1),[i,o]=(0,n.useState)(),u=()=>{s(!0),(0,m.Gy)({path:"/clients/jobs?clientId=".concat(t),method:"GET"}).then(e=>{s(!1),!e.error&&(o(e),l&&l())})};return(0,n.useEffect)(()=>{u()},[t]),r?(0,a.jsx)(C.Z,{}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(f.ZP,{container:!0,justifyContent:"space-between",alignItems:"center",children:(0,a.jsx)(f.ZP,{item:!0,children:(0,a.jsx)("h3",{children:"Jobs"})})}),(0,a.jsx)(S.Z,{component:d.Z,children:(0,a.jsx)(P.Z,{children:(0,a.jsx)(w.Z,{children:(i||[]).map(e=>(0,a.jsxs)(E.Z,{sx:{"&:last-child td, &:last-child th":{border:0}},children:[(0,a.jsxs)(O.Z,{children:[(0,a.jsx)(Z(),{href:"job?id=".concat(e._id),children:e.title}),(0,a.jsx)("br",{}),e.location]}),(0,a.jsx)(O.Z,{children:(0,g.KY)(e)})]},e._id))})})})]})},k=()=>{let e=(0,i.useRouter)(),[t,l]=(0,n.useState)(!1),[r,v]=(0,n.useState)(),[Z,C]=(0,n.useState)(""),[S,P]=(0,n.useState)(""),[w,E]=(0,n.useState)(""),[O,k]=(0,n.useState)(""),[D,N]=(0,n.useState)(""),[A,R]=(0,n.useState)(""),[V,I]=(0,n.useState)({}),L=()=>{if(e.isReady){let{query:t}=e;l(!0),(0,m.Gy)({path:"/clients/detail?_id=".concat(t.id),method:"GET"}).then(e=>{l(!1),e.error||(v(e),C(e.logo),R(e.status),P(e.name),E(e.websiteUrl),k(e.companyEmailAddress),I(e.address||{}),N(e.notes))})}},{id:G}=e.query;(0,n.useEffect)(()=>{L()},[G]);let M=(e,t)=>(0,m.Gy)({path:"/clients/update-field",method:"POST",data:{clientId:r._id,...e}}).then(e=>{!e.error&&(L(),(0,y.Z)("Success"),t&&t())}),U=(e,t)=>M({type:"update-simple-field",fieldName:e,value:t}),W=e=>{M({type:"add-attachment",value:e})},F=e=>{M({type:"remove-attachment",value:e})},Y=()=>{M({type:"update-simple-field",fieldName:"notes",value:D})};if(!r)return(0,a.jsx)(o.Z,{title:"",isLoading:t,children:" "});let H={padding:"10px 20px",marginBottom:"20px",marginRight:"10px"};return(0,a.jsx)(o.Z,{title:(0,a.jsxs)(f.ZP,{container:!0,children:[Z?(0,a.jsx)("img",{style:{borderRadius:"50px",height:"30px",marginRight:"10px"},src:(0,m.pJ)(Z)}):null,r.name]}),isLoading:t,children:(0,a.jsxs)(f.ZP,{container:!0,flexDirection:"row",children:[(0,a.jsxs)(f.ZP,{item:!0,flex:1,children:[(0,a.jsxs)(d.Z,{sx:H,children:[(0,a.jsx)("h3",{children:"Primary"}),(0,a.jsx)("br",{}),(0,a.jsx)(_.Z,{fieldName:"logo",label:"Logo",value:Z?(0,a.jsx)("img",{height:50,src:(0,m.pJ)(Z)}):null,editControl:()=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(j.Z,{label:"Upload",showList:!1,multiple:!1,onChange:e=>{C(e.url)}}),(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),Z?(0,a.jsx)("img",{height:50,src:(0,m.pJ)(Z)}):null]}),onSave:()=>U("logo",Z)}),(0,a.jsx)(_.Z,{fieldName:"name",label:"Name",value:r.name,editControl:()=>(0,a.jsx)(u.Z,{sx:_.D,defaultValue:r.name,onChange:e=>{P(e.target.value)}}),onSave:()=>U("name",S)}),(0,a.jsx)(_.Z,{fieldName:"websiteUrl",label:"Website",value:r.websiteUrl,editControl:()=>(0,a.jsx)(u.Z,{sx:_.D,defaultValue:r.websiteUrl,onChange:e=>{E(e.target.value)}}),onSave:()=>U("websiteUrl",w)}),(0,a.jsx)(_.Z,{fieldName:"companyEmailAddress",label:"Company email",value:r.companyEmailAddress,editControl:()=>(0,a.jsx)(u.Z,{sx:_.D,defaultValue:r.companyEmailAddress,onChange:e=>{k(e.target.value)}}),onSave:()=>U("companyEmailAddress",O)}),(0,a.jsx)(_.Z,{fieldName:"status",label:"Status",value:(0,g.lS)(r),editControl:()=>(0,a.jsxs)(c.Z,{sx:_.D,labelId:"status-select-label",defaultValue:r.status,onChange:e=>R(e.target.value),children:[(0,a.jsx)(h.Z,{value:"active",children:"Active"}),(0,a.jsx)(h.Z,{value:"onHold",children:"InActive/On Hold"})]}),onSave:()=>U("status",A)}),(0,a.jsx)(_.Z,{fieldName:"address",label:"Address",value:r.address?(0,a.jsxs)("span",{children:[r.address.state,", ",r.address.city]}):null,editControl:()=>(0,a.jsxs)("div",{children:[(0,a.jsx)(u.Z,{fullWidth:!0,multiline:!0,rows:2,label:"Street",defaultValue:V.street,onChange:e=>{V.street=e.target.value,I(V)}})," ",(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),(0,a.jsx)(u.Z,{fullWidth:!0,label:"City",defaultValue:V.city,onChange:e=>{V.city=e.target.value,I(V)}})," ",(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),(0,a.jsx)(u.Z,{fullWidth:!0,label:"State",defaultValue:V.state,onChange:e=>{V.state=e.target.value,I(V)}})," ",(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),(0,a.jsx)(u.Z,{fullWidth:!0,label:"Zip Code",defaultValue:V.zipcode,onChange:e=>{V.zipcode=e.target.value,I(V)}})," ",(0,a.jsx)("br",{}),(0,a.jsx)("br",{})]}),onSave:()=>U("address",V)}),(0,g.FQ)("Created Date",s()(r.createdAt).format("MM/DD/YYYY"))]}),(0,a.jsxs)(d.Z,{sx:{...H,height:"500px"},children:[(0,a.jsxs)(f.ZP,{container:!0,justifyContent:"space-between",alignItems:"center",children:[(0,a.jsx)(f.ZP,{item:!0,children:(0,a.jsx)("h3",{children:"Notes"})}),(0,a.jsx)(f.ZP,{item:!0,children:(0,a.jsx)(p.Z,{size:"small",onClick:()=>{Y()},variant:"contained",children:"Save"})})]}),(0,a.jsx)(x.Z,{style:{height:"300px"},value:D,onChange:e=>N(e)})]})]}),(0,a.jsxs)(f.ZP,{item:!0,flex:1,children:[(0,a.jsx)(d.Z,{sx:H,children:(0,a.jsx)(T,{clientId:r._id})}),(0,a.jsx)(d.Z,{sx:H,children:(0,a.jsx)(b.Z,{files:r.attachments,onDelete:e=>{F(e)},rightSide:(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(j.Z,{label:"Add atachment",showList:!1,multiple:!1,onChange:e=>{W(e)}})})})})]})]})})}},8645:function(){},5152:function(e,t,l){e.exports=l(83841)},92703:function(e,t,l){"use strict";var a=l(50414);function n(){}function r(){}r.resetWarningCache=n,e.exports=function(){function e(e,t,l,n,r,s){if(s!==a){var i=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function t(){return e}e.isRequired=e;var l={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:r,resetWarningCache:n};return l.PropTypes=l,l}},45697:function(e,t,l){e.exports=l(92703)()},50414:function(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}},function(e){e.O(0,[4885,2840,8360,8584,7994,6326,7231,1956,5968,8118,8762,1664,6427,2889,2888,9774,179],function(){return e(e.s=31432)}),_N_E=e.O()}]);
//# sourceMappingURL=client-9aed8611eb185bc2.js.map
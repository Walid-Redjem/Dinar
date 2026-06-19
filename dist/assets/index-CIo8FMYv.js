const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Landing-D-Wn4Hlz.js","assets/vendor-motion-B5i6Y3Oa.js","assets/vendor-react-D4Jfxrgv.js","assets/vendor-firebase-B_1RFV3u.js","assets/button-DCnTRSIs.js","assets/vendor-charts-Dlwaej1J.js","assets/vendor-ui-CcYJDMWo.js","assets/dialog-nE2-h2sl.js","assets/index-BNwdmFrq.js","assets/index-BLyta4_B.js","assets/index-CgqtHrr7.js","assets/sonner-IwuX-6nv.js","assets/Login-CjK332--.js","assets/input-BKK39ww0.js","assets/label-CG6QLBxW.js","assets/ThemeToggle-CSh_u79r.js","assets/PhoneVerification-DCqSpURP.js","assets/IdentityVerification-Bx8szTk2.js","assets/Dashboard-CkCx5vqZ.js","assets/card-Cm56Qmjb.js","assets/badge-BL44kjLH.js","assets/PageTransition-B63e2P4a.js","assets/EmptyState-Bh2Jrq1E.js","assets/Settings-CQTyLYvW.js","assets/Admin-BwjNvxXw.js","assets/Contact-DqTs_zVZ.js","assets/NotFound-CJUkqQRa.js"])))=>i.map(i=>d[i]);
var tt=Object.defineProperty;var nt=(e,t,n)=>t in e?tt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var le=(e,t,n)=>nt(e,typeof t!="symbol"?t+"":t,n);import{j as u}from"./vendor-motion-B5i6Y3Oa.js";import{r as rt}from"./vendor-ui-CcYJDMWo.js";import{a as m,u as Te,b as st,d as at,e as it,f as ot}from"./vendor-react-D4Jfxrgv.js";import{r as F,_ as M,C as $,a as U,E as Ae,o as ct,F as Ee,L as lt,g as Z,i as ut,b as dt,v as ft,c as ue,d as mt,e as pt,f as ht,h as gt,j as yt,k as wt,l as bt,m as xe,n as Se,p as _e}from"./vendor-firebase-B_1RFV3u.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();var O={},de;function It(){if(de)return O;de=1;var e=rt();return O.createRoot=e.createRoot,O.hydrateRoot=e.hydrateRoot,O}var vt=It(),Tt=(e,t,n,s,r,a,i,o)=>{let c=document.documentElement,l=["light","dark"];function f(h){(Array.isArray(e)?e:[e]).forEach(I=>{let L=I==="class",K=L&&a?r.map(C=>a[C]||C):r;L?(c.classList.remove(...K),c.classList.add(a&&a[h]?a[h]:h)):c.setAttribute(I,h)}),p(h)}function p(h){o&&l.includes(h)&&(c.style.colorScheme=h)}function d(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(s)f(s);else try{let h=localStorage.getItem(t)||n,I=i&&h==="system"?d():h;f(I)}catch{}},fe=["light","dark"],ke="(prefers-color-scheme: dark)",At=typeof window>"u",ee=m.createContext(void 0),Et={setTheme:e=>{},themes:[]},Ir=()=>{var e;return(e=m.useContext(ee))!=null?e:Et},xt=e=>m.useContext(ee)?m.createElement(m.Fragment,null,e.children):m.createElement(_t,{...e}),St=["light","dark"],_t=({forcedTheme:e,disableTransitionOnChange:t=!1,enableSystem:n=!0,enableColorScheme:s=!0,storageKey:r="theme",themes:a=St,defaultTheme:i=n?"system":"light",attribute:o="data-theme",value:c,children:l,nonce:f,scriptProps:p})=>{let[d,h]=m.useState(()=>Rt(r,i)),[I,L]=m.useState(()=>d==="system"?H():d),K=c?Object.values(c):a,C=m.useCallback(g=>{let y=g;if(!y)return;g==="system"&&n&&(y=H());let P=c?c[y]:y,oe=t?Ct(f):null,j=document.documentElement,ce=k=>{k==="class"?(j.classList.remove(...K),P&&j.classList.add(P)):k.startsWith("data-")&&(P?j.setAttribute(k,P):j.removeAttribute(k))};if(Array.isArray(o)?o.forEach(ce):ce(o),s){let k=fe.includes(i)?i:null,et=fe.includes(y)?y:k;j.style.colorScheme=et}oe==null||oe()},[f]),D=m.useCallback(g=>{let y=typeof g=="function"?g(d):g;h(y);try{localStorage.setItem(r,y)}catch{}},[d]),N=m.useCallback(g=>{let y=H(g);L(y),d==="system"&&n&&!e&&C("system")},[d,e]);m.useEffect(()=>{let g=window.matchMedia(ke);return g.addListener(N),N(g),()=>g.removeListener(N)},[N]),m.useEffect(()=>{let g=y=>{y.key===r&&(y.newValue?h(y.newValue):D(i))};return window.addEventListener("storage",g),()=>window.removeEventListener("storage",g)},[D]),m.useEffect(()=>{C(e??d)},[e,d]);let Ze=m.useMemo(()=>({theme:d,setTheme:D,forcedTheme:e,resolvedTheme:d==="system"?I:d,themes:n?[...a,"system"]:a,systemTheme:n?I:void 0}),[d,D,e,I,n,a]);return m.createElement(ee.Provider,{value:Ze},m.createElement(kt,{forcedTheme:e,storageKey:r,attribute:o,enableSystem:n,enableColorScheme:s,defaultTheme:i,value:c,themes:a,nonce:f,scriptProps:p}),l)},kt=m.memo(({forcedTheme:e,storageKey:t,attribute:n,enableSystem:s,enableColorScheme:r,defaultTheme:a,value:i,themes:o,nonce:c,scriptProps:l})=>{let f=JSON.stringify([n,t,a,e,o,i,s,r]).slice(1,-1);return m.createElement("script",{...l,suppressHydrationWarning:!0,nonce:typeof window>"u"?c:"",dangerouslySetInnerHTML:{__html:`(${Tt.toString()})(${f})`}})}),Rt=(e,t)=>{if(At)return;let n;try{n=localStorage.getItem(e)||void 0}catch{}return n||t},Ct=e=>{let t=document.createElement("style");return e&&t.setAttribute("nonce",e),t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},H=e=>(e||(e=window.matchMedia(ke)),e.matches?"dark":"light");const Pt="modulepreload",jt=function(e){return"/"+e},me={},A=function(t,n,s){let r=Promise.resolve();if(n&&n.length>0){let i=function(l){return Promise.all(l.map(f=>Promise.resolve(f).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=i(n.map(l=>{if(l=jt(l),l in me)return;me[l]=!0;const f=l.endsWith(".css"),p=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${p}`))return;const d=document.createElement("link");if(d.rel=f?"stylesheet":Pt,f||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),f)return new Promise((h,I)=>{d.addEventListener("load",h),d.addEventListener("error",()=>I(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&a(o.reason);return t().catch(a)})},Re="@firebase/installations",te="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce=1e4,Pe=`w:${te}`,je="FIS_v2",Lt="https://firebaseinstallations.googleapis.com/v1",Dt=3600*1e3,Nt="installations",Ot="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},S=new Ae(Nt,Ot,Ft);function Le(e){return e instanceof Ee&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function De({projectId:e}){return`${Lt}/projects/${e}/installations`}function Ne(e){return{token:e.token,requestStatus:2,expiresIn:$t(e.expiresIn),creationTime:Date.now()}}async function Oe(e,t){const s=(await t.json()).error;return S.create("request-failed",{requestName:e,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function Fe({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Mt(e,{refreshToken:t}){const n=Fe(e);return n.append("Authorization",qt(t)),n}async function Me(e){const t=await e();return t.status>=500&&t.status<600?e():t}function $t(e){return Number(e.replace("s","000"))}function qt(e){return`${je} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vt({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const s=De(e),r=Fe(e),a=t.getImmediate({optional:!0});if(a){const l=await a.getHeartbeatsHeader();l&&r.append("x-firebase-client",l)}const i={fid:n,authVersion:je,appId:e.appId,sdkVersion:Pe},o={method:"POST",headers:r,body:JSON.stringify(i)},c=await Me(()=>fetch(s,o));if(c.ok){const l=await c.json();return{fid:l.fid||n,registrationStatus:2,refreshToken:l.refreshToken,authToken:Ne(l.authToken)}}else throw await Oe("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $e(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt=/^[cdef][\w-]{21}$/,X="";function zt(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Gt(e);return Bt.test(n)?n:X}catch{return X}}function Gt(e){return Ut(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qe=new Map;function Ve(e,t){const n=B(e);Ue(n,t),Kt(n,t)}function Ue(e,t){const n=qe.get(e);if(n)for(const s of n)s(t)}function Kt(e,t){const n=Ht();n&&n.postMessage({key:e,fid:t}),Wt()}let x=null;function Ht(){return!x&&"BroadcastChannel"in self&&(x=new BroadcastChannel("[Firebase] FID Change"),x.onmessage=e=>{Ue(e.data.key,e.data.fid)}),x}function Wt(){qe.size===0&&x&&(x.close(),x=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="firebase-installations-database",Jt=1,_="firebase-installations-store";let W=null;function ne(){return W||(W=ct(Yt,Jt,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(_)}}})),W}async function q(e,t){const n=B(e),r=(await ne()).transaction(_,"readwrite"),a=r.objectStore(_),i=await a.get(n);return await a.put(t,n),await r.done,(!i||i.fid!==t.fid)&&Ve(e,t.fid),t}async function Be(e){const t=B(e),s=(await ne()).transaction(_,"readwrite");await s.objectStore(_).delete(t),await s.done}async function z(e,t){const n=B(e),r=(await ne()).transaction(_,"readwrite"),a=r.objectStore(_),i=await a.get(n),o=t(i);return o===void 0?await a.delete(n):await a.put(o,n),await r.done,o&&(!i||i.fid!==o.fid)&&Ve(e,o.fid),o}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function re(e){let t;const n=await z(e.appConfig,s=>{const r=Qt(s),a=Xt(e,r);return t=a.registrationPromise,a.installationEntry});return n.fid===X?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Qt(e){const t=e||{fid:zt(),registrationStatus:0};return ze(t)}function Xt(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(S.create("app-offline"));return{installationEntry:t,registrationPromise:r}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},s=Zt(e,n);return{installationEntry:n,registrationPromise:s}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:en(e)}:{installationEntry:t}}async function Zt(e,t){try{const n=await Vt(e,t);return q(e.appConfig,n)}catch(n){throw Le(n)&&n.customData.serverCode===409?await Be(e.appConfig):await q(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function en(e){let t=await pe(e.appConfig);for(;t.registrationStatus===1;)await $e(100),t=await pe(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await re(e);return s||n}return t}function pe(e){return z(e,t=>{if(!t)throw S.create("installation-not-found");return ze(t)})}function ze(e){return tn(e)?{fid:e.fid,registrationStatus:0}:e}function tn(e){return e.registrationStatus===1&&e.registrationTime+Ce<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nn({appConfig:e,heartbeatServiceProvider:t},n){const s=rn(e,n),r=Mt(e,n),a=t.getImmediate({optional:!0});if(a){const l=await a.getHeartbeatsHeader();l&&r.append("x-firebase-client",l)}const i={installation:{sdkVersion:Pe,appId:e.appId}},o={method:"POST",headers:r,body:JSON.stringify(i)},c=await Me(()=>fetch(s,o));if(c.ok){const l=await c.json();return Ne(l)}else throw await Oe("Generate Auth Token",c)}function rn(e,{fid:t}){return`${De(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function se(e,t=!1){let n;const s=await z(e.appConfig,a=>{if(!Ge(a))throw S.create("not-registered");const i=a.authToken;if(!t&&on(i))return a;if(i.requestStatus===1)return n=sn(e,t),a;{if(!navigator.onLine)throw S.create("app-offline");const o=ln(a);return n=an(e,o),o}});return n?await n:s.authToken}async function sn(e,t){let n=await he(e.appConfig);for(;n.authToken.requestStatus===1;)await $e(100),n=await he(e.appConfig);const s=n.authToken;return s.requestStatus===0?se(e,t):s}function he(e){return z(e,t=>{if(!Ge(t))throw S.create("not-registered");const n=t.authToken;return un(n)?{...t,authToken:{requestStatus:0}}:t})}async function an(e,t){try{const n=await nn(e,t),s={...t,authToken:n};return await q(e.appConfig,s),n}catch(n){if(Le(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await Be(e.appConfig);else{const s={...t,authToken:{requestStatus:0}};await q(e.appConfig,s)}throw n}}function Ge(e){return e!==void 0&&e.registrationStatus===2}function on(e){return e.requestStatus===2&&!cn(e)}function cn(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Dt}function ln(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function un(e){return e.requestStatus===1&&e.requestTime+Ce<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dn(e){const t=e,{installationEntry:n,registrationPromise:s}=await re(t);return s?s.catch(console.error):se(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fn(e,t=!1){const n=e;return await mn(n),(await se(n,t)).token}async function mn(e){const{registrationPromise:t}=await re(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(e){if(!e||!e.options)throw Y("App Configuration");if(!e.name)throw Y("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw Y(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Y(e){return S.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="installations",hn="installations-internal",gn=e=>{const t=e.getProvider("app").getImmediate(),n=pn(t),s=U(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},yn=e=>{const t=e.getProvider("app").getImmediate(),n=U(t,Ke).getImmediate();return{getId:()=>dn(n),getToken:r=>fn(n,r)}};function wn(){M(new $(Ke,gn,"PUBLIC")),M(new $(hn,yn,"PRIVATE"))}wn();F(Re,te);F(Re,te,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V="analytics",bn="firebase_id",In="origin",vn=60*1e3,Tn="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ae="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w=new lt("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},b=new Ae("analytics","Analytics",An);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(e){if(!e.startsWith(ae)){const t=b.create("invalid-gtag-resource",{gtagURL:e});return w.warn(t.message),""}return e}function He(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function xn(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function Sn(e,t){const n=xn("firebase-js-sdk-policy",{createScriptURL:En}),s=document.createElement("script"),r=`${ae}?l=${e}&id=${t}`;s.src=n?n==null?void 0:n.createScriptURL(r):r,s.async=!0,document.head.appendChild(s)}function _n(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function kn(e,t,n,s,r,a){const i=s[r];try{if(i)await t[i];else{const c=(await He(n)).find(l=>l.measurementId===r);c&&await t[c.appId]}}catch(o){w.error(o)}e("config",r,a)}async function Rn(e,t,n,s,r){try{let a=[];if(r&&r.send_to){let i=r.send_to;Array.isArray(i)||(i=[i]);const o=await He(n);for(const c of i){const l=o.find(p=>p.measurementId===c),f=l&&t[l.appId];if(f)a.push(f);else{a=[];break}}}a.length===0&&(a=Object.values(t)),await Promise.all(a),e("event",s,r||{})}catch(a){w.error(a)}}function Cn(e,t,n,s){async function r(a,...i){try{if(a==="event"){const[o,c]=i;await Rn(e,t,n,o,c)}else if(a==="config"){const[o,c]=i;await kn(e,t,n,s,o,c)}else if(a==="consent"){const[o,c]=i;e("consent",o,c)}else if(a==="get"){const[o,c,l]=i;e("get",o,c,l)}else if(a==="set"){const[o]=i;e("set",o)}else e(a,...i)}catch(o){w.error(o)}}return r}function Pn(e,t,n,s,r){let a=function(...i){window[s].push(arguments)};return window[r]&&typeof window[r]=="function"&&(a=window[r]),window[r]=Cn(a,e,t,n),{gtagCore:a,wrappedGtag:window[r]}}function jn(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(ae)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ln=30,Dn=1e3;class Nn{constructor(t={},n=Dn){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const We=new Nn;function On(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Fn(e){var i;const{appId:t,apiKey:n}=e,s={method:"GET",headers:On(n)},r=Tn.replace("{app-id}",t),a=await fetch(r,s);if(a.status!==200&&a.status!==304){let o="";try{const c=await a.json();(i=c.error)!=null&&i.message&&(o=c.error.message)}catch{}throw b.create("config-fetch-failed",{httpStatus:a.status,responseMessage:o})}return a.json()}async function Mn(e,t=We,n){const{appId:s,apiKey:r,measurementId:a}=e.options;if(!s)throw b.create("no-app-id");if(!r){if(a)return{measurementId:a,appId:s};throw b.create("no-api-key")}const i=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},o=new Vn;return setTimeout(async()=>{o.abort()},vn),Ye({appId:s,apiKey:r,measurementId:a},i,o,t)}async function Ye(e,{throttleEndTimeMillis:t,backoffCount:n},s,r=We){var o;const{appId:a,measurementId:i}=e;try{await $n(s,t)}catch(c){if(i)return w.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${i} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:a,measurementId:i};throw c}try{const c=await Fn(e);return r.deleteThrottleMetadata(a),c}catch(c){const l=c;if(!qn(l)){if(r.deleteThrottleMetadata(a),i)return w.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${i} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:a,measurementId:i};throw c}const f=Number((o=l==null?void 0:l.customData)==null?void 0:o.httpStatus)===503?ue(n,r.intervalMillis,Ln):ue(n,r.intervalMillis),p={throttleEndTimeMillis:Date.now()+f,backoffCount:n+1};return r.setThrottleMetadata(a,p),w.debug(`Calling attemptFetch again in ${f} millis`),Ye(e,p,s,r)}}function $n(e,t){return new Promise((n,s)=>{const r=Math.max(t-Date.now(),0),a=setTimeout(n,r);e.addEventListener(()=>{clearTimeout(a),s(b.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function qn(e){if(!(e instanceof Ee)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class Vn{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function Un(e,t,n,s,r){if(r&&r.global){e("event",n,s);return}else{const a=await t,i={...s,send_to:a};e("event",n,i)}}async function Bn(e,t,n,s){if(s&&s.global){const r={};for(const a of Object.keys(n))r[`user_properties.${a}`]=n[a];return e("set",r),Promise.resolve()}else{const r=await t;e("config",r,{update:!0,user_properties:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zn(){if(dt())try{await ft()}catch(e){return w.warn(b.create("indexeddb-unavailable",{errorInfo:e==null?void 0:e.toString()}).message),!1}else return w.warn(b.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Gn(e,t,n,s,r,a,i){const o=Mn(e);o.then(d=>{n[d.measurementId]=d.appId,e.options.measurementId&&d.measurementId!==e.options.measurementId&&w.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${d.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(d=>w.error(d)),t.push(o);const c=zn().then(d=>{if(d)return s.getId()}),[l,f]=await Promise.all([o,c]);jn(a)||Sn(a,l.measurementId),r("js",new Date);const p=(i==null?void 0:i.config)??{};return p[In]="firebase",p.update=!0,f!=null&&(p[bn]=f),r("config",l.measurementId,p),l.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(t){this.app=t}_delete(){return delete R[this.app.options.appId],Promise.resolve()}}let R={},ge=[];const ye={};let J="dataLayer",Hn="gtag",we,ie,be=!1;function Wn(){const e=[];if(ut()&&e.push("This is a browser extension environment."),ht()||e.push("Cookies are not available."),e.length>0){const t=e.map((s,r)=>`(${r+1}) ${s}`).join(" "),n=b.create("invalid-analytics-context",{errorInfo:t});w.warn(n.message)}}function Yn(e,t,n){Wn();const s=e.options.appId;if(!s)throw b.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)w.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw b.create("no-api-key");if(R[s]!=null)throw b.create("already-exists",{id:s});if(!be){_n(J);const{wrappedGtag:a,gtagCore:i}=Pn(R,ge,ye,J,Hn);ie=a,we=i,be=!0}return R[s]=Gn(e,ge,ye,t,we,J,n),new Kn(e)}function Jn(e=mt()){e=Z(e);const t=U(e,V);return t.isInitialized()?t.getImmediate():Qn(e)}function Qn(e,t={}){const n=U(e,V);if(n.isInitialized()){const r=n.getImmediate();if(pt(t,n.getOptions()))return r;throw b.create("already-initialized")}return n.initialize({options:t})}function Xn(e,t,n){e=Z(e),Bn(ie,R[e.app.options.appId],t,n).catch(s=>w.error(s))}function Zn(e,t,n,s){e=Z(e),Un(ie,R[e.app.options.appId],t,n,s).catch(r=>w.error(r))}const Ie="@firebase/analytics",ve="0.10.22";function er(){M(new $(V,(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),r=t.getProvider("installations-internal").getImmediate();return Yn(s,r,n)},"PUBLIC")),M(new $("analytics-internal",e,"PRIVATE")),F(Ie,ve),F(Ie,ve,"esm2020");function e(t){try{const n=t.getProvider(V).getImmediate();return{logEvent:(s,r,a)=>Zn(n,s,r,a),setUserProperties:(s,r)=>Xn(n,s,r)}}catch(n){throw b.create("interop-component-reg-failed",{reason:n})}}}er();const tr={apiKey:"AIzaSyDCHWMA1TeGtbx0dMh-AwNVwnIIsb7RUb8",authDomain:"dinar-8b9ca.firebaseapp.com",projectId:"dinar-8b9ca",storageBucket:"dinar-8b9ca.firebasestorage.app",messagingSenderId:"696543534966",appId:"1:696543534966:web:67f4169cfd3ee07006e457"},G=gt(tr),Je=yt(G),Qe=wt(G);bt(G);Jn(G);function Q({children:e}){const t=Te(),n=st(),[s,r]=m.useState(!0),[a,i]=m.useState(!1);return m.useEffect(()=>{r(!0),i(!1);const o=xe(Je,async c=>{if(!c){t("/"),r(!1);return}try{const l=await Se(_e(Qe,"users",c.uid));if(!l.exists()){t("/signup"),r(!1);return}const{idUploaded:f,isAdmin:p}=l.data();if(p){t("/admin"),r(!1);return}const d=n.pathname==="/verify-identity";if(!f&&!d){t("/verify-identity"),r(!1);return}if(f&&d){t("/dashboard"),r(!1);return}i(!0),r(!1)}catch(l){console.error("ProtectedRoute auth check failed:",l),i(!0),r(!1)}});return()=>o()},[t,n.pathname]),s?u.jsx("div",{className:"min-h-screen flex items-center justify-center",children:u.jsx("div",{className:"w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"})}):a?u.jsx(u.Fragment,{children:e}):null}function nr({children:e}){const t=Te(),[n,s]=m.useState(!0),[r,a]=m.useState(!1);return m.useEffect(()=>{const i=xe(Je,async o=>{if(!o){t("/"),s(!1);return}try{const c=await Se(_e(Qe,"users",o.uid));if(!c.exists()||!c.data().isAdmin){t("/dashboard"),s(!1);return}a(!0),s(!1)}catch{t("/"),s(!1)}});return()=>i()},[t]),n?u.jsx("div",{className:"min-h-screen flex items-center justify-center",children:u.jsx("div",{className:"w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"})}):r?u.jsx(u.Fragment,{children:e}):null}const E=e=>m.lazy(()=>e().catch(()=>(window.location.reload(),new Promise(()=>{})))),rr=E(()=>A(()=>import("./Landing-D-Wn4Hlz.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),sr=E(()=>A(()=>import("./Login-CjK332--.js"),__vite__mapDeps([12,1,2,3,4,5,6,13,14,10,11,15]))),ar=E(()=>A(()=>import("./PhoneVerification-DCqSpURP.js"),__vite__mapDeps([16,1,2,4,5,6,13,11,15,3]))),ir=E(()=>A(()=>import("./IdentityVerification-Bx8szTk2.js"),__vite__mapDeps([17,1,2,4,5,6,11,15,3]))),or=E(()=>A(()=>import("./Dashboard-CkCx5vqZ.js"),__vite__mapDeps([18,1,2,3,4,5,6,19,20,9,8,10,21,13,14,11,15,22]))),cr=E(()=>A(()=>import("./Settings-CQTyLYvW.js"),__vite__mapDeps([23,1,2,3,4,5,6,19,13,14,10,20,9,21,11,15]))),lr=E(()=>A(()=>import("./Admin-BwjNvxXw.js"),__vite__mapDeps([24,1,2,15,4,5,6,22,3,13,14,10,20,7,8,9,11]))),ur=E(()=>A(()=>import("./Contact-DqTs_zVZ.js"),__vite__mapDeps([25,1,2,3,4,5,6,13,14,10,11]))),dr=E(()=>A(()=>import("./NotFound-CJUkqQRa.js"),__vite__mapDeps([26,1,2,4,5,6,19]))),Xe=()=>u.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-50",children:u.jsx("div",{className:"w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"})});function v(){var t,n;const e=it();return(t=e==null?void 0:e.message)!=null&&t.includes("MIME")||(n=e==null?void 0:e.message)!=null&&n.includes("Failed to fetch dynamically")?(window.location.reload(),u.jsx(Xe,{})):u.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-50",children:u.jsxs("div",{className:"text-center",children:[u.jsx("p",{className:"text-xl font-bold text-gray-900 mb-2",children:"Something went wrong"}),u.jsx("p",{className:"text-gray-500 mb-4",children:"Please refresh the page."}),u.jsx("button",{onClick:()=>window.location.reload(),className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",children:"Refresh"})]})})}const T=e=>u.jsx(m.Suspense,{fallback:u.jsx(Xe,{}),children:e}),fr=at([{path:"/",element:T(u.jsx(rr,{})),errorElement:u.jsx(v,{})},{path:"/login",element:T(u.jsx(sr,{})),errorElement:u.jsx(v,{})},{path:"/signup",element:T(u.jsx(ar,{})),errorElement:u.jsx(v,{})},{path:"/verify-identity",element:T(u.jsx(Q,{children:u.jsx(ir,{})})),errorElement:u.jsx(v,{})},{path:"/dashboard",element:T(u.jsx(Q,{children:u.jsx(or,{})})),errorElement:u.jsx(v,{})},{path:"/settings",element:T(u.jsx(Q,{children:u.jsx(cr,{})})),errorElement:u.jsx(v,{})},{path:"/admin",element:T(u.jsx(nr,{children:u.jsx(lr,{})})),errorElement:u.jsx(v,{})},{path:"/contact",element:T(u.jsx(ur,{})),errorElement:u.jsx(v,{})},{path:"*",element:T(u.jsx(dr,{})),errorElement:u.jsx(v,{})}]);class mr extends m.Component{constructor(){super(...arguments);le(this,"state",{hasError:!1,message:""})}static getDerivedStateFromError(n){return{hasError:!0,message:n.message??"Unknown error"}}render(){return this.state.hasError?u.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-50 px-4",children:u.jsxs("div",{className:"text-center max-w-sm",children:[u.jsx("div",{className:"w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",children:u.jsx("svg",{className:"w-8 h-8 text-red-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:u.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"})})}),u.jsx("h1",{className:"text-xl font-bold text-gray-900 mb-2",children:"Something went wrong"}),u.jsx("p",{className:"text-gray-500 text-sm mb-6",children:"An unexpected error occurred. Please refresh the page."}),u.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm",children:"Refresh page"})]})}):this.props.children}}function pr(){return u.jsx(mr,{children:u.jsx(xt,{attribute:"class",defaultTheme:"dark",enableSystem:!1,children:u.jsx(ot,{router:fr})})})}vt.createRoot(document.getElementById("root")).render(u.jsx(pr,{}));export{Je as a,Qe as d,Ir as z};

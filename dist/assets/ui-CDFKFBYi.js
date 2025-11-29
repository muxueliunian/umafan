import{h as e}from"./vue-BjDFopHP.js";
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),o=e=>{const t=(e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,o)=>o?o.toUpperCase():t.toLowerCase()))(e);return t.charAt(0).toUpperCase()+t.slice(1)},r=(...e)=>e.filter((e,t,o)=>Boolean(e)&&""!==e.trim()&&o.indexOf(e)===t).join(" ").trim(),s=e=>""===e;
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=({name:i,iconNode:l,absoluteStrokeWidth:d,"absolute-stroke-width":n,strokeWidth:h,"stroke-width":c,size:k=a.width,color:p=a.stroke,...w},{slots:u})=>e("svg",{...a,...w,width:k,height:k,stroke:p,"stroke-width":s(d)||s(n)||!0===d||!0===n?24*Number(h||c||a["stroke-width"])/Number(k):h||c||a["stroke-width"],class:r("lucide",w.class,...i?[`lucide-${t(o(i))}-icon`,`lucide-${t(i)}`]:["lucide-icon"])},[...l.map(t=>e(...t)),...u.default?[u.default()]:[]]),l=(t,o)=>(r,{slots:s,attrs:a})=>e(i,{...a,...r,iconNode:o,name:t},s),d=l("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),n=l("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]),h=l("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */export{d as A,n as T,h as Z};

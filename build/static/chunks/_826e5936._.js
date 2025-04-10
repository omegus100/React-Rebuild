(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/client/node_modules/turbo-stream/dist/turbo-stream.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/utils.ts
__turbopack_context__.s({
    "decode": (()=>decode),
    "encode": (()=>encode)
});
var HOLE = -1;
var NAN = -2;
var NEGATIVE_INFINITY = -3;
var NEGATIVE_ZERO = -4;
var NULL = -5;
var POSITIVE_INFINITY = -6;
var UNDEFINED = -7;
var TYPE_BIGINT = "B";
var TYPE_DATE = "D";
var TYPE_ERROR = "E";
var TYPE_MAP = "M";
var TYPE_NULL_OBJECT = "N";
var TYPE_PROMISE = "P";
var TYPE_REGEXP = "R";
var TYPE_SET = "S";
var TYPE_SYMBOL = "Y";
var TYPE_URL = "U";
var TYPE_PREVIOUS_RESOLVED = "Z";
var Deferred = class {
    promise;
    resolve;
    reject;
    constructor(){
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
};
function createLineSplittingTransform() {
    const decoder = new TextDecoder();
    let leftover = "";
    return new TransformStream({
        transform (chunk, controller) {
            const str = decoder.decode(chunk, {
                stream: true
            });
            const parts = (leftover + str).split("\n");
            leftover = parts.pop() || "";
            for (const part of parts){
                controller.enqueue(part);
            }
        },
        flush (controller) {
            if (leftover) {
                controller.enqueue(leftover);
            }
        }
    });
}
// src/flatten.ts
function flatten(input) {
    const { indices } = this;
    const existing = indices.get(input);
    if (existing) return [
        existing
    ];
    if (input === void 0) return UNDEFINED;
    if (input === null) return NULL;
    if (Number.isNaN(input)) return NAN;
    if (input === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY;
    if (input === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY;
    if (input === 0 && 1 / input < 0) return NEGATIVE_ZERO;
    const index = this.index++;
    indices.set(input, index);
    stringify.call(this, input, index);
    return index;
}
function stringify(input, index) {
    const { deferred, plugins, postPlugins } = this;
    const str = this.stringified;
    const stack = [
        [
            input,
            index
        ]
    ];
    while(stack.length > 0){
        const [input2, index2] = stack.pop();
        const partsForObj = (obj)=>Object.keys(obj).map((k)=>`"_${flatten.call(this, k)}":${flatten.call(this, obj[k])}`).join(",");
        let error = null;
        switch(typeof input2){
            case "boolean":
            case "number":
            case "string":
                str[index2] = JSON.stringify(input2);
                break;
            case "bigint":
                str[index2] = `["${TYPE_BIGINT}","${input2}"]`;
                break;
            case "symbol":
                {
                    const keyFor = Symbol.keyFor(input2);
                    if (!keyFor) {
                        error = new Error("Cannot encode symbol unless created with Symbol.for()");
                    } else {
                        str[index2] = `["${TYPE_SYMBOL}",${JSON.stringify(keyFor)}]`;
                    }
                    break;
                }
            case "object":
                {
                    if (!input2) {
                        str[index2] = `${NULL}`;
                        break;
                    }
                    const isArray = Array.isArray(input2);
                    let pluginHandled = false;
                    if (!isArray && plugins) {
                        for (const plugin of plugins){
                            const pluginResult = plugin(input2);
                            if (Array.isArray(pluginResult)) {
                                pluginHandled = true;
                                const [pluginIdentifier, ...rest] = pluginResult;
                                str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
                                if (rest.length > 0) {
                                    str[index2] += `,${rest.map((v)=>flatten.call(this, v)).join(",")}`;
                                }
                                str[index2] += "]";
                                break;
                            }
                        }
                    }
                    if (!pluginHandled) {
                        let result = isArray ? "[" : "{";
                        if (isArray) {
                            for(let i = 0; i < input2.length; i++)result += (i ? "," : "") + (i in input2 ? flatten.call(this, input2[i]) : HOLE);
                            str[index2] = `${result}]`;
                        } else if (input2 instanceof Date) {
                            str[index2] = `["${TYPE_DATE}",${input2.getTime()}]`;
                        } else if (input2 instanceof URL) {
                            str[index2] = `["${TYPE_URL}",${JSON.stringify(input2.href)}]`;
                        } else if (input2 instanceof RegExp) {
                            str[index2] = `["${TYPE_REGEXP}",${JSON.stringify(input2.source)},${JSON.stringify(input2.flags)}]`;
                        } else if (input2 instanceof Set) {
                            if (input2.size > 0) {
                                str[index2] = `["${TYPE_SET}",${[
                                    ...input2
                                ].map((val)=>flatten.call(this, val)).join(",")}]`;
                            } else {
                                str[index2] = `["${TYPE_SET}"]`;
                            }
                        } else if (input2 instanceof Map) {
                            if (input2.size > 0) {
                                str[index2] = `["${TYPE_MAP}",${[
                                    ...input2
                                ].flatMap(([k, v])=>[
                                        flatten.call(this, k),
                                        flatten.call(this, v)
                                    ]).join(",")}]`;
                            } else {
                                str[index2] = `["${TYPE_MAP}"]`;
                            }
                        } else if (input2 instanceof Promise) {
                            str[index2] = `["${TYPE_PROMISE}",${index2}]`;
                            deferred[index2] = input2;
                        } else if (input2 instanceof Error) {
                            str[index2] = `["${TYPE_ERROR}",${JSON.stringify(input2.message)}`;
                            if (input2.name !== "Error") {
                                str[index2] += `,${JSON.stringify(input2.name)}`;
                            }
                            str[index2] += "]";
                        } else if (Object.getPrototypeOf(input2) === null) {
                            str[index2] = `["${TYPE_NULL_OBJECT}",{${partsForObj(input2)}}]`;
                        } else if (isPlainObject(input2)) {
                            str[index2] = `{${partsForObj(input2)}}`;
                        } else {
                            error = new Error("Cannot encode object with prototype");
                        }
                    }
                    break;
                }
            default:
                {
                    const isArray = Array.isArray(input2);
                    let pluginHandled = false;
                    if (!isArray && plugins) {
                        for (const plugin of plugins){
                            const pluginResult = plugin(input2);
                            if (Array.isArray(pluginResult)) {
                                pluginHandled = true;
                                const [pluginIdentifier, ...rest] = pluginResult;
                                str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
                                if (rest.length > 0) {
                                    str[index2] += `,${rest.map((v)=>flatten.call(this, v)).join(",")}`;
                                }
                                str[index2] += "]";
                                break;
                            }
                        }
                    }
                    if (!pluginHandled) {
                        error = new Error("Cannot encode function or unexpected type");
                    }
                }
        }
        if (error) {
            let pluginHandled = false;
            if (postPlugins) {
                for (const plugin of postPlugins){
                    const pluginResult = plugin(input2);
                    if (Array.isArray(pluginResult)) {
                        pluginHandled = true;
                        const [pluginIdentifier, ...rest] = pluginResult;
                        str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
                        if (rest.length > 0) {
                            str[index2] += `,${rest.map((v)=>flatten.call(this, v)).join(",")}`;
                        }
                        str[index2] += "]";
                        break;
                    }
                }
            }
            if (!pluginHandled) {
                throw error;
            }
        }
    }
}
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject(thing) {
    const proto = Object.getPrototypeOf(thing);
    return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}
// src/unflatten.ts
var globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
function unflatten(parsed) {
    const { hydrated, values } = this;
    if (typeof parsed === "number") return hydrate.call(this, parsed);
    if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
    const startIndex = values.length;
    for (const value of parsed){
        values.push(value);
    }
    hydrated.length = values.length;
    return hydrate.call(this, startIndex);
}
function hydrate(index) {
    const { hydrated, values, deferred, plugins } = this;
    let result;
    const stack = [
        [
            index,
            (v)=>{
                result = v;
            }
        ]
    ];
    let postRun = [];
    while(stack.length > 0){
        const [index2, set] = stack.pop();
        switch(index2){
            case UNDEFINED:
                set(void 0);
                continue;
            case NULL:
                set(null);
                continue;
            case NAN:
                set(NaN);
                continue;
            case POSITIVE_INFINITY:
                set(Infinity);
                continue;
            case NEGATIVE_INFINITY:
                set(-Infinity);
                continue;
            case NEGATIVE_ZERO:
                set(-0);
                continue;
        }
        if (hydrated[index2]) {
            set(hydrated[index2]);
            continue;
        }
        const value = values[index2];
        if (!value || typeof value !== "object") {
            hydrated[index2] = value;
            set(value);
            continue;
        }
        if (Array.isArray(value)) {
            if (typeof value[0] === "string") {
                const [type, b, c] = value;
                switch(type){
                    case TYPE_DATE:
                        set(hydrated[index2] = new Date(b));
                        continue;
                    case TYPE_URL:
                        set(hydrated[index2] = new URL(b));
                        continue;
                    case TYPE_BIGINT:
                        set(hydrated[index2] = BigInt(b));
                        continue;
                    case TYPE_REGEXP:
                        set(hydrated[index2] = new RegExp(b, c));
                        continue;
                    case TYPE_SYMBOL:
                        set(hydrated[index2] = Symbol.for(b));
                        continue;
                    case TYPE_SET:
                        const newSet = /* @__PURE__ */ new Set();
                        hydrated[index2] = newSet;
                        for(let i = 1; i < value.length; i++)stack.push([
                            value[i],
                            (v)=>{
                                newSet.add(v);
                            }
                        ]);
                        set(newSet);
                        continue;
                    case TYPE_MAP:
                        const map = /* @__PURE__ */ new Map();
                        hydrated[index2] = map;
                        for(let i = 1; i < value.length; i += 2){
                            const r = [];
                            stack.push([
                                value[i + 1],
                                (v)=>{
                                    r[1] = v;
                                }
                            ]);
                            stack.push([
                                value[i],
                                (k)=>{
                                    r[0] = k;
                                }
                            ]);
                            postRun.push(()=>{
                                map.set(r[0], r[1]);
                            });
                        }
                        set(map);
                        continue;
                    case TYPE_NULL_OBJECT:
                        const obj = /* @__PURE__ */ Object.create(null);
                        hydrated[index2] = obj;
                        for (const key of Object.keys(b).reverse()){
                            const r = [];
                            stack.push([
                                b[key],
                                (v)=>{
                                    r[1] = v;
                                }
                            ]);
                            stack.push([
                                Number(key.slice(1)),
                                (k)=>{
                                    r[0] = k;
                                }
                            ]);
                            postRun.push(()=>{
                                obj[r[0]] = r[1];
                            });
                        }
                        set(obj);
                        continue;
                    case TYPE_PROMISE:
                        if (hydrated[b]) {
                            set(hydrated[index2] = hydrated[b]);
                        } else {
                            const d = new Deferred();
                            deferred[b] = d;
                            set(hydrated[index2] = d.promise);
                        }
                        continue;
                    case TYPE_ERROR:
                        const [, message, errorType] = value;
                        let error = errorType && globalObj && globalObj[errorType] ? new globalObj[errorType](message) : new Error(message);
                        hydrated[index2] = error;
                        set(error);
                        continue;
                    case TYPE_PREVIOUS_RESOLVED:
                        set(hydrated[index2] = hydrated[b]);
                        continue;
                    default:
                        if (Array.isArray(plugins)) {
                            const r = [];
                            const vals = value.slice(1);
                            for(let i = 0; i < vals.length; i++){
                                const v = vals[i];
                                stack.push([
                                    v,
                                    (v2)=>{
                                        r[i] = v2;
                                    }
                                ]);
                            }
                            postRun.push(()=>{
                                for (const plugin of plugins){
                                    const result2 = plugin(value[0], ...r);
                                    if (result2) {
                                        set(hydrated[index2] = result2.value);
                                        return;
                                    }
                                }
                                throw new SyntaxError();
                            });
                            continue;
                        }
                        throw new SyntaxError();
                }
            } else {
                const array = [];
                hydrated[index2] = array;
                for(let i = 0; i < value.length; i++){
                    const n = value[i];
                    if (n !== HOLE) {
                        stack.push([
                            n,
                            (v)=>{
                                array[i] = v;
                            }
                        ]);
                    }
                }
                set(array);
                continue;
            }
        } else {
            const object = {};
            hydrated[index2] = object;
            for (const key of Object.keys(value).reverse()){
                const r = [];
                stack.push([
                    value[key],
                    (v)=>{
                        r[1] = v;
                    }
                ]);
                stack.push([
                    Number(key.slice(1)),
                    (k)=>{
                        r[0] = k;
                    }
                ]);
                postRun.push(()=>{
                    object[r[0]] = r[1];
                });
            }
            set(object);
            continue;
        }
    }
    while(postRun.length > 0){
        postRun.pop()();
    }
    return result;
}
// src/turbo-stream.ts
async function decode(readable, options) {
    const { plugins } = options ?? {};
    const done = new Deferred();
    const reader = readable.pipeThrough(createLineSplittingTransform()).getReader();
    const decoder = {
        values: [],
        hydrated: [],
        deferred: {},
        plugins
    };
    const decoded = await decodeInitial.call(decoder, reader);
    let donePromise = done.promise;
    if (decoded.done) {
        done.resolve();
    } else {
        donePromise = decodeDeferred.call(decoder, reader).then(done.resolve).catch((reason)=>{
            for (const deferred of Object.values(decoder.deferred)){
                deferred.reject(reason);
            }
            done.reject(reason);
        });
    }
    return {
        done: donePromise.then(()=>reader.closed),
        value: decoded.value
    };
}
async function decodeInitial(reader) {
    const read = await reader.read();
    if (!read.value) {
        throw new SyntaxError();
    }
    let line;
    try {
        line = JSON.parse(read.value);
    } catch (reason) {
        throw new SyntaxError();
    }
    return {
        done: read.done,
        value: unflatten.call(this, line)
    };
}
async function decodeDeferred(reader) {
    let read = await reader.read();
    while(!read.done){
        if (!read.value) continue;
        const line = read.value;
        switch(line[0]){
            case TYPE_PROMISE:
                {
                    const colonIndex = line.indexOf(":");
                    const deferredId = Number(line.slice(1, colonIndex));
                    const deferred = this.deferred[deferredId];
                    if (!deferred) {
                        throw new Error(`Deferred ID ${deferredId} not found in stream`);
                    }
                    const lineData = line.slice(colonIndex + 1);
                    let jsonLine;
                    try {
                        jsonLine = JSON.parse(lineData);
                    } catch (reason) {
                        throw new SyntaxError();
                    }
                    const value = unflatten.call(this, jsonLine);
                    deferred.resolve(value);
                    break;
                }
            case TYPE_ERROR:
                {
                    const colonIndex = line.indexOf(":");
                    const deferredId = Number(line.slice(1, colonIndex));
                    const deferred = this.deferred[deferredId];
                    if (!deferred) {
                        throw new Error(`Deferred ID ${deferredId} not found in stream`);
                    }
                    const lineData = line.slice(colonIndex + 1);
                    let jsonLine;
                    try {
                        jsonLine = JSON.parse(lineData);
                    } catch (reason) {
                        throw new SyntaxError();
                    }
                    const value = unflatten.call(this, jsonLine);
                    deferred.reject(value);
                    break;
                }
            default:
                throw new SyntaxError();
        }
        read = await reader.read();
    }
}
function encode(input, options) {
    const { plugins, postPlugins, signal } = options ?? {};
    const encoder = {
        deferred: {},
        index: 0,
        indices: /* @__PURE__ */ new Map(),
        stringified: [],
        plugins,
        postPlugins,
        signal
    };
    const textEncoder = new TextEncoder();
    let lastSentIndex = 0;
    const readable = new ReadableStream({
        async start (controller) {
            const id = flatten.call(encoder, input);
            if (Array.isArray(id)) {
                throw new Error("This should never happen");
            }
            if (id < 0) {
                controller.enqueue(textEncoder.encode(`${id}
`));
            } else {
                controller.enqueue(textEncoder.encode(`[${encoder.stringified.join(",")}]
`));
                lastSentIndex = encoder.stringified.length - 1;
            }
            const seenPromises = /* @__PURE__ */ new WeakSet();
            while(Object.keys(encoder.deferred).length > 0){
                for (const [deferredId, deferred] of Object.entries(encoder.deferred)){
                    if (seenPromises.has(deferred)) continue;
                    seenPromises.add(encoder.deferred[Number(deferredId)] = raceSignal(deferred, encoder.signal).then((resolved)=>{
                        const id2 = flatten.call(encoder, resolved);
                        if (Array.isArray(id2)) {
                            controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`));
                            encoder.index++;
                            lastSentIndex++;
                        } else if (id2 < 0) {
                            controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:${id2}
`));
                        } else {
                            const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                            controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:[${values}]
`));
                            lastSentIndex = encoder.stringified.length - 1;
                        }
                    }, (reason)=>{
                        if (!reason || typeof reason !== "object" || !(reason instanceof Error)) {
                            reason = new Error("An unknown error occurred");
                        }
                        const id2 = flatten.call(encoder, reason);
                        if (Array.isArray(id2)) {
                            controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`));
                            encoder.index++;
                            lastSentIndex++;
                        } else if (id2 < 0) {
                            controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:${id2}
`));
                        } else {
                            const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                            controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:[${values}]
`));
                            lastSentIndex = encoder.stringified.length - 1;
                        }
                    }).finally(()=>{
                        delete encoder.deferred[Number(deferredId)];
                    }));
                }
                await Promise.race(Object.values(encoder.deferred));
            }
            await Promise.all(Object.values(encoder.deferred));
            controller.close();
        }
    });
    return readable;
}
function raceSignal(promise, signal) {
    if (!signal) return promise;
    if (signal.aborted) return Promise.reject(signal.reason || new Error("Signal was aborted."));
    const abort = new Promise((resolve, reject)=>{
        signal.addEventListener("abort", (event)=>{
            reject(signal.reason || new Error("Signal was aborted."));
        });
        promise.then(resolve).catch(reject);
    });
    abort.catch(()=>{});
    return Promise.race([
        abort,
        promise
    ]);
}
;
}}),
"[project]/client/node_modules/react-router/node_modules/cookie/dist/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parse = parse;
exports.serialize = serialize;
/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 *
 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
 * Allow same range as cookie value, except `=`, which delimits end of name.
 */ const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 *
 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
 */ const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */ const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */ const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
const __toString = Object.prototype.toString;
const NullObject = /* @__PURE__ */ (()=>{
    const C = function() {};
    C.prototype = Object.create(null);
    return C;
})();
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */ function parse(str, options) {
    const obj = new NullObject();
    const len = str.length;
    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
    if (len < 2) return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) break; // No more cookie pairs.
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        // only assign once
        if (obj[key] === undefined) {
            let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
            let valEndIdx = endIndex(str, endIdx, valStartIdx);
            const value = dec(str.slice(valStartIdx, valEndIdx));
            obj[key] = value;
        }
        index = endIdx + 1;
    }while (index < len)
    return obj;
}
function startIndex(str, index, max) {
    do {
        const code = str.charCodeAt(index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index;
    }while (++index < max)
    return max;
}
function endIndex(str, index, min) {
    while(index > min){
        const code = str.charCodeAt(--index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index + 1;
    }
    return min;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 */ function serialize(name, val, options) {
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
    }
    const value = enc(val);
    if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
    }
    let str = name + "=" + value;
    if (!options) return str;
    if (options.maxAge !== undefined) {
        if (!Number.isInteger(options.maxAge)) {
            throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
    }
    if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
            throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
    }
    if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
            throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
    }
    if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
            throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
    }
    if (options.httpOnly) {
        str += "; HttpOnly";
    }
    if (options.secure) {
        str += "; Secure";
    }
    if (options.partitioned) {
        str += "; Partitioned";
    }
    if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : undefined;
        switch(priority){
            case "low":
                str += "; Priority=Low";
                break;
            case "medium":
                str += "; Priority=Medium";
                break;
            case "high":
                str += "; Priority=High";
                break;
            default:
                throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
    }
    if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch(sameSite){
            case true:
            case "strict":
                str += "; SameSite=Strict";
                break;
            case "lax":
                str += "; SameSite=Lax";
                break;
            case "none":
                str += "; SameSite=None";
                break;
            default:
                throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 */ function decode(str) {
    if (str.indexOf("%") === -1) return str;
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
}
/**
 * Determine if value is a Date.
 */ function isDate(val) {
    return __toString.call(val) === "[object Date]";
} //# sourceMappingURL=index.js.map
}}),
"[project]/client/node_modules/set-cookie-parser/lib/set-cookie.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
var defaultParseOptions = {
    decodeValues: true,
    map: false,
    silent: false
};
function isNonEmptyString(str) {
    return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
    var parts = setCookieValue.split(";").filter(isNonEmptyString);
    var nameValuePairStr = parts.shift();
    var parsed = parseNameValuePair(nameValuePairStr);
    var name = parsed.name;
    var value = parsed.value;
    options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
    try {
        value = options.decodeValues ? decodeURIComponent(value) : value; // decode cookie value
    } catch (e) {
        console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
    }
    var cookie = {
        name: name,
        value: value
    };
    parts.forEach(function(part) {
        var sides = part.split("=");
        var key = sides.shift().trimLeft().toLowerCase();
        var value = sides.join("=");
        if (key === "expires") {
            cookie.expires = new Date(value);
        } else if (key === "max-age") {
            cookie.maxAge = parseInt(value, 10);
        } else if (key === "secure") {
            cookie.secure = true;
        } else if (key === "httponly") {
            cookie.httpOnly = true;
        } else if (key === "samesite") {
            cookie.sameSite = value;
        } else if (key === "partitioned") {
            cookie.partitioned = true;
        } else {
            cookie[key] = value;
        }
    });
    return cookie;
}
function parseNameValuePair(nameValuePairStr) {
    // Parses name-value-pair according to rfc6265bis draft
    var name = "";
    var value = "";
    var nameValueArr = nameValuePairStr.split("=");
    if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("="); // everything after the first =, joined by a "=" if there was more than one part
    } else {
        value = nameValuePairStr;
    }
    return {
        name: name,
        value: value
    };
}
function parse(input, options) {
    options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
    if (!input) {
        if (!options.map) {
            return [];
        } else {
            return {};
        }
    }
    if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
            // for fetch responses - they combine headers of the same type in the headers array,
            // but getSetCookie returns an uncombined array
            input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
            // fast-path for node.js (which automatically normalizes header names to lower-case
            input = input.headers["set-cookie"];
        } else {
            // slow-path for other environments - see #25
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
                return key.toLowerCase() === "set-cookie";
            })];
            // warn if called on a request-like object with a cookie header rather than a set-cookie header - see #34, 36
            if (!sch && input.headers.cookie && !options.silent) {
                console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
            }
            input = sch;
        }
    }
    if (!Array.isArray(input)) {
        input = [
            input
        ];
    }
    if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
        });
    } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies, str) {
            var cookie = parseString(str, options);
            cookies[cookie.name] = cookie;
            return cookies;
        }, cookies);
    }
}
/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.

  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.

  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/ function splitCookiesString(cookiesString) {
    if (Array.isArray(cookiesString)) {
        return cookiesString;
    }
    if (typeof cookiesString !== "string") {
        return [];
    }
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
module.exports = parse;
module.exports.parse = parse;
module.exports.parseString = parseString;
module.exports.splitCookiesString = splitCookiesString;
}}),
"[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
(function() {
    var e = {
        675: function(e, r) {
            "use strict";
            r.byteLength = byteLength;
            r.toByteArray = toByteArray;
            r.fromByteArray = fromByteArray;
            var t = [];
            var f = [];
            var n = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, u = i.length; o < u; ++o){
                t[o] = i[o];
                f[i.charCodeAt(o)] = o;
            }
            f["-".charCodeAt(0)] = 62;
            f["_".charCodeAt(0)] = 63;
            function getLens(e) {
                var r = e.length;
                if (r % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var t = e.indexOf("=");
                if (t === -1) t = r;
                var f = t === r ? 0 : 4 - t % 4;
                return [
                    t,
                    f
                ];
            }
            function byteLength(e) {
                var r = getLens(e);
                var t = r[0];
                var f = r[1];
                return (t + f) * 3 / 4 - f;
            }
            function _byteLength(e, r, t) {
                return (r + t) * 3 / 4 - t;
            }
            function toByteArray(e) {
                var r;
                var t = getLens(e);
                var i = t[0];
                var o = t[1];
                var u = new n(_byteLength(e, i, o));
                var a = 0;
                var s = o > 0 ? i - 4 : i;
                var h;
                for(h = 0; h < s; h += 4){
                    r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)];
                    u[a++] = r >> 16 & 255;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                if (o === 2) {
                    r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4;
                    u[a++] = r & 255;
                }
                if (o === 1) {
                    r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                return u;
            }
            function tripletToBase64(e) {
                return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
            }
            function encodeChunk(e, r, t) {
                var f;
                var n = [];
                for(var i = r; i < t; i += 3){
                    f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255);
                    n.push(tripletToBase64(f));
                }
                return n.join("");
            }
            function fromByteArray(e) {
                var r;
                var f = e.length;
                var n = f % 3;
                var i = [];
                var o = 16383;
                for(var u = 0, a = f - n; u < a; u += o){
                    i.push(encodeChunk(e, u, u + o > a ? a : u + o));
                }
                if (n === 1) {
                    r = e[f - 1];
                    i.push(t[r >> 2] + t[r << 4 & 63] + "==");
                } else if (n === 2) {
                    r = (e[f - 2] << 8) + e[f - 1];
                    i.push(t[r >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "=");
                }
                return i.join("");
            }
        },
        72: function(e, r, t) {
            "use strict";
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var f = t(675);
            var n = t(783);
            var i = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            r.Buffer = Buffer;
            r.SlowBuffer = SlowBuffer;
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            r.kMaxLength = o;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function typedArraySupport() {
                try {
                    var e = new Uint8Array(1);
                    var r = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(r, Uint8Array.prototype);
                    Object.setPrototypeOf(e, r);
                    return e.foo() === 42;
                } catch (e) {
                    return false;
                }
            }
            Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function createBuffer(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var r = new Uint8Array(e);
                Object.setPrototypeOf(r, Buffer.prototype);
                return r;
            }
            function Buffer(e, r, t) {
                if (typeof e === "number") {
                    if (typeof r === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return allocUnsafe(e);
                }
                return from(e, r, t);
            }
            Buffer.poolSize = 8192;
            function from(e, r, t) {
                if (typeof e === "string") {
                    return fromString(e, r);
                }
                if (ArrayBuffer.isView(e)) {
                    return fromArrayLike(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer)) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var f = e.valueOf && e.valueOf();
                if (f != null && f !== e) {
                    return Buffer.from(f, r, t);
                }
                var n = fromObject(e);
                if (n) return n;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            Buffer.from = function(e, r, t) {
                return from(e, r, t);
            };
            Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(Buffer, Uint8Array);
            function assertSize(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function alloc(e, r, t) {
                assertSize(e);
                if (e <= 0) {
                    return createBuffer(e);
                }
                if (r !== undefined) {
                    return typeof t === "string" ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r);
                }
                return createBuffer(e);
            }
            Buffer.alloc = function(e, r, t) {
                return alloc(e, r, t);
            };
            function allocUnsafe(e) {
                assertSize(e);
                return createBuffer(e < 0 ? 0 : checked(e) | 0);
            }
            Buffer.allocUnsafe = function(e) {
                return allocUnsafe(e);
            };
            Buffer.allocUnsafeSlow = function(e) {
                return allocUnsafe(e);
            };
            function fromString(e, r) {
                if (typeof r !== "string" || r === "") {
                    r = "utf8";
                }
                if (!Buffer.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r);
                }
                var t = byteLength(e, r) | 0;
                var f = createBuffer(t);
                var n = f.write(e, r);
                if (n !== t) {
                    f = f.slice(0, n);
                }
                return f;
            }
            function fromArrayLike(e) {
                var r = e.length < 0 ? 0 : checked(e.length) | 0;
                var t = createBuffer(r);
                for(var f = 0; f < r; f += 1){
                    t[f] = e[f] & 255;
                }
                return t;
            }
            function fromArrayBuffer(e, r, t) {
                if (r < 0 || e.byteLength < r) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < r + (t || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var f;
                if (r === undefined && t === undefined) {
                    f = new Uint8Array(e);
                } else if (t === undefined) {
                    f = new Uint8Array(e, r);
                } else {
                    f = new Uint8Array(e, r, t);
                }
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            }
            function fromObject(e) {
                if (Buffer.isBuffer(e)) {
                    var r = checked(e.length) | 0;
                    var t = createBuffer(r);
                    if (t.length === 0) {
                        return t;
                    }
                    e.copy(t, 0, 0, r);
                    return t;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || numberIsNaN(e.length)) {
                        return createBuffer(0);
                    }
                    return fromArrayLike(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return fromArrayLike(e.data);
                }
            }
            function checked(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function SlowBuffer(e) {
                if (+e != e) {
                    e = 0;
                }
                return Buffer.alloc(+e);
            }
            Buffer.isBuffer = function isBuffer(e) {
                return e != null && e._isBuffer === true && e !== Buffer.prototype;
            };
            Buffer.compare = function compare(e, r) {
                if (isInstance(e, Uint8Array)) e = Buffer.from(e, e.offset, e.byteLength);
                if (isInstance(r, Uint8Array)) r = Buffer.from(r, r.offset, r.byteLength);
                if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (e === r) return 0;
                var t = e.length;
                var f = r.length;
                for(var n = 0, i = Math.min(t, f); n < i; ++n){
                    if (e[n] !== r[n]) {
                        t = e[n];
                        f = r[n];
                        break;
                    }
                }
                if (t < f) return -1;
                if (f < t) return 1;
                return 0;
            };
            Buffer.isEncoding = function isEncoding(e) {
                switch(String(e).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            Buffer.concat = function concat(e, r) {
                if (!Array.isArray(e)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (e.length === 0) {
                    return Buffer.alloc(0);
                }
                var t;
                if (r === undefined) {
                    r = 0;
                    for(t = 0; t < e.length; ++t){
                        r += e[t].length;
                    }
                }
                var f = Buffer.allocUnsafe(r);
                var n = 0;
                for(t = 0; t < e.length; ++t){
                    var i = e[t];
                    if (isInstance(i, Uint8Array)) {
                        i = Buffer.from(i);
                    }
                    if (!Buffer.isBuffer(i)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    i.copy(f, n);
                    n += i.length;
                }
                return f;
            };
            function byteLength(e, r) {
                if (Buffer.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var t = e.length;
                var f = arguments.length > 2 && arguments[2] === true;
                if (!f && t === 0) return 0;
                var n = false;
                for(;;){
                    switch(r){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return t;
                        case "utf8":
                        case "utf-8":
                            return utf8ToBytes(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return t * 2;
                        case "hex":
                            return t >>> 1;
                        case "base64":
                            return base64ToBytes(e).length;
                        default:
                            if (n) {
                                return f ? -1 : utf8ToBytes(e).length;
                            }
                            r = ("" + r).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(e, r, t) {
                var f = false;
                if (r === undefined || r < 0) {
                    r = 0;
                }
                if (r > this.length) {
                    return "";
                }
                if (t === undefined || t > this.length) {
                    t = this.length;
                }
                if (t <= 0) {
                    return "";
                }
                t >>>= 0;
                r >>>= 0;
                if (t <= r) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return hexSlice(this, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, r, t);
                        case "ascii":
                            return asciiSlice(this, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Slice(this, r, t);
                        case "base64":
                            return base64Slice(this, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, r, t);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            f = true;
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(e, r, t) {
                var f = e[r];
                e[r] = e[t];
                e[t] = f;
            }
            Buffer.prototype.swap16 = function swap16() {
                var e = this.length;
                if (e % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < e; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer.prototype.swap32 = function swap32() {
                var e = this.length;
                if (e % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < e; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer.prototype.swap64 = function swap64() {
                var e = this.length;
                if (e % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < e; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer.prototype.toString = function toString() {
                var e = this.length;
                if (e === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, e);
                return slowToString.apply(this, arguments);
            };
            Buffer.prototype.toLocaleString = Buffer.prototype.toString;
            Buffer.prototype.equals = function equals(e) {
                if (!Buffer.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return Buffer.compare(this, e) === 0;
            };
            Buffer.prototype.inspect = function inspect() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > t) e += " ... ";
                return "<Buffer " + e + ">";
            };
            if (i) {
                Buffer.prototype[i] = Buffer.prototype.inspect;
            }
            Buffer.prototype.compare = function compare(e, r, t, f, n) {
                if (isInstance(e, Uint8Array)) {
                    e = Buffer.from(e, e.offset, e.byteLength);
                }
                if (!Buffer.isBuffer(e)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof e);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (t === undefined) {
                    t = e ? e.length : 0;
                }
                if (f === undefined) {
                    f = 0;
                }
                if (n === undefined) {
                    n = this.length;
                }
                if (r < 0 || t > e.length || f < 0 || n > this.length) {
                    throw new RangeError("out of range index");
                }
                if (f >= n && r >= t) {
                    return 0;
                }
                if (f >= n) {
                    return -1;
                }
                if (r >= t) {
                    return 1;
                }
                r >>>= 0;
                t >>>= 0;
                f >>>= 0;
                n >>>= 0;
                if (this === e) return 0;
                var i = n - f;
                var o = t - r;
                var u = Math.min(i, o);
                var a = this.slice(f, n);
                var s = e.slice(r, t);
                for(var h = 0; h < u; ++h){
                    if (a[h] !== s[h]) {
                        i = a[h];
                        o = s[h];
                        break;
                    }
                }
                if (i < o) return -1;
                if (o < i) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, r, t, f, n) {
                if (e.length === 0) return -1;
                if (typeof t === "string") {
                    f = t;
                    t = 0;
                } else if (t > 2147483647) {
                    t = 2147483647;
                } else if (t < -2147483648) {
                    t = -2147483648;
                }
                t = +t;
                if (numberIsNaN(t)) {
                    t = n ? 0 : e.length - 1;
                }
                if (t < 0) t = e.length + t;
                if (t >= e.length) {
                    if (n) return -1;
                    else t = e.length - 1;
                } else if (t < 0) {
                    if (n) t = 0;
                    else return -1;
                }
                if (typeof r === "string") {
                    r = Buffer.from(r, f);
                }
                if (Buffer.isBuffer(r)) {
                    if (r.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, r, t, f, n);
                } else if (typeof r === "number") {
                    r = r & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (n) {
                            return Uint8Array.prototype.indexOf.call(e, r, t);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, r, t);
                        }
                    }
                    return arrayIndexOf(e, [
                        r
                    ], t, f, n);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(e, r, t, f, n) {
                var i = 1;
                var o = e.length;
                var u = r.length;
                if (f !== undefined) {
                    f = String(f).toLowerCase();
                    if (f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le") {
                        if (e.length < 2 || r.length < 2) {
                            return -1;
                        }
                        i = 2;
                        o /= 2;
                        u /= 2;
                        t /= 2;
                    }
                }
                function read(e, r) {
                    if (i === 1) {
                        return e[r];
                    } else {
                        return e.readUInt16BE(r * i);
                    }
                }
                var a;
                if (n) {
                    var s = -1;
                    for(a = t; a < o; a++){
                        if (read(e, a) === read(r, s === -1 ? 0 : a - s)) {
                            if (s === -1) s = a;
                            if (a - s + 1 === u) return s * i;
                        } else {
                            if (s !== -1) a -= a - s;
                            s = -1;
                        }
                    }
                } else {
                    if (t + u > o) t = o - u;
                    for(a = t; a >= 0; a--){
                        var h = true;
                        for(var c = 0; c < u; c++){
                            if (read(e, a + c) !== read(r, c)) {
                                h = false;
                                break;
                            }
                        }
                        if (h) return a;
                    }
                }
                return -1;
            }
            Buffer.prototype.includes = function includes(e, r, t) {
                return this.indexOf(e, r, t) !== -1;
            };
            Buffer.prototype.indexOf = function indexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, true);
            };
            Buffer.prototype.lastIndexOf = function lastIndexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, false);
            };
            function hexWrite(e, r, t, f) {
                t = Number(t) || 0;
                var n = e.length - t;
                if (!f) {
                    f = n;
                } else {
                    f = Number(f);
                    if (f > n) {
                        f = n;
                    }
                }
                var i = r.length;
                if (f > i / 2) {
                    f = i / 2;
                }
                for(var o = 0; o < f; ++o){
                    var u = parseInt(r.substr(o * 2, 2), 16);
                    if (numberIsNaN(u)) return o;
                    e[t + o] = u;
                }
                return o;
            }
            function utf8Write(e, r, t, f) {
                return blitBuffer(utf8ToBytes(r, e.length - t), e, t, f);
            }
            function asciiWrite(e, r, t, f) {
                return blitBuffer(asciiToBytes(r), e, t, f);
            }
            function latin1Write(e, r, t, f) {
                return asciiWrite(e, r, t, f);
            }
            function base64Write(e, r, t, f) {
                return blitBuffer(base64ToBytes(r), e, t, f);
            }
            function ucs2Write(e, r, t, f) {
                return blitBuffer(utf16leToBytes(r, e.length - t), e, t, f);
            }
            Buffer.prototype.write = function write(e, r, t, f) {
                if (r === undefined) {
                    f = "utf8";
                    t = this.length;
                    r = 0;
                } else if (t === undefined && typeof r === "string") {
                    f = r;
                    t = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(t)) {
                        t = t >>> 0;
                        if (f === undefined) f = "utf8";
                    } else {
                        f = t;
                        t = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var n = this.length - r;
                if (t === undefined || t > n) t = n;
                if (e.length > 0 && (t < 0 || r < 0) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!f) f = "utf8";
                var i = false;
                for(;;){
                    switch(f){
                        case "hex":
                            return hexWrite(this, e, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, e, r, t);
                        case "ascii":
                            return asciiWrite(this, e, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Write(this, e, r, t);
                        case "base64":
                            return base64Write(this, e, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, e, r, t);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + f);
                            f = ("" + f).toLowerCase();
                            i = true;
                    }
                }
            };
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, r, t) {
                if (r === 0 && t === e.length) {
                    return f.fromByteArray(e);
                } else {
                    return f.fromByteArray(e.slice(r, t));
                }
            }
            function utf8Slice(e, r, t) {
                t = Math.min(e.length, t);
                var f = [];
                var n = r;
                while(n < t){
                    var i = e[n];
                    var o = null;
                    var u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                    if (n + u <= t) {
                        var a, s, h, c;
                        switch(u){
                            case 1:
                                if (i < 128) {
                                    o = i;
                                }
                                break;
                            case 2:
                                a = e[n + 1];
                                if ((a & 192) === 128) {
                                    c = (i & 31) << 6 | a & 63;
                                    if (c > 127) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                a = e[n + 1];
                                s = e[n + 2];
                                if ((a & 192) === 128 && (s & 192) === 128) {
                                    c = (i & 15) << 12 | (a & 63) << 6 | s & 63;
                                    if (c > 2047 && (c < 55296 || c > 57343)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                a = e[n + 1];
                                s = e[n + 2];
                                h = e[n + 3];
                                if ((a & 192) === 128 && (s & 192) === 128 && (h & 192) === 128) {
                                    c = (i & 15) << 18 | (a & 63) << 12 | (s & 63) << 6 | h & 63;
                                    if (c > 65535 && c < 1114112) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 65533;
                        u = 1;
                    } else if (o > 65535) {
                        o -= 65536;
                        f.push(o >>> 10 & 1023 | 55296);
                        o = 56320 | o & 1023;
                    }
                    f.push(o);
                    n += u;
                }
                return decodeCodePointsArray(f);
            }
            var u = 4096;
            function decodeCodePointsArray(e) {
                var r = e.length;
                if (r <= u) {
                    return String.fromCharCode.apply(String, e);
                }
                var t = "";
                var f = 0;
                while(f < r){
                    t += String.fromCharCode.apply(String, e.slice(f, f += u));
                }
                return t;
            }
            function asciiSlice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n] & 127);
                }
                return f;
            }
            function latin1Slice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n]);
                }
                return f;
            }
            function hexSlice(e, r, t) {
                var f = e.length;
                if (!r || r < 0) r = 0;
                if (!t || t < 0 || t > f) t = f;
                var n = "";
                for(var i = r; i < t; ++i){
                    n += s[e[i]];
                }
                return n;
            }
            function utf16leSlice(e, r, t) {
                var f = e.slice(r, t);
                var n = "";
                for(var i = 0; i < f.length; i += 2){
                    n += String.fromCharCode(f[i] + f[i + 1] * 256);
                }
                return n;
            }
            Buffer.prototype.slice = function slice(e, r) {
                var t = this.length;
                e = ~~e;
                r = r === undefined ? t : ~~r;
                if (e < 0) {
                    e += t;
                    if (e < 0) e = 0;
                } else if (e > t) {
                    e = t;
                }
                if (r < 0) {
                    r += t;
                    if (r < 0) r = 0;
                } else if (r > t) {
                    r = t;
                }
                if (r < e) r = e;
                var f = this.subarray(e, r);
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            };
            function checkOffset(e, r, t) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + r > t) throw new RangeError("Trying to access beyond buffer length");
            }
            Buffer.prototype.readUIntLE = function readUIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                return f;
            };
            Buffer.prototype.readUIntBE = function readUIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) {
                    checkOffset(e, r, this.length);
                }
                var f = this[e + --r];
                var n = 1;
                while(r > 0 && (n *= 256)){
                    f += this[e + --r] * n;
                }
                return f;
            };
            Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                return this[e];
            };
            Buffer.prototype.readUInt16LE = function readUInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] | this[e + 1] << 8;
            };
            Buffer.prototype.readUInt16BE = function readUInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] << 8 | this[e + 1];
            };
            Buffer.prototype.readUInt32LE = function readUInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
            };
            Buffer.prototype.readUInt32BE = function readUInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            };
            Buffer.prototype.readIntLE = function readIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                n *= 128;
                if (f >= n) f -= Math.pow(2, 8 * r);
                return f;
            };
            Buffer.prototype.readIntBE = function readIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = r;
                var n = 1;
                var i = this[e + --f];
                while(f > 0 && (n *= 256)){
                    i += this[e + --f] * n;
                }
                n *= 128;
                if (i >= n) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer.prototype.readInt8 = function readInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1;
            };
            Buffer.prototype.readInt16LE = function readInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e] | this[e + 1] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt16BE = function readInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e + 1] | this[e] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt32LE = function readInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            };
            Buffer.prototype.readInt32BE = function readInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            };
            Buffer.prototype.readFloatLE = function readFloatLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, true, 23, 4);
            };
            Buffer.prototype.readFloatBE = function readFloatBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, false, 23, 4);
            };
            Buffer.prototype.readDoubleLE = function readDoubleLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, true, 52, 8);
            };
            Buffer.prototype.readDoubleBE = function readDoubleBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, false, 52, 8);
            };
            function checkInt(e, r, t, f, n, i) {
                if (!Buffer.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > n || r < i) throw new RangeError('"value" argument is out of bounds');
                if (t + f > e.length) throw new RangeError("Index out of range");
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = 1;
                var o = 0;
                this[r] = e & 255;
                while(++o < t && (i *= 256)){
                    this[r + o] = e / i & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUIntBE = function writeUIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = t - 1;
                var o = 1;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    this[r + i] = e / o & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUInt8 = function writeUInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 255, 0);
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r + 3] = e >>> 24;
                this[r + 2] = e >>> 16;
                this[r + 1] = e >>> 8;
                this[r] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeIntLE = function writeIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = 0;
                var o = 1;
                var u = 0;
                this[r] = e & 255;
                while(++i < t && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeIntBE = function writeIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = t - 1;
                var o = 1;
                var u = 0;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeInt8 = function writeInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 127, -128);
                if (e < 0) e = 255 + e + 1;
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeInt16LE = function writeInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeInt16BE = function writeInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeInt32LE = function writeInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                this[r + 2] = e >>> 16;
                this[r + 3] = e >>> 24;
                return r + 4;
            };
            Buffer.prototype.writeInt32BE = function writeInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            function checkIEEE754(e, r, t, f, n, i) {
                if (t + f > e.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 4, 34028234663852886e22, -34028234663852886e22);
                }
                n.write(e, r, t, f, 23, 4);
                return t + 4;
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(e, r, t) {
                return writeFloat(this, e, r, true, t);
            };
            Buffer.prototype.writeFloatBE = function writeFloatBE(e, r, t) {
                return writeFloat(this, e, r, false, t);
            };
            function writeDouble(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 8, 17976931348623157e292, -17976931348623157e292);
                }
                n.write(e, r, t, f, 52, 8);
                return t + 8;
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(e, r, t) {
                return writeDouble(this, e, r, true, t);
            };
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(e, r, t) {
                return writeDouble(this, e, r, false, t);
            };
            Buffer.prototype.copy = function copy(e, r, t, f) {
                if (!Buffer.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!t) t = 0;
                if (!f && f !== 0) f = this.length;
                if (r >= e.length) r = e.length;
                if (!r) r = 0;
                if (f > 0 && f < t) f = t;
                if (f === t) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (t < 0 || t >= this.length) throw new RangeError("Index out of range");
                if (f < 0) throw new RangeError("sourceEnd out of bounds");
                if (f > this.length) f = this.length;
                if (e.length - r < f - t) {
                    f = e.length - r + t;
                }
                var n = f - t;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, t, f);
                } else if (this === e && t < r && r < f) {
                    for(var i = n - 1; i >= 0; --i){
                        e[i + r] = this[i + t];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                }
                return n;
            };
            Buffer.prototype.fill = function fill(e, r, t, f) {
                if (typeof e === "string") {
                    if (typeof r === "string") {
                        f = r;
                        r = 0;
                        t = this.length;
                    } else if (typeof t === "string") {
                        f = t;
                        t = this.length;
                    }
                    if (f !== undefined && typeof f !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof f === "string" && !Buffer.isEncoding(f)) {
                        throw new TypeError("Unknown encoding: " + f);
                    }
                    if (e.length === 1) {
                        var n = e.charCodeAt(0);
                        if (f === "utf8" && n < 128 || f === "latin1") {
                            e = n;
                        }
                    }
                } else if (typeof e === "number") {
                    e = e & 255;
                } else if (typeof e === "boolean") {
                    e = Number(e);
                }
                if (r < 0 || this.length < r || this.length < t) {
                    throw new RangeError("Out of range index");
                }
                if (t <= r) {
                    return this;
                }
                r = r >>> 0;
                t = t === undefined ? this.length : t >>> 0;
                if (!e) e = 0;
                var i;
                if (typeof e === "number") {
                    for(i = r; i < t; ++i){
                        this[i] = e;
                    }
                } else {
                    var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f);
                    var u = o.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    }
                    for(i = 0; i < t - r; ++i){
                        this[i + r] = o[i % u];
                    }
                }
                return this;
            };
            var a = /[^+/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = e.split("=")[0];
                e = e.trim().replace(a, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function utf8ToBytes(e, r) {
                r = r || Infinity;
                var t;
                var f = e.length;
                var n = null;
                var i = [];
                for(var o = 0; o < f; ++o){
                    t = e.charCodeAt(o);
                    if (t > 55295 && t < 57344) {
                        if (!n) {
                            if (t > 56319) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            } else if (o + 1 === f) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            }
                            n = t;
                            continue;
                        }
                        if (t < 56320) {
                            if ((r -= 3) > -1) i.push(239, 191, 189);
                            n = t;
                            continue;
                        }
                        t = (n - 55296 << 10 | t - 56320) + 65536;
                    } else if (n) {
                        if ((r -= 3) > -1) i.push(239, 191, 189);
                    }
                    n = null;
                    if (t < 128) {
                        if ((r -= 1) < 0) break;
                        i.push(t);
                    } else if (t < 2048) {
                        if ((r -= 2) < 0) break;
                        i.push(t >> 6 | 192, t & 63 | 128);
                    } else if (t < 65536) {
                        if ((r -= 3) < 0) break;
                        i.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
                    } else if (t < 1114112) {
                        if ((r -= 4) < 0) break;
                        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return i;
            }
            function asciiToBytes(e) {
                var r = [];
                for(var t = 0; t < e.length; ++t){
                    r.push(e.charCodeAt(t) & 255);
                }
                return r;
            }
            function utf16leToBytes(e, r) {
                var t, f, n;
                var i = [];
                for(var o = 0; o < e.length; ++o){
                    if ((r -= 2) < 0) break;
                    t = e.charCodeAt(o);
                    f = t >> 8;
                    n = t % 256;
                    i.push(n);
                    i.push(f);
                }
                return i;
            }
            function base64ToBytes(e) {
                return f.toByteArray(base64clean(e));
            }
            function blitBuffer(e, r, t, f) {
                for(var n = 0; n < f; ++n){
                    if (n + t >= r.length || n >= e.length) break;
                    r[n + t] = e[n];
                }
                return n;
            }
            function isInstance(e, r) {
                return e instanceof r || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === r.name;
            }
            function numberIsNaN(e) {
                return e !== e;
            }
            var s = function() {
                var e = "0123456789abcdef";
                var r = new Array(256);
                for(var t = 0; t < 16; ++t){
                    var f = t * 16;
                    for(var n = 0; n < 16; ++n){
                        r[f + n] = e[t] + e[n];
                    }
                }
                return r;
            }();
        },
        783: function(e, r) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ r.read = function(e, r, t, f, n) {
                var i, o;
                var u = n * 8 - f - 1;
                var a = (1 << u) - 1;
                var s = a >> 1;
                var h = -7;
                var c = t ? n - 1 : 0;
                var l = t ? -1 : 1;
                var p = e[r + c];
                c += l;
                i = p & (1 << -h) - 1;
                p >>= -h;
                h += u;
                for(; h > 0; i = i * 256 + e[r + c], c += l, h -= 8){}
                o = i & (1 << -h) - 1;
                i >>= -h;
                h += f;
                for(; h > 0; o = o * 256 + e[r + c], c += l, h -= 8){}
                if (i === 0) {
                    i = 1 - s;
                } else if (i === a) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, f);
                    i = i - s;
                }
                return (p ? -1 : 1) * o * Math.pow(2, i - f);
            };
            r.write = function(e, r, t, f, n, i) {
                var o, u, a;
                var s = i * 8 - n - 1;
                var h = (1 << s) - 1;
                var c = h >> 1;
                var l = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = f ? 0 : i - 1;
                var y = f ? 1 : -1;
                var g = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
                r = Math.abs(r);
                if (isNaN(r) || r === Infinity) {
                    u = isNaN(r) ? 1 : 0;
                    o = h;
                } else {
                    o = Math.floor(Math.log(r) / Math.LN2);
                    if (r * (a = Math.pow(2, -o)) < 1) {
                        o--;
                        a *= 2;
                    }
                    if (o + c >= 1) {
                        r += l / a;
                    } else {
                        r += l * Math.pow(2, 1 - c);
                    }
                    if (r * a >= 2) {
                        o++;
                        a /= 2;
                    }
                    if (o + c >= h) {
                        u = 0;
                        o = h;
                    } else if (o + c >= 1) {
                        u = (r * a - 1) * Math.pow(2, n);
                        o = o + c;
                    } else {
                        u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                        o = 0;
                    }
                }
                for(; n >= 8; e[t + p] = u & 255, p += y, u /= 256, n -= 8){}
                o = o << n | u;
                s += n;
                for(; s > 0; e[t + p] = o & 255, p += y, o /= 256, s -= 8){}
                e[t + p - y] |= g * 128;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var f = r[t];
        if (f !== undefined) {
            return f.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var t = __nccwpck_require__(72);
    module.exports = t;
})();
}}),
"[project]/client/node_modules/react-filepond/dist/react-filepond.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/*!
 * react-filepond v7.1.3
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2024 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilePond = exports.FileStatus = exports.registerPlugin = undefined;
var _createClass = function() {
    function defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
var _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _react2 = _interopRequireDefault(_react);
var _filepond = __turbopack_context__.r("[project]/client/node_modules/filepond/dist/filepond.js [app-client] (ecmascript)");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
// Import required methods and styles from the FilePond module, should not need anything else
// We need to be able to call the registerPlugin method directly so we can add plugins
exports.registerPlugin = _filepond.registerPlugin;
exports.FileStatus = _filepond.FileStatus;
// Do this once
var isSupported = (0, _filepond.supported)();
// filtered methods
var filteredMethods = [
    "setOptions",
    "on",
    "off",
    "onOnce",
    "appendTo",
    "insertAfter",
    "insertBefore",
    "isAttachedTo",
    "replaceElement",
    "restoreElement",
    "destroy"
];
// The React <FilePond/> wrapper
var FilePond = exports.FilePond = function(_React$Component) {
    _inherits(FilePond, _React$Component);
    function FilePond(props) {
        _classCallCheck(this, FilePond);
        var _this = _possibleConstructorReturn(this, (FilePond.__proto__ || Object.getPrototypeOf(FilePond)).call(this, props));
        _this.allowFilesSync = true;
        return _this;
    }
    // Will setup FilePond instance when mounted
    _createClass(FilePond, [
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                var _this2 = this;
                // clone the input so we can restore it in unmount
                this._input = this._element.querySelector('input[type="file"]');
                this._inputClone = this._input.cloneNode();
                // exit here if not supported
                if (!isSupported) return;
                var options = Object.assign({}, this.props);
                // if onupdate files is defined, make sure setFiles does not cause race condition
                if (options.onupdatefiles) {
                    var cb = options.onupdatefiles;
                    options.onupdatefiles = function(items) {
                        _this2.allowFilesSync = false;
                        cb(items);
                    };
                }
                // Create our pond
                this._pond = (0, _filepond.create)(this._input, options);
                // Reference pond methods to FilePond component instance
                Object.keys(this._pond).filter(function(key) {
                    return !filteredMethods.includes(key);
                }).forEach(function(key) {
                    _this2[key] = _this2._pond[key];
                });
            }
        },
        {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                // exit when no pond defined
                if (!this._pond) return;
                // This fixed <Strict> errors
                // FilePond destroy is async so we have to move FilePond to a bin element so it can no longer affect current element tree as React unmount / mount is sync
                var bin = document.createElement("div");
                bin.append(this._pond.element);
                bin.id = "foo";
                // now we call destroy so FilePond can start it's destroy logic
                this._pond.destroy();
                this._pond = undefined;
                // we re-add the original file input element so everything is as it was before
                this._element.append(this._inputClone);
            }
        },
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate() {
                if (!this.allowFilesSync) {
                    this.allowFilesSync = true;
                    return false;
                }
                return true;
            }
        },
        {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                // exit when no pond defined
                if (!this._pond) return;
                var options = Object.assign({}, this.props);
                // this is only set onces, on didmount
                delete options.onupdatefiles;
                // update pond options based on new props
                this._pond.setOptions(options);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this3 = this;
                var _props = this.props, id = _props.id, name = _props.name, className = _props.className, allowMultiple = _props.allowMultiple, required = _props.required, captureMethod = _props.captureMethod, acceptedFileTypes = _props.acceptedFileTypes;
                return (0, _react.createElement)("div", {
                    className: "filepond--wrapper",
                    ref: function ref(element) {
                        return _this3._element = element;
                    }
                }, (0, _react.createElement)("input", {
                    type: "file",
                    name: name,
                    id: id,
                    accept: acceptedFileTypes,
                    multiple: allowMultiple,
                    required: required,
                    className: className,
                    capture: captureMethod
                }));
            }
        }
    ]);
    return FilePond;
}(_react2.default.Component);
}}),
"[project]/client/node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/*!
 * FilePondPluginImagePreview 4.6.12
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */ /* eslint-disable */ (function(global, factory) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = factory() : ("TURBOPACK unreachable", undefined);
})(this, function() {
    'use strict';
    // test if file is of type image and can be viewed in canvas
    var isPreviewableImage = function isPreviewableImage(file) {
        return /^image/.test(file.type);
    };
    function _typeof(obj) {
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
            };
        }
        return _typeof(obj);
    }
    var REACT_ELEMENT_TYPE;
    function _jsx(type, props, key, children) {
        if (!REACT_ELEMENT_TYPE) {
            REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;
        }
        var defaultProps = type && type.defaultProps;
        var childrenLength = arguments.length - 3;
        if (!props && childrenLength !== 0) {
            props = {
                children: void 0
            };
        }
        if (props && defaultProps) {
            for(var propName in defaultProps){
                if (props[propName] === void 0) {
                    props[propName] = defaultProps[propName];
                }
            }
        } else if (!props) {
            props = defaultProps || {};
        }
        if (childrenLength === 1) {
            props.children = children;
        } else if (childrenLength > 1) {
            var childArray = new Array(childrenLength);
            for(var i = 0; i < childrenLength; i++){
                childArray[i] = arguments[i + 3];
            }
            props.children = childArray;
        }
        return {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key === undefined ? null : '' + key,
            ref: null,
            props: props,
            _owner: null
        };
    }
    function _asyncIterator(iterable) {
        var method;
        if (typeof Symbol === 'function') {
            if (Symbol.asyncIterator) {
                method = iterable[Symbol.asyncIterator];
                if (method != null) return method.call(iterable);
            }
            if (Symbol.iterator) {
                method = iterable[Symbol.iterator];
                if (method != null) return method.call(iterable);
            }
        }
        throw new TypeError('Object is not async iterable');
    }
    function _AwaitValue(value) {
        this.wrapped = value;
    }
    function _AsyncGenerator(gen) {
        var front, back;
        function send(key, arg) {
            return new Promise(function(resolve, reject) {
                var request = {
                    key: key,
                    arg: arg,
                    resolve: resolve,
                    reject: reject,
                    next: null
                };
                if (back) {
                    back = back.next = request;
                } else {
                    front = back = request;
                    resume(key, arg);
                }
            });
        }
        function resume(key, arg) {
            try {
                var result = gen[key](arg);
                var value = result.value;
                var wrappedAwait = value instanceof _AwaitValue;
                Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg) {
                    if (wrappedAwait) {
                        resume('next', arg);
                        return;
                    }
                    settle(result.done ? 'return' : 'normal', arg);
                }, function(err) {
                    resume('throw', err);
                });
            } catch (err) {
                settle('throw', err);
            }
        }
        function settle(type, value) {
            switch(type){
                case 'return':
                    front.resolve({
                        value: value,
                        done: true
                    });
                    break;
                case 'throw':
                    front.reject(value);
                    break;
                default:
                    front.resolve({
                        value: value,
                        done: false
                    });
                    break;
            }
            front = front.next;
            if (front) {
                resume(front.key, front.arg);
            } else {
                back = null;
            }
        }
        this._invoke = send;
        if (typeof gen.return !== 'function') {
            this.return = undefined;
        }
    }
    if (typeof Symbol === 'function' && Symbol.asyncIterator) {
        _AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    _AsyncGenerator.prototype.next = function(arg) {
        return this._invoke('next', arg);
    };
    _AsyncGenerator.prototype.throw = function(arg) {
        return this._invoke('throw', arg);
    };
    _AsyncGenerator.prototype.return = function(arg) {
        return this._invoke('return', arg);
    };
    function _wrapAsyncGenerator(fn) {
        return function() {
            return new _AsyncGenerator(fn.apply(this, arguments));
        };
    }
    function _awaitAsyncGenerator(value) {
        return new _AwaitValue(value);
    }
    function _asyncGeneratorDelegate(inner, awaitWrap) {
        var iter = {}, waiting = false;
        function pump(key, value) {
            waiting = true;
            value = new Promise(function(resolve) {
                resolve(inner[key](value));
            });
            return {
                done: false,
                value: awaitWrap(value)
            };
        }
        if (typeof Symbol === 'function' && Symbol.iterator) {
            iter[Symbol.iterator] = function() {
                return this;
            };
        }
        iter.next = function(value) {
            if (waiting) {
                waiting = false;
                return value;
            }
            return pump('next', value);
        };
        if (typeof inner.throw === 'function') {
            iter.throw = function(value) {
                if (waiting) {
                    waiting = false;
                    throw value;
                }
                return pump('throw', value);
            };
        }
        if (typeof inner.return === 'function') {
            iter.return = function(value) {
                return pump('return', value);
            };
        }
        return iter;
    }
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }
    function _asyncToGenerator(fn) {
        return function() {
            var self1 = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self1, args);
                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
                }
                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
                }
                _next(undefined);
            });
        };
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }
    function _defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function _defineEnumerableProperties(obj, descs) {
        for(var key in descs){
            var desc = descs[key];
            desc.configurable = desc.enumerable = true;
            if ('value' in desc) desc.writable = true;
            Object.defineProperty(obj, key, desc);
        }
        if (Object.getOwnPropertySymbols) {
            var objectSymbols = Object.getOwnPropertySymbols(descs);
            for(var i = 0; i < objectSymbols.length; i++){
                var sym = objectSymbols[i];
                var desc = descs[sym];
                desc.configurable = desc.enumerable = true;
                if ('value' in desc) desc.writable = true;
                Object.defineProperty(obj, sym, desc);
            }
        }
        return obj;
    }
    function _defaults(obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);
        for(var i = 0; i < keys.length; i++){
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);
            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }
        return obj;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function _extends() {
        _extends = Object.assign || function(target) {
            for(var i = 1; i < arguments.length; i++){
                var source = arguments[i];
                for(var key in source){
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
        return _extends.apply(this, arguments);
    }
    function _objectSpread(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === 'function') {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        }
        return target;
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError('Super expression must either be null or a function');
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === 'function') return true;
        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _construct(Parent, args, Class) {
        if (isNativeReflectConstruct()) {
            _construct = Reflect.construct;
        } else {
            _construct = function _construct(Parent, args, Class) {
                var a = [
                    null
                ];
                a.push.apply(a, args);
                var Constructor = Function.bind.apply(Parent, a);
                var instance = new Constructor();
                if (Class) _setPrototypeOf(instance, Class.prototype);
                return instance;
            };
        }
        return _construct.apply(null, arguments);
    }
    function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf('[native code]') !== -1;
    }
    function _wrapNativeSuper(Class) {
        var _cache = typeof Map === 'function' ? new Map() : undefined;
        _wrapNativeSuper = function _wrapNativeSuper(Class) {
            if (Class === null || !_isNativeFunction(Class)) return Class;
            if (typeof Class !== 'function') {
                throw new TypeError('Super expression must either be null or a function');
            }
            if (typeof _cache !== 'undefined') {
                if (_cache.has(Class)) return _cache.get(Class);
                _cache.set(Class, Wrapper);
            }
            function Wrapper() {
                return _construct(Class, arguments, _getPrototypeOf(this).constructor);
            }
            Wrapper.prototype = Object.create(Class.prototype, {
                constructor: {
                    value: Wrapper,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            return _setPrototypeOf(Wrapper, Class);
        };
        return _wrapNativeSuper(Class);
    }
    function _instanceof(left, right) {
        if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
            return right[Symbol.hasInstance](left);
        } else {
            return left instanceof right;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                        if (desc.get || desc.set) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
            }
            newObj.default = obj;
            return newObj;
        }
    }
    function _newArrowCheck(innerThis, boundThis) {
        if (innerThis !== boundThis) {
            throw new TypeError('Cannot instantiate an arrow function');
        }
    }
    function _objectDestructuringEmpty(obj) {
        if (obj == null) throw new TypeError('Cannot destructure undefined');
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }
    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++){
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                target[key] = source[key];
            }
        }
        return target;
    }
    function _assertThisInitialized(self1) {
        if (self1 === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self1;
    }
    function _possibleConstructorReturn(self1, call) {
        if (call && (typeof call === 'object' || typeof call === 'function')) {
            return call;
        }
        return _assertThisInitialized(self1);
    }
    function _superPropBase(object, property) {
        while(!Object.prototype.hasOwnProperty.call(object, property)){
            object = _getPrototypeOf(object);
            if (object === null) break;
        }
        return object;
    }
    function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) {
            _get = Reflect.get;
        } else {
            _get = function _get(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.get) {
                    return desc.get.call(receiver);
                }
                return desc.value;
            };
        }
        return _get(target, property, receiver || target);
    }
    function set(target, property, value, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.set) {
            set = Reflect.set;
        } else {
            set = function set(target, property, value, receiver) {
                var base = _superPropBase(target, property);
                var desc;
                if (base) {
                    desc = Object.getOwnPropertyDescriptor(base, property);
                    if (desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    } else if (!desc.writable) {
                        return false;
                    }
                }
                desc = Object.getOwnPropertyDescriptor(receiver, property);
                if (desc) {
                    if (!desc.writable) {
                        return false;
                    }
                    desc.value = value;
                    Object.defineProperty(receiver, property, desc);
                } else {
                    _defineProperty(receiver, property, value);
                }
                return true;
            };
        }
        return set(target, property, value, receiver);
    }
    function _set(target, property, value, receiver, isStrict) {
        var s = set(target, property, value, receiver || target);
        if (!s && isStrict) {
            throw new Error('failed to set property');
        }
        return value;
    }
    function _taggedTemplateLiteral(strings, raw) {
        if (!raw) {
            raw = strings.slice(0);
        }
        return Object.freeze(Object.defineProperties(strings, {
            raw: {
                value: Object.freeze(raw)
            }
        }));
    }
    function _taggedTemplateLiteralLoose(strings, raw) {
        if (!raw) {
            raw = strings.slice(0);
        }
        strings.raw = raw;
        return strings;
    }
    function _temporalRef(val, name) {
        if (val === _temporalUndefined) {
            throw new ReferenceError(name + ' is not defined - temporal dead zone');
        } else {
            return val;
        }
    }
    function _readOnlyError(name) {
        throw new Error('"' + name + '" is read-only');
    }
    function _classNameTDZError(name) {
        throw new Error('Class "' + name + '" cannot be referenced in computed property keys.');
    }
    var _temporalUndefined = {};
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _slicedToArrayLoose(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _nonIterableRest();
    }
    function _toArray(arr) {
        return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter) {
        if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter);
    }
    function _iterableToArrayLimit(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally{
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _iterableToArrayLimitLoose(arr, i) {
        var _arr = [];
        for(var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;){
            _arr.push(_step.value);
            if (i && _arr.length === i) break;
        }
        return _arr;
    }
    function _nonIterableSpread() {
        throw new TypeError('Invalid attempt to spread non-iterable instance');
    }
    function _nonIterableRest() {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }
    function _skipFirstGeneratorNext(fn) {
        return function() {
            var it = fn.apply(this, arguments);
            it.next();
            return it;
        };
    }
    function _toPrimitive(input, hint) {
        if (typeof input !== 'object' || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined) {
            var res = prim.call(input, hint || 'default');
            if (typeof res !== 'object') return res;
            throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return (hint === 'string' ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, 'string');
        return typeof key === 'symbol' ? key : String(key);
    }
    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.');
    }
    function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }
    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function(key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;
        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }
        desc = decorators.slice().reverse().reduce(function(desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);
        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }
        if (desc.initializer === void 0) {
            Object.defineProperty(target, property, desc);
            desc = null;
        }
        return desc;
    }
    var id = 0;
    function _classPrivateFieldLooseKey(name) {
        return '__private_' + id++ + '_' + name;
    }
    function _classPrivateFieldLooseBase(receiver, privateKey) {
        if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
            throw new TypeError('attempted to use private field on non-instance');
        }
        return receiver;
    }
    function _classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to get private field on non-instance');
        }
        var descriptor = privateMap.get(receiver);
        if (descriptor.get) {
            return descriptor.get.call(receiver);
        }
        return descriptor.value;
    }
    function _classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to set private field on non-instance');
        }
        var descriptor = privateMap.get(receiver);
        if (descriptor.set) {
            descriptor.set.call(receiver, value);
        } else {
            if (!descriptor.writable) {
                throw new TypeError('attempted to set read only private field');
            }
            descriptor.value = value;
        }
        return value;
    }
    function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }
        return descriptor.value;
    }
    function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }
        if (!descriptor.writable) {
            throw new TypeError('attempted to set read only private field');
        }
        descriptor.value = value;
        return value;
    }
    function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }
        return method;
    }
    function _classStaticPrivateMethodSet() {
        throw new TypeError('attempted to set read only static private field');
    }
    function _decorate(decorators, factory, superClass, mixins) {
        var api = _getDecoratorsApi();
        if (mixins) {
            for(var i = 0; i < mixins.length; i++){
                api = mixins[i](api);
            }
        }
        var r = factory(function initialize(O) {
            api.initializeInstanceElements(O, decorated.elements);
        }, superClass);
        var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
        api.initializeClassElements(r.F, decorated.elements);
        return api.runClassFinishers(r.F, decorated.finishers);
    }
    function _getDecoratorsApi() {
        _getDecoratorsApi = function() {
            return api;
        };
        var api = {
            elementsDefinitionOrder: [
                [
                    'method'
                ],
                [
                    'field'
                ]
            ],
            initializeInstanceElements: function(O, elements) {
                [
                    'method',
                    'field'
                ].forEach(function(kind) {
                    elements.forEach(function(element) {
                        if (element.kind === kind && element.placement === 'own') {
                            this.defineClassElement(O, element);
                        }
                    }, this);
                }, this);
            },
            initializeClassElements: function(F, elements) {
                var proto = F.prototype;
                [
                    'method',
                    'field'
                ].forEach(function(kind) {
                    elements.forEach(function(element) {
                        var placement = element.placement;
                        if (element.kind === kind && (placement === 'static' || placement === 'prototype')) {
                            var receiver = placement === 'static' ? F : proto;
                            this.defineClassElement(receiver, element);
                        }
                    }, this);
                }, this);
            },
            defineClassElement: function(receiver, element) {
                var descriptor = element.descriptor;
                if (element.kind === 'field') {
                    var initializer = element.initializer;
                    descriptor = {
                        enumerable: descriptor.enumerable,
                        writable: descriptor.writable,
                        configurable: descriptor.configurable,
                        value: initializer === void 0 ? void 0 : initializer.call(receiver)
                    };
                }
                Object.defineProperty(receiver, element.key, descriptor);
            },
            decorateClass: function(elements, decorators) {
                var newElements = [];
                var finishers = [];
                var placements = {
                    static: [],
                    prototype: [],
                    own: []
                };
                elements.forEach(function(element) {
                    this.addElementPlacement(element, placements);
                }, this);
                elements.forEach(function(element) {
                    if (!_hasDecorators(element)) return newElements.push(element);
                    var elementFinishersExtras = this.decorateElement(element, placements);
                    newElements.push(elementFinishersExtras.element);
                    newElements.push.apply(newElements, elementFinishersExtras.extras);
                    finishers.push.apply(finishers, elementFinishersExtras.finishers);
                }, this);
                if (!decorators) {
                    return {
                        elements: newElements,
                        finishers: finishers
                    };
                }
                var result = this.decorateConstructor(newElements, decorators);
                finishers.push.apply(finishers, result.finishers);
                result.finishers = finishers;
                return result;
            },
            addElementPlacement: function(element, placements, silent) {
                var keys = placements[element.placement];
                if (!silent && keys.indexOf(element.key) !== -1) {
                    throw new TypeError('Duplicated element (' + element.key + ')');
                }
                keys.push(element.key);
            },
            decorateElement: function(element, placements) {
                var extras = [];
                var finishers = [];
                for(var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--){
                    var keys = placements[element.placement];
                    keys.splice(keys.indexOf(element.key), 1);
                    var elementObject = this.fromElementDescriptor(element);
                    var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
                    element = elementFinisherExtras.element;
                    this.addElementPlacement(element, placements);
                    if (elementFinisherExtras.finisher) {
                        finishers.push(elementFinisherExtras.finisher);
                    }
                    var newExtras = elementFinisherExtras.extras;
                    if (newExtras) {
                        for(var j = 0; j < newExtras.length; j++){
                            this.addElementPlacement(newExtras[j], placements);
                        }
                        extras.push.apply(extras, newExtras);
                    }
                }
                return {
                    element: element,
                    finishers: finishers,
                    extras: extras
                };
            },
            decorateConstructor: function(elements, decorators) {
                var finishers = [];
                for(var i = decorators.length - 1; i >= 0; i--){
                    var obj = this.fromClassDescriptor(elements);
                    var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);
                    if (elementsAndFinisher.finisher !== undefined) {
                        finishers.push(elementsAndFinisher.finisher);
                    }
                    if (elementsAndFinisher.elements !== undefined) {
                        elements = elementsAndFinisher.elements;
                        for(var j = 0; j < elements.length - 1; j++){
                            for(var k = j + 1; k < elements.length; k++){
                                if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                                    throw new TypeError('Duplicated element (' + elements[j].key + ')');
                                }
                            }
                        }
                    }
                }
                return {
                    elements: elements,
                    finishers: finishers
                };
            },
            fromElementDescriptor: function(element) {
                var obj = {
                    kind: element.kind,
                    key: element.key,
                    placement: element.placement,
                    descriptor: element.descriptor
                };
                var desc = {
                    value: 'Descriptor',
                    configurable: true
                };
                Object.defineProperty(obj, Symbol.toStringTag, desc);
                if (element.kind === 'field') obj.initializer = element.initializer;
                return obj;
            },
            toElementDescriptors: function(elementObjects) {
                if (elementObjects === undefined) return;
                return _toArray(elementObjects).map(function(elementObject) {
                    var element = this.toElementDescriptor(elementObject);
                    this.disallowProperty(elementObject, 'finisher', 'An element descriptor');
                    this.disallowProperty(elementObject, 'extras', 'An element descriptor');
                    return element;
                }, this);
            },
            toElementDescriptor: function(elementObject) {
                var kind = String(elementObject.kind);
                if (kind !== 'method' && kind !== 'field') {
                    throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
                }
                var key = _toPropertyKey(elementObject.key);
                var placement = String(elementObject.placement);
                if (placement !== 'static' && placement !== 'prototype' && placement !== 'own') {
                    throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
                }
                var descriptor = elementObject.descriptor;
                this.disallowProperty(elementObject, 'elements', 'An element descriptor');
                var element = {
                    kind: kind,
                    key: key,
                    placement: placement,
                    descriptor: Object.assign({}, descriptor)
                };
                if (kind !== 'field') {
                    this.disallowProperty(elementObject, 'initializer', 'A method descriptor');
                } else {
                    this.disallowProperty(descriptor, 'get', 'The property descriptor of a field descriptor');
                    this.disallowProperty(descriptor, 'set', 'The property descriptor of a field descriptor');
                    this.disallowProperty(descriptor, 'value', 'The property descriptor of a field descriptor');
                    element.initializer = elementObject.initializer;
                }
                return element;
            },
            toElementFinisherExtras: function(elementObject) {
                var element = this.toElementDescriptor(elementObject);
                var finisher = _optionalCallableProperty(elementObject, 'finisher');
                var extras = this.toElementDescriptors(elementObject.extras);
                return {
                    element: element,
                    finisher: finisher,
                    extras: extras
                };
            },
            fromClassDescriptor: function(elements) {
                var obj = {
                    kind: 'class',
                    elements: elements.map(this.fromElementDescriptor, this)
                };
                var desc = {
                    value: 'Descriptor',
                    configurable: true
                };
                Object.defineProperty(obj, Symbol.toStringTag, desc);
                return obj;
            },
            toClassDescriptor: function(obj) {
                var kind = String(obj.kind);
                if (kind !== 'class') {
                    throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
                }
                this.disallowProperty(obj, 'key', 'A class descriptor');
                this.disallowProperty(obj, 'placement', 'A class descriptor');
                this.disallowProperty(obj, 'descriptor', 'A class descriptor');
                this.disallowProperty(obj, 'initializer', 'A class descriptor');
                this.disallowProperty(obj, 'extras', 'A class descriptor');
                var finisher = _optionalCallableProperty(obj, 'finisher');
                var elements = this.toElementDescriptors(obj.elements);
                return {
                    elements: elements,
                    finisher: finisher
                };
            },
            runClassFinishers: function(constructor, finishers) {
                for(var i = 0; i < finishers.length; i++){
                    var newConstructor = (0, finishers[i])(constructor);
                    if (newConstructor !== undefined) {
                        if (typeof newConstructor !== 'function') {
                            throw new TypeError('Finishers must return a constructor.');
                        }
                        constructor = newConstructor;
                    }
                }
                return constructor;
            },
            disallowProperty: function(obj, name, objectType) {
                if (obj[name] !== undefined) {
                    throw new TypeError(objectType + " can't have a ." + name + ' property.');
                }
            }
        };
        return api;
    }
    function _createElementDescriptor(def) {
        var key = _toPropertyKey(def.key);
        var descriptor;
        if (def.kind === 'method') {
            descriptor = {
                value: def.value,
                writable: true,
                configurable: true,
                enumerable: false
            };
        } else if (def.kind === 'get') {
            descriptor = {
                get: def.value,
                configurable: true,
                enumerable: false
            };
        } else if (def.kind === 'set') {
            descriptor = {
                set: def.value,
                configurable: true,
                enumerable: false
            };
        } else if (def.kind === 'field') {
            descriptor = {
                configurable: true,
                writable: true,
                enumerable: true
            };
        }
        var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static ? 'static' : def.kind === 'field' ? 'own' : 'prototype',
            descriptor: descriptor
        };
        if (def.decorators) element.decorators = def.decorators;
        if (def.kind === 'field') element.initializer = def.value;
        return element;
    }
    function _coalesceGetterSetter(element, other) {
        if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get;
        } else {
            other.descriptor.set = element.descriptor.set;
        }
    }
    function _coalesceClassElements(elements) {
        var newElements = [];
        var isSameElement = function(other) {
            return other.kind === 'method' && other.key === element.key && other.placement === element.placement;
        };
        for(var i = 0; i < elements.length; i++){
            var element = elements[i];
            var other;
            if (element.kind === 'method' && (other = newElements.find(isSameElement))) {
                if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
                    if (_hasDecorators(element) || _hasDecorators(other)) {
                        throw new ReferenceError('Duplicated methods (' + element.key + ") can't be decorated.");
                    }
                    other.descriptor = element.descriptor;
                } else {
                    if (_hasDecorators(element)) {
                        if (_hasDecorators(other)) {
                            throw new ReferenceError("Decorators can't be placed on different accessors with for " + 'the same property (' + element.key + ').');
                        }
                        other.decorators = element.decorators;
                    }
                    _coalesceGetterSetter(element, other);
                }
            } else {
                newElements.push(element);
            }
        }
        return newElements;
    }
    function _hasDecorators(element) {
        return element.decorators && element.decorators.length;
    }
    function _isDataDescriptor(desc) {
        return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
    }
    function _optionalCallableProperty(obj, name) {
        var value = obj[name];
        if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function");
        }
        return value;
    }
    function _classPrivateMethodGet(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) {
            throw new TypeError('attempted to get private field on non-instance');
        }
        return fn;
    }
    function _classPrivateMethodSet() {
        throw new TypeError('attempted to reassign private method');
    }
    function _wrapRegExp(re, groups) {
        _wrapRegExp = function(re, groups) {
            return new BabelRegExp(re, groups);
        };
        var _RegExp = _wrapNativeSuper(RegExp);
        var _super = RegExp.prototype;
        var _groups = new WeakMap();
        function BabelRegExp(re, groups) {
            var _this = _RegExp.call(this, re);
            _groups.set(_this, groups);
            return _this;
        }
        _inherits(BabelRegExp, _RegExp);
        BabelRegExp.prototype.exec = function(str) {
            var result = _super.exec.call(this, str);
            if (result) result.groups = buildGroups(result, this);
            return result;
        };
        BabelRegExp.prototype[Symbol.replace] = function(str, substitution) {
            if (typeof substitution === 'string') {
                var groups = _groups.get(this);
                return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function(_, name) {
                    return '$' + groups[name];
                }));
            } else if (typeof substitution === 'function') {
                var _this = this;
                return _super[Symbol.replace].call(this, str, function() {
                    var args = [];
                    args.push.apply(args, arguments);
                    if (typeof args[args.length - 1] !== 'object') {
                        args.push(buildGroups(args, _this));
                    }
                    return substitution.apply(this, args);
                });
            } else {
                return _super[Symbol.replace].call(this, str, substitution);
            }
        };
        function buildGroups(result, re) {
            var g = _groups.get(re);
            return Object.keys(g).reduce(function(groups, name) {
                groups[name] = result[g[name]];
                return groups;
            }, Object.create(null));
        }
        return _wrapRegExp.apply(this, arguments);
    }
    var vectorMultiply = function vectorMultiply(v, amount) {
        return createVector(v.x * amount, v.y * amount);
    };
    var vectorAdd = function vectorAdd(a, b) {
        return createVector(a.x + b.x, a.y + b.y);
    };
    var vectorNormalize = function vectorNormalize(v) {
        var l = Math.sqrt(v.x * v.x + v.y * v.y);
        if (l === 0) {
            return {
                x: 0,
                y: 0
            };
        }
        return createVector(v.x / l, v.y / l);
    };
    var vectorRotate = function vectorRotate(v, radians, origin) {
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var t = createVector(v.x - origin.x, v.y - origin.y);
        return createVector(origin.x + cos * t.x - sin * t.y, origin.y + sin * t.x + cos * t.y);
    };
    var createVector = function createVector() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        return {
            x: x,
            y: y
        };
    };
    var getMarkupValue = function getMarkupValue(value, size) {
        var scalar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var axis = arguments.length > 3 ? arguments[3] : undefined;
        if (typeof value === 'string') {
            return parseFloat(value) * scalar;
        }
        if (typeof value === 'number') {
            return value * (axis ? size[axis] : Math.min(size.width, size.height));
        }
        return;
    };
    var getMarkupStyles = function getMarkupStyles(markup, size, scale) {
        var lineStyle = markup.borderStyle || markup.lineStyle || 'solid';
        var fill = markup.backgroundColor || markup.fontColor || 'transparent';
        var stroke = markup.borderColor || markup.lineColor || 'transparent';
        var strokeWidth = getMarkupValue(markup.borderWidth || markup.lineWidth, size, scale);
        var lineCap = markup.lineCap || 'round';
        var lineJoin = markup.lineJoin || 'round';
        var dashes = typeof lineStyle === 'string' ? '' : lineStyle.map(function(v) {
            return getMarkupValue(v, size, scale);
        }).join(',');
        var opacity = markup.opacity || 1;
        return {
            'stroke-linecap': lineCap,
            'stroke-linejoin': lineJoin,
            'stroke-width': strokeWidth || 0,
            'stroke-dasharray': dashes,
            stroke: stroke,
            fill: fill,
            opacity: opacity
        };
    };
    var isDefined = function isDefined(value) {
        return value != null;
    };
    var getMarkupRect = function getMarkupRect(rect, size) {
        var scalar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var left = getMarkupValue(rect.x, size, scalar, 'width') || getMarkupValue(rect.left, size, scalar, 'width');
        var top = getMarkupValue(rect.y, size, scalar, 'height') || getMarkupValue(rect.top, size, scalar, 'height');
        var width = getMarkupValue(rect.width, size, scalar, 'width');
        var height = getMarkupValue(rect.height, size, scalar, 'height');
        var right = getMarkupValue(rect.right, size, scalar, 'width');
        var bottom = getMarkupValue(rect.bottom, size, scalar, 'height');
        if (!isDefined(top)) {
            if (isDefined(height) && isDefined(bottom)) {
                top = size.height - height - bottom;
            } else {
                top = bottom;
            }
        }
        if (!isDefined(left)) {
            if (isDefined(width) && isDefined(right)) {
                left = size.width - width - right;
            } else {
                left = right;
            }
        }
        if (!isDefined(width)) {
            if (isDefined(left) && isDefined(right)) {
                width = size.width - left - right;
            } else {
                width = 0;
            }
        }
        if (!isDefined(height)) {
            if (isDefined(top) && isDefined(bottom)) {
                height = size.height - top - bottom;
            } else {
                height = 0;
            }
        }
        return {
            x: left || 0,
            y: top || 0,
            width: width || 0,
            height: height || 0
        };
    };
    var pointsToPathShape = function pointsToPathShape(points) {
        return points.map(function(point, index) {
            return ''.concat(index === 0 ? 'M' : 'L', ' ').concat(point.x, ' ').concat(point.y);
        }).join(' ');
    };
    var setAttributes = function setAttributes(element, attr) {
        return Object.keys(attr).forEach(function(key) {
            return element.setAttribute(key, attr[key]);
        });
    };
    var ns = 'http://www.w3.org/2000/svg';
    var svg = function svg(tag, attr) {
        var element = document.createElementNS(ns, tag);
        if (attr) {
            setAttributes(element, attr);
        }
        return element;
    };
    var updateRect = function updateRect(element) {
        return setAttributes(element, Object.assign({}, element.rect, element.styles));
    };
    var updateEllipse = function updateEllipse(element) {
        var cx = element.rect.x + element.rect.width * 0.5;
        var cy = element.rect.y + element.rect.height * 0.5;
        var rx = element.rect.width * 0.5;
        var ry = element.rect.height * 0.5;
        return setAttributes(element, Object.assign({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry
        }, element.styles));
    };
    var IMAGE_FIT_STYLE = {
        contain: 'xMidYMid meet',
        cover: 'xMidYMid slice'
    };
    var updateImage = function updateImage(element, markup) {
        setAttributes(element, Object.assign({}, element.rect, element.styles, {
            preserveAspectRatio: IMAGE_FIT_STYLE[markup.fit] || 'none'
        }));
    };
    var TEXT_ANCHOR = {
        left: 'start',
        center: 'middle',
        right: 'end'
    };
    var updateText = function updateText(element, markup, size, scale) {
        var fontSize = getMarkupValue(markup.fontSize, size, scale);
        var fontFamily = markup.fontFamily || 'sans-serif';
        var fontWeight = markup.fontWeight || 'normal';
        var textAlign = TEXT_ANCHOR[markup.textAlign] || 'start';
        setAttributes(element, Object.assign({}, element.rect, element.styles, {
            'stroke-width': 0,
            'font-weight': fontWeight,
            'font-size': fontSize,
            'font-family': fontFamily,
            'text-anchor': textAlign
        }));
        // update text
        if (element.text !== markup.text) {
            element.text = markup.text;
            element.textContent = markup.text.length ? markup.text : ' ';
        }
    };
    var updateLine = function updateLine(element, markup, size, scale) {
        setAttributes(element, Object.assign({}, element.rect, element.styles, {
            fill: 'none'
        }));
        var line = element.childNodes[0];
        var begin = element.childNodes[1];
        var end = element.childNodes[2];
        var origin = element.rect;
        var target = {
            x: element.rect.x + element.rect.width,
            y: element.rect.y + element.rect.height
        };
        setAttributes(line, {
            x1: origin.x,
            y1: origin.y,
            x2: target.x,
            y2: target.y
        });
        if (!markup.lineDecoration) return;
        begin.style.display = 'none';
        end.style.display = 'none';
        var v = vectorNormalize({
            x: target.x - origin.x,
            y: target.y - origin.y
        });
        var l = getMarkupValue(0.05, size, scale);
        if (markup.lineDecoration.indexOf('arrow-begin') !== -1) {
            var arrowBeginRotationPoint = vectorMultiply(v, l);
            var arrowBeginCenter = vectorAdd(origin, arrowBeginRotationPoint);
            var arrowBeginA = vectorRotate(origin, 2, arrowBeginCenter);
            var arrowBeginB = vectorRotate(origin, -2, arrowBeginCenter);
            setAttributes(begin, {
                style: 'display:block;',
                d: 'M'.concat(arrowBeginA.x, ',').concat(arrowBeginA.y, ' L').concat(origin.x, ',').concat(origin.y, ' L').concat(arrowBeginB.x, ',').concat(arrowBeginB.y)
            });
        }
        if (markup.lineDecoration.indexOf('arrow-end') !== -1) {
            var arrowEndRotationPoint = vectorMultiply(v, -l);
            var arrowEndCenter = vectorAdd(target, arrowEndRotationPoint);
            var arrowEndA = vectorRotate(target, 2, arrowEndCenter);
            var arrowEndB = vectorRotate(target, -2, arrowEndCenter);
            setAttributes(end, {
                style: 'display:block;',
                d: 'M'.concat(arrowEndA.x, ',').concat(arrowEndA.y, ' L').concat(target.x, ',').concat(target.y, ' L').concat(arrowEndB.x, ',').concat(arrowEndB.y)
            });
        }
    };
    var updatePath = function updatePath(element, markup, size, scale) {
        setAttributes(element, Object.assign({}, element.styles, {
            fill: 'none',
            d: pointsToPathShape(markup.points.map(function(point) {
                return {
                    x: getMarkupValue(point.x, size, scale, 'width'),
                    y: getMarkupValue(point.y, size, scale, 'height')
                };
            }))
        }));
    };
    var createShape = function createShape(node) {
        return function(markup) {
            return svg(node, {
                id: markup.id
            });
        };
    };
    var createImage = function createImage(markup) {
        var shape = svg('image', {
            id: markup.id,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: '0'
        });
        shape.onload = function() {
            shape.setAttribute('opacity', markup.opacity || 1);
        };
        shape.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', markup.src);
        return shape;
    };
    var createLine = function createLine(markup) {
        var shape = svg('g', {
            id: markup.id,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        });
        var line = svg('line');
        shape.appendChild(line);
        var begin = svg('path');
        shape.appendChild(begin);
        var end = svg('path');
        shape.appendChild(end);
        return shape;
    };
    var CREATE_TYPE_ROUTES = {
        image: createImage,
        rect: createShape('rect'),
        ellipse: createShape('ellipse'),
        text: createShape('text'),
        path: createShape('path'),
        line: createLine
    };
    var UPDATE_TYPE_ROUTES = {
        rect: updateRect,
        ellipse: updateEllipse,
        image: updateImage,
        text: updateText,
        path: updatePath,
        line: updateLine
    };
    var createMarkupByType = function createMarkupByType(type, markup) {
        return CREATE_TYPE_ROUTES[type](markup);
    };
    var updateMarkupByType = function updateMarkupByType(element, type, markup, size, scale) {
        if (type !== 'path') {
            element.rect = getMarkupRect(markup, size, scale);
        }
        element.styles = getMarkupStyles(markup, size, scale);
        UPDATE_TYPE_ROUTES[type](element, markup, size, scale);
    };
    var MARKUP_RECT = [
        'x',
        'y',
        'left',
        'top',
        'right',
        'bottom',
        'width',
        'height'
    ];
    var toOptionalFraction = function toOptionalFraction(value) {
        return typeof value === 'string' && /%/.test(value) ? parseFloat(value) / 100 : value;
    };
    // adds default markup properties, clones markup
    var prepareMarkup = function prepareMarkup(markup) {
        var _markup = _slicedToArray(markup, 2), type = _markup[0], props = _markup[1];
        var rect = props.points ? {} : MARKUP_RECT.reduce(function(prev, curr) {
            prev[curr] = toOptionalFraction(props[curr]);
            return prev;
        }, {});
        return [
            type,
            Object.assign({
                zIndex: 0
            }, props, rect)
        ];
    };
    var sortMarkupByZIndex = function sortMarkupByZIndex(a, b) {
        if (a[1].zIndex > b[1].zIndex) {
            return 1;
        }
        if (a[1].zIndex < b[1].zIndex) {
            return -1;
        }
        return 0;
    };
    var createMarkupView = function createMarkupView(_) {
        return _.utils.createView({
            name: 'image-preview-markup',
            tag: 'svg',
            ignoreRect: true,
            mixins: {
                apis: [
                    'width',
                    'height',
                    'crop',
                    'markup',
                    'resize',
                    'dirty'
                ]
            },
            write: function write(_ref) {
                var root = _ref.root, props = _ref.props;
                if (!props.dirty) return;
                var crop = props.crop, resize = props.resize, markup = props.markup;
                var viewWidth = props.width;
                var viewHeight = props.height;
                var cropWidth = crop.width;
                var cropHeight = crop.height;
                if (resize) {
                    var _size = resize.size;
                    var outputWidth = _size && _size.width;
                    var outputHeight = _size && _size.height;
                    var outputFit = resize.mode;
                    var outputUpscale = resize.upscale;
                    if (outputWidth && !outputHeight) outputHeight = outputWidth;
                    if (outputHeight && !outputWidth) outputWidth = outputHeight;
                    var shouldUpscale = cropWidth < outputWidth && cropHeight < outputHeight;
                    if (!shouldUpscale || shouldUpscale && outputUpscale) {
                        var scalarWidth = outputWidth / cropWidth;
                        var scalarHeight = outputHeight / cropHeight;
                        if (outputFit === 'force') {
                            cropWidth = outputWidth;
                            cropHeight = outputHeight;
                        } else {
                            var scalar;
                            if (outputFit === 'cover') {
                                scalar = Math.max(scalarWidth, scalarHeight);
                            } else if (outputFit === 'contain') {
                                scalar = Math.min(scalarWidth, scalarHeight);
                            }
                            cropWidth = cropWidth * scalar;
                            cropHeight = cropHeight * scalar;
                        }
                    }
                }
                var size = {
                    width: viewWidth,
                    height: viewHeight
                };
                root.element.setAttribute('width', size.width);
                root.element.setAttribute('height', size.height);
                var scale = Math.min(viewWidth / cropWidth, viewHeight / cropHeight);
                // clear
                root.element.innerHTML = '';
                // get filter
                var markupFilter = root.query('GET_IMAGE_PREVIEW_MARKUP_FILTER');
                // draw new
                markup.filter(markupFilter).map(prepareMarkup).sort(sortMarkupByZIndex).forEach(function(markup) {
                    var _markup = _slicedToArray(markup, 2), type = _markup[0], settings = _markup[1];
                    // create
                    var element = createMarkupByType(type, settings);
                    // update
                    updateMarkupByType(element, type, settings, size, scale);
                    // add
                    root.element.appendChild(element);
                });
            }
        });
    };
    var createVector$1 = function createVector(x, y) {
        return {
            x: x,
            y: y
        };
    };
    var vectorDot = function vectorDot(a, b) {
        return a.x * b.x + a.y * b.y;
    };
    var vectorSubtract = function vectorSubtract(a, b) {
        return createVector$1(a.x - b.x, a.y - b.y);
    };
    var vectorDistanceSquared = function vectorDistanceSquared(a, b) {
        return vectorDot(vectorSubtract(a, b), vectorSubtract(a, b));
    };
    var vectorDistance = function vectorDistance(a, b) {
        return Math.sqrt(vectorDistanceSquared(a, b));
    };
    var getOffsetPointOnEdge = function getOffsetPointOnEdge(length, rotation) {
        var a = length;
        var A = 1.5707963267948966;
        var B = rotation;
        var C = 1.5707963267948966 - rotation;
        var sinA = Math.sin(A);
        var sinB = Math.sin(B);
        var sinC = Math.sin(C);
        var cosC = Math.cos(C);
        var ratio = a / sinA;
        var b = ratio * sinB;
        var c = ratio * sinC;
        return createVector$1(cosC * b, cosC * c);
    };
    var getRotatedRectSize = function getRotatedRectSize(rect, rotation) {
        var w = rect.width;
        var h = rect.height;
        var hor = getOffsetPointOnEdge(w, rotation);
        var ver = getOffsetPointOnEdge(h, rotation);
        var tl = createVector$1(rect.x + Math.abs(hor.x), rect.y - Math.abs(hor.y));
        var tr = createVector$1(rect.x + rect.width + Math.abs(ver.y), rect.y + Math.abs(ver.x));
        var bl = createVector$1(rect.x - Math.abs(ver.y), rect.y + rect.height - Math.abs(ver.x));
        return {
            width: vectorDistance(tl, tr),
            height: vectorDistance(tl, bl)
        };
    };
    var calculateCanvasSize = function calculateCanvasSize(image, canvasAspectRatio) {
        var zoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var imageAspectRatio = image.height / image.width;
        // determine actual pixels on x and y axis
        var canvasWidth = 1;
        var canvasHeight = canvasAspectRatio;
        var imgWidth = 1;
        var imgHeight = imageAspectRatio;
        if (imgHeight > canvasHeight) {
            imgHeight = canvasHeight;
            imgWidth = imgHeight / imageAspectRatio;
        }
        var scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        var width = image.width / (zoom * scalar * imgWidth);
        var height = width * canvasAspectRatio;
        return {
            width: width,
            height: height
        };
    };
    var getImageRectZoomFactor = function getImageRectZoomFactor(imageRect, cropRect, rotation, center) {
        // calculate available space round image center position
        var cx = center.x > 0.5 ? 1 - center.x : center.x;
        var cy = center.y > 0.5 ? 1 - center.y : center.y;
        var imageWidth = cx * 2 * imageRect.width;
        var imageHeight = cy * 2 * imageRect.height;
        // calculate rotated crop rectangle size
        var rotatedCropSize = getRotatedRectSize(cropRect, rotation);
        // calculate scalar required to fit image
        return Math.max(rotatedCropSize.width / imageWidth, rotatedCropSize.height / imageHeight);
    };
    var getCenteredCropRect = function getCenteredCropRect(container, aspectRatio) {
        var width = container.width;
        var height = width * aspectRatio;
        if (height > container.height) {
            height = container.height;
            width = height / aspectRatio;
        }
        var x = (container.width - width) * 0.5;
        var y = (container.height - height) * 0.5;
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    };
    var getCurrentCropSize = function getCurrentCropSize(imageSize) {
        var crop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var zoom = crop.zoom, rotation = crop.rotation, center = crop.center, aspectRatio = crop.aspectRatio;
        if (!aspectRatio) aspectRatio = imageSize.height / imageSize.width;
        var canvasSize = calculateCanvasSize(imageSize, aspectRatio, zoom);
        var canvasCenter = {
            x: canvasSize.width * 0.5,
            y: canvasSize.height * 0.5
        };
        var stage = {
            x: 0,
            y: 0,
            width: canvasSize.width,
            height: canvasSize.height,
            center: canvasCenter
        };
        var shouldLimit = typeof crop.scaleToFit === 'undefined' || crop.scaleToFit;
        var stageZoomFactor = getImageRectZoomFactor(imageSize, getCenteredCropRect(stage, aspectRatio), rotation, shouldLimit ? center : {
            x: 0.5,
            y: 0.5
        });
        var scale = zoom * stageZoomFactor;
        // start drawing
        return {
            widthFloat: canvasSize.width / scale,
            heightFloat: canvasSize.height / scale,
            width: Math.round(canvasSize.width / scale),
            height: Math.round(canvasSize.height / scale)
        };
    };
    var IMAGE_SCALE_SPRING_PROPS = {
        type: 'spring',
        stiffness: 0.5,
        damping: 0.45,
        mass: 10
    };
    // does horizontal and vertical flipping
    var createBitmapView = function createBitmapView(_) {
        return _.utils.createView({
            name: 'image-bitmap',
            ignoreRect: true,
            mixins: {
                styles: [
                    'scaleX',
                    'scaleY'
                ]
            },
            create: function create(_ref) {
                var root = _ref.root, props = _ref.props;
                root.appendChild(props.image);
            }
        });
    };
    // shifts and rotates image
    var createImageCanvasWrapper = function createImageCanvasWrapper(_) {
        return _.utils.createView({
            name: 'image-canvas-wrapper',
            tag: 'div',
            ignoreRect: true,
            mixins: {
                apis: [
                    'crop',
                    'width',
                    'height'
                ],
                styles: [
                    'originX',
                    'originY',
                    'translateX',
                    'translateY',
                    'scaleX',
                    'scaleY',
                    'rotateZ'
                ],
                animations: {
                    originX: IMAGE_SCALE_SPRING_PROPS,
                    originY: IMAGE_SCALE_SPRING_PROPS,
                    scaleX: IMAGE_SCALE_SPRING_PROPS,
                    scaleY: IMAGE_SCALE_SPRING_PROPS,
                    translateX: IMAGE_SCALE_SPRING_PROPS,
                    translateY: IMAGE_SCALE_SPRING_PROPS,
                    rotateZ: IMAGE_SCALE_SPRING_PROPS
                }
            },
            create: function create(_ref2) {
                var root = _ref2.root, props = _ref2.props;
                props.width = props.image.width;
                props.height = props.image.height;
                root.ref.bitmap = root.appendChildView(root.createChildView(createBitmapView(_), {
                    image: props.image
                }));
            },
            write: function write(_ref3) {
                var root = _ref3.root, props = _ref3.props;
                var flip = props.crop.flip;
                var bitmap = root.ref.bitmap;
                bitmap.scaleX = flip.horizontal ? -1 : 1;
                bitmap.scaleY = flip.vertical ? -1 : 1;
            }
        });
    };
    // clips canvas to correct aspect ratio
    var createClipView = function createClipView(_) {
        return _.utils.createView({
            name: 'image-clip',
            tag: 'div',
            ignoreRect: true,
            mixins: {
                apis: [
                    'crop',
                    'markup',
                    'resize',
                    'width',
                    'height',
                    'dirty',
                    'background'
                ],
                styles: [
                    'width',
                    'height',
                    'opacity'
                ],
                animations: {
                    opacity: {
                        type: 'tween',
                        duration: 250
                    }
                }
            },
            didWriteView: function didWriteView(_ref4) {
                var root = _ref4.root, props = _ref4.props;
                if (!props.background) return;
                root.element.style.backgroundColor = props.background;
            },
            create: function create(_ref5) {
                var root = _ref5.root, props = _ref5.props;
                root.ref.image = root.appendChildView(root.createChildView(createImageCanvasWrapper(_), Object.assign({}, props)));
                root.ref.createMarkup = function() {
                    if (root.ref.markup) return;
                    root.ref.markup = root.appendChildView(root.createChildView(createMarkupView(_), Object.assign({}, props)));
                };
                root.ref.destroyMarkup = function() {
                    if (!root.ref.markup) return;
                    root.removeChildView(root.ref.markup);
                    root.ref.markup = null;
                };
                // set up transparency grid
                var transparencyIndicator = root.query('GET_IMAGE_PREVIEW_TRANSPARENCY_INDICATOR');
                if (transparencyIndicator === null) return;
                // grid pattern
                if (transparencyIndicator === 'grid') {
                    root.element.dataset.transparencyIndicator = transparencyIndicator;
                } else {
                    root.element.dataset.transparencyIndicator = 'color';
                }
            },
            write: function write(_ref6) {
                var root = _ref6.root, props = _ref6.props, shouldOptimize = _ref6.shouldOptimize;
                var crop = props.crop, markup = props.markup, resize = props.resize, dirty = props.dirty, width = props.width, height = props.height;
                root.ref.image.crop = crop;
                var stage = {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    center: {
                        x: width * 0.5,
                        y: height * 0.5
                    }
                };
                var image = {
                    width: root.ref.image.width,
                    height: root.ref.image.height
                };
                var origin = {
                    x: crop.center.x * image.width,
                    y: crop.center.y * image.height
                };
                var translation = {
                    x: stage.center.x - image.width * crop.center.x,
                    y: stage.center.y - image.height * crop.center.y
                };
                var rotation = Math.PI * 2 + crop.rotation % (Math.PI * 2);
                var cropAspectRatio = crop.aspectRatio || image.height / image.width;
                var shouldLimit = typeof crop.scaleToFit === 'undefined' || crop.scaleToFit;
                var stageZoomFactor = getImageRectZoomFactor(image, getCenteredCropRect(stage, cropAspectRatio), rotation, shouldLimit ? crop.center : {
                    x: 0.5,
                    y: 0.5
                });
                var scale = crop.zoom * stageZoomFactor;
                // update markup view
                if (markup && markup.length) {
                    root.ref.createMarkup();
                    root.ref.markup.width = width;
                    root.ref.markup.height = height;
                    root.ref.markup.resize = resize;
                    root.ref.markup.dirty = dirty;
                    root.ref.markup.markup = markup;
                    root.ref.markup.crop = getCurrentCropSize(image, crop);
                } else if (root.ref.markup) {
                    root.ref.destroyMarkup();
                }
                // update image view
                var imageView = root.ref.image;
                // don't update clip layout
                if (shouldOptimize) {
                    imageView.originX = null;
                    imageView.originY = null;
                    imageView.translateX = null;
                    imageView.translateY = null;
                    imageView.rotateZ = null;
                    imageView.scaleX = null;
                    imageView.scaleY = null;
                    return;
                }
                imageView.originX = origin.x;
                imageView.originY = origin.y;
                imageView.translateX = translation.x;
                imageView.translateY = translation.y;
                imageView.rotateZ = rotation;
                imageView.scaleX = scale;
                imageView.scaleY = scale;
            }
        });
    };
    var createImageView = function createImageView(_) {
        return _.utils.createView({
            name: 'image-preview',
            tag: 'div',
            ignoreRect: true,
            mixins: {
                apis: [
                    'image',
                    'crop',
                    'markup',
                    'resize',
                    'dirty',
                    'background'
                ],
                styles: [
                    'translateY',
                    'scaleX',
                    'scaleY',
                    'opacity'
                ],
                animations: {
                    scaleX: IMAGE_SCALE_SPRING_PROPS,
                    scaleY: IMAGE_SCALE_SPRING_PROPS,
                    translateY: IMAGE_SCALE_SPRING_PROPS,
                    opacity: {
                        type: 'tween',
                        duration: 400
                    }
                }
            },
            create: function create(_ref7) {
                var root = _ref7.root, props = _ref7.props;
                root.ref.clip = root.appendChildView(root.createChildView(createClipView(_), {
                    id: props.id,
                    image: props.image,
                    crop: props.crop,
                    markup: props.markup,
                    resize: props.resize,
                    dirty: props.dirty,
                    background: props.background
                }));
            },
            write: function write(_ref8) {
                var root = _ref8.root, props = _ref8.props, shouldOptimize = _ref8.shouldOptimize;
                var clip = root.ref.clip;
                var image = props.image, crop = props.crop, markup = props.markup, resize = props.resize, dirty = props.dirty;
                clip.crop = crop;
                clip.markup = markup;
                clip.resize = resize;
                clip.dirty = dirty;
                // don't update clip layout
                clip.opacity = shouldOptimize ? 0 : 1;
                // don't re-render if optimizing or hidden (width will be zero resulting in weird animations)
                if (shouldOptimize || root.rect.element.hidden) return;
                // calculate scaled preview image size
                var imageAspectRatio = image.height / image.width;
                var aspectRatio = crop.aspectRatio || imageAspectRatio;
                // calculate container size
                var containerWidth = root.rect.inner.width;
                var containerHeight = root.rect.inner.height;
                var fixedPreviewHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
                var minPreviewHeight = root.query('GET_IMAGE_PREVIEW_MIN_HEIGHT');
                var maxPreviewHeight = root.query('GET_IMAGE_PREVIEW_MAX_HEIGHT');
                var panelAspectRatio = root.query('GET_PANEL_ASPECT_RATIO');
                var allowMultiple = root.query('GET_ALLOW_MULTIPLE');
                if (panelAspectRatio && !allowMultiple) {
                    fixedPreviewHeight = containerWidth * panelAspectRatio;
                    aspectRatio = panelAspectRatio;
                }
                // determine clip width and height
                var clipHeight = fixedPreviewHeight !== null ? fixedPreviewHeight : Math.max(minPreviewHeight, Math.min(containerWidth * aspectRatio, maxPreviewHeight));
                var clipWidth = clipHeight / aspectRatio;
                if (clipWidth > containerWidth) {
                    clipWidth = containerWidth;
                    clipHeight = clipWidth * aspectRatio;
                }
                if (clipHeight > containerHeight) {
                    clipHeight = containerHeight;
                    clipWidth = containerHeight / aspectRatio;
                }
                clip.width = clipWidth;
                clip.height = clipHeight;
            }
        });
    };
    var SVG_MASK = '<svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">\n    <defs>\n        <radialGradient id="gradient-__UID__" cx=".5" cy="1.25" r="1.15">\n            <stop offset=\'50%\' stop-color=\'#000000\'/>\n            <stop offset=\'56%\' stop-color=\'#0a0a0a\'/>\n            <stop offset=\'63%\' stop-color=\'#262626\'/>\n            <stop offset=\'69%\' stop-color=\'#4f4f4f\'/>\n            <stop offset=\'75%\' stop-color=\'#808080\'/>\n            <stop offset=\'81%\' stop-color=\'#b1b1b1\'/>\n            <stop offset=\'88%\' stop-color=\'#dadada\'/>\n            <stop offset=\'94%\' stop-color=\'#f6f6f6\'/>\n            <stop offset=\'100%\' stop-color=\'#ffffff\'/>\n        </radialGradient>\n        <mask id="mask-__UID__">\n            <rect x="0" y="0" width="500" height="200" fill="url(#gradient-__UID__)"></rect>\n        </mask>\n    </defs>\n    <rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-__UID__)"></rect>\n</svg>';
    var SVGMaskUniqueId = 0;
    var createImageOverlayView = function createImageOverlayView(fpAPI) {
        return fpAPI.utils.createView({
            name: 'image-preview-overlay',
            tag: 'div',
            ignoreRect: true,
            create: function create(_ref) {
                var root = _ref.root, props = _ref.props;
                var mask = SVG_MASK;
                if (document.querySelector('base')) {
                    var url = new URL(window.location.href.replace(window.location.hash, '')).href;
                    mask = mask.replace(/url\(\#/g, 'url(' + url + '#');
                }
                SVGMaskUniqueId++;
                root.element.classList.add('filepond--image-preview-overlay-'.concat(props.status));
                root.element.innerHTML = mask.replace(/__UID__/g, SVGMaskUniqueId);
            },
            mixins: {
                styles: [
                    'opacity'
                ],
                animations: {
                    opacity: {
                        type: 'spring',
                        mass: 25
                    }
                }
            }
        });
    };
    /**
   * Bitmap Worker
   */ var BitmapWorker = function BitmapWorker() {
        self.onmessage = function(e) {
            createImageBitmap(e.data.message.file).then(function(bitmap) {
                self.postMessage({
                    id: e.data.id,
                    message: bitmap
                }, [
                    bitmap
                ]);
            });
        };
    };
    /**
   * ColorMatrix Worker
   */ var ColorMatrixWorker = function ColorMatrixWorker() {
        self.onmessage = function(e) {
            var imageData = e.data.message.imageData;
            var matrix = e.data.message.colorMatrix;
            var data1 = imageData.data;
            var l = data1.length;
            var m11 = matrix[0];
            var m12 = matrix[1];
            var m13 = matrix[2];
            var m14 = matrix[3];
            var m15 = matrix[4];
            var m21 = matrix[5];
            var m22 = matrix[6];
            var m23 = matrix[7];
            var m24 = matrix[8];
            var m25 = matrix[9];
            var m31 = matrix[10];
            var m32 = matrix[11];
            var m33 = matrix[12];
            var m34 = matrix[13];
            var m35 = matrix[14];
            var m41 = matrix[15];
            var m42 = matrix[16];
            var m43 = matrix[17];
            var m44 = matrix[18];
            var m45 = matrix[19];
            var index = 0, r = 0.0, g = 0.0, b = 0.0, a = 0.0;
            for(; index < l; index += 4){
                r = data1[index] / 255;
                g = data1[index + 1] / 255;
                b = data1[index + 2] / 255;
                a = data1[index + 3] / 255;
                data1[index] = Math.max(0, Math.min((r * m11 + g * m12 + b * m13 + a * m14 + m15) * 255, 255));
                data1[index + 1] = Math.max(0, Math.min((r * m21 + g * m22 + b * m23 + a * m24 + m25) * 255, 255));
                data1[index + 2] = Math.max(0, Math.min((r * m31 + g * m32 + b * m33 + a * m34 + m35) * 255, 255));
                data1[index + 3] = Math.max(0, Math.min((r * m41 + g * m42 + b * m43 + a * m44 + m45) * 255, 255));
            }
            self.postMessage({
                id: e.data.id,
                message: imageData
            }, [
                imageData.data.buffer
            ]);
        };
    };
    var getImageSize = function getImageSize(url, cb) {
        var image = new Image();
        image.onload = function() {
            var width = image.naturalWidth;
            var height = image.naturalHeight;
            image = null;
            cb(width, height);
        };
        image.src = url;
    };
    var transforms = {
        1: function _() {
            return [
                1,
                0,
                0,
                1,
                0,
                0
            ];
        },
        2: function _(width) {
            return [
                -1,
                0,
                0,
                1,
                width,
                0
            ];
        },
        3: function _(width, height) {
            return [
                -1,
                0,
                0,
                -1,
                width,
                height
            ];
        },
        4: function _(width, height) {
            return [
                1,
                0,
                0,
                -1,
                0,
                height
            ];
        },
        5: function _() {
            return [
                0,
                1,
                1,
                0,
                0,
                0
            ];
        },
        6: function _(width, height) {
            return [
                0,
                1,
                -1,
                0,
                height,
                0
            ];
        },
        7: function _(width, height) {
            return [
                0,
                -1,
                -1,
                0,
                height,
                width
            ];
        },
        8: function _(width) {
            return [
                0,
                -1,
                1,
                0,
                0,
                width
            ];
        }
    };
    var fixImageOrientation = function fixImageOrientation(ctx, width, height, orientation) {
        // no orientation supplied
        if (orientation === -1) {
            return;
        }
        ctx.transform.apply(ctx, transforms[orientation](width, height));
    };
    // draws the preview image to canvas
    var createPreviewImage = function createPreviewImage(data1, width, height, orientation) {
        // can't draw on half pixels
        width = Math.round(width);
        height = Math.round(height);
        // draw image
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        // if is rotated incorrectly swap width and height
        if (orientation >= 5 && orientation <= 8) {
            var _ref = [
                height,
                width
            ];
            width = _ref[0];
            height = _ref[1];
        }
        // correct image orientation
        fixImageOrientation(ctx, width, height, orientation);
        // draw the image
        ctx.drawImage(data1, 0, 0, width, height);
        return canvas;
    };
    var isBitmap = function isBitmap(file) {
        return /^image/.test(file.type) && !/svg/.test(file.type);
    };
    var MAX_WIDTH = 10;
    var MAX_HEIGHT = 10;
    var calculateAverageColor = function calculateAverageColor(image) {
        var scalar = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var width = canvas.width = Math.ceil(image.width * scalar);
        var height = canvas.height = Math.ceil(image.height * scalar);
        ctx.drawImage(image, 0, 0, width, height);
        var data1 = null;
        try {
            data1 = ctx.getImageData(0, 0, width, height).data;
        } catch (e) {
            return null;
        }
        var l = data1.length;
        var r = 0;
        var g = 0;
        var b = 0;
        var i = 0;
        for(; i < l; i += 4){
            r += data1[i] * data1[i];
            g += data1[i + 1] * data1[i + 1];
            b += data1[i + 2] * data1[i + 2];
        }
        r = averageColor(r, l);
        g = averageColor(g, l);
        b = averageColor(b, l);
        return {
            r: r,
            g: g,
            b: b
        };
    };
    var averageColor = function averageColor(c, l) {
        return Math.floor(Math.sqrt(c / (l / 4)));
    };
    var cloneCanvas = function cloneCanvas(origin, target) {
        target = target || document.createElement('canvas');
        target.width = origin.width;
        target.height = origin.height;
        var ctx = target.getContext('2d');
        ctx.drawImage(origin, 0, 0);
        return target;
    };
    var cloneImageData = function cloneImageData(imageData) {
        var id;
        try {
            id = new ImageData(imageData.width, imageData.height);
        } catch (e) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            id = ctx.createImageData(imageData.width, imageData.height);
        }
        id.data.set(new Uint8ClampedArray(imageData.data));
        return id;
    };
    var loadImage = function loadImage(url) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function(e) {
                reject(e);
            };
            img.src = url;
        });
    };
    var createImageWrapperView = function createImageWrapperView(_) {
        // create overlay view
        var OverlayView = createImageOverlayView(_);
        var ImageView = createImageView(_);
        var createWorker = _.utils.createWorker;
        var applyFilter = function applyFilter(root, filter, target) {
            return new Promise(function(resolve) {
                // will store image data for future filter updates
                if (!root.ref.imageData) {
                    root.ref.imageData = target.getContext('2d').getImageData(0, 0, target.width, target.height);
                }
                // get image data reference
                var imageData = cloneImageData(root.ref.imageData);
                if (!filter || filter.length !== 20) {
                    target.getContext('2d').putImageData(imageData, 0, 0);
                    return resolve();
                }
                var worker = createWorker(ColorMatrixWorker);
                worker.post({
                    imageData: imageData,
                    colorMatrix: filter
                }, function(response) {
                    // apply filtered colors
                    target.getContext('2d').putImageData(response, 0, 0);
                    // stop worker
                    worker.terminate();
                    // done!
                    resolve();
                }, [
                    imageData.data.buffer
                ]);
            });
        };
        var removeImageView = function removeImageView(root, imageView) {
            root.removeChildView(imageView);
            imageView.image.width = 1;
            imageView.image.height = 1;
            imageView._destroy();
        };
        // remove an image
        var shiftImage = function shiftImage(_ref) {
            var root = _ref.root;
            var imageView = root.ref.images.shift();
            imageView.opacity = 0;
            imageView.translateY = -15;
            root.ref.imageViewBin.push(imageView);
            return imageView;
        };
        // add new image
        var pushImage = function pushImage(_ref2) {
            var root = _ref2.root, props = _ref2.props, image = _ref2.image;
            var id = props.id;
            var item = root.query('GET_ITEM', {
                id: id
            });
            if (!item) return;
            var crop = item.getMetadata('crop') || {
                center: {
                    x: 0.5,
                    y: 0.5
                },
                flip: {
                    horizontal: false,
                    vertical: false
                },
                zoom: 1,
                rotation: 0,
                aspectRatio: null
            };
            var background = root.query('GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR');
            var markup;
            var resize;
            var dirty = false;
            if (root.query('GET_IMAGE_PREVIEW_MARKUP_SHOW')) {
                markup = item.getMetadata('markup') || [];
                resize = item.getMetadata('resize');
                dirty = true;
            }
            // append image presenter
            var imageView = root.appendChildView(root.createChildView(ImageView, {
                id: id,
                image: image,
                crop: crop,
                resize: resize,
                markup: markup,
                dirty: dirty,
                background: background,
                opacity: 0,
                scaleX: 1.15,
                scaleY: 1.15,
                translateY: 15
            }), root.childViews.length);
            root.ref.images.push(imageView);
            // reveal the preview image
            imageView.opacity = 1;
            imageView.scaleX = 1;
            imageView.scaleY = 1;
            imageView.translateY = 0;
            // the preview is now ready to be drawn
            setTimeout(function() {
                root.dispatch('DID_IMAGE_PREVIEW_SHOW', {
                    id: id
                });
            }, 250);
        };
        var updateImage = function updateImage(_ref3) {
            var root = _ref3.root, props = _ref3.props;
            var item = root.query('GET_ITEM', {
                id: props.id
            });
            if (!item) return;
            var imageView = root.ref.images[root.ref.images.length - 1];
            imageView.crop = item.getMetadata('crop');
            imageView.background = root.query('GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR');
            if (root.query('GET_IMAGE_PREVIEW_MARKUP_SHOW')) {
                imageView.dirty = true;
                imageView.resize = item.getMetadata('resize');
                imageView.markup = item.getMetadata('markup');
            }
        };
        // replace image preview
        var didUpdateItemMetadata = function didUpdateItemMetadata(_ref4) {
            var root = _ref4.root, props = _ref4.props, action = _ref4.action;
            // only filter and crop trigger redraw
            if (!/crop|filter|markup|resize/.test(action.change.key)) return;
            // no images to update, exit
            if (!root.ref.images.length) return;
            // no item found, exit
            var item = root.query('GET_ITEM', {
                id: props.id
            });
            if (!item) return;
            // for now, update existing image when filtering
            if (/filter/.test(action.change.key)) {
                var imageView = root.ref.images[root.ref.images.length - 1];
                applyFilter(root, action.change.value, imageView.image);
                return;
            }
            if (/crop|markup|resize/.test(action.change.key)) {
                var crop = item.getMetadata('crop');
                var image = root.ref.images[root.ref.images.length - 1];
                // if aspect ratio has changed, we need to create a new image
                if (crop && crop.aspectRatio && image.crop && image.crop.aspectRatio && Math.abs(crop.aspectRatio - image.crop.aspectRatio) > 0.00001) {
                    var _imageView = shiftImage({
                        root: root
                    });
                    pushImage({
                        root: root,
                        props: props,
                        image: cloneCanvas(_imageView.image)
                    });
                } else {
                    updateImage({
                        root: root,
                        props: props
                    });
                }
            }
        };
        var canCreateImageBitmap = function canCreateImageBitmap(file) {
            // Firefox versions before 58 will freeze when running createImageBitmap
            // in a Web Worker so we detect those versions and return false for support
            var userAgent = window.navigator.userAgent;
            var isFirefox = userAgent.match(/Firefox\/([0-9]+)\./);
            var firefoxVersion = isFirefox ? parseInt(isFirefox[1]) : null;
            if (firefoxVersion !== null && firefoxVersion <= 58) return false;
            return 'createImageBitmap' in window && isBitmap(file);
        };
        /**
     * Write handler for when preview container has been created
     */ var didCreatePreviewContainer = function didCreatePreviewContainer(_ref5) {
            var root = _ref5.root, props = _ref5.props;
            var id = props.id;
            // we need to get the file data to determine the eventual image size
            var item = root.query('GET_ITEM', id);
            if (!item) return;
            // get url to file (we'll revoke it later on when done)
            var fileURL = URL.createObjectURL(item.file);
            // determine image size of this item
            getImageSize(fileURL, function(width, height) {
                // we can now scale the panel to the final size
                root.dispatch('DID_IMAGE_PREVIEW_CALCULATE_SIZE', {
                    id: id,
                    width: width,
                    height: height
                });
            });
        };
        var drawPreview = function drawPreview(_ref6) {
            var root = _ref6.root, props = _ref6.props;
            var id = props.id;
            // we need to get the file data to determine the eventual image size
            var item = root.query('GET_ITEM', id);
            if (!item) return;
            // get url to file (we'll revoke it later on when done)
            var fileURL = URL.createObjectURL(item.file);
            // fallback
            var loadPreviewFallback = function loadPreviewFallback() {
                // let's scale the image in the main thread :(
                loadImage(fileURL).then(previewImageLoaded);
            };
            // image is now ready
            var previewImageLoaded = function previewImageLoaded(imageData) {
                // the file url is no longer needed
                URL.revokeObjectURL(fileURL);
                // draw the scaled down version here and use that as source so bitmapdata can be closed
                // orientation info
                var exif = item.getMetadata('exif') || {};
                var orientation = exif.orientation || -1;
                // get width and height from action, and swap if orientation is incorrect
                var width = imageData.width, height = imageData.height;
                // if no width or height, just return early.
                if (!width || !height) return;
                if (orientation >= 5 && orientation <= 8) {
                    var _ref7 = [
                        height,
                        width
                    ];
                    width = _ref7[0];
                    height = _ref7[1];
                }
                // scale canvas based on pixel density
                // we multiply by .75 as that creates smaller but still clear images on screens with high res displays
                var pixelDensityFactor = Math.max(1, window.devicePixelRatio * 0.75);
                // we want as much pixels to work with as possible,
                // this multiplies the minimum image resolution,
                // so when zooming in it doesn't get too blurry
                var zoomFactor = root.query('GET_IMAGE_PREVIEW_ZOOM_FACTOR');
                // imaeg scale factor
                var scaleFactor = zoomFactor * pixelDensityFactor;
                // calculate scaled preview image size
                var previewImageRatio = height / width;
                // calculate image preview height and width
                var previewContainerWidth = root.rect.element.width;
                var previewContainerHeight = root.rect.element.height;
                var imageWidth = previewContainerWidth;
                var imageHeight = imageWidth * previewImageRatio;
                if (previewImageRatio > 1) {
                    imageWidth = Math.min(width, previewContainerWidth * scaleFactor);
                    imageHeight = imageWidth * previewImageRatio;
                } else {
                    imageHeight = Math.min(height, previewContainerHeight * scaleFactor);
                    imageWidth = imageHeight / previewImageRatio;
                }
                // transfer to image tag so no canvas memory wasted on iOS
                var previewImage = createPreviewImage(imageData, imageWidth, imageHeight, orientation);
                // done
                var done = function done() {
                    // calculate average image color, disabled for now
                    var averageColor = root.query('GET_IMAGE_PREVIEW_CALCULATE_AVERAGE_IMAGE_COLOR') ? calculateAverageColor(data) : null;
                    item.setMetadata('color', averageColor, true);
                    // data has been transferred to canvas ( if was ImageBitmap )
                    if ('close' in imageData) {
                        imageData.close();
                    }
                    // show the overlay
                    root.ref.overlayShadow.opacity = 1;
                    // create the first image
                    pushImage({
                        root: root,
                        props: props,
                        image: previewImage
                    });
                };
                // apply filter
                var filter = item.getMetadata('filter');
                if (filter) {
                    applyFilter(root, filter, previewImage).then(done);
                } else {
                    done();
                }
            };
            // if we support scaling using createImageBitmap we use a worker
            if (canCreateImageBitmap(item.file)) {
                // let's scale the image in a worker
                var worker = createWorker(BitmapWorker);
                worker.post({
                    file: item.file
                }, function(imageBitmap) {
                    // destroy worker
                    worker.terminate();
                    // no bitmap returned, must be something wrong,
                    // try the oldschool way
                    if (!imageBitmap) {
                        loadPreviewFallback();
                        return;
                    }
                    // yay we got our bitmap, let's continue showing the preview
                    previewImageLoaded(imageBitmap);
                });
            } else {
                // create fallback preview
                loadPreviewFallback();
            }
        };
        /**
     * Write handler for when the preview image is ready to be animated
     */ var didDrawPreview = function didDrawPreview(_ref8) {
            var root = _ref8.root;
            // get last added image
            var image = root.ref.images[root.ref.images.length - 1];
            image.translateY = 0;
            image.scaleX = 1.0;
            image.scaleY = 1.0;
            image.opacity = 1;
        };
        /**
     * Write handler for when the preview has been loaded
     */ var restoreOverlay = function restoreOverlay(_ref9) {
            var root = _ref9.root;
            root.ref.overlayShadow.opacity = 1;
            root.ref.overlayError.opacity = 0;
            root.ref.overlaySuccess.opacity = 0;
        };
        var didThrowError = function didThrowError(_ref10) {
            var root = _ref10.root;
            root.ref.overlayShadow.opacity = 0.25;
            root.ref.overlayError.opacity = 1;
        };
        var didCompleteProcessing = function didCompleteProcessing(_ref11) {
            var root = _ref11.root;
            root.ref.overlayShadow.opacity = 0.25;
            root.ref.overlaySuccess.opacity = 1;
        };
        /**
     * Constructor
     */ var create = function create(_ref12) {
            var root = _ref12.root;
            // image view
            root.ref.images = [];
            // the preview image data (we need this to filter the image)
            root.ref.imageData = null;
            // image bin
            root.ref.imageViewBin = [];
            // image overlays
            root.ref.overlayShadow = root.appendChildView(root.createChildView(OverlayView, {
                opacity: 0,
                status: 'idle'
            }));
            root.ref.overlaySuccess = root.appendChildView(root.createChildView(OverlayView, {
                opacity: 0,
                status: 'success'
            }));
            root.ref.overlayError = root.appendChildView(root.createChildView(OverlayView, {
                opacity: 0,
                status: 'failure'
            }));
        };
        return _.utils.createView({
            name: 'image-preview-wrapper',
            create: create,
            styles: [
                'height'
            ],
            apis: [
                'height'
            ],
            destroy: function destroy(_ref13) {
                var root = _ref13.root;
                // we resize the image so memory on iOS 12 is released more quickly (it seems)
                root.ref.images.forEach(function(imageView) {
                    imageView.image.width = 1;
                    imageView.image.height = 1;
                });
            },
            didWriteView: function didWriteView(_ref14) {
                var root = _ref14.root;
                root.ref.images.forEach(function(imageView) {
                    imageView.dirty = false;
                });
            },
            write: _.utils.createRoute({
                // image preview stated
                DID_IMAGE_PREVIEW_DRAW: didDrawPreview,
                DID_IMAGE_PREVIEW_CONTAINER_CREATE: didCreatePreviewContainer,
                DID_FINISH_CALCULATE_PREVIEWSIZE: drawPreview,
                DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
                // file states
                DID_THROW_ITEM_LOAD_ERROR: didThrowError,
                DID_THROW_ITEM_PROCESSING_ERROR: didThrowError,
                DID_THROW_ITEM_INVALID: didThrowError,
                DID_COMPLETE_ITEM_PROCESSING: didCompleteProcessing,
                DID_START_ITEM_PROCESSING: restoreOverlay,
                DID_REVERT_ITEM_PROCESSING: restoreOverlay
            }, function(_ref15) {
                var root = _ref15.root;
                // views on death row
                var viewsToRemove = root.ref.imageViewBin.filter(function(imageView) {
                    return imageView.opacity === 0;
                });
                // views to retain
                root.ref.imageViewBin = root.ref.imageViewBin.filter(function(imageView) {
                    return imageView.opacity > 0;
                });
                // remove these views
                viewsToRemove.forEach(function(imageView) {
                    return removeImageView(root, imageView);
                });
                viewsToRemove.length = 0;
            })
        });
    };
    /**
   * Image Preview Plugin
   */ var plugin = function plugin(fpAPI) {
        var addFilter = fpAPI.addFilter, utils = fpAPI.utils;
        var Type = utils.Type, createRoute = utils.createRoute, isFile = utils.isFile;
        // imagePreviewView
        var imagePreviewView = createImageWrapperView(fpAPI);
        // called for each view that is created right after the 'create' method
        addFilter('CREATE_VIEW', function(viewAPI) {
            // get reference to created view
            var is = viewAPI.is, view = viewAPI.view, query = viewAPI.query;
            // only hook up to item view and only if is enabled for this cropper
            if (!is('file') || !query('GET_ALLOW_IMAGE_PREVIEW')) return;
            // create the image preview plugin, but only do so if the item is an image
            var didLoadItem = function didLoadItem(_ref) {
                var root = _ref.root, props = _ref.props;
                var id = props.id;
                var item = query('GET_ITEM', id);
                // item could theoretically have been removed in the mean time
                if (!item || !isFile(item.file) || item.archived) return;
                // get the file object
                var file = item.file;
                // exit if this is not an image
                if (!isPreviewableImage(file)) return;
                // test if is filtered
                if (!query('GET_IMAGE_PREVIEW_FILTER_ITEM')(item)) return;
                // exit if image size is too high and no createImageBitmap support
                // this would simply bring the browser to its knees and that is not what we want
                var supportsCreateImageBitmap = 'createImageBitmap' in (window || {});
                var maxPreviewFileSize = query('GET_IMAGE_PREVIEW_MAX_FILE_SIZE');
                if (!supportsCreateImageBitmap && maxPreviewFileSize && file.size > maxPreviewFileSize) return;
                // set preview view
                root.ref.imagePreview = view.appendChildView(view.createChildView(imagePreviewView, {
                    id: id
                }));
                // update height if is fixed
                var fixedPreviewHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
                if (fixedPreviewHeight) {
                    root.dispatch('DID_UPDATE_PANEL_HEIGHT', {
                        id: item.id,
                        height: fixedPreviewHeight
                    });
                }
                // now ready
                var queue = !supportsCreateImageBitmap && file.size > query('GET_IMAGE_PREVIEW_MAX_INSTANT_PREVIEW_FILE_SIZE');
                root.dispatch('DID_IMAGE_PREVIEW_CONTAINER_CREATE', {
                    id: id
                }, queue);
            };
            var rescaleItem = function rescaleItem(root, props) {
                if (!root.ref.imagePreview) return;
                var id = props.id;
                // get item
                var item = root.query('GET_ITEM', {
                    id: id
                });
                if (!item) return;
                // if is fixed height or panel has aspect ratio, exit here, height has already been defined
                var panelAspectRatio = root.query('GET_PANEL_ASPECT_RATIO');
                var itemPanelAspectRatio = root.query('GET_ITEM_PANEL_ASPECT_RATIO');
                var fixedHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
                if (panelAspectRatio || itemPanelAspectRatio || fixedHeight) return;
                // no data!
                var _root$ref = root.ref, imageWidth = _root$ref.imageWidth, imageHeight = _root$ref.imageHeight;
                if (!imageWidth || !imageHeight) return;
                // get height min and max
                var minPreviewHeight = root.query('GET_IMAGE_PREVIEW_MIN_HEIGHT');
                var maxPreviewHeight = root.query('GET_IMAGE_PREVIEW_MAX_HEIGHT');
                // orientation info
                var exif = item.getMetadata('exif') || {};
                var orientation = exif.orientation || -1;
                // get width and height from action, and swap of orientation is incorrect
                if (orientation >= 5 && orientation <= 8) {
                    var _ref2 = [
                        imageHeight,
                        imageWidth
                    ];
                    imageWidth = _ref2[0];
                    imageHeight = _ref2[1];
                }
                // scale up width and height when we're dealing with an SVG
                if (!isBitmap(item.file) || root.query('GET_IMAGE_PREVIEW_UPSCALE')) {
                    var scalar = 2048 / imageWidth;
                    imageWidth *= scalar;
                    imageHeight *= scalar;
                }
                // image aspect ratio
                var imageAspectRatio = imageHeight / imageWidth;
                // we need the item to get to the crop size
                var previewAspectRatio = (item.getMetadata('crop') || {}).aspectRatio || imageAspectRatio;
                // preview height range
                var previewHeightMax = Math.max(minPreviewHeight, Math.min(imageHeight, maxPreviewHeight));
                var itemWidth = root.rect.element.width;
                var previewHeight = Math.min(itemWidth * previewAspectRatio, previewHeightMax);
                // request update to panel height
                root.dispatch('DID_UPDATE_PANEL_HEIGHT', {
                    id: item.id,
                    height: previewHeight
                });
            };
            var didResizeView = function didResizeView(_ref3) {
                var root = _ref3.root;
                // actions in next write operation
                root.ref.shouldRescale = true;
            };
            var didUpdateItemMetadata = function didUpdateItemMetadata(_ref4) {
                var root = _ref4.root, action = _ref4.action;
                if (action.change.key !== 'crop') return;
                // actions in next write operation
                root.ref.shouldRescale = true;
            };
            var didCalculatePreviewSize = function didCalculatePreviewSize(_ref5) {
                var root = _ref5.root, action = _ref5.action;
                // remember dimensions
                root.ref.imageWidth = action.width;
                root.ref.imageHeight = action.height;
                // actions in next write operation
                root.ref.shouldRescale = true;
                root.ref.shouldDrawPreview = true;
                // as image load could take a while and fire when draw loop is resting we need to give it a kick
                root.dispatch('KICK');
            };
            // start writing
            view.registerWriter(createRoute({
                DID_RESIZE_ROOT: didResizeView,
                DID_STOP_RESIZE: didResizeView,
                DID_LOAD_ITEM: didLoadItem,
                DID_IMAGE_PREVIEW_CALCULATE_SIZE: didCalculatePreviewSize,
                DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata
            }, function(_ref6) {
                var root = _ref6.root, props = _ref6.props;
                // no preview view attached
                if (!root.ref.imagePreview) return;
                // don't do anything while hidden
                if (root.rect.element.hidden) return;
                // resize the item panel
                if (root.ref.shouldRescale) {
                    rescaleItem(root, props);
                    root.ref.shouldRescale = false;
                }
                if (root.ref.shouldDrawPreview) {
                    // queue till next frame so we're sure the height has been applied this forces the draw image call inside the wrapper view to use the correct height
                    requestAnimationFrame(function() {
                        // this requestAnimationFrame nesting is horrible but it fixes an issue with 100hz displays on Chrome
                        // https://github.com/pqina/filepond-plugin-image-preview/issues/57
                        requestAnimationFrame(function() {
                            root.dispatch('DID_FINISH_CALCULATE_PREVIEWSIZE', {
                                id: props.id
                            });
                        });
                    });
                    root.ref.shouldDrawPreview = false;
                }
            }));
        });
        // expose plugin
        return {
            options: {
                // Enable or disable image preview
                allowImagePreview: [
                    true,
                    Type.BOOLEAN
                ],
                // filters file items to determine which are shown as preview
                imagePreviewFilterItem: [
                    function() {
                        return true;
                    },
                    Type.FUNCTION
                ],
                // Fixed preview height
                imagePreviewHeight: [
                    null,
                    Type.INT
                ],
                // Min image height
                imagePreviewMinHeight: [
                    44,
                    Type.INT
                ],
                // Max image height
                imagePreviewMaxHeight: [
                    256,
                    Type.INT
                ],
                // Max size of preview file for when createImageBitmap is not supported
                imagePreviewMaxFileSize: [
                    null,
                    Type.INT
                ],
                // The amount of extra pixels added to the image preview to allow comfortable zooming
                imagePreviewZoomFactor: [
                    2,
                    Type.INT
                ],
                // Should we upscale small images to fit the max bounding box of the preview area
                imagePreviewUpscale: [
                    false,
                    Type.BOOLEAN
                ],
                // Max size of preview file that we allow to try to instant preview if createImageBitmap is not supported, else image is queued for loading
                imagePreviewMaxInstantPreviewFileSize: [
                    1000000,
                    Type.INT
                ],
                // Style of the transparancy indicator used behind images
                imagePreviewTransparencyIndicator: [
                    null,
                    Type.STRING
                ],
                // Enables or disables reading average image color
                imagePreviewCalculateAverageImageColor: [
                    false,
                    Type.BOOLEAN
                ],
                // Enables or disables the previewing of markup
                imagePreviewMarkupShow: [
                    true,
                    Type.BOOLEAN
                ],
                // Allows filtering of markup to only show certain shapes
                imagePreviewMarkupFilter: [
                    function() {
                        return true;
                    },
                    Type.FUNCTION
                ]
            }
        };
    };
    // fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
    var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (isBrowser) {
        document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', {
            detail: plugin
        }));
    }
    return plugin;
});
}}),
}]);

//# sourceMappingURL=_826e5936._.js.map
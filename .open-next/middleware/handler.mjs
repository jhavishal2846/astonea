
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.0.2";globalThis.nextVersion = "16.2.6";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
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
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
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
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__0fq~heb._.js
var require_root_of_the_server_0fq_heb = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__0fq~heb._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__0fq~heb._.js", 51615, (e, r, o) => {
      r.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, r, o) => {
      r.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 38022, (e, r, o) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(42738));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, r2) {
        if ("then" === r2) return (r3, o3) => e2.then(r3, o3);
        let o2 = (...o3) => e2.then((e3) => (0, e3[r2])(...o3));
        return o2.then = (o3, n2) => e2.then((e3) => e3[r2]).then(o3, n2), o2;
      } });
    }]);
  }
});

// .next/server/edge/chunks/node_modules_next_0~vyq1w._.js
var require_node_modules_next_0_vyq1w = __commonJS({
  ".next/server/edge/chunks/node_modules_next_0~vyq1w._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_next_0~vyq1w._.js", 74398, (e, t, r) => {
    }, 26430, 52151, (e) => {
      "use strict";
      let t = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      t.reactServerComponents, t.actionBrowser, t.reactServerComponents, t.actionBrowser, t.instrument, t.middleware, t.apiNode, t.apiEdge, t.serverSideRendering, t.appPagesBrowser, t.reactServerComponents, t.actionBrowser, t.serverSideRendering, t.appPagesBrowser, t.shared, t.instrument, t.middleware, t.reactServerComponents, t.serverSideRendering, t.appPagesBrowser, t.actionBrowser, e.s(["CACHE_ONE_YEAR_SECONDS", 0, 31536e3, "HTML_CONTENT_TYPE_HEADER", 0, "text/html; charset=utf-8", "INFINITE_CACHE", 0, 4294967294, "NEXT_CACHE_IMPLICIT_TAG_ID", 0, "_N_T_", "NEXT_CACHE_REVALIDATED_TAGS_HEADER", 0, "x-next-revalidated-tags", "NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER", 0, "x-next-revalidate-tag-token", "NEXT_CACHE_SOFT_TAG_MAX_LENGTH", 0, 1024, "NEXT_CACHE_TAGS_HEADER", 0, "x-next-cache-tags", "NEXT_CACHE_TAG_MAX_ITEMS", 0, 128, "NEXT_CACHE_TAG_MAX_LENGTH", 0, 256, "NEXT_DATA_SUFFIX", 0, ".json", "NEXT_INTERCEPTION_MARKER_PREFIX", 0, "nxtI", "NEXT_META_SUFFIX", 0, ".meta", "NEXT_QUERY_PARAM_PREFIX", 0, "nxtP", "PRERENDER_REVALIDATE_HEADER", 0, "x-prerender-revalidate", "PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER", 0, "x-prerender-revalidate-if-generated", "RSC_SEGMENTS_DIR_SUFFIX", 0, ".segments", "RSC_SEGMENT_SUFFIX", 0, ".segment.rsc", "RSC_SUFFIX", 0, ".rsc"], 26430), e.s(["removeTrailingSlash", 0, function(e2) {
        return e2.replace(/\/$/, "") || "/";
      }], 52151);
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => h, parseSetCookie: () => d, stringifyCookie: () => c };
      for (var u in l) n(o, u, { get: l[u], enumerable: true });
      function c(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function h(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function d(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = h(e2), { domain: i2, expires: s2, httponly: a2, maxage: o2, path: l2, samesite: u2, secure: c2, partitioned: d2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, y, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...s2 && { expires: new Date(s2) }, ...a2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...u2 && { sameSite: f.includes(m2 = (m2 = u2).toLowerCase()) ? m2 : void 0 }, ...c2 && { secure: true }, ...g2 && { priority: p.includes(y = (y = g2).toLowerCase()) ? y : void 0 }, ...d2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of s(t2)) a.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(o2 = i(t2, l2)) || o2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var f = ["strict", "lax", "none"], p = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of h(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => c(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => c(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, s2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, s2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (s2 = true, o2 = i3, a2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!s2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(i2)) {
            const t3 = d(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = c(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(c).join("; ");
        }
      };
    }, 90460, (e) => {
      "use strict";
      var t = e.i(46478);
      e.s(["workAsyncStorage", () => t.workAsyncStorageInstance]);
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, i, s, a;
        var o, l, u, c, h, d, f, p, g, m, y, b, v, w, _, S, E = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), i2 = r3(172), s2 = r3(930), a2 = "context", o2 = new n2.NoopContextManager();
          class l2 {
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, i2.registerGlobal)(a2, e3, s2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(a2) || o2;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(a2, s2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = l2;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), i2 = r3(912), s2 = r3(957), a2 = r3(172);
          class o2 {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, a2.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: s2.DiagLogLevel.INFO }) => {
                var n3, o3, l2;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let u2 = (0, a2.getGlobal)("diag"), c2 = (0, i2.createLogLevelDiagLogger)(null != (o3 = r4.logLevel) ? o3 : s2.DiagLogLevel.INFO, e4);
                if (u2 && !r4.suppressOverrideMessage) {
                  let e5 = null != (l2 = Error().stack) ? l2 : "<failed to generate stacktrace>";
                  u2.warn(`Current logger will be overwritten from ${e5}`), c2.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a2.registerGlobal)("diag", c2, t3, true);
              }, t3.disable = () => {
                (0, a2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
          }
          t2.DiagAPI = o2;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), i2 = r3(172), s2 = r3(930), a2 = "metrics";
          class o2 {
            static getInstance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, i2.registerGlobal)(a2, e3, s2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(a2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(a2, s2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = o2;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), i2 = r3(874), s2 = r3(194), a2 = r3(277), o2 = r3(369), l2 = r3(930), u2 = "propagation", c2 = new i2.NoopTextMapPropagator();
          class h2 {
            constructor() {
              this.createBaggage = o2.createBaggage, this.getBaggage = a2.getBaggage, this.getActiveBaggage = a2.getActiveBaggage, this.setBaggage = a2.setBaggage, this.deleteBaggage = a2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(u2, e3, l2.DiagAPI.instance());
            }
            inject(e3, t3, r4 = s2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = s2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(u2, l2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(u2) || c2;
            }
          }
          t2.PropagationAPI = h2;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), i2 = r3(846), s2 = r3(139), a2 = r3(607), o2 = r3(930), l2 = "trace";
          class u2 {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = s2.wrapSpanContext, this.isSpanContextValid = s2.isSpanContextValid, this.deleteSpan = a2.deleteSpan, this.getSpan = a2.getSpan, this.getActiveSpan = a2.getActiveSpan, this.getSpanContext = a2.getSpanContext, this.setSpan = a2.setSpan, this.setSpanContext = a2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u2()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(l2, this._proxyTracerProvider, o2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, o2.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = u2;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), i2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function s2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = s2, t2.getActiveBaggage = function() {
            return s2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), i2 = r3(993), s2 = r3(830), a2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: s2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let i2 = new r3(t3._currentContext);
                return i2._currentContext.set(e4, n2), i2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), i2 = r3(521), s2 = r3(130), a2 = i2.VERSION.split(".")[0], o2 = Symbol.for(`opentelemetry.js.api.${a2}`), l2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var s3;
            let a3 = l2[o2] = null != (s3 = l2[o2]) ? s3 : { version: i2.VERSION };
            if (!n3 && a3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (a3.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${a3.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return a3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l2[o2]) ? void 0 : t3.version;
            if (n3 && (0, s2.isCompatible)(n3)) return null == (r4 = l2[o2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l2[o2];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function s2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let s3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != s3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function a2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return a2(e4);
              let o2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != o2.prerelease || s3.major !== o2.major) return a2(e4);
              if (0 === s3.major) return s3.minor === o2.minor && s3.patch <= o2.patch ? (t3.add(e4), true) : a2(e4);
              return s3.minor <= o2.minor ? (t3.add(e4), true) : a2(e4);
            };
          }
          t2._makeCompatibilityCheck = s2, t2.isCompatible = s2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class s2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = s2;
          class a2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = a2;
          class o2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = o2;
          class l2 extends o2 {
          }
          t2.NoopObservableCounterMetric = l2;
          class u2 extends o2 {
          }
          t2.NoopObservableGaugeMetric = u2;
          class c2 extends o2 {
          }
          t2.NoopObservableUpDownCounterMetric = c2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new a2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new s2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new u2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), i2 = r3(607), s2 = r3(403), a2 = r3(139), o2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = o2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new s2.NonRecordingSpan();
              let l2 = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, a2.isSpanContextValid)(l2) ? new s2.NonRecordingSpan(l2) : new s2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let s3, a3, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t3 : 3 == arguments.length ? (s3 = t3, l2 = r4) : (s3 = t3, a3 = r4, l2 = n3);
              let u2 = null != a3 ? a3 : o2.active(), c2 = this.startSpan(e3, s3, u2), h2 = (0, i2.setSpan)(u2, c2);
              return o2.with(h2, l2, void 0, c2);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), i2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), i2 = r3(403), s2 = r3(491), a2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o2(e3) {
            return e3.getValue(a2) || void 0;
          }
          function l2(e3, t3) {
            return e3.setValue(a2, t3);
          }
          t2.getSpan = o2, t2.getActiveSpan = function() {
            return o2(s2.ContextAPI.getInstance().active());
          }, t2.setSpan = l2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(a2);
          }, t2.setSpanContext = function(e3, t3) {
            return l2(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = o2(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class i2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), i3 = r4.indexOf("=");
                if (-1 !== i3) {
                  let s2 = r4.slice(0, i3), a2 = r4.slice(i3 + 1, t3.length);
                  (0, n2.validateKey)(s2) && (0, n2.validateValue)(a2) && e4.set(s2, a2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new i2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = i2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, s2 = RegExp(`^(?:${n2}|${i2})$`), a2 = /^[ -~]{0,255}[!-~]$/, o2 = /,|=/;
          t2.validateKey = function(e3) {
            return s2.test(e3);
          }, t2.validateValue = function(e3) {
            return a2.test(e3) && !o2.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), i2 = r3(403), s2 = /^([0-9a-f]{32})$/i, a2 = /^[0-9a-f]{16}$/i;
          function o2(e3) {
            return s2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l2(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = o2, t2.isValidSpanId = l2, t2.isSpanContextValid = function(e3) {
            return o2(e3.traceId) && l2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, x = {};
        function T(e2) {
          var t2 = x[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = x[e2] = { exports: {} }, n2 = true;
          try {
            E[e2].call(r3.exports, r3, r3.exports, T), n2 = false;
          } finally {
            n2 && delete x[e2];
          }
          return r3.exports;
        }
        T.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var C = {};
        Object.defineProperty(C, "__esModule", { value: true }), C.trace = C.propagation = C.metrics = C.diag = C.context = C.INVALID_SPAN_CONTEXT = C.INVALID_TRACEID = C.INVALID_SPANID = C.isValidSpanId = C.isValidTraceId = C.isSpanContextValid = C.createTraceState = C.TraceFlags = C.SpanStatusCode = C.SpanKind = C.SamplingDecision = C.ProxyTracerProvider = C.ProxyTracer = C.defaultTextMapSetter = C.defaultTextMapGetter = C.ValueType = C.createNoopMeter = C.DiagLogLevel = C.DiagConsoleLogger = C.ROOT_CONTEXT = C.createContextKey = C.baggageEntryMetadataFromString = void 0, o = T(369), Object.defineProperty(C, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return o.baggageEntryMetadataFromString;
        } }), l = T(780), Object.defineProperty(C, "createContextKey", { enumerable: true, get: function() {
          return l.createContextKey;
        } }), Object.defineProperty(C, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return l.ROOT_CONTEXT;
        } }), u = T(972), Object.defineProperty(C, "DiagConsoleLogger", { enumerable: true, get: function() {
          return u.DiagConsoleLogger;
        } }), c = T(957), Object.defineProperty(C, "DiagLogLevel", { enumerable: true, get: function() {
          return c.DiagLogLevel;
        } }), h = T(102), Object.defineProperty(C, "createNoopMeter", { enumerable: true, get: function() {
          return h.createNoopMeter;
        } }), d = T(901), Object.defineProperty(C, "ValueType", { enumerable: true, get: function() {
          return d.ValueType;
        } }), f = T(194), Object.defineProperty(C, "defaultTextMapGetter", { enumerable: true, get: function() {
          return f.defaultTextMapGetter;
        } }), Object.defineProperty(C, "defaultTextMapSetter", { enumerable: true, get: function() {
          return f.defaultTextMapSetter;
        } }), p = T(125), Object.defineProperty(C, "ProxyTracer", { enumerable: true, get: function() {
          return p.ProxyTracer;
        } }), g = T(846), Object.defineProperty(C, "ProxyTracerProvider", { enumerable: true, get: function() {
          return g.ProxyTracerProvider;
        } }), m = T(996), Object.defineProperty(C, "SamplingDecision", { enumerable: true, get: function() {
          return m.SamplingDecision;
        } }), y = T(357), Object.defineProperty(C, "SpanKind", { enumerable: true, get: function() {
          return y.SpanKind;
        } }), b = T(847), Object.defineProperty(C, "SpanStatusCode", { enumerable: true, get: function() {
          return b.SpanStatusCode;
        } }), v = T(475), Object.defineProperty(C, "TraceFlags", { enumerable: true, get: function() {
          return v.TraceFlags;
        } }), w = T(98), Object.defineProperty(C, "createTraceState", { enumerable: true, get: function() {
          return w.createTraceState;
        } }), _ = T(139), Object.defineProperty(C, "isSpanContextValid", { enumerable: true, get: function() {
          return _.isSpanContextValid;
        } }), Object.defineProperty(C, "isValidTraceId", { enumerable: true, get: function() {
          return _.isValidTraceId;
        } }), Object.defineProperty(C, "isValidSpanId", { enumerable: true, get: function() {
          return _.isValidSpanId;
        } }), S = T(476), Object.defineProperty(C, "INVALID_SPANID", { enumerable: true, get: function() {
          return S.INVALID_SPANID;
        } }), Object.defineProperty(C, "INVALID_TRACEID", { enumerable: true, get: function() {
          return S.INVALID_TRACEID;
        } }), Object.defineProperty(C, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return S.INVALID_SPAN_CONTEXT;
        } }), r2 = T(67), Object.defineProperty(C, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = T(506), Object.defineProperty(C, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), i = T(886), Object.defineProperty(C, "metrics", { enumerable: true, get: function() {
          return i.metrics;
        } }), s = T(939), Object.defineProperty(C, "propagation", { enumerable: true, get: function() {
          return s.propagation;
        } }), a = T(845), Object.defineProperty(C, "trace", { enumerable: true, get: function() {
          return a.trace;
        } }), C.default = { context: r2.context, diag: n.diag, metrics: i.metrics, propagation: s.propagation, trace: a.trace }, t.exports = C;
      })();
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, s = {};
        s.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, s2 = t2.split(n), a = (r3 || {}).decode || e2, o = 0; o < s2.length; o++) {
            var l = s2[o], u = l.indexOf("=");
            if (!(u < 0)) {
              var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
              '"' == h[0] && (h = h.slice(1, -1)), void 0 == i2[c] && (i2[c] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(h, a));
            }
          }
          return i2;
        }, s.serialize = function(e3, t2, n2) {
          var s2 = n2 || {}, a = s2.encode || r2;
          if ("function" != typeof a) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var o = a(t2);
          if (o && !i.test(o)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + o;
          if (null != s2.maxAge) {
            var u = s2.maxAge - 0;
            if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(u);
          }
          if (s2.domain) {
            if (!i.test(s2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + s2.domain;
          }
          if (s2.path) {
            if (!i.test(s2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + s2.path;
          }
          if (s2.expires) {
            if ("function" != typeof s2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + s2.expires.toUTCString();
          }
          if (s2.httpOnly && (l += "; HttpOnly"), s2.secure && (l += "; Secure"), s2.sameSite) switch ("string" == typeof s2.sameSite ? s2.sameSite.toLowerCase() : s2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = s;
      })();
    }, 7754, 90044, 46478, 53835, 82453, (e) => {
      "use strict";
      let t = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class r {
        disable() {
          throw t;
        }
        getStore() {
        }
        run() {
          throw t;
        }
        exit() {
          throw t;
        }
        enterWith() {
          throw t;
        }
        static bind(e2) {
          return e2;
        }
      }
      let n = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function i() {
        return n ? new n() : new r();
      }
      e.s(["bindSnapshot", 0, function(e2) {
        return n ? n.bind(e2) : r.bind(e2);
      }, "createAsyncLocalStorage", 0, i, "createSnapshot", 0, function() {
        return n ? n.snapshot() : function(e2, ...t2) {
          return e2(...t2);
        };
      }], 90044);
      let s = i();
      e.s(["workAsyncStorageInstance", 0, s], 46478), e.s([], 7754);
      let a = i();
      e.s(["getCacheSignal", 0, function(e2) {
        switch (e2.type) {
          case "prerender":
          case "prerender-client":
          case "validation-client":
          case "prerender-runtime":
            return e2.cacheSignal;
          case "request":
            if (e2.cacheSignal) return e2.cacheSignal;
          case "prerender-ppr":
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return e2;
        }
      }, "getDraftModeProviderForCacheScope", 0, function(e2, t2) {
        if (e2.isDraftMode) switch (t2.type) {
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-runtime":
          case "request":
            return t2.draftMode;
        }
      }, "getPrerenderResumeDataCache", 0, function(e2) {
        switch (e2.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return e2.prerenderResumeDataCache;
          case "request":
            if (e2.prerenderResumeDataCache) return e2.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return e2;
        }
      }, "getRenderResumeDataCache", 0, function(e2) {
        switch (e2.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
            if (e2.renderResumeDataCache) return e2.renderResumeDataCache;
          case "prerender-ppr":
            return e2.prerenderResumeDataCache ?? null;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return e2;
        }
      }], 53835), e.s(["workUnitAsyncStorage", 0, a], 82453);
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, s;
        var a = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function s2(e4, t3, n3, s3, a3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o3 = new i2(n3, s3 || e4, a3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], o3] : e4._events[l2].push(o3) : (e4._events[l2] = o3, e4._eventsCount++), e4;
          }
          function a2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, o2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, s3 = n3.length, a3 = Array(s3); i3 < s3; i3++) a3[i3] = n3[i3].fn;
            return a3;
          }, o2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o2.prototype.emit = function(e4, t3, n3, i3, s3, a3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return false;
            var l2, u2, c = this._events[o3], h = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), h) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, i3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, i3, s3), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, i3, s3, a3), true;
              }
              for (u2 = 1, l2 = Array(h - 1); u2 < h; u2++) l2[u2 - 1] = arguments[u2];
              c.fn.apply(c.context, l2);
            } else {
              var d, f = c.length;
              for (u2 = 0; u2 < f; u2++) switch (c[u2].once && this.removeListener(e4, c[u2].fn, void 0, true), h) {
                case 1:
                  c[u2].fn.call(c[u2].context);
                  break;
                case 2:
                  c[u2].fn.call(c[u2].context, t3);
                  break;
                case 3:
                  c[u2].fn.call(c[u2].context, t3, n3);
                  break;
                case 4:
                  c[u2].fn.call(c[u2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (d = 1, l2 = Array(h - 1); d < h; d++) l2[d - 1] = arguments[d];
                  c[u2].fn.apply(c[u2].context, l2);
              }
            }
            return true;
          }, o2.prototype.on = function(e4, t3, r4) {
            return s2(this, e4, t3, r4, false);
          }, o2.prototype.once = function(e4, t3, r4) {
            return s2(this, e4, t3, r4, true);
          }, o2.prototype.removeListener = function(e4, t3, n3, i3) {
            var s3 = r3 ? r3 + e4 : e4;
            if (!this._events[s3]) return this;
            if (!t3) return a2(this, s3), this;
            var o3 = this._events[s3];
            if (o3.fn) o3.fn !== t3 || i3 && !o3.once || n3 && o3.context !== n3 || a2(this, s3);
            else {
              for (var l2 = 0, u2 = [], c = o3.length; l2 < c; l2++) (o3[l2].fn !== t3 || i3 && !o3[l2].once || n3 && o3[l2].context !== n3) && u2.push(o3[l2]);
              u2.length ? this._events[s3] = 1 === u2.length ? u2[0] : u2 : a2(this, s3);
            }
            return this;
          }, o2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && a2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o2.prototype.off = o2.prototype.removeListener, o2.prototype.addListener = o2.prototype.on, o2.prefixed = r3, o2.EventEmitter = o2, e3.exports = o2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let s2 = i2 / 2 | 0, a2 = n2 + s2;
              0 >= r3(e4[a2], t3) ? (n2 = ++a2, i2 -= s2 + 1) : i2 = s2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let s2 = (e4, t3, r4) => new Promise((s3, a2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void s3(e4);
            let o2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  s3(r4());
                } catch (e5) {
                  a2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), a2(o3);
            }, t3);
            n2(e4.then(s3, a2), () => {
              clearTimeout(o2);
            });
          });
          e3.exports = s2, e3.exports.default = s2, e3.exports.TimeoutError = i2;
        } }, o = {};
        function l(e3) {
          var t2 = o[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = o[e3] = { exports: {} }, n2 = true;
          try {
            a[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete o[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var u = {};
        Object.defineProperty(u, "__esModule", { value: true }), e2 = l(993), r2 = l(816), n = l(821), i = () => {
        }, s = new r2.TimeoutError(), u.default = class extends e2 {
          constructor(e3) {
            var t2, r3, s2, a2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (s2 = e3.interval) ? void 0 : s2.toString()) ? a2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let a2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let a3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(s);
                  });
                  n2(await a3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(a2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = u;
      })();
    }, 25753, (e) => {
      "use strict";
      e.s(["InvariantError", 0, class extends Error {
        constructor(e2, t) {
          super(`Invariant: ${e2.endsWith(".") ? e2 : e2 + "."} This is a bug in Next.js.`, t), this.name = "InvariantError";
        }
      }]);
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return o;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let s = new (e.r(78500)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let n2 = a(e2, t2);
        return n2 ? s.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = s.getStore();
        return r2 || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return u;
      }, interceptFetch: function() {
        return c;
      }, reader: function() {
        return o;
      } };
      for (var s in i) Object.defineProperty(r, s, { enumerable: true, get: i[s] });
      let a = e.r(25085), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: s2, body: a2, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: f } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(s2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: f } };
      }
      async function u(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: i2, proxyPort: s2 } = r2, u2 = await l(i2, t2), c2 = await e2(`http://localhost:${s2}`, { method: "POST", body: JSON.stringify(u2), next: { internal: true } });
        if (!c2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let h = await c2.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(h);
          default:
            return d;
        }
      }
      function c(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : u(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let s = e.r(25085), a = e.r(28325);
      function o() {
        return (0, a.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, s.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 23407, 34144, 57841, 65664, 44655, 2275, 56827, 23741, 7553, 56148, 25754, 83735, 60403, (e) => {
      "use strict";
      let t, r;
      class n extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class i extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      e.s(["PageSignatureError", 0, class extends Error {
        constructor({ page: e2 }) {
          super(`The middleware "${e2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }, "RemovedPageError", 0, n, "RemovedUAError", 0, i], 23407);
      var s, a, o, l, u, c, h, d, f, p, g, m, y, b, v, w = e.i(26430);
      function _(e2) {
        var t2, r2, n2, i2, s2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e2.length && /\s/.test(e2.charAt(o2)); ) o2 += 1;
          return o2 < e2.length;
        }
        for (; o2 < e2.length; ) {
          for (t2 = o2, s2 = false; l2(); ) if ("," === (r2 = e2.charAt(o2))) {
            for (n2 = o2, o2 += 1, l2(), i2 = o2; o2 < e2.length && "=" !== (r2 = e2.charAt(o2)) && ";" !== r2 && "," !== r2; ) o2 += 1;
            o2 < e2.length && "=" === e2.charAt(o2) ? (s2 = true, o2 = i2, a2.push(e2.substring(t2, n2)), t2 = o2) : o2 = n2 + 1;
          } else o2 += 1;
          (!s2 || o2 >= e2.length) && a2.push(e2.substring(t2, e2.length));
        }
        return a2;
      }
      function S(e2) {
        let t2 = {}, r2 = [];
        if (e2) for (let [n2, i2] of e2.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(..._(i2)), t2[n2] = 1 === r2.length ? r2[0] : r2) : t2[n2] = i2;
        return t2;
      }
      function E(e2) {
        try {
          return String(new URL(String(e2)));
        } catch (t2) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      e.s(["fromNodeOutgoingHttpHeaders", 0, function(e2) {
        let t2 = new Headers();
        for (let [r2, n2] of Object.entries(e2)) for (let e3 of Array.isArray(n2) ? n2 : [n2]) void 0 !== e3 && ("number" == typeof e3 && (e3 = e3.toString()), t2.append(r2, e3));
        return t2;
      }, "normalizeNextQueryParam", 0, function(e2) {
        for (let t2 of [w.NEXT_QUERY_PARAM_PREFIX, w.NEXT_INTERCEPTION_MARKER_PREFIX]) if (e2 !== t2 && e2.startsWith(t2)) return e2.substring(t2.length);
        return null;
      }, "splitCookiesString", 0, _, "toNodeOutgoingHttpHeaders", 0, S, "validateURL", 0, E], 34144);
      var x = e.i(52151);
      function T(e2) {
        let t2 = e2.indexOf("#"), r2 = e2.indexOf("?"), n2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return n2 || t2 > -1 ? { pathname: e2.substring(0, n2 ? r2 : t2), query: n2 ? e2.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e2.slice(t2) : "" } : { pathname: e2, query: "", hash: "" };
      }
      function C(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: i2 } = T(e2);
        return `${t2}${r2}${n2}${i2}`;
      }
      function P(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: i2 } = T(e2);
        return `${r2}${t2}${n2}${i2}`;
      }
      function A(e2, t2) {
        if ("string" != typeof e2) return false;
        let { pathname: r2 } = T(e2);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      let R = /* @__PURE__ */ new WeakMap();
      function N(e2, t2) {
        let r2;
        if (!t2) return { pathname: e2 };
        let n2 = R.get(t2);
        n2 || (n2 = t2.map((e3) => e3.toLowerCase()), R.set(t2, n2));
        let i2 = e2.split("/", 2);
        if (!i2[1]) return { pathname: e2 };
        let s2 = i2[1].toLowerCase(), a2 = n2.indexOf(s2);
        return a2 < 0 ? { pathname: e2 } : (r2 = t2[a2], { pathname: e2 = e2.slice(r2.length + 1) || "/", detectedLocale: r2 });
      }
      let O = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function I(e2, t2) {
        let r2 = new URL(String(e2), t2 && String(t2));
        return O.test(r2.hostname) && (r2.hostname = "localhost"), r2;
      }
      let k = Symbol("NextURLInternal");
      class D {
        constructor(e2, t2, r2) {
          let n2, i2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (n2 = t2, i2 = r2 || {}) : i2 = r2 || t2 || {}, this[k] = { url: I(e2, n2 ?? i2.base), options: i2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e2, t2, r2, n2, i2;
          let s2 = function(e3, t3) {
            let { basePath: r3, i18n: n3, trailingSlash: i3 } = t3.nextConfig ?? {}, s3 = { pathname: e3, trailingSlash: "/" !== e3 ? e3.endsWith("/") : i3 };
            r3 && A(s3.pathname, r3) && (s3.pathname = function(e4, t4) {
              if (!A(e4, t4)) return e4;
              let r4 = e4.slice(t4.length);
              return r4.startsWith("/") ? r4 : `/${r4}`;
            }(s3.pathname, r3), s3.basePath = r3);
            let a3 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e4 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              s3.buildId = e4[0], a3 = "index" !== e4[1] ? `/${e4.slice(1).join("/")}` : "/", true === t3.parseData && (s3.pathname = a3);
            }
            if (n3) {
              let e4 = t3.i18nProvider ? t3.i18nProvider.analyze(s3.pathname) : N(s3.pathname, n3.locales);
              s3.locale = e4.detectedLocale, s3.pathname = e4.pathname ?? s3.pathname, !e4.detectedLocale && s3.buildId && (e4 = t3.i18nProvider ? t3.i18nProvider.analyze(a3) : N(a3, n3.locales)).detectedLocale && (s3.locale = e4.detectedLocale);
            }
            return s3;
          }(this[k].url.pathname, { nextConfig: this[k].options.nextConfig, parseData: true, i18nProvider: this[k].options.i18nProvider }), a2 = function(e3, t3) {
            let r3;
            if (t3?.host && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e3.hostname) return;
              r3 = e3.hostname;
            }
            return r3.toLowerCase();
          }(this[k].url, this[k].options.headers);
          this[k].domainLocale = this[k].options.i18nProvider ? this[k].options.i18nProvider.detectDomainLocale(a2) : function(e3, t3, r3) {
            if (e3) {
              for (let n3 of (r3 && (r3 = r3.toLowerCase()), e3)) if (t3 === n3.domain?.split(":", 1)[0].toLowerCase() || r3 === n3.defaultLocale.toLowerCase() || n3.locales?.some((e4) => e4.toLowerCase() === r3)) return n3;
            }
          }(null == (t2 = this[k].options.nextConfig) || null == (e2 = t2.i18n) ? void 0 : e2.domains, a2);
          let o2 = (null == (r2 = this[k].domainLocale) ? void 0 : r2.defaultLocale) || (null == (i2 = this[k].options.nextConfig) || null == (n2 = i2.i18n) ? void 0 : n2.defaultLocale);
          this[k].url.pathname = s2.pathname, this[k].defaultLocale = o2, this[k].basePath = s2.basePath ?? "", this[k].buildId = s2.buildId, this[k].locale = s2.locale ?? o2, this[k].trailingSlash = s2.trailingSlash;
        }
        formatPathname() {
          var e2;
          let t2;
          return t2 = function(e3, t3, r2, n2) {
            if (!t3 || t3 === r2) return e3;
            let i2 = e3.toLowerCase();
            return !n2 && (A(i2, "/api") || A(i2, `/${t3.toLowerCase()}`)) ? e3 : C(e3, `/${t3}`);
          }((e2 = { basePath: this[k].basePath, buildId: this[k].buildId, defaultLocale: this[k].options.forceLocale ? void 0 : this[k].defaultLocale, locale: this[k].locale, pathname: this[k].url.pathname, trailingSlash: this[k].trailingSlash }).pathname, e2.locale, e2.buildId ? void 0 : e2.defaultLocale, e2.ignorePrefix), (e2.buildId || !e2.trailingSlash) && (t2 = (0, x.removeTrailingSlash)(t2)), e2.buildId && (t2 = P(C(t2, `/_next/data/${e2.buildId}`), "/" === e2.pathname ? "index.json" : ".json")), t2 = C(t2, e2.basePath), !e2.buildId && e2.trailingSlash ? t2.endsWith("/") ? t2 : P(t2, "/") : (0, x.removeTrailingSlash)(t2);
        }
        formatSearch() {
          return this[k].url.search;
        }
        get buildId() {
          return this[k].buildId;
        }
        set buildId(e2) {
          this[k].buildId = e2;
        }
        get locale() {
          return this[k].locale ?? "";
        }
        set locale(e2) {
          var t2, r2;
          if (!this[k].locale || !(null == (r2 = this[k].options.nextConfig) || null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e2))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e2}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[k].locale = e2;
        }
        get defaultLocale() {
          return this[k].defaultLocale;
        }
        get domainLocale() {
          return this[k].domainLocale;
        }
        get searchParams() {
          return this[k].url.searchParams;
        }
        get host() {
          return this[k].url.host;
        }
        set host(e2) {
          this[k].url.host = e2;
        }
        get hostname() {
          return this[k].url.hostname;
        }
        set hostname(e2) {
          this[k].url.hostname = e2;
        }
        get port() {
          return this[k].url.port;
        }
        set port(e2) {
          this[k].url.port = e2;
        }
        get protocol() {
          return this[k].url.protocol;
        }
        set protocol(e2) {
          this[k].url.protocol = e2;
        }
        get href() {
          let e2 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e2}${t2}${this.hash}`;
        }
        set href(e2) {
          this[k].url = I(e2), this.analyze();
        }
        get origin() {
          return this[k].url.origin;
        }
        get pathname() {
          return this[k].url.pathname;
        }
        set pathname(e2) {
          this[k].url.pathname = e2;
        }
        get hash() {
          return this[k].url.hash;
        }
        set hash(e2) {
          this[k].url.hash = e2;
        }
        get search() {
          return this[k].url.search;
        }
        set search(e2) {
          this[k].url.search = e2;
        }
        get password() {
          return this[k].url.password;
        }
        set password(e2) {
          this[k].url.password = e2;
        }
        get username() {
          return this[k].url.username;
        }
        set username(e2) {
          this[k].url.username = e2;
        }
        get basePath() {
          return this[k].basePath;
        }
        set basePath(e2) {
          this[k].basePath = e2.startsWith("/") ? e2 : `/${e2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new D(String(this), this[k].options);
        }
      }
      e.s(["NextURL", 0, D], 57841);
      var L = e.i(28042);
      e.s([], 65664);
      let M = Symbol("internal request");
      class B extends Request {
        constructor(e2, t2 = {}) {
          const r2 = "string" != typeof e2 && "url" in e2 ? e2.url : String(e2);
          E(r2), e2 instanceof Request ? super(e2, t2) : super(r2, t2);
          const n2 = new D(r2, { headers: S(this.headers), nextConfig: t2.nextConfig });
          this[M] = { cookies: new L.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[M].cookies;
        }
        get nextUrl() {
          return this[M].nextUrl;
        }
        get page() {
          throw new n();
        }
        get ua() {
          throw new i();
        }
        get url() {
          return this[M].url;
        }
      }
      e.s(["NextRequest", 0, B], 44655);
      var $ = ((s = $ || {}).handleRequest = "BaseServer.handleRequest", s.run = "BaseServer.run", s.pipe = "BaseServer.pipe", s.getStaticHTML = "BaseServer.getStaticHTML", s.render = "BaseServer.render", s.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", s.renderToResponse = "BaseServer.renderToResponse", s.renderToHTML = "BaseServer.renderToHTML", s.renderError = "BaseServer.renderError", s.renderErrorToResponse = "BaseServer.renderErrorToResponse", s.renderErrorToHTML = "BaseServer.renderErrorToHTML", s.render404 = "BaseServer.render404", s), j = ((a = j || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", a.loadComponents = "LoadComponents.loadComponents", a), q = ((o = q || {}).getRequestHandler = "NextServer.getRequestHandler", o.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", o.getServer = "NextServer.getServer", o.getServerRequestHandler = "NextServer.getServerRequestHandler", o.createServer = "createServer.createServer", o), F = ((l = F || {}).compression = "NextNodeServer.compression", l.getBuildId = "NextNodeServer.getBuildId", l.createComponentTree = "NextNodeServer.createComponentTree", l.clientComponentLoading = "NextNodeServer.clientComponentLoading", l.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", l.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", l.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", l.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", l.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", l.sendRenderResult = "NextNodeServer.sendRenderResult", l.proxyRequest = "NextNodeServer.proxyRequest", l.runApi = "NextNodeServer.runApi", l.render = "NextNodeServer.render", l.renderHTML = "NextNodeServer.renderHTML", l.imageOptimizer = "NextNodeServer.imageOptimizer", l.getPagePath = "NextNodeServer.getPagePath", l.getRoutesManifest = "NextNodeServer.getRoutesManifest", l.findPageComponents = "NextNodeServer.findPageComponents", l.getFontManifest = "NextNodeServer.getFontManifest", l.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", l.getRequestHandler = "NextNodeServer.getRequestHandler", l.renderToHTML = "NextNodeServer.renderToHTML", l.renderError = "NextNodeServer.renderError", l.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", l.render404 = "NextNodeServer.render404", l.startResponse = "NextNodeServer.startResponse", l.route = "route", l.onProxyReq = "onProxyReq", l.apiResolver = "apiResolver", l.internalFetch = "internalFetch", l), U = ((u = U || {}).startServer = "startServer.startServer", u), Q = ((c = Q || {}).getServerSideProps = "Render.getServerSideProps", c.getStaticProps = "Render.getStaticProps", c.renderToString = "Render.renderToString", c.renderDocument = "Render.renderDocument", c.createBodyResult = "Render.createBodyResult", c), z = ((h = z || {}).renderToString = "AppRender.renderToString", h.renderToReadableStream = "AppRender.renderToReadableStream", h.getBodyResult = "AppRender.getBodyResult", h.fetch = "AppRender.fetch", h), V = ((d = V || {}).executeRoute = "Router.executeRoute", d), H = ((f = H || {}).runHandler = "Node.runHandler", f), G = ((p = G || {}).runHandler = "AppRouteRouteHandlers.runHandler", p), W = ((g = W || {}).generateMetadata = "ResolveMetadata.generateMetadata", g.generateViewport = "ResolveMetadata.generateViewport", g), K = ((m = K || {}).execute = "Middleware.execute", m);
      let X = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), J = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function Y(e2) {
        return null !== e2 && "object" == typeof e2 && "then" in e2 && "function" == typeof e2.then;
      }
      e.s(["LogSpanAllowList", 0, J, "MiddlewareSpan", 0, K, "NextNodeServerSpan", 0, F, "NextVanillaSpanAllowlist", 0, X], 2275), e.s(["isThenable", 0, Y], 56827);
      let Z = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: ee, propagation: et, trace: er, SpanStatusCode: en, SpanKind: ei, ROOT_CONTEXT: es } = t = e.r(59110);
      class ea extends Error {
        constructor(e2, t2) {
          super(), this.bubble = e2, this.result = t2;
        }
      }
      let eo = (e2, t2) => {
        "object" == typeof t2 && null !== t2 && t2 instanceof ea && t2.bubble ? e2.setAttribute("next.bubble", true) : (t2 && (e2.recordException(t2), e2.setAttribute("error.type", t2.name)), e2.setStatus({ code: en.ERROR, message: null == t2 ? void 0 : t2.message })), e2.end();
      }, el = /* @__PURE__ */ new Map(), eu = t.createContextKey("next.rootSpanId"), ec = 0, eh = { set(e2, t2, r2) {
        e2.push({ key: t2, value: r2 });
      } }, ed = (r = new class e {
        getTracerInstance() {
          return er.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return ee;
        }
        getTracePropagationData() {
          let e2 = ee.active(), t2 = [];
          return et.inject(e2, t2, eh), t2;
        }
        getActiveScopeSpan() {
          return er.getSpan(null == ee ? void 0 : ee.active());
        }
        withPropagatedContext(e2, t2, r2, n2 = false) {
          let i2 = ee.active();
          if (n2) {
            let n3 = et.extract(es, e2, r2);
            if (er.getSpanContext(n3)) return ee.with(n3, t2);
            let s3 = et.extract(i2, e2, r2);
            return ee.with(s3, t2);
          }
          if (er.getSpanContext(i2)) return t2();
          let s2 = et.extract(i2, e2, r2);
          return ee.with(s2, t2);
        }
        trace(...e2) {
          let [t2, r2, n2] = e2, { fn: i2, options: s2 } = "function" == typeof r2 ? { fn: r2, options: {} } : { fn: n2, options: { ...r2 } }, a2 = s2.spanName ?? t2;
          if (!X.has(t2) && "1" !== process.env.NEXT_OTEL_VERBOSE || s2.hideSpan) return i2();
          let o2 = this.getSpanContext((null == s2 ? void 0 : s2.parentSpan) ?? this.getActiveScopeSpan());
          o2 || (o2 = (null == ee ? void 0 : ee.active()) ?? es);
          let l2 = o2.getValue(eu), u2 = "number" != typeof l2 || !el.has(l2), c2 = ec++;
          return s2.attributes = { "next.span_name": a2, "next.span_type": t2, ...s2.attributes }, ee.with(o2.setValue(eu, c2), () => this.getTracerInstance().startActiveSpan(a2, s2, (e3) => {
            let r3;
            Z && t2 && J.has(t2) && (r3 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n3 = false, a3 = () => {
              !n3 && (n3 = true, el.delete(c2), r3 && performance.measure(`${Z}:next-${(t2.split(".").pop() || "").replace(/[A-Z]/g, (e4) => "-" + e4.toLowerCase())}`, { start: r3, end: performance.now() }));
            };
            if (u2 && el.set(c2, new Map(Object.entries(s2.attributes ?? {}))), i2.length > 1) try {
              return i2(e3, (t3) => eo(e3, t3));
            } catch (t3) {
              throw eo(e3, t3), t3;
            } finally {
              a3();
            }
            try {
              let t3 = i2(e3);
              if (Y(t3)) return t3.then((t4) => (e3.end(), t4)).catch((t4) => {
                throw eo(e3, t4), t4;
              }).finally(a3);
              return e3.end(), a3(), t3;
            } catch (t3) {
              throw eo(e3, t3), a3(), t3;
            }
          }));
        }
        wrap(...e2) {
          let t2 = this, [r2, n2, i2] = 3 === e2.length ? e2 : [e2[0], {}, e2[1]];
          return X.has(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e3 = n2;
            "function" == typeof e3 && "function" == typeof i2 && (e3 = e3.apply(this, arguments));
            let s2 = arguments.length - 1, a2 = arguments[s2];
            if ("function" != typeof a2) return t2.trace(r2, e3, () => i2.apply(this, arguments));
            {
              let n3 = t2.getContext().bind(ee.active(), a2);
              return t2.trace(r2, e3, (e4, t3) => (arguments[s2] = function(e5) {
                return null == t3 || t3(e5), n3.apply(this, arguments);
              }, i2.apply(this, arguments)));
            }
          } : i2;
        }
        startSpan(...e2) {
          let [t2, r2] = e2, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, n2);
        }
        getSpanContext(e2) {
          return e2 ? er.setSpan(ee.active(), e2) : void 0;
        }
        getRootSpanAttributes() {
          let e2 = ee.active().getValue(eu);
          return el.get(e2);
        }
        setRootSpanAttribute(e2, t2) {
          let r2 = ee.active().getValue(eu), n2 = el.get(r2);
          n2 && !n2.has(e2) && n2.set(e2, t2);
        }
        withSpan(e2, t2) {
          let r2 = er.setSpan(ee.active(), e2);
          return ee.with(r2, t2);
        }
      }(), () => r);
      e.s(["getTracer", 0, ed], 23741);
      let ef = Symbol.for("NextInternalRequestMeta");
      e.s(["getRequestMeta", 0, function(e2, t2) {
        let r2 = e2[ef] || {};
        return "string" == typeof t2 ? r2[t2] : r2;
      }, "setRequestMeta", 0, function(e2, t2) {
        return e2[ef] = t2, t2;
      }], 7553);
      class ep {
        constructor() {
          let e2, t2;
          this.promise = new Promise((r2, n2) => {
            e2 = r2, t2 = n2;
          }), this.resolve = e2, this.reject = t2;
        }
      }
      e.s(["DetachedPromise", 0, ep], 56148);
      class eg {
        constructor(e2, t2, r2) {
          this.prev = null, this.next = null, this.key = e2, this.data = t2, this.size = r2;
        }
      }
      class em {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class ey {
        constructor(e2, t2, r2) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e2, this.calculateSize = t2, this.onEvict = r2, this.head = new em(), this.tail = new em(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e2) {
          e2.prev = this.head, e2.next = this.head.next, this.head.next.prev = e2, this.head.next = e2;
        }
        removeNode(e2) {
          e2.prev.next = e2.next, e2.next.prev = e2.prev;
        }
        moveToHead(e2) {
          this.removeNode(e2), this.addToHead(e2);
        }
        removeTail() {
          let e2 = this.tail.prev;
          return this.removeNode(e2), e2;
        }
        set(e2, t2) {
          let r2 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t2)) ?? 1;
          if (r2 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r2}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r2 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n2 = this.cache.get(e2);
          if (n2) n2.data = t2, this.totalSize = this.totalSize - n2.size + r2, n2.size = r2, this.moveToHead(n2);
          else {
            let n3 = new eg(e2, t2, r2);
            this.cache.set(e2, n3), this.addToHead(n3), this.totalSize += r2;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e3 = this.removeTail();
            this.cache.delete(e3.key), this.totalSize -= e3.size, null == this.onEvict || this.onEvict.call(this, e3.key, e3.data);
          }
          return true;
        }
        has(e2) {
          return this.cache.has(e2);
        }
        get(e2) {
          let t2 = this.cache.get(e2);
          if (t2) return this.moveToHead(t2), t2.data;
        }
        *[Symbol.iterator]() {
          let e2 = this.head.next;
          for (; e2 && e2 !== this.tail; ) {
            let t2 = e2;
            yield [t2.key, t2.data], e2 = e2.next;
          }
        }
        remove(e2) {
          let t2 = this.cache.get(e2);
          t2 && (this.removeNode(t2), this.cache.delete(e2), this.totalSize -= t2.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      e.s(["LRUCache", 0, ey], 25754);
      let { env: eb, stdout: ev } = (null == (v = globalThis) ? void 0 : v.process) ?? {}, ew = eb && !eb.NO_COLOR && (eb.FORCE_COLOR || (null == ev ? void 0 : ev.isTTY) && !eb.CI && "dumb" !== eb.TERM), e_ = (e2, t2, r2, n2) => {
        let i2 = e2.substring(0, n2) + r2, s2 = e2.substring(n2 + t2.length), a2 = s2.indexOf(t2);
        return ~a2 ? i2 + e_(s2, t2, r2, a2) : i2 + s2;
      }, eS = (e2, t2, r2 = e2) => ew ? (n2) => {
        let i2 = "" + n2, s2 = i2.indexOf(t2, e2.length);
        return ~s2 ? e2 + e_(i2, t2, r2, s2) + t2 : e2 + i2 + t2;
      } : String, eE = eS("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      eS("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), eS("\x1B[3m", "\x1B[23m"), eS("\x1B[4m", "\x1B[24m"), eS("\x1B[7m", "\x1B[27m"), eS("\x1B[8m", "\x1B[28m"), eS("\x1B[9m", "\x1B[29m"), eS("\x1B[30m", "\x1B[39m");
      let ex = eS("\x1B[31m", "\x1B[39m"), eT = eS("\x1B[32m", "\x1B[39m"), eC = eS("\x1B[33m", "\x1B[39m");
      eS("\x1B[34m", "\x1B[39m");
      let eP = eS("\x1B[35m", "\x1B[39m");
      eS("\x1B[38;2;173;127;168m", "\x1B[39m"), eS("\x1B[36m", "\x1B[39m");
      let eA = eS("\x1B[37m", "\x1B[39m");
      eS("\x1B[90m", "\x1B[39m"), eS("\x1B[40m", "\x1B[49m"), eS("\x1B[41m", "\x1B[49m"), eS("\x1B[42m", "\x1B[49m"), eS("\x1B[43m", "\x1B[49m"), eS("\x1B[44m", "\x1B[49m"), eS("\x1B[45m", "\x1B[49m"), eS("\x1B[46m", "\x1B[49m"), eS("\x1B[47m", "\x1B[49m"), eA(eE("\u25CB")), ex(eE("\u2A2F")), eC(eE("\u26A0")), eA(eE(" ")), eT(eE("\u2713")), eP(eE("\xBB")), new ey(1e4, (e2) => e2.length), new ey(1e4, (e2) => e2.length);
      var eR = ((y = {}).APP_PAGE = "APP_PAGE", y.APP_ROUTE = "APP_ROUTE", y.PAGES = "PAGES", y.FETCH = "FETCH", y.REDIRECT = "REDIRECT", y.IMAGE = "IMAGE", y), eN = ((b = {}).APP_PAGE = "APP_PAGE", b.APP_ROUTE = "APP_ROUTE", b.PAGES = "PAGES", b.FETCH = "FETCH", b.IMAGE = "IMAGE", b);
      e.s(["CachedRouteKind", 0, eR, "IncrementalCacheKind", 0, eN], 83735);
      var eO = e.i(51615);
      function eI() {
      }
      new TextEncoder();
      let ek = new TextEncoder();
      function eD(e2) {
        return new ReadableStream({ start(t2) {
          t2.enqueue(ek.encode(e2)), t2.close();
        } });
      }
      function eL(e2) {
        return new ReadableStream({ start(t2) {
          t2.enqueue(e2), t2.close();
        } });
      }
      async function eM(e2, t2) {
        let r2 = new TextDecoder("utf-8", { fatal: true }), n2 = "";
        for await (let i2 of e2) {
          if (null == t2 ? void 0 : t2.aborted) return n2;
          n2 += r2.decode(i2, { stream: true });
        }
        return n2 + r2.decode();
      }
      let eB = "ResponseAborted";
      class e$ extends Error {
        constructor(...e2) {
          super(...e2), this.name = eB;
        }
      }
      let ej = 0, eq = 0, eF = 0;
      function eU(e2) {
        return (null == e2 ? void 0 : e2.name) === "AbortError" || (null == e2 ? void 0 : e2.name) === eB;
      }
      async function eQ(e2, t2, r2) {
        try {
          let n2, { errored: i2, destroyed: s2 } = t2;
          if (i2 || s2) return;
          let a2 = (n2 = new AbortController(), t2.once("close", () => {
            t2.writableFinished || n2.abort(new e$());
          }), n2), o2 = function(e3, t3) {
            let r3 = false, n3 = new ep();
            function i3() {
              n3.resolve();
            }
            e3.on("drain", i3), e3.once("close", () => {
              e3.off("drain", i3), n3.resolve();
            });
            let s3 = new ep();
            return e3.once("finish", () => {
              s3.resolve();
            }), new WritableStream({ write: async (t4) => {
              if (!r3) {
                if (r3 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let e4 = function(e5 = {}) {
                    let t5 = 0 === ej ? void 0 : { clientComponentLoadStart: ej, clientComponentLoadTimes: eq, clientComponentLoadCount: eF };
                    return e5.reset && (ej = 0, eq = 0, eF = 0), t5;
                  }();
                  e4 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e4.clientComponentLoadStart, end: e4.clientComponentLoadStart + e4.clientComponentLoadTimes });
                }
                e3.flushHeaders(), ed().trace(F.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r4 = e3.write(t4);
                "flush" in e3 && "function" == typeof e3.flush && e3.flush(), r4 || (await n3.promise, n3 = new ep());
              } catch (t5) {
                throw e3.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t5 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t4) => {
              e3.writableFinished || e3.destroy(t4);
            }, close: async () => {
              if (t3 && await t3, !e3.writableFinished) return e3.end(), s3.promise;
            } });
          }(t2, r2);
          await e2.pipeTo(o2, { signal: a2.signal });
        } catch (e3) {
          if (eU(e3)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e3 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var ez = e.i(25753);
      class eV {
        static #e = this.EMPTY = new eV(null, { metadata: {}, contentType: null });
        static fromStatic(e2, t2) {
          return new eV(e2, { metadata: {}, contentType: t2 });
        }
        constructor(e2, { contentType: t2, waitUntil: r2, metadata: n2 }) {
          this.response = e2, this.contentType = t2, this.metadata = n2, this.waitUntil = r2;
        }
        assignMetadata(e2) {
          Object.assign(this.metadata, e2);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e2 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e2) throw Object.defineProperty(new ez.InvariantError("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return eM(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(e2) {
            e2.close();
          } }) : "string" == typeof this.response ? eD(this.response) : eO.Buffer.isBuffer(this.response) ? eL(this.response) : Array.isArray(this.response) ? function(...e2) {
            if (0 === e2.length) return new ReadableStream({ start(e3) {
              e3.close();
            } });
            if (1 === e2.length) return e2[0];
            let { readable: t2, writable: r2 } = new TransformStream(), n2 = e2[0].pipeTo(r2, { preventClose: true }), i2 = 1;
            for (; i2 < e2.length - 1; i2++) {
              let t3 = e2[i2];
              n2 = n2.then(() => t3.pipeTo(r2, { preventClose: true }));
            }
            let s2 = e2[i2];
            return (n2 = n2.then(() => s2.pipeTo(r2))).catch(eI), t2;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [eD(this.response)] : Array.isArray(this.response) ? this.response : eO.Buffer.isBuffer(this.response) ? [eL(this.response)] : [this.response];
        }
        pipeThrough(e2) {
          this.response = this.readable.pipeThrough(e2);
        }
        unshift(e2) {
          this.response = this.coerce(), this.response.unshift(e2);
        }
        push(e2) {
          this.response = this.coerce(), this.response.push(e2);
        }
        async pipeTo(e2) {
          try {
            await this.readable.pipeTo(e2, { preventClose: true }), this.waitUntil && await this.waitUntil, await e2.close();
          } catch (t2) {
            if (eU(t2)) return void await e2.abort(t2);
            throw t2;
          }
        }
        async pipeToNodeResponse(e2) {
          await eQ(this.readable, e2, this.waitUntil);
        }
      }
      function eH(e2, t2) {
        if (!e2) return t2;
        let r2 = parseInt(e2, 10);
        return Number.isFinite(r2) && r2 > 0 ? r2 : t2;
      }
      eH(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), eH(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150), e.s([], 60403);
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 114: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, s = -1, a = 0, o = 0; o <= e4.length; ++o) {
              if (o < e4.length) r4 = e4.charCodeAt(o);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (s === o - 1 || 1 === a) ;
                else if (s !== o - 1 && 2 === a) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), s = o, a = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, s = o, a = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(s + 1, o) : n3 = e4.slice(s + 1, o), i = o - s - 1;
                s = o, a = 0;
              } else 46 === r4 && -1 !== a ? ++a : a = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", s = false, a = arguments.length - 1; a >= -1 && !s; a--) a >= 0 ? n3 = arguments[a] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, s = 47 === n3.charCodeAt(0));
            if (i = r3(i, !s), s) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var s = e4.length, a = s - i, o = 1; o < r4.length && 47 === r4.charCodeAt(o); ++o) ;
            for (var l = r4.length - o, u = a < l ? a : l, c = -1, h = 0; h <= u; ++h) {
              if (h === u) {
                if (l > u) {
                  if (47 === r4.charCodeAt(o + h)) return r4.slice(o + h + 1);
                  else if (0 === h) return r4.slice(o + h);
                } else a > u && (47 === e4.charCodeAt(i + h) ? c = h : 0 === h && (c = 0));
                break;
              }
              var d = e4.charCodeAt(i + h);
              if (d !== r4.charCodeAt(o + h)) break;
              47 === d && (c = h);
            }
            var f = "";
            for (h = i + c + 1; h <= s; ++h) (h === s || 47 === e4.charCodeAt(h)) && (0 === f.length ? f += ".." : f += "/..");
            return f.length > 0 ? f + r4.slice(o + c) : (o += c, 47 === r4.charCodeAt(o) && ++o, r4.slice(o));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, s = true, a = e4.length - 1; a >= 1; --a) if (47 === (r4 = e4.charCodeAt(a))) {
              if (!s) {
                i = a;
                break;
              }
            } else s = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, s = -1, a = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var o = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var u = e4.charCodeAt(n3);
                if (47 === u) {
                  if (!a) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (a = false, l = n3 + 1), o >= 0 && (u === r4.charCodeAt(o) ? -1 == --o && (s = n3) : (o = -1, s = l));
              }
              return i === s ? s = l : -1 === s && (s = e4.length), e4.slice(i, s);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!a) {
                i = n3 + 1;
                break;
              }
            } else -1 === s && (a = false, s = n3 + 1);
            return -1 === s ? "" : e4.slice(i, s);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, s = true, a = 0, o = e4.length - 1; o >= 0; --o) {
              var l = e4.charCodeAt(o);
              if (47 === l) {
                if (!s) {
                  n3 = o + 1;
                  break;
                }
                continue;
              }
              -1 === i && (s = false, i = o + 1), 46 === l ? -1 === r4 ? r4 = o : 1 !== a && (a = 1) : -1 !== r4 && (a = -1);
            }
            return -1 === r4 || -1 === i || 0 === a || 1 === a && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), s = 47 === i;
            s ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var a = -1, o = 0, l = -1, u = true, c = e4.length - 1, h = 0; c >= r4; --c) {
              if (47 === (i = e4.charCodeAt(c))) {
                if (!u) {
                  o = c + 1;
                  break;
                }
                continue;
              }
              -1 === l && (u = false, l = c + 1), 46 === i ? -1 === a ? a = c : 1 !== h && (h = 1) : -1 !== a && (h = -1);
            }
            return -1 === a || -1 === l || 0 === h || 1 === h && a === l - 1 && a === o + 1 ? -1 !== l && (0 === o && s ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(o, l)) : (0 === o && s ? (n3.name = e4.slice(1, a), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(o, a), n3.base = e4.slice(o, l)), n3.ext = e4.slice(a, l)), o > 0 ? n3.dir = e4.slice(0, o - 1) : s && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var s = r2[t2] = { exports: {} }, a = true;
          try {
            e2[t2](s, s.exports, n), a = false;
          } finally {
            a && delete r2[t2];
          }
          return s.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(114);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 98105, 35685, 87479, 6443, (e) => {
      "use strict";
      function t(e2) {
        return e2.startsWith("/") ? e2 : `/${e2}`;
      }
      function r(e2) {
        return t(e2.split("/").reduce((e3, t2, r2, n2) => t2 ? "(" === t2[0] && t2.endsWith(")") || "@" === t2[0] || ("page" === t2 || "route" === t2) && r2 === n2.length - 1 ? e3 : `${e3}/${t2}` : e3, ""));
      }
      e.s(["ensureLeadingSlash", 0, t], 35685), e.s(["normalizeAppPath", 0, r, "normalizeRscURL", 0, function(e2) {
        return e2.replace(/\.rsc($|\?)/, "$1");
      }], 98105), e.s(["ActionDidRevalidateDynamicOnly", 0, 2, "ActionDidRevalidateStaticAndDynamic", 0, 1], 87479);
      let n = ["(..)(..)", "(.)", "(..)", "(...)"], i = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, s = /\/\[[^/]+\](?=\/|$)/;
      e.s(["isDynamicRoute", 0, function(e2, t2 = true) {
        return (void 0 !== e2.split("/").find((e3) => n.find((t3) => e3.startsWith(t3))) && (e2 = function(e3) {
          let t3, i2, s2;
          for (let r2 of e3.split("/")) if (i2 = n.find((e4) => r2.startsWith(e4))) {
            [t3, s2] = e3.split(i2, 2);
            break;
          }
          if (!t3 || !i2 || !s2) throw Object.defineProperty(Error(`Invalid interception route: ${e3}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
          switch (t3 = r(t3), i2) {
            case "(.)":
              s2 = "/" === t3 ? `/${s2}` : t3 + "/" + s2;
              break;
            case "(..)":
              if ("/" === t3) throw Object.defineProperty(Error(`Invalid interception route: ${e3}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
              s2 = t3.split("/").slice(0, -1).concat(s2).join("/");
              break;
            case "(...)":
              s2 = "/" + s2;
              break;
            case "(..)(..)":
              let a = t3.split("/");
              if (a.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e3}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
              s2 = a.slice(0, -2).concat(s2).join("/");
              break;
            default:
              throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
          }
          return { interceptingRoute: t3, interceptedRoute: s2 };
        }(e2).interceptedRoute), t2) ? s.test(e2) : i.test(e2);
      }], 6443);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", s3 = r4 + 1; s3 < e4.length; ) {
                    var a3 = e4.charCodeAt(s3);
                    if (a3 >= 48 && a3 <= 57 || a3 >= 65 && a3 <= 90 || a3 >= 97 && a3 <= 122 || 95 === a3) {
                      i2 += e4[s3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = s3;
                  continue;
                }
                if ("(" === n3) {
                  var o3 = 1, l2 = "", s3 = r4 + 1;
                  if ("?" === e4[s3]) throw TypeError('Pattern cannot start with "?" at '.concat(s3));
                  for (; s3 < e4.length; ) {
                    if ("\\" === e4[s3]) {
                      l2 += e4[s3++] + e4[s3++];
                      continue;
                    }
                    if (")" === e4[s3]) {
                      if (0 == --o3) {
                        s3++;
                        break;
                      }
                    } else if ("(" === e4[s3] && (o3++, "?" !== e4[s3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(s3));
                    l2 += e4[s3++];
                  }
                  if (o3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = s3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, s2 = void 0 === n2 ? "./" : n2, a2 = t3.delimiter, o2 = void 0 === a2 ? "/#?" : a2, l = [], u = 0, c = 0, h = "", d = function(e4) {
              if (c < r3.length && r3[c].type === e4) return r3[c++].value;
            }, f = function(e4) {
              var t4 = d(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[c], i2 = n3.type, s3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(s3, ", expected ").concat(e4));
            }, p = function() {
              for (var e4, t4 = ""; e4 = d("CHAR") || d("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, g = function(e4) {
              for (var t4 = 0; t4 < o2.length; t4++) {
                var r4 = o2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, m = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || g(r4) ? "[^".concat(i(o2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(o2), "])+?");
            }; c < r3.length; ) {
              var y = d("CHAR"), b = d("NAME"), v = d("PATTERN");
              if (b || v) {
                var w = y || "";
                -1 === s2.indexOf(w) && (h += w, w = ""), h && (l.push(h), h = ""), l.push({ name: b || u++, prefix: w, suffix: "", pattern: v || m(w), modifier: d("MODIFIER") || "" });
                continue;
              }
              var _ = y || d("ESCAPED_CHAR");
              if (_) {
                h += _;
                continue;
              }
              if (h && (l.push(h), h = ""), d("OPEN")) {
                var w = p(), S = d("NAME") || "", E = d("PATTERN") || "", x = p();
                f("CLOSE"), l.push({ name: S || (E ? u++ : ""), pattern: S && !E ? m(w) : E, prefix: w, suffix: x, modifier: d("MODIFIER") || "" });
                continue;
              }
              f("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = s(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, a2 = t3.validate, o2 = void 0 === a2 || a2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var s2 = e3[n3];
                if ("string" == typeof s2) {
                  r4 += s2;
                  continue;
                }
                var a3 = t4 ? t4[s2.name] : void 0, u = "?" === s2.modifier || "*" === s2.modifier, c = "*" === s2.modifier || "+" === s2.modifier;
                if (Array.isArray(a3)) {
                  if (!c) throw TypeError('Expected "'.concat(s2.name, '" to not repeat, but got an array'));
                  if (0 === a3.length) {
                    if (u) continue;
                    throw TypeError('Expected "'.concat(s2.name, '" to not be empty'));
                  }
                  for (var h = 0; h < a3.length; h++) {
                    var d = i2(a3[h], s2);
                    if (o2 && !l[n3].test(d)) throw TypeError('Expected all "'.concat(s2.name, '" to match "').concat(s2.pattern, '", but got "').concat(d, '"'));
                    r4 += s2.prefix + d + s2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof a3 || "number" == typeof a3) {
                  var d = i2(String(a3), s2);
                  if (o2 && !l[n3].test(d)) throw TypeError('Expected "'.concat(s2.name, '" to match "').concat(s2.pattern, '", but got "').concat(d, '"'));
                  r4 += s2.prefix + d + s2.suffix;
                  continue;
                }
                if (!u) {
                  var f = c ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(s2.name, '" to be ').concat(f));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var s2 = n3[0], a2 = n3.index, o2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? o2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : o2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: s2, index: a2, params: o2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function s(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function a(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, a2 = void 0 !== n2 && n2, o2 = r3.start, l = r3.end, u = r3.encode, c = void 0 === u ? function(e4) {
              return e4;
            } : u, h = r3.delimiter, d = r3.endsWith, f = "[".concat(i(void 0 === d ? "" : d), "]|$"), p = "[".concat(i(void 0 === h ? "/#?" : h), "]"), g = void 0 === o2 || o2 ? "^" : "", m = 0; m < e3.length; m++) {
              var y = e3[m];
              if ("string" == typeof y) g += i(c(y));
              else {
                var b = i(c(y.prefix)), v = i(c(y.suffix));
                if (y.pattern) if (t3 && t3.push(y), b || v) if ("+" === y.modifier || "*" === y.modifier) {
                  var w = "*" === y.modifier ? "?" : "";
                  g += "(?:".concat(b, "((?:").concat(y.pattern, ")(?:").concat(v).concat(b, "(?:").concat(y.pattern, "))*)").concat(v, ")").concat(w);
                } else g += "(?:".concat(b, "(").concat(y.pattern, ")").concat(v, ")").concat(y.modifier);
                else {
                  if ("+" === y.modifier || "*" === y.modifier) throw TypeError('Can not repeat "'.concat(y.name, '" without a prefix and suffix'));
                  g += "(".concat(y.pattern, ")").concat(y.modifier);
                }
                else g += "(?:".concat(b).concat(v, ")").concat(y.modifier);
              }
            }
            if (void 0 === l || l) a2 || (g += "".concat(p, "?")), g += r3.endsWith ? "(?=".concat(f, ")") : "$";
            else {
              var _ = e3[e3.length - 1], S = "string" == typeof _ ? p.indexOf(_[_.length - 1]) > -1 : void 0 === _;
              a2 || (g += "(?:".concat(p, "(?=").concat(f, "))?")), S || (g += "(?=".concat(p, "|").concat(f, ")"));
            }
            return new RegExp(g, s(r3));
          }
          function o(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, u = 0, c = l.exec(e3.source); c; ) r3.push({ name: c[1] || u++, prefix: "", suffix: "", modifier: "", pattern: "" }), c = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return o(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), s(n2))) : a(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(o(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = a, e2.pathToRegexp = o;
        })(), t.exports = e2;
      })();
    }, 64445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", s2 = "undefined", a = "object", o = "string", l = "major", u = "model", c = "name", h = "type", d = "vendor", f = "version", p = "architecture", g = "console", m = "mobile", y = "tablet", b = "smarttv", v = "wearable", w = "embedded", _ = "Amazon", S = "Apple", E = "ASUS", x = "BlackBerry", T = "Browser", C = "Chrome", P = "Firefox", A = "Google", R = "Huawei", N = "Microsoft", O = "Motorola", I = "Opera", k = "Samsung", D = "Sharp", L = "Sony", M = "Xiaomi", B = "Zebra", $ = "Facebook", j = "Chromium OS", q = "Mac OS", F = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, U = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, Q = function(e2, t3) {
            return typeof e2 === o && -1 !== z(t3).indexOf(z(e2));
          }, z = function(e2) {
            return e2.toLowerCase();
          }, V = function(e2, t3) {
            if (typeof e2 === o) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === s2 ? e2 : e2.substring(0, 350);
          }, H = function(e2, t3) {
            for (var r3, n3, s3, o2, l2, u2, c2 = 0; c2 < t3.length && !l2; ) {
              var h2 = t3[c2], d2 = t3[c2 + 1];
              for (r3 = n3 = 0; r3 < h2.length && !l2 && h2[r3]; ) if (l2 = h2[r3++].exec(e2)) for (s3 = 0; s3 < d2.length; s3++) u2 = l2[++n3], typeof (o2 = d2[s3]) === a && o2.length > 0 ? 2 === o2.length ? typeof o2[1] == i2 ? this[o2[0]] = o2[1].call(this, u2) : this[o2[0]] = o2[1] : 3 === o2.length ? typeof o2[1] !== i2 || o2[1].exec && o2[1].test ? this[o2[0]] = u2 ? u2.replace(o2[1], o2[2]) : void 0 : this[o2[0]] = u2 ? o2[1].call(this, u2, o2[2]) : void 0 : 4 === o2.length && (this[o2[0]] = u2 ? o2[3].call(this, u2.replace(o2[1], o2[2])) : void 0) : this[o2] = u2 || void 0;
              c2 += 2;
            }
          }, G = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === a && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (Q(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (Q(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, W = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, K = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [c, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [c, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [c, f], [/opios[\/ ]+([\w\.]+)/i], [f, [c, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [c, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [c, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [c, "UC" + T]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [c, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [c, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [c, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [c, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [c, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[c, /(.+)/, "$1 Secure " + T], f], [/\bfocus\/([\w\.]+)/i], [f, [c, P + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [c, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [c, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [c, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [c, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [c, "MIUI " + T]], [/fxios\/([-\w\.]+)/i], [f, [c, P]], [/\bqihu|(qi?ho?o?|360)browser/i], [[c, "360 " + T]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[c, /(.+)/, "$1 " + T], f], [/(comodo_dragon)\/([\w\.]+)/i], [[c, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [c, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [c], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[c, $], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [c, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [c, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [c, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [c, C + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[c, C + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [c, "Android " + T]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [c, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [c, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, c], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [c, [f, G, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [c, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[c, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [c, P + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [c, f], [/(cobalt)\/([\w\.]+)/i], [c, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[p, "amd64"]], [/(ia32(?=;))/i], [[p, z]], [/((?:i[346]|x)86)[;\)]/i], [[p, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[p, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[p, "armhf"]], [/windows (ce|mobile); ppc;/i], [[p, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[p, /ower/, "", z]], [/(sun4\w)[;\)]/i], [[p, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[p, z]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [d, k], [h, y]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [d, k], [h, m]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [d, S], [h, m]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [d, S], [h, y]], [/(macintosh);/i], [u, [d, S]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [d, D], [h, m]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [d, R], [h, y]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [d, R], [h, m]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [d, M], [h, m]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [d, M], [h, y]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [d, "OPPO"], [h, m]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [d, "Vivo"], [h, m]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [u, [d, "Realme"], [h, m]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [d, O], [h, m]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [d, O], [h, y]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [d, "LG"], [h, y]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [d, "LG"], [h, m]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [d, "Lenovo"], [h, y]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [d, "Nokia"], [h, m]], [/(pixel c)\b/i], [u, [d, A], [h, y]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [d, A], [h, m]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [d, L], [h, m]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [d, L], [h, y]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [d, "OnePlus"], [h, m]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [d, _], [h, y]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [d, _], [h, m]], [/(playbook);[-\w\),; ]+(rim)/i], [u, d, [h, y]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [d, x], [h, m]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [d, E], [h, y]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [d, E], [h, m]], [/(nexus 9)/i], [u, [d, "HTC"], [h, y]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [d, [u, /_/g, " "], [h, m]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [d, "Acer"], [h, y]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [d, "Meizu"], [h, m]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [d, u, [h, m]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [d, u, [h, y]], [/(surface duo)/i], [u, [d, N], [h, y]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [d, "Fairphone"], [h, m]], [/(u304aa)/i], [u, [d, "AT&T"], [h, m]], [/\bsie-(\w*)/i], [u, [d, "Siemens"], [h, m]], [/\b(rct\w+) b/i], [u, [d, "RCA"], [h, y]], [/\b(venue[\d ]{2,7}) b/i], [u, [d, "Dell"], [h, y]], [/\b(q(?:mv|ta)\w+) b/i], [u, [d, "Verizon"], [h, y]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [d, "Barnes & Noble"], [h, y]], [/\b(tm\d{3}\w+) b/i], [u, [d, "NuVision"], [h, y]], [/\b(k88) b/i], [u, [d, "ZTE"], [h, y]], [/\b(nx\d{3}j) b/i], [u, [d, "ZTE"], [h, m]], [/\b(gen\d{3}) b.+49h/i], [u, [d, "Swiss"], [h, m]], [/\b(zur\d{3}) b/i], [u, [d, "Swiss"], [h, y]], [/\b((zeki)?tb.*\b) b/i], [u, [d, "Zeki"], [h, y]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[d, "Dragon Touch"], u, [h, y]], [/\b(ns-?\w{0,9}) b/i], [u, [d, "Insignia"], [h, y]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [d, "NextBook"], [h, y]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[d, "Voice"], u, [h, m]], [/\b(lvtel\-)?(v1[12]) b/i], [[d, "LvTel"], u, [h, m]], [/\b(ph-1) /i], [u, [d, "Essential"], [h, m]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [d, "Envizen"], [h, y]], [/\b(trio[-\w\. ]+) b/i], [u, [d, "MachSpeed"], [h, y]], [/\btu_(1491) b/i], [u, [d, "Rotor"], [h, y]], [/(shield[\w ]+) b/i], [u, [d, "Nvidia"], [h, y]], [/(sprint) (\w+)/i], [d, u, [h, m]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [d, N], [h, m]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [d, B], [h, y]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [d, B], [h, m]], [/smart-tv.+(samsung)/i], [d, [h, b]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [d, k], [h, b]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[d, "LG"], [h, b]], [/(apple) ?tv/i], [d, [u, S + " TV"], [h, b]], [/crkey/i], [[u, C + "cast"], [d, A], [h, b]], [/droid.+aft(\w)( bui|\))/i], [u, [d, _], [h, b]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [d, D], [h, b]], [/(bravia[\w ]+)( bui|\))/i], [u, [d, L], [h, b]], [/(mitv-\w{5}) bui/i], [u, [d, M], [h, b]], [/Hbbtv.*(technisat) (.*);/i], [d, u, [h, b]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[d, V], [u, V], [h, b]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[h, b]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [d, u, [h, g]], [/droid.+; (shield) bui/i], [u, [d, "Nvidia"], [h, g]], [/(playstation [345portablevi]+)/i], [u, [d, L], [h, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [d, N], [h, g]], [/((pebble))app/i], [d, u, [h, v]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [d, S], [h, v]], [/droid.+; (glass) \d/i], [u, [d, A], [h, v]], [/droid.+; (wt63?0{2,3})\)/i], [u, [d, B], [h, v]], [/(quest( 2| pro)?)/i], [u, [d, $], [h, v]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [d, [h, w]], [/(aeobc)\b/i], [u, [d, _], [h, w]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [u, [h, m]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [h, y]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[h, y]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[h, m]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [d, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [c, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [c, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [c, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, c]], os: [[/microsoft (windows) (vista|xp)/i], [c, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [c, [f, G, W]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[c, "Windows"], [f, G, W]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [c, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[c, q], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, c], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [c, f], [/\(bb(10);/i], [f, [c, x]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [c, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [c, P + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [c, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [c, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [c, C + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[c, j], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [c, f], [/(sunos) ?([\w\.\d]*)/i], [[c, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [c, f]] }, X = function(e2, t3) {
            if (typeof e2 === a && (t3 = e2, e2 = void 0), !(this instanceof X)) return new X(e2, t3).getResult();
            var r3 = typeof n2 !== s2 && n2.navigator ? n2.navigator : void 0, g2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), b2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, v2 = t3 ? F(K, t3) : K, w2 = r3 && r3.userAgent == g2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[c] = void 0, t4[f] = void 0, H.call(t4, g2, v2.browser), t4[l] = typeof (e3 = t4[f]) === o ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, w2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[c] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[p] = void 0, H.call(e3, g2, v2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[d] = void 0, e3[u] = void 0, e3[h] = void 0, H.call(e3, g2, v2.device), w2 && !e3[h] && b2 && b2.mobile && (e3[h] = m), w2 && "Macintosh" == e3[u] && r3 && typeof r3.standalone !== s2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[u] = "iPad", e3[h] = y), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, H.call(e3, g2, v2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, H.call(e3, g2, v2.os), w2 && !e3[c] && b2 && "Unknown" != b2.platform && (e3[c] = b2.platform.replace(/chrome os/i, j).replace(/macos/i, q)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return g2;
            }, this.setUA = function(e3) {
              return g2 = typeof e3 === o && e3.length > 350 ? V(e3, 350) : e3, this;
            }, this.setUA(g2), this;
          };
          if (X.VERSION = "1.0.35", X.BROWSER = U([c, f, l]), X.CPU = U([p]), X.DEVICE = U([u, d, h, g, m, b, y, v, w]), X.ENGINE = X.OS = U([c, f]), typeof r2 !== s2) t2.exports && (r2 = t2.exports = X), r2.UAParser = X;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== X && e.v(X);
          else typeof n2 !== s2 && (n2.UAParser = X);
          var J = typeof n2 !== s2 && (n2.jQuery || n2.Zepto);
          if (J && !J.ua) {
            var Y = new X();
            J.ua = Y.getResult(), J.ua.get = function() {
              return Y.getUA();
            }, J.ua.set = function(e2) {
              Y.setUA(e2);
              var t3 = Y.getResult();
              for (var r3 in t3) J.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function s(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, a = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, s), a = false;
        } finally {
          a && delete i[e2];
        }
        return r2.exports;
      }
      s.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = s(226);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var s = Array.isArray;
      function a() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), d = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), y = Symbol.for("react.view_transition"), b = Symbol.iterator, v = Object.prototype.hasOwnProperty, w = Object.assign;
      function _(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function S(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var E = /\/+/g;
      function x(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function T(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var h2, d2, f2, p2 = typeof t3;
          ("undefined" === p2 || "boolean" === p2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (p2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (m2) return c2 = c2(t3), m2 = "" === u3 ? "." + x(t3, 0) : u3, s(c2) ? (n3 = "", null != m2 && (n3 = m2.replace(E, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (S(c2) && (h2 = c2, d2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(E, "$&/") + "/") + m2, c2 = _(h2.type, d2, h2.props)), r3.push(c2)), 1;
          m2 = 0;
          var y2 = "" === u3 ? "." : u3 + ":";
          if (s(t3)) for (var v2 = 0; v2 < t3.length; v2++) p2 = y2 + x(u3 = t3[v2], v2), m2 += e3(u3, r3, n3, p2, c2);
          else if ("function" == typeof (v2 = null === (f2 = t3) || "object" != typeof f2 ? null : "function" == typeof (f2 = b && f2[b] || f2["@@iterator"]) ? f2 : null)) for (t3 = v2.call(t3), v2 = 0; !(u3 = t3.next()).done; ) p2 = y2 + x(u3 = u3.value, v2++), m2 += e3(u3, r3, n3, p2, c2);
          else if ("object" === p2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(a, a) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function C(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function P() {
        return /* @__PURE__ */ new WeakMap();
      }
      function A() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: T, forEach: function(e2, t2, r2) {
        T(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return T(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return T(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!S(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = h, r.StrictMode = c, r.Suspense = f, r.ViewTransition = y, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(P);
          void 0 === (t2 = r2.get(e2)) && (t2 = A(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var s2 = arguments[r2];
            if ("function" == typeof s2 || "object" == typeof s2 && null !== s2) {
              var a2 = t2.o;
              null === a2 && (t2.o = a2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = a2.get(s2)) && (t2 = A(), a2.set(s2, t2));
            } else null === (a2 = t2.p) && (t2.p = a2 = /* @__PURE__ */ new Map()), void 0 === (t2 = a2.get(s2)) && (t2 = A(), a2.set(s2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = w({}, e2.props), s2 = e2.key;
        if (null != t2) for (a2 in void 0 !== t2.key && (s2 = "" + t2.key), t2) v.call(t2, a2) && "key" !== a2 && "__self" !== a2 && "__source" !== a2 && ("ref" !== a2 || void 0 !== t2.ref) && (n2[a2] = t2[a2]);
        var a2 = arguments.length - 2;
        if (1 === a2) n2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return _(e2.type, s2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, s2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (s2 = "" + t2.key), t2) v.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var a2 = arguments.length - 2;
        if (1 === a2) i2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          i2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in a2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = a2[n2]);
        return _(e2, s2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: d, render: e2 };
      }, r.isValidElement = S, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: C };
      }, r.memo = function(e2, t2) {
        return { $$typeof: p, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-3f0b9e61-20260317";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 63072, 18368, (e) => {
      "use strict";
      var t, r = e.i(40049);
      class n extends Error {
        constructor(e2) {
          super(`Dynamic server usage: ${e2}`), this.description = e2, this.digest = "DYNAMIC_SERVER_USAGE";
        }
      }
      e.s(["DynamicServerError", 0, n], 18368);
      class i extends Error {
        constructor(...e2) {
          super(...e2), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
      e.i(53835), e.i(7754);
      let s = "function" == typeof r.default.unstable_postpone;
      function a(e2, t2, n2) {
        (function() {
          if (!s) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
        })(), n2 && n2.dynamicAccesses.push({ stack: n2.isDebugDynamicAccesses ? Error().stack : void 0, expression: t2 }), r.default.unstable_postpone(o(e2, t2));
      }
      function o(e2, t2) {
        return `Route ${e2} needs to bail out of prerendering at this point because it used ${t2}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === ((t = o("%%%", "^^^")).includes("needs to bail out of prerendering at this point because it used") && t.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      function l(e2) {
        let t2 = Object.defineProperty(Error(e2), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        return t2.digest = "NEXT_PRERENDER_INTERRUPTED", t2;
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), e.s(["abortAndThrowOnSynchronousRequestDataAccess", 0, function(e2, t2, r2, n2) {
        if (false === n2.controller.signal.aborted) {
          let i2, s2;
          i2 = l(`Route ${e2} needs to bail out of prerendering at this point because it used ${t2}.`), n2.controller.abort(i2), (s2 = n2.dynamicTracking) && s2.dynamicAccesses.push({ stack: s2.isDebugDynamicAccesses ? Error().stack : void 0, expression: t2 });
          let a2 = n2.dynamicTracking;
          a2 && null === a2.syncDynamicErrorWithStack && (a2.syncDynamicErrorWithStack = r2);
        }
        throw l(`Route ${e2} needs to bail out of prerendering at this point because it used ${t2}.`);
      }, "markCurrentScopeAsDynamic", 0, function(e2, t2, r2) {
        if (t2) switch (t2.type) {
          case "cache":
          case "unstable-cache":
          case "private-cache":
            return;
        }
        if (!e2.forceDynamic && !e2.forceStatic) {
          if (e2.dynamicShouldError) throw Object.defineProperty(new i(`Route ${e2.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${r2}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E553", enumerable: false, configurable: true });
          if (t2) switch (t2.type) {
            case "prerender-ppr":
              return a(e2.route, r2, t2.dynamicTracking);
            case "prerender-legacy":
              t2.revalidate = 0;
              let s2 = Object.defineProperty(new n(`Route ${e2.route} couldn't be rendered statically because it used ${r2}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E550", enumerable: false, configurable: true });
              throw e2.dynamicUsageDescription = r2, e2.dynamicUsageStack = s2.stack, s2;
          }
        }
      }, "postponeWithTracking", 0, a], 63072);
    }, 36773, (e) => {
      "use strict";
      e.i(51615), e.i(23741);
      var t = e.i(26430);
      e.i(63072), e.i(40049);
      let r = () => {
      };
      globalThis.FinalizationRegistry && new FinalizationRegistry((e2) => {
        let t2 = e2.deref();
        t2 && !t2.locked && t2.cancel("Response object has been garbage collected").then(r);
      }), e.i(53835), e.i(60403), Symbol.for("next-patch"), e.s(["validateRevalidate", 0, function(e2, r2) {
        try {
          let n;
          if (false === e2) n = t.INFINITE_CACHE;
          else if ("number" == typeof e2 && !isNaN(e2) && e2 > -1) n = e2;
          else if (void 0 !== e2) throw Object.defineProperty(Error(`Invalid revalidate value "${e2}" on "${r2}", must be a non-negative number or false`), "__NEXT_ERROR_CODE", { value: "E179", enumerable: false, configurable: true });
          return n;
        } catch (e3) {
          if (e3 instanceof Error && e3.message.includes("Invalid revalidate")) throw e3;
          return;
        }
      }, "validateTags", 0, function(e2, r2) {
        let n = [], i = [];
        for (let s = 0; s < e2.length; s++) {
          let a = e2[s];
          if ("string" != typeof a ? i.push({ tag: a, reason: "invalid type, must be a string" }) : a.length > t.NEXT_CACHE_TAG_MAX_LENGTH ? i.push({ tag: a, reason: `exceeded max length of ${t.NEXT_CACHE_TAG_MAX_LENGTH}` }) : n.push(a), n.length > t.NEXT_CACHE_TAG_MAX_ITEMS) {
            console.warn(`Warning: exceeded max tag count for ${r2}, dropped tags:`, e2.slice(s).join(", "));
            break;
          }
        }
        if (i.length > 0) for (let { tag: e3, reason: t2 } of (console.warn(`Warning: invalid tags passed to ${r2}: `), i)) console.log(`tag: "${e3}" ${t2}`);
        return n;
      }], 36773);
    }, 88992, (e) => {
      "use strict";
      var t = e.i(26430), r = e.i(36773);
      e.i(7754);
      var n = e.i(90460), i = e.i(53835), s = e.i(82453);
      e.i(60403);
      var a = e.i(83735);
      let o = 0;
      async function l(e2, r2, n2, i2, s2, o2, l2) {
        await r2.set(n2, { kind: a.CachedRouteKind.FETCH, data: { headers: {}, body: JSON.stringify(e2), status: 200, url: "" }, revalidate: "number" != typeof s2 ? t.CACHE_ONE_YEAR_SECONDS : s2 }, { fetchCache: true, tags: i2, fetchIdx: o2, fetchUrl: l2 });
      }
      e.s(["unstable_cache", 0, function(e2, t2, u = {}) {
        if (0 === u.revalidate) throw Object.defineProperty(Error(`Invariant revalidate: 0 can not be passed to unstable_cache(), must be "false" or "> 0" ${e2.toString()}`), "__NEXT_ERROR_CODE", { value: "E57", enumerable: false, configurable: true });
        let c = u.tags ? (0, r.validateTags)(u.tags, `unstable_cache ${e2.toString()}`) : [];
        (0, r.validateRevalidate)(u.revalidate, `unstable_cache ${e2.name || e2.toString()}`);
        let h = `${e2.toString()}-${Array.isArray(t2) && t2.join(",")}`;
        return async (...t3) => {
          let r2 = n.workAsyncStorage.getStore(), d = s.workUnitAsyncStorage.getStore(), f = (null == r2 ? void 0 : r2.incrementalCache) || globalThis.__incrementalCache;
          if (!f) throw Object.defineProperty(Error(`Invariant: incrementalCache missing in unstable_cache ${e2.toString()}`), "__NEXT_ERROR_CODE", { value: "E469", enumerable: false, configurable: true });
          let p = d ? (0, i.getCacheSignal)(d) : null;
          p && p.beginRead();
          try {
            let n2 = r2 && d ? function(e3, t4) {
              switch (t4.type) {
                case "request":
                  let r3 = t4.url.pathname, n3 = new URLSearchParams(t4.url.search), i2 = [...n3.keys()].sort((e4, t5) => e4.localeCompare(t5)).map((e4) => `${e4}=${n3.get(e4)}`).join("&");
                  return `${r3}${i2.length ? "?" : ""}${i2}`;
                case "prerender":
                case "prerender-client":
                case "validation-client":
                case "prerender-runtime":
                case "prerender-ppr":
                case "prerender-legacy":
                case "cache":
                case "private-cache":
                case "unstable-cache":
                case "generate-static-params":
                  return e3.route;
                default:
                  return t4;
              }
            }(r2, d) : "", p2 = `${h}-${JSON.stringify(t3)}`, g = await f.generateCacheKey(p2), m = `unstable_cache ${n2} ${e2.name ? ` ${e2.name}` : g}`, y = (r2 ? r2.nextFetchId : o) ?? 1, b = null == d ? void 0 : d.implicitTags, v = { type: "unstable-cache", phase: "render", implicitTags: b, draftMode: d && r2 && (0, i.getDraftModeProviderForCacheScope)(r2, d), rootParams: void 0 };
            if (r2) {
              r2.nextFetchId = y + 1;
              let n3 = false;
              if (d) switch (d.type) {
                case "cache":
                case "private-cache":
                case "prerender":
                case "prerender-runtime":
                case "prerender-ppr":
                case "prerender-legacy":
                  "number" == typeof u.revalidate && (d.revalidate < u.revalidate || (d.revalidate = u.revalidate));
                  let i2 = d.tags;
                  if (null === i2) d.tags = c.slice();
                  else for (let e3 of c) i2.includes(e3) || i2.push(e3);
                  break;
                case "unstable-cache":
                  n3 = true;
              }
              if (!n3 && "force-no-store" !== r2.fetchCache && !r2.isOnDemandRevalidate && !f.isOnDemandRevalidate && !r2.isDraftMode) {
                let n4 = await f.get(g, { kind: a.IncrementalCacheKind.FETCH, revalidate: u.revalidate, tags: c, softTags: null == b ? void 0 : b.tags, fetchIdx: y, fetchUrl: m });
                if (n4 && n4.value) if (n4.value.kind !== a.CachedRouteKind.FETCH) console.error(`Invariant invalid cacheEntry returned for ${p2}`);
                else {
                  let i2 = void 0 !== n4.value.data.body ? JSON.parse(n4.value.data.body) : void 0;
                  if (n4.isStale) {
                    if (r2.pendingRevalidates || (r2.pendingRevalidates = {}), !r2.pendingRevalidates[p2]) {
                      let n5 = s.workUnitAsyncStorage.run(v, e2, ...t3).then(async (e3) => (await l(e3, f, g, c, u.revalidate, y, m), e3)).catch((e3) => (console.error(`revalidating cache with key: ${p2}`, e3), i2));
                      r2.isStaticGeneration && n5.catch(() => {
                      }), r2.pendingRevalidates[p2] = n5;
                    }
                    if (r2.isStaticGeneration) return r2.pendingRevalidates[p2];
                  }
                  return i2;
                }
              }
              let o2 = await s.workUnitAsyncStorage.run(v, e2, ...t3);
              return r2.isDraftMode || (r2.pendingRevalidates || (r2.pendingRevalidates = {}), r2.pendingRevalidates[p2] = l(o2, f, g, c, u.revalidate, y, m)), o2;
            }
            {
              if (o += 1, !f.isOnDemandRevalidate) {
                let e3 = await f.get(g, { kind: a.IncrementalCacheKind.FETCH, revalidate: u.revalidate, tags: c, fetchIdx: y, fetchUrl: m, softTags: null == b ? void 0 : b.tags });
                if (e3 && e3.value) {
                  if (e3.value.kind !== a.CachedRouteKind.FETCH) console.error(`Invariant invalid cacheEntry returned for ${p2}`);
                  else if (!e3.isStale) return void 0 !== e3.value.data.body ? JSON.parse(e3.value.data.body) : void 0;
                }
              }
              let r3 = await s.workUnitAsyncStorage.run(v, e2, ...t3);
              return await l(r3, f, g, c, u.revalidate, y, m), r3;
            }
          } finally {
            p && p.endRead();
          }
        };
      }]);
    }, 36146, (e) => {
      "use strict";
      var t = e.i(63072), r = e.i(6443), n = e.i(26430);
      e.i(7754);
      var i = e.i(90460);
      e.i(53835);
      var s = e.i(82453), a = e.i(18368), o = e.i(25753), l = e.i(87479), u = e.i(52151);
      function c(e2, r2, n2) {
        var u2;
        let c2 = i.workAsyncStorage.getStore();
        if (!c2 || !c2.incrementalCache) throw Object.defineProperty(Error(`Invariant: static generation store missing in ${r2}`), "__NEXT_ERROR_CODE", { value: "E263", enumerable: false, configurable: true });
        let h = s.workUnitAsyncStorage.getStore();
        if (h) {
          if ("render" === h.phase) throw Object.defineProperty(Error(`Route ${c2.route} used "${r2}" during render which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E7", enumerable: false, configurable: true });
          switch (h.type) {
            case "cache":
            case "private-cache":
              throw Object.defineProperty(Error(`Route ${c2.route} used "${r2}" inside a "use cache" which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E181", enumerable: false, configurable: true });
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${c2.route} used "${r2}" inside a function cached with "unstable_cache(...)" which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E306", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${c2.route} used "${r2}" inside \`generateStaticParams\` which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E1127", enumerable: false, configurable: true });
            case "prerender":
            case "prerender-runtime":
              let e3 = Object.defineProperty(Error(`Route ${c2.route} used ${r2} without first calling \`await connection()\`.`), "__NEXT_ERROR_CODE", { value: "E406", enumerable: false, configurable: true });
              return (0, t.abortAndThrowOnSynchronousRequestDataAccess)(c2.route, r2, e3, h);
            case "prerender-client":
            case "validation-client":
              throw Object.defineProperty(new o.InvariantError(`${r2} must not be used within a client component. Next.js should be preventing ${r2} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E693", enumerable: false, configurable: true });
            case "prerender-ppr":
              return (0, t.postponeWithTracking)(c2.route, r2, h.dynamicTracking);
            case "prerender-legacy":
              h.revalidate = 0;
              let n3 = Object.defineProperty(new a.DynamicServerError(`Route ${c2.route} couldn't be rendered statically because it used \`${r2}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
              throw c2.dynamicUsageDescription = r2, c2.dynamicUsageStack = n3.stack, n3;
          }
        }
        for (let t2 of (c2.pendingRevalidatedTags || (c2.pendingRevalidatedTags = []), e2)) -1 === c2.pendingRevalidatedTags.findIndex((e3) => e3.tag === t2 && ("string" == typeof e3.profile && "string" == typeof n2 ? e3.profile === n2 : "object" == typeof e3.profile && "object" == typeof n2 ? JSON.stringify(e3.profile) === JSON.stringify(n2) : e3.profile === n2)) && c2.pendingRevalidatedTags.push({ tag: t2, profile: n2 });
        let d = n2 && "object" == typeof n2 ? n2 : n2 && "string" == typeof n2 && (null == c2 || null == (u2 = c2.cacheLifeProfiles) ? void 0 : u2[n2]) ? c2.cacheLifeProfiles[n2] : void 0;
        n2 && (null == d ? void 0 : d.expire) !== 0 || (c2.pathWasRevalidated = l.ActionDidRevalidateStaticAndDynamic);
      }
      e.s(["refresh", 0, function() {
        let e2 = i.workAsyncStorage.getStore(), t2 = s.workUnitAsyncStorage.getStore();
        if (!e2 || e2.page.endsWith("/route") || (null == t2 ? void 0 : t2.phase) !== "action") throw Object.defineProperty(Error("refresh can only be called from within a Server Action. See more info here: https://nextjs.org/docs/app/api-reference/functions/refresh"), "__NEXT_ERROR_CODE", { value: "E870", enumerable: false, configurable: true });
        e2 && (e2.pathWasRevalidated = l.ActionDidRevalidateDynamicOnly);
      }, "revalidatePath", 0, function(e2, t2) {
        if (e2.length > n.NEXT_CACHE_SOFT_TAG_MAX_LENGTH) return void console.warn(`Warning: revalidatePath received "${e2}" which exceeded max length of ${n.NEXT_CACHE_SOFT_TAG_MAX_LENGTH}. See more info here https://nextjs.org/docs/app/api-reference/functions/revalidatePath`);
        let i2 = `${n.NEXT_CACHE_IMPLICIT_TAG_ID}${(0, u.removeTrailingSlash)(e2)}`;
        t2 ? i2 += `${i2.endsWith("/") ? "" : "/"}${t2}` : (0, r.isDynamicRoute)(e2) && console.warn(`Warning: a dynamic page path "${e2}" was passed to "revalidatePath", but the "type" parameter is missing. This has no effect by default, see more info here https://nextjs.org/docs/app/api-reference/functions/revalidatePath`);
        let s2 = [i2];
        return i2 === `${n.NEXT_CACHE_IMPLICIT_TAG_ID}/` ? s2.push(`${n.NEXT_CACHE_IMPLICIT_TAG_ID}/index`) : i2 === `${n.NEXT_CACHE_IMPLICIT_TAG_ID}/index` && s2.push(`${n.NEXT_CACHE_IMPLICIT_TAG_ID}/`), c(s2, `revalidatePath ${e2}`);
      }, "revalidateTag", 0, function(e2, t2) {
        return t2 || console.warn('"revalidateTag" without the second argument is now deprecated, add second argument of "max" or use "updateTag". See more info here: https://nextjs.org/docs/messages/revalidate-tag-single-arg'), c([e2], `revalidateTag ${e2}`, t2);
      }, "updateTag", 0, function(e2) {
        let t2 = i.workAsyncStorage.getStore();
        if (!t2 || t2.page.endsWith("/route")) throw Object.defineProperty(Error("updateTag can only be called from within a Server Action. To invalidate cache tags in Route Handlers or other contexts, use revalidateTag instead. See more info here: https://nextjs.org/docs/app/api-reference/functions/updateTag"), "__NEXT_ERROR_CODE", { value: "E872", enumerable: false, configurable: true });
        return c([e2], `updateTag ${e2}`, void 0);
      }]);
    }, 65535, (e) => {
      "use strict";
      e.i(7754);
      var t = e.i(90460);
      e.i(53835);
      var r = e.i(82453), n = e.i(63072);
      e.s(["unstable_noStore", 0, function() {
        let e2 = t.workAsyncStorage.getStore(), i = r.workUnitAsyncStorage.getStore();
        if (e2) {
          if (!e2.forceStatic) {
            if (e2.isUnstableNoStore = true, i) switch (i.type) {
              case "prerender":
              case "prerender-client":
              case "validation-client":
              case "prerender-runtime":
                return;
            }
            (0, n.markCurrentScopeAsDynamic)(e2, i, "unstable_noStore()");
          }
        }
      }]);
    }, 9361, (e) => {
      "use strict";
      e.i(25753), e.i(7754), e.i(90460), e.i(53835), e.i(82453), e.s(["cacheLife", 0, function(e2) {
        throw Object.defineProperty(Error("`cacheLife()` is only available with the `cacheComponents` config."), "__NEXT_ERROR_CODE", { value: "E887", enumerable: false, configurable: true });
      }]);
    }, 38974, (e) => {
      "use strict";
      e.i(53835), e.i(82453), e.i(36773), e.s(["cacheTag", 0, function() {
        throw Object.defineProperty(Error("`cacheTag()` is only available with the `cacheComponents` config."), "__NEXT_ERROR_CODE", { value: "E886", enumerable: false, configurable: true });
      }]);
    }, 77040, (e, t, r) => {
      let n;
      n = { unstable_cache: e.r(88992).unstable_cache, updateTag: e.r(36146).updateTag, revalidateTag: e.r(36146).revalidateTag, revalidatePath: e.r(36146).revalidatePath, refresh: e.r(36146).refresh, unstable_noStore: e.r(65535).unstable_noStore, cacheLife: e.r(9361).cacheLife, cacheTag: e.r(38974).cacheTag };
      let i = false, s = false;
      n.unstable_cacheLife = function() {
        return i || (i = true, console.error(Error("`unstable_cacheLife` was recently stabilized and should be imported as `cacheLife`. The `unstable` prefixed form will be removed in a future version of Next.js."))), n.cacheLife.apply(this, arguments);
      }, n.unstable_cacheTag = function() {
        return s || (s = true, console.error(Error("`unstable_cacheTag` was recently stabilized and should be imported as `cacheTag`. The `unstable` prefixed form will be removed in a future version of Next.js."))), n.cacheTag.apply(this, arguments);
      }, t.exports = n, r.unstable_cache = n.unstable_cache, r.revalidatePath = n.revalidatePath, r.revalidateTag = n.revalidateTag, r.updateTag = n.updateTag, r.unstable_noStore = n.unstable_noStore, r.cacheLife = n.cacheLife, r.unstable_cacheLife = n.unstable_cacheLife, r.cacheTag = n.cacheTag, r.unstable_cacheTag = n.unstable_cacheTag, r.refresh = n.refresh;
    }, 42738, (e) => {
      "use strict";
      let t, r, n;
      async function i() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let s = null;
      async function a() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        s || (s = i());
        let e10 = await s;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function o(...e10) {
        let t10 = await i();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let l = null;
      function u() {
        return l || (l = a()), l;
      }
      function c(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n10, i10) {
            if ("function" == typeof i10[0]) return i10[0](t10);
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      u();
      var h, d, f = e.i(23407), p = e.i(34144);
      let g = Symbol("response"), m = Symbol("passThrough"), y = Symbol("waitUntil");
      class b {
        constructor(e10, t10) {
          this[m] = false, this[y] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[g] || (this[g] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[m] = true;
        }
        waitUntil(e10) {
          if ("external" === this[y].kind) return (0, this[y].function)(e10);
          this[y].promises.push(e10);
        }
      }
      class v extends b {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new f.PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new f.PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      var w = e.i(44655);
      e.i(65664);
      var _ = e.i(28042), S = e.i(57841);
      class E {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let x = Symbol("internal response"), T = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function C(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, i10] of e10.request.headers) t10.set("x-middleware-request-" + n10, i10), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class P extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n10 = new Proxy(new _.ResponseCookies(r10), { get(e11, n11, i10) {
            switch (n11) {
              case "delete":
              case "set":
                return (...i11) => {
                  let s10 = Reflect.apply(e11[n11], e11, i11), a10 = new Headers(r10);
                  return s10 instanceof _.ResponseCookies && r10.set("x-middleware-set-cookie", s10.getAll().map((e12) => (0, _.stringifyCookie)(e12)).join(",")), C(t10, a10), s10;
                };
              default:
                return E.get(e11, n11, i10);
            }
          } });
          this[x] = { cookies: n10, url: t10.url ? new S.NextURL(t10.url, { headers: (0, p.toNodeOutgoingHttpHeaders)(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[x].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new P(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!T.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, i10 = new Headers(null == n10 ? void 0 : n10.headers);
          return i10.set("Location", (0, p.validateURL)(e10)), new P(null, { ...n10, headers: i10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", (0, p.validateURL)(e10)), C(t10, r10), new P(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), C(e10, t10), new P(null, { ...e10, headers: t10 });
        }
      }
      function A(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), i10 = n10.origin === r10.origin;
        return { url: i10 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: i10 };
      }
      let R = "next-router-prefetch", N = ["rsc", "next-router-state-tree", R, "next-hmr-refresh", "next-router-segment-prefetch"], O = "_rsc";
      var I = e.i(98105);
      class k extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new k();
        }
      }
      class D extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return E.get(t10, r10, n10);
            let i10 = r10.toLowerCase(), s10 = Object.keys(e10).find((e11) => e11.toLowerCase() === i10);
            if (void 0 !== s10) return E.get(t10, s10, n10);
          }, set(t10, r10, n10, i10) {
            if ("symbol" == typeof r10) return E.set(t10, r10, n10, i10);
            let s10 = r10.toLowerCase(), a10 = Object.keys(e10).find((e11) => e11.toLowerCase() === s10);
            return E.set(t10, a10 ?? r10, n10, i10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return E.has(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== i10 && E.has(t10, i10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return E.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === i10 || E.deleteProperty(t10, i10);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return k.callable;
              default:
                return E.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new D(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      e.i(7754);
      var L = e.i(90460), M = e.i(87479);
      class B extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new B();
        }
      }
      class $ {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return B.callable;
              default:
                return E.get(e11, t10, r10);
            }
          } });
        }
      }
      let j = Symbol.for("next.mutated.cookies");
      class q {
        static wrap(e10, t10) {
          let r10 = new _.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], i10 = /* @__PURE__ */ new Set(), s10 = () => {
            let e11 = L.workAsyncStorage.getStore();
            if (e11 && (e11.pathWasRevalidated = M.ActionDidRevalidateStaticAndDynamic), n10 = r10.getAll().filter((e12) => i10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new _.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, a10 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case j:
                return n10;
              case "delete":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), a10;
                  } finally {
                    s10();
                  }
                };
              case "set":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), a10;
                  } finally {
                    s10();
                  }
                };
              default:
                return E.get(e11, t11, r11);
            }
          } });
          return a10;
        }
      }
      function F(e10, t10) {
        if ("action" !== e10.phase) throw new B();
      }
      var U = e.i(26430), Q = e.i(23741);
      let z = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(z);
      class V {
        constructor(e10, t10, r10, n10) {
          var i10;
          const s10 = e10 && function(e11, t11) {
            let r11 = D.from(e11.headers);
            return { isOnDemandRevalidate: r11.get(U.PRERENDER_REVALIDATE_HEADER) === t11.previewModeId, revalidateOnlyGenerated: r11.has(U.PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER) };
          }(t10, e10).isOnDemandRevalidate, a10 = null == (i10 = r10.get(z)) ? void 0 : i10.value;
          this._isEnabled = !!(!s10 && a10 && e10 && a10 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: z, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: z, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function H(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of (0, p.splitCookiesString)(r10)) n10.append("set-cookie", e11);
          for (let e11 of new _.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      var G = e.i(53835), W = e.i(82453), K = e.i(99734), X = e.i(25753), J = e.i(56827);
      e.i(51615), process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let Y = Symbol.for("@next/cache-handlers-map"), Z = Symbol.for("@next/cache-handlers-set"), ee = globalThis;
      function et() {
        if (ee[Y]) return ee[Y].entries();
      }
      async function er(e10, t10) {
        if (!e10) return t10();
        let r10 = en(e10);
        try {
          return await t10();
        } finally {
          var n10, i10, s10, a10;
          let t11, o10, l2, u2, c2 = (n10 = r10, i10 = en(e10), t11 = new Set(n10.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), o10 = new Set(n10.pendingRevalidateWrites), { pendingRevalidatedTags: i10.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i10.pendingRevalidates).filter(([e11]) => !(e11 in n10.pendingRevalidates))), pendingRevalidateWrites: i10.pendingRevalidateWrites.filter((e11) => !o10.has(e11)) });
          await (s10 = e10, l2 = [], (u2 = (null == (a10 = c2) ? void 0 : a10.pendingRevalidatedTags) ?? s10.pendingRevalidatedTags ?? []).length > 0 && l2.push(ei(u2, s10.incrementalCache, s10)), l2.push(...Object.values((null == a10 ? void 0 : a10.pendingRevalidates) ?? s10.pendingRevalidates ?? {})), l2.push(...(null == a10 ? void 0 : a10.pendingRevalidateWrites) ?? s10.pendingRevalidateWrites ?? []), 0 !== l2.length && Promise.all(l2).then(() => void 0));
        }
      }
      function en(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function ei(e10, t10, r10) {
        if (0 === e10.length) return;
        let n10 = function() {
          if (ee[Z]) return ee[Z].values();
        }(), i10 = [], s10 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of s10) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n11 = e11 || r11;
          s10.has(n11) || s10.set(n11, []), s10.get(n11).push(t11.tag);
        }
        for (let [e11, o10] of s10) {
          let s11;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11) {
              var a10;
              if (!(t11 = null == r10 || null == (a10 = r10.cacheLifeProfiles) ? void 0 : a10[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t11 && (s11 = { expire: t11.expire });
          }
          for (let t11 of n10 || []) e11 ? i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10, s11)) : i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10));
          t10 && i10.push(t10.revalidateTag(o10, s11));
        }
        await Promise.all(i10);
      }
      var es = e.i(90044);
      let ea = (0, es.createAsyncLocalStorage)();
      class eo {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new K.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if ((0, J.isThenable)(e10)) this.waitUntil || el(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          this.waitUntil || el();
          let t10 = W.workUnitAsyncStorage.getStore();
          t10 && this.workUnitStores.add(t10);
          let r10 = ea.getStore(), n10 = r10 ? r10.rootTaskSpawnPhase : null == t10 ? void 0 : t10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let i10 = (0, es.bindSnapshot)(async () => {
            try {
              await ea.run({ rootTaskSpawnPhase: n10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          });
          this.callbackQueue.add(i10);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = L.workAsyncStorage.getStore();
          if (!e10) throw Object.defineProperty(new X.InvariantError("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return er(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new X.InvariantError("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function el() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function eu(e10) {
        let t10, r10 = { then: (n10, i10) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, i10)) };
        return r10;
      }
      var ec = e.i(2275);
      class eh {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function ed() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let ef = Symbol.for("@next/request-context");
      async function ep(e10, t10, r10) {
        let n10 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.split("/");
            for (let e12 = 1; e12 < r11.length + 1; e12++) {
              let n11 = r11.slice(0, e12).join("/");
              n11 && (n11.endsWith("/page") || n11.endsWith("/route") || (n11 = `${n11}${!n11.endsWith("/") ? "/" : ""}layout`), t12.push(n11));
            }
          }
          return t12;
        })(e10)) t11 = `${U.NEXT_CACHE_IMPLICIT_TAG_ID}${t11}`, n10.add(t11);
        if (t10 && (!r10 || 0 === r10.size)) {
          let e11 = `${U.NEXT_CACHE_IMPLICIT_TAG_ID}${t10}`;
          n10.add(e11);
        }
        n10.has(`${U.NEXT_CACHE_IMPLICIT_TAG_ID}/`) && n10.add(`${U.NEXT_CACHE_IMPLICIT_TAG_ID}/index`), n10.has(`${U.NEXT_CACHE_IMPLICIT_TAG_ID}/index`) && n10.add(`${U.NEXT_CACHE_IMPLICIT_TAG_ID}/`);
        let i10 = Array.from(n10);
        return { tags: i10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = et();
          if (r11) for (let [n11, i11] of r11) "getExpiration" in i11 && t11.set(n11, eu(async () => i11.getExpiration(e11)));
          return t11;
        }(i10) };
      }
      var eg = e.i(7553);
      class em extends w.NextRequest {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new f.PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new f.PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new f.PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let ey = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, eb = (e10, t10) => (0, Q.getTracer)().withPropagatedContext(e10.headers, t10, ey), ev = false;
      async function ew(t10) {
        var r10, n10, i10, s10;
        let a10, o10, l2, c2, h2;
        !function() {
          if (!ev && (ev = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(94165);
            t11(), eb = r11(eb);
          }
        }(), await u();
        let d2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = (0, I.normalizeRscURL)(t10.request.url);
        let f2 = t10.bypassNextUrl ? new URL(t10.request.url) : new S.NextURL(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...f2.searchParams.keys()]) {
          let t11 = f2.searchParams.getAll(e10), r11 = (0, p.normalizeNextQueryParam)(e10);
          if (r11) {
            for (let e11 of (f2.searchParams.delete(r11), t11)) f2.searchParams.append(r11, e11);
            f2.searchParams.delete(e10);
          }
        }
        let g2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in f2 && (g2 = f2.buildId || "", f2.buildId = "");
        let m2 = (0, p.fromNodeOutgoingHttpHeaders)(t10.request.headers), b2 = m2.has("x-nextjs-data"), w2 = "1" === m2.get("rsc");
        b2 && "/index" === f2.pathname && (f2.pathname = "/");
        let x2 = /* @__PURE__ */ new Map();
        if (!d2) for (let e10 of N) {
          let t11 = m2.get(e10);
          null !== t11 && (x2.set(e10, t11), m2.delete(e10));
        }
        let T2 = f2.searchParams.get(O), C2 = new em({ page: t10.page, input: ((c2 = (l2 = "string" == typeof f2) ? new URL(f2) : f2).searchParams.delete(O), l2 ? c2.toString() : c2).toString(), init: { body: t10.request.body, headers: m2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (0, eg.setRequestMeta)(C2, t10.request.requestMeta), b2 && Object.defineProperty(C2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: ed() }) }));
        let k2 = t10.request.waitUntil ?? (null == (r10 = null == (h2 = globalThis[ef]) ? void 0 : h2.get()) ? void 0 : r10.waitUntil), M2 = new v({ request: C2, page: t10.page, context: k2 ? { waitUntil: k2 } : void 0 });
        if ((a10 = await eb(C2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = M2.waitUntil.bind(M2), r11 = new eh();
            return (0, Q.getTracer)().trace(ec.MiddlewareSpan.execute, { spanName: `middleware ${C2.method}`, attributes: { "http.target": C2.nextUrl.pathname, "http.method": C2.method } }, async () => {
              try {
                var n11, i11, s11, a11, l3, u2;
                let c3 = ed(), h3 = await ep("/", C2.nextUrl.pathname, null), d3 = (l3 = C2.nextUrl, u2 = (e11) => {
                  o10 = e11;
                }, function(e11, t11, r12, n12, i12, s12, a12, o11, l4, u3) {
                  function c4(e12) {
                    r12 && r12.setHeader("Set-Cookie", e12);
                  }
                  let h4 = {};
                  return { type: "request", phase: e11, implicitTags: s12, url: { pathname: n12.pathname, search: n12.search ?? "" }, rootParams: i12, get headers() {
                    return h4.headers || (h4.headers = function(e12) {
                      let t12 = D.from(e12);
                      for (let e13 of N) t12.delete(e13);
                      return D.seal(t12);
                    }(t11.headers)), h4.headers;
                  }, get cookies() {
                    if (!h4.cookies) {
                      let e12 = new _.RequestCookies(D.from(t11.headers));
                      H(t11, e12), h4.cookies = $.seal(e12);
                    }
                    return h4.cookies;
                  }, set cookies(value) {
                    h4.cookies = value;
                  }, get mutableCookies() {
                    if (!h4.mutableCookies) {
                      var d4, f4;
                      let e12, n13 = (d4 = t11.headers, f4 = a12 || (r12 ? c4 : void 0), e12 = new _.RequestCookies(D.from(d4)), q.wrap(e12, f4));
                      H(t11, n13), h4.mutableCookies = n13;
                    }
                    return h4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!h4.userspaceMutableCookies) {
                      var p2;
                      let e12;
                      p2 = this, h4.userspaceMutableCookies = e12 = new Proxy(p2.mutableCookies, { get(t12, r13, n13) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return F(p2, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return F(p2, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return E.get(t12, r13, n13);
                        }
                      } });
                    }
                    return h4.userspaceMutableCookies;
                  }, get draftMode() {
                    return h4.draftMode || (h4.draftMode = new V(o11, t11, this.cookies, this.mutableCookies)), h4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: l4, serverComponentsHmrCache: u3 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", C2, void 0, l3, {}, h3, u2, c3, false, void 0)), f3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, previouslyRevalidatedTags: s12, nonce: a12 }) {
                  let o11 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, l4 = o11 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), u3 = { isStaticGeneration: o11, page: e11, route: (0, I.normalizeAppPath)(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: a12, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n13 } = e12;
                    return new eo({ waitUntil: t12, onClose: r13, onTaskError: n13 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, previouslyRevalidatedTags: s12, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = et();
                    if (t12) for (let [r13, n13] of t12) "refreshTags" in n13 && e12.set(r13, eu(async () => n13.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: (0, es.createSnapshot)(), shouldTrackFetchMetrics: l4, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = u3, u3;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (i11 = t10.request.nextConfig) || null == (n11 = i11.experimental) ? void 0 : n11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (a11 = t10.request.nextConfig) || null == (s11 = a11.experimental) ? void 0 : s11.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === C2.headers.get(R), buildId: g2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await L.workAsyncStorage.run(f3, () => W.workUnitAsyncStorage.run(d3, t10.handler, C2, M2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(C2, M2);
        })) && !(a10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        a10 && o10 && a10.headers.set("set-cookie", o10);
        let B2 = null == a10 ? void 0 : a10.headers.get("x-middleware-rewrite");
        if (a10 && B2 && (w2 || !d2)) {
          let e10 = new S.NextURL(B2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          d2 || e10.host !== C2.nextUrl.host || (e10.buildId = g2 || e10.buildId, a10.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: o11 } = A(e10.toString(), f2.toString());
          !d2 && b2 && a10.headers.set("x-nextjs-rewrite", r11);
          let l3 = !o11 && (null == (s10 = t10.request.nextConfig) || null == (i10 = s10.experimental) || null == (n10 = i10.clientParamParsingOrigins) ? void 0 : n10.some((t11) => new RegExp(t11).test(e10.origin)));
          w2 && (o11 || l3) && (f2.pathname !== e10.pathname && a10.headers.set("x-nextjs-rewritten-path", e10.pathname), f2.search !== e10.search && a10.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (a10 && B2 && w2 && T2) {
          let e10 = new URL(B2);
          e10.searchParams.has(O) || (e10.searchParams.set(O, T2), a10.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let j2 = null == a10 ? void 0 : a10.headers.get("Location");
        if (a10 && j2 && !d2) {
          let e10 = new S.NextURL(j2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          a10 = new Response(a10.body, a10), e10.host === f2.host && (e10.buildId = g2 || e10.buildId, a10.headers.set("Location", A(e10, f2).url)), b2 && (a10.headers.delete("Location"), a10.headers.set("x-nextjs-redirect", A(e10.toString(), f2.toString()).url));
        }
        let U2 = a10 || P.next(), z2 = U2.headers.get("x-middleware-override-headers"), G2 = [];
        if (z2) {
          for (let [e10, t11] of x2) U2.headers.set(`x-middleware-request-${e10}`, t11), G2.push(e10);
          G2.length > 0 && U2.headers.set("x-middleware-override-headers", z2 + "," + G2.join(","));
        }
        return { response: U2, waitUntil: ("internal" === M2[y].kind ? Promise.all(M2[y].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: C2.fetchMetrics };
      }
      e.i(60403);
      var e_ = e.i(83735), eS = e.i(68886);
      let eE = /* @__PURE__ */ new Map(), ex = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = eE.get(r10), n10 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n10 && n10 <= Date.now() && n10 > t10) return true;
        }
        return false;
      }, eT = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = eE.get(r10), n10 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n10 && n10 > t10) return true;
        }
        return false;
      };
      class eC {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r10 = [e10, t10, []];
          return this.tasks.push(r10), r10;
        }
        append(e10, t10) {
          let r10 = this.findOrCreateTask(eS.default.dirname(e10)), n10 = r10[1].then(() => this.fs.writeFile(e10, t10));
          n10.catch(() => {
          }), r10[2].push(n10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      var eP = e.i(25754);
      function eA(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class eR {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? eR.memoryCache ? eR.debug && console.log("FileSystemCache: memory store already initialized") : (eR.debug && console.log("FileSystemCache: using memory store for fetch cache"), eR.memoryCache = function(e11) {
            return t || (t = new eP.LRUCache(e11, function({ value: e12 }) {
              var t10, r10;
              if (!e12) return 25;
              if (e12.kind === e_.CachedRouteKind.REDIRECT) return JSON.stringify(e12.props).length;
              if (e12.kind === e_.CachedRouteKind.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (e12.kind === e_.CachedRouteKind.FETCH) return JSON.stringify(e12.data || "").length;
              if (e12.kind === e_.CachedRouteKind.APP_ROUTE) return e12.body.length;
              return e12.kind === e_.CachedRouteKind.APP_PAGE ? Math.max(1, e12.html.length + eA(e12.rscData) + ((null == (r10 = e12.postponed) ? void 0 : r10.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r11, n10] of e13) t11 += r11.length + eA(n10);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (t10 = JSON.stringify(e12.pageData)) ? void 0 : t10.length) || 0);
            })), t;
          }(e10.maxMemoryCacheSize)) : eR.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, eR.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r10 = Date.now();
          for (let n10 of e10) {
            let e11 = eE.get(n10) || {};
            if (t10) {
              let i10 = { ...e11 };
              i10.stale = r10, void 0 !== t10.expire && (i10.expired = r10 + 1e3 * t10.expire), eE.set(n10, i10);
            } else eE.set(n10, { ...e11, expired: r10 });
          }
        }
        async get(...e10) {
          var t10, r10, n10, i10, s10, a10;
          let [o10, l2] = e10, { kind: u2 } = l2, c2 = null == (t10 = eR.memoryCache) ? void 0 : t10.get(o10);
          if (eR.debug && (u2 === e_.IncrementalCacheKind.FETCH ? console.log("FileSystemCache: get", o10, l2.tags, u2, !!c2) : console.log("FileSystemCache: get", o10, u2, !!c2)), (null == c2 || null == (r10 = c2.value) ? void 0 : r10.kind) === e_.CachedRouteKind.APP_PAGE || (null == c2 || null == (n10 = c2.value) ? void 0 : n10.kind) === e_.CachedRouteKind.APP_ROUTE || (null == c2 || null == (i10 = c2.value) ? void 0 : i10.kind) === e_.CachedRouteKind.PAGES) {
            let e11 = null == (a10 = c2.value.headers) ? void 0 : a10[U.NEXT_CACHE_TAGS_HEADER];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && ex(t11, c2.lastModified)) return eR.debug && console.log("FileSystemCache: expired tags", t11), null;
            }
          } else if ((null == c2 || null == (s10 = c2.value) ? void 0 : s10.kind) === e_.CachedRouteKind.FETCH) {
            let e11 = l2.kind === e_.IncrementalCacheKind.FETCH ? [...l2.tags || [], ...l2.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return eR.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (ex(e11, c2.lastModified)) return eR.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          return c2 ?? null;
        }
        async set(e10, t10, r10) {
          var n10;
          if (null == (n10 = eR.memoryCache) || n10.set(e10, { value: t10, lastModified: Date.now() }), eR.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          let i10 = new eC(this.fs);
          if (t10.kind === e_.CachedRouteKind.APP_ROUTE) {
            let r11 = this.getFilePath(`${e10}.body`, e_.IncrementalCacheKind.APP_ROUTE);
            i10.append(r11, t10.body);
            let n11 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            i10.append(r11.replace(/\.body$/, U.NEXT_META_SUFFIX), JSON.stringify(n11, null, 2));
          } else if (t10.kind === e_.CachedRouteKind.PAGES || t10.kind === e_.CachedRouteKind.APP_PAGE) {
            let n11 = t10.kind === e_.CachedRouteKind.APP_PAGE, s10 = this.getFilePath(`${e10}.html`, n11 ? e_.IncrementalCacheKind.APP_PAGE : e_.IncrementalCacheKind.PAGES);
            if (i10.append(s10, t10.html), r10.fetchCache || r10.isFallback || r10.isRoutePPREnabled || i10.append(this.getFilePath(`${e10}${n11 ? U.RSC_SUFFIX : U.NEXT_DATA_SUFFIX}`, n11 ? e_.IncrementalCacheKind.APP_PAGE : e_.IncrementalCacheKind.PAGES), n11 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === e_.CachedRouteKind.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r12 = s10.replace(/\.html$/, U.RSC_SEGMENTS_DIR_SUFFIX);
                for (let [n12, s11] of t10.segmentData) {
                  e11.push(n12);
                  let t11 = r12 + n12 + U.RSC_SEGMENT_SUFFIX;
                  i10.append(t11, s11);
                }
              }
              let r11 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              i10.append(s10.replace(/\.html$/, U.NEXT_META_SUFFIX), JSON.stringify(r11));
            }
          } else if (t10.kind === e_.CachedRouteKind.FETCH) {
            let n11 = this.getFilePath(e10, e_.IncrementalCacheKind.FETCH);
            i10.append(n11, JSON.stringify({ ...t10, tags: r10.fetchCache ? r10.tags : [] }));
          }
          await i10.wait();
        }
        getFilePath(e10, t10) {
          switch (t10) {
            case e_.IncrementalCacheKind.FETCH:
              return eS.default.join(this.serverDistDir, "..", "cache", "fetch-cache", e10);
            case e_.IncrementalCacheKind.PAGES:
              return eS.default.join(this.serverDistDir, "pages", e10);
            case e_.IncrementalCacheKind.IMAGE:
            case e_.IncrementalCacheKind.APP_PAGE:
            case e_.IncrementalCacheKind.APP_ROUTE:
              return eS.default.join(this.serverDistDir, "app", e10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      var eN = e.i(35685), eO = e.i(6443);
      function eI(e10) {
        return e10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class ek {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.prerenderManifest = e10;
        }
        get(e10) {
          let t10 = ek.cacheControls.get(e10);
          if (t10) return t10;
          let r10 = this.prerenderManifest.routes[e10];
          if (r10) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = r10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let n10 = this.prerenderManifest.dynamicRoutes[e10];
          if (n10) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = n10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          ek.cacheControls.set(e10, t10);
        }
        clear() {
          ek.cacheControls.clear();
        }
      }
      e.i(67914);
      var eD = e.i(56148);
      class eL {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r10, minimalMode: n10, serverDistDir: i10, requestHeaders: s10, maxMemoryCacheSize: a10, getPrerenderManifest: o10, fetchCacheKeyPrefix: l2, CurCacheHandler: u2, allowedRevalidateHeaderKeys: c2 }) {
          var h2, d2, f2, p2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!u2;
          const g2 = Symbol.for("@next/cache-handlers"), m2 = globalThis;
          if (u2) eL.debug && console.log("IncrementalCache: using custom cache handler", u2.name);
          else {
            const t11 = m2[g2];
            (null == t11 ? void 0 : t11.FetchCache) ? (u2 = t11.FetchCache, eL.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i10 && (eL.debug && console.log("IncrementalCache: using filesystem cache handler"), u2 = eR);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (a10 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n10, this.requestHeaders = s10, this.allowedRevalidateHeaderKeys = c2, this.prerenderManifest = o10(), this.cacheControls = new ek(this.prerenderManifest), this.fetchCacheKeyPrefix = l2;
          let y2 = [];
          s10[U.PRERENDER_REVALIDATE_HEADER] === (null == (d2 = this.prerenderManifest) || null == (h2 = d2.preview) ? void 0 : h2.previewModeId) && (this.isOnDemandRevalidate = true), n10 && (y2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[U.NEXT_CACHE_REVALIDATED_TAGS_HEADER] && e11[U.NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER] === t11 ? e11[U.NEXT_CACHE_REVALIDATED_TAGS_HEADER].split(",") : [];
          }(s10, null == (p2 = this.prerenderManifest) || null == (f2 = p2.preview) ? void 0 : f2.previewModeId)), u2 && (this.cacheHandler = new u2({ dev: t10, fs: e10, flushToDisk: r10, serverDistDir: i10, revalidatedTags: y2, maxMemoryCacheSize: a10, _requestHeaders: s10, fetchCacheKeyPrefix: l2 }));
        }
        calculateRevalidate(e10, t10, r10, n10) {
          if (r10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i10 = this.cacheControls.get(eI(e10)), s10 = i10 ? i10.revalidate : !n10 && 1;
          return "number" == typeof s10 ? 1e3 * s10 + t10 : s10;
        }
        _getPathname(e10, t10) {
          return t10 ? e10 : /^\/index(\/|$)/.test(e10) && !(0, eO.isDynamicRoute)(e10) ? `/index${e10}` : "/" === e10 ? "/index" : (0, eN.ensureLeadingSlash)(e10);
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (eL.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r10 } = new eD.DetachedPromise();
          return eL.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r10), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r10;
          return null == (r10 = this.cacheHandler) ? void 0 : r10.revalidateTag(e10, t10);
        }
        async generateCacheKey(e10, t10 = {}) {
          let r10 = [], n10 = new TextEncoder(), i10 = new TextDecoder();
          if (t10.body) if (t10.body instanceof Uint8Array) r10.push(i10.decode(t10.body)), t10._ogBody = t10.body;
          else if ("function" == typeof t10.body.getReader) {
            let e11 = t10.body, s11 = [];
            try {
              await e11.pipeTo(new WritableStream({ write(e12) {
                "string" == typeof e12 ? (s11.push(n10.encode(e12)), r10.push(e12)) : (s11.push(e12), r10.push(i10.decode(e12, { stream: true })));
              } })), r10.push(i10.decode());
              let a11 = s11.reduce((e12, t11) => e12 + t11.length, 0), o11 = new Uint8Array(a11), l2 = 0;
              for (let e12 of s11) o11.set(e12, l2), l2 += e12.length;
              t10._ogBody = o11;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof t10.body.keys) {
            let e11 = t10.body;
            for (let n11 of (t10._ogBody = t10.body, /* @__PURE__ */ new Set([...e11.keys()]))) {
              let t11 = e11.getAll(n11);
              r10.push(`${n11}=${(await Promise.all(t11.map(async (e12) => "string" == typeof e12 ? e12 : await e12.text()))).join(",")}`);
            }
          } else if ("function" == typeof t10.body.arrayBuffer) {
            let e11 = t10.body, n11 = await e11.arrayBuffer();
            r10.push(await e11.text()), t10._ogBody = new Blob([n11], { type: e11.type });
          } else "string" == typeof t10.body && (r10.push(t10.body), t10._ogBody = t10.body);
          let s10 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          "traceparent" in s10 && delete s10.traceparent, "tracestate" in s10 && delete s10.tracestate;
          let a10 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", e10, t10.method, s10, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r10]);
          {
            var o10;
            let e11 = n10.encode(a10);
            return o10 = await crypto.subtle.digest("SHA-256", e11), Array.prototype.map.call(new Uint8Array(o10), (e12) => e12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(e10, t10) {
          var r10, n10, i10, s10, a10, o10, l2;
          let u2, c2;
          if (t10.kind === e_.IncrementalCacheKind.FETCH) {
            let r11 = W.workUnitAsyncStorage.getStore(), n11 = r11 ? (0, G.getRenderResumeDataCache)(r11) : null;
            if (n11) {
              let r12 = n11.fetch.get(e10);
              if ((null == r12 ? void 0 : r12.kind) === e_.CachedRouteKind.FETCH) {
                let n12 = L.workAsyncStorage.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r13;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n12 || null == (r13 = n12.pendingRevalidatedTags) ? void 0 : r13.some((t12) => t12.tag === e11));
                })) return eL.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r12 };
                eL.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else eL.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else eL.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== e_.IncrementalCacheKind.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          e10 = this._getPathname(e10, t10.kind === e_.IncrementalCacheKind.FETCH);
          let h2 = await (null == (r10 = this.cacheHandler) ? void 0 : r10.get(e10, t10));
          if (t10.kind === e_.IncrementalCacheKind.FETCH) {
            if (!h2) return null;
            if ((null == (i10 = h2.value) ? void 0 : i10.kind) !== e_.CachedRouteKind.FETCH) throw Object.defineProperty(new X.InvariantError(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (s10 = h2.value) ? void 0 : s10.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r11 = L.workAsyncStorage.getStore(), n11 = [...t10.tags || [], ...t10.softTags || []];
            if (n11.some((e11) => {
              var t11, n12;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r11 || null == (n12 = r11.pendingRevalidatedTags) ? void 0 : n12.some((t12) => t12.tag === e11));
            })) return eL.debug && console.log("IncrementalCache: expired tag", e10), null;
            let a11 = W.workUnitAsyncStorage.getStore();
            if (a11) {
              let t11 = (0, G.getPrerenderResumeDataCache)(a11);
              t11 && (eL.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, h2.value));
            }
            let o11 = t10.revalidate || h2.value.revalidate, l3 = (performance.timeOrigin + performance.now() - (h2.lastModified || 0)) / 1e3 > o11, u3 = h2.value.data;
            return ex(n11, h2.lastModified) ? null : (eT(n11, h2.lastModified) && (l3 = true), { isStale: l3, value: { kind: e_.CachedRouteKind.FETCH, data: u3, revalidate: o11 } });
          }
          if ((null == h2 || null == (n10 = h2.value) ? void 0 : n10.kind) === e_.CachedRouteKind.FETCH) throw Object.defineProperty(new X.InvariantError(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let d2 = null, { isFallback: f2 } = t10, p2 = this.cacheControls.get(eI(e10));
          if ((null == h2 ? void 0 : h2.lastModified) === -1) u2 = -1, c2 = -1 * U.CACHE_ONE_YEAR_SECONDS * 1e3;
          else {
            let r11 = performance.timeOrigin + performance.now(), n11 = (null == h2 ? void 0 : h2.lastModified) || r11;
            if (void 0 === (u2 = false !== (c2 = this.calculateRevalidate(e10, n11, this.dev ?? false, t10.isFallback)) && c2 < r11 || void 0) && ((null == h2 || null == (a10 = h2.value) ? void 0 : a10.kind) === e_.CachedRouteKind.APP_PAGE || (null == h2 || null == (o10 = h2.value) ? void 0 : o10.kind) === e_.CachedRouteKind.APP_ROUTE)) {
              let e11 = null == (l2 = h2.value.headers) ? void 0 : l2[U.NEXT_CACHE_TAGS_HEADER];
              if ("string" == typeof e11) {
                let t11 = e11.split(",");
                t11.length > 0 && (ex(t11, n11) ? u2 = -1 : eT(t11, n11) && (u2 = true));
              }
            }
          }
          return h2 && (d2 = { isStale: u2, cacheControl: p2, revalidateAfter: c2, value: h2.value, isFallback: f2 }), !h2 && this.prerenderManifest.notFoundRoutes.includes(e10) && (d2 = { isStale: u2, value: null, cacheControl: p2, revalidateAfter: c2, isFallback: f2 }, this.set(e10, d2.value, { ...t10, cacheControl: p2 })), d2;
        }
        async set(e10, t10, r10) {
          if ((null == t10 ? void 0 : t10.kind) === e_.CachedRouteKind.FETCH) {
            let r11 = W.workUnitAsyncStorage.getStore(), n11 = r11 ? (0, G.getPrerenderResumeDataCache)(r11) : null;
            n11 && (eL.debug && console.log("IncrementalCache: rdc:set", e10), n11.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r10.fetchCache) return;
          e10 = this._getPathname(e10, r10.fetchCache);
          let n10 = JSON.stringify(t10).length;
          if (r10.fetchCache && n10 > 2097152 && !this.hasCustomCacheHandler && !r10.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r10.fetchUrl || e10}, items over 2MB can not be cached (${n10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var i10;
            !r10.fetchCache && r10.cacheControl && this.cacheControls.set(eI(e10), r10.cacheControl), await (null == (i10 = this.cacheHandler) ? void 0 : i10.set(e10, t10, r10));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      e.i(64445), e.i(63072);
      var eM = e.i(77040);
      let eB = Symbol.for("drizzle:entityKind");
      function e$(e10, t10) {
        if (!e10 || "object" != typeof e10) return false;
        if (e10 instanceof t10) return true;
        if (!Object.prototype.hasOwnProperty.call(t10, eB)) throw Error(`Class "${t10.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
        let r10 = Object.getPrototypeOf(e10).constructor;
        if (r10) for (; r10; ) {
          if (eB in r10 && r10[eB] === t10[eB]) return true;
          r10 = Object.getPrototypeOf(r10);
        }
        return false;
      }
      Symbol.for("drizzle:hasOwnEntityKind");
      class ej {
        constructor(e10, t10) {
          this.table = e10, this.config = t10, this.name = t10.name, this.keyAsName = t10.keyAsName, this.notNull = t10.notNull, this.default = t10.default, this.defaultFn = t10.defaultFn, this.onUpdateFn = t10.onUpdateFn, this.hasDefault = t10.hasDefault, this.primary = t10.primaryKey, this.isUnique = t10.isUnique, this.uniqueName = t10.uniqueName, this.uniqueType = t10.uniqueType, this.dataType = t10.dataType, this.columnType = t10.columnType, this.generated = t10.generated, this.generatedIdentity = t10.generatedIdentity;
        }
        static [eB] = "Column";
        name;
        keyAsName;
        primary;
        notNull;
        default;
        defaultFn;
        onUpdateFn;
        hasDefault;
        isUnique;
        uniqueName;
        uniqueType;
        dataType;
        columnType;
        enumValues = void 0;
        generated = void 0;
        generatedIdentity = void 0;
        config;
        mapFromDriverValue(e10) {
          return e10;
        }
        mapToDriverValue(e10) {
          return e10;
        }
        shouldDisableInsert() {
          return void 0 !== this.config.generated && "byDefault" !== this.config.generated.type;
        }
      }
      let eq = Symbol.for("drizzle:Name"), eF = Symbol.for("drizzle:Schema"), eU = Symbol.for("drizzle:Columns"), eQ = Symbol.for("drizzle:ExtraConfigColumns"), ez = Symbol.for("drizzle:OriginalName"), eV = Symbol.for("drizzle:BaseName"), eH = Symbol.for("drizzle:IsAlias"), eG = Symbol.for("drizzle:ExtraConfigBuilder"), eW = Symbol.for("drizzle:IsDrizzleTable");
      class eK {
        static [eB] = "Table";
        static Symbol = { Name: eq, Schema: eF, OriginalName: ez, Columns: eU, ExtraConfigColumns: eQ, BaseName: eV, IsAlias: eH, ExtraConfigBuilder: eG };
        [eq];
        [ez];
        [eF];
        [eU];
        [eQ];
        [eV];
        [eH] = false;
        [eW] = true;
        [eG] = void 0;
        constructor(e10, t10, r10) {
          this[eq] = this[ez] = e10, this[eF] = t10, this[eV] = r10;
        }
      }
      function eX(e10) {
        return `${e10[eF] ?? "public"}.${e10[eq]}`;
      }
      class eJ {
        static [eB] = "ColumnBuilder";
        config;
        constructor(e10, t10, r10) {
          this.config = { name: e10, keyAsName: "" === e10, notNull: false, default: void 0, hasDefault: false, primaryKey: false, isUnique: false, uniqueName: void 0, uniqueType: void 0, dataType: t10, columnType: r10, generated: void 0 };
        }
        $type() {
          return this;
        }
        notNull() {
          return this.config.notNull = true, this;
        }
        default(e10) {
          return this.config.default = e10, this.config.hasDefault = true, this;
        }
        $defaultFn(e10) {
          return this.config.defaultFn = e10, this.config.hasDefault = true, this;
        }
        $default = this.$defaultFn;
        $onUpdateFn(e10) {
          return this.config.onUpdateFn = e10, this.config.hasDefault = true, this;
        }
        $onUpdate = this.$onUpdateFn;
        primaryKey() {
          return this.config.primaryKey = true, this.config.notNull = true, this;
        }
        setName(e10) {
          "" === this.config.name && (this.config.name = e10);
        }
      }
      class eY {
        static [eB] = "PgForeignKeyBuilder";
        reference;
        _onUpdate = "no action";
        _onDelete = "no action";
        constructor(e10, t10) {
          this.reference = () => {
            let { name: t11, columns: r10, foreignColumns: n10 } = e10();
            return { name: t11, columns: r10, foreignTable: n10[0].table, foreignColumns: n10 };
          }, t10 && (this._onUpdate = t10.onUpdate, this._onDelete = t10.onDelete);
        }
        onUpdate(e10) {
          return this._onUpdate = void 0 === e10 ? "no action" : e10, this;
        }
        onDelete(e10) {
          return this._onDelete = void 0 === e10 ? "no action" : e10, this;
        }
        build(e10) {
          return new eZ(e10, this);
        }
      }
      class eZ {
        constructor(e10, t10) {
          this.table = e10, this.reference = t10.reference, this.onUpdate = t10._onUpdate, this.onDelete = t10._onDelete;
        }
        static [eB] = "PgForeignKey";
        reference;
        onUpdate;
        onDelete;
        getName() {
          let { name: e10, columns: t10, foreignColumns: r10 } = this.reference(), n10 = t10.map((e11) => e11.name), i10 = r10.map((e11) => e11.name), s10 = [this.table[eq], ...n10, r10[0].table[eq], ...i10];
          return e10 ?? `${s10.join("_")}_fk`;
        }
      }
      function e0(e10, ...t10) {
        return e10(...t10);
      }
      function e1(e10, t10) {
        return `${e10[eq]}_${t10.join("_")}_unique`;
      }
      class e2 {
        constructor(e10, t10) {
          this.name = t10, this.columns = e10;
        }
        static [eB] = "PgUniqueConstraintBuilder";
        columns;
        nullsNotDistinctConfig = false;
        nullsNotDistinct() {
          return this.nullsNotDistinctConfig = true, this;
        }
        build(e10) {
          return new e5(e10, this.columns, this.nullsNotDistinctConfig, this.name);
        }
      }
      class e6 {
        static [eB] = "PgUniqueOnConstraintBuilder";
        name;
        constructor(e10) {
          this.name = e10;
        }
        on(...e10) {
          return new e2(e10, this.name);
        }
      }
      class e5 {
        constructor(e10, t10, r10, n10) {
          this.table = e10, this.columns = t10, this.name = n10 ?? e1(this.table, this.columns.map((e11) => e11.name)), this.nullsNotDistinct = r10;
        }
        static [eB] = "PgUniqueConstraint";
        columns;
        name;
        nullsNotDistinct = false;
        getName() {
          return this.name;
        }
      }
      function e3(e10, t10, r10) {
        for (let n10 = t10; n10 < e10.length; n10++) {
          let i10 = e10[n10];
          if ("\\" === i10) {
            n10++;
            continue;
          }
          if ('"' === i10) return [e10.slice(t10, n10).replace(/\\/g, ""), n10 + 1];
          if (!r10 && ("," === i10 || "}" === i10)) return [e10.slice(t10, n10).replace(/\\/g, ""), n10];
        }
        return [e10.slice(t10).replace(/\\/g, ""), e10.length];
      }
      class e4 extends eJ {
        foreignKeyConfigs = [];
        static [eB] = "PgColumnBuilder";
        array(e10) {
          return new te(this.config.name, this, e10);
        }
        references(e10, t10 = {}) {
          return this.foreignKeyConfigs.push({ ref: e10, actions: t10 }), this;
        }
        unique(e10, t10) {
          return this.config.isUnique = true, this.config.uniqueName = e10, this.config.uniqueType = t10?.nulls, this;
        }
        generatedAlwaysAs(e10) {
          return this.config.generated = { as: e10, type: "always", mode: "stored" }, this;
        }
        buildForeignKeys(e10, t10) {
          return this.foreignKeyConfigs.map(({ ref: r10, actions: n10 }) => e0((r11, n11) => {
            let i10 = new eY(() => ({ columns: [e10], foreignColumns: [r11()] }));
            return n11.onUpdate && i10.onUpdate(n11.onUpdate), n11.onDelete && i10.onDelete(n11.onDelete), i10.build(t10);
          }, r10, n10));
        }
        buildExtraConfigColumn(e10) {
          return new e7(e10, this.config);
        }
      }
      class e8 extends ej {
        constructor(e10, t10) {
          t10.uniqueName || (t10.uniqueName = e1(e10, [t10.name])), super(e10, t10), this.table = e10;
        }
        static [eB] = "PgColumn";
      }
      class e7 extends e8 {
        static [eB] = "ExtraConfigColumn";
        getSQLType() {
          return this.getSQLType();
        }
        indexConfig = { order: this.config.order ?? "asc", nulls: this.config.nulls ?? "last", opClass: this.config.opClass };
        defaultConfig = { order: "asc", nulls: "last", opClass: void 0 };
        asc() {
          return this.indexConfig.order = "asc", this;
        }
        desc() {
          return this.indexConfig.order = "desc", this;
        }
        nullsFirst() {
          return this.indexConfig.nulls = "first", this;
        }
        nullsLast() {
          return this.indexConfig.nulls = "last", this;
        }
        op(e10) {
          return this.indexConfig.opClass = e10, this;
        }
      }
      class e9 {
        static [eB] = "IndexedColumn";
        constructor(e10, t10, r10, n10) {
          this.name = e10, this.keyAsName = t10, this.type = r10, this.indexConfig = n10;
        }
        name;
        keyAsName;
        type;
        indexConfig;
      }
      class te extends e4 {
        static [eB] = "PgArrayBuilder";
        constructor(e10, t10, r10) {
          super(e10, "array", "PgArray"), this.config.baseBuilder = t10, this.config.size = r10;
        }
        build(e10) {
          let t10 = this.config.baseBuilder.build(e10);
          return new tt(e10, this.config, t10);
        }
      }
      class tt extends e8 {
        constructor(e10, t10, r10, n10) {
          super(e10, t10), this.baseColumn = r10, this.range = n10, this.size = t10.size;
        }
        size;
        static [eB] = "PgArray";
        getSQLType() {
          return `${this.baseColumn.getSQLType()}[${"number" == typeof this.size ? this.size : ""}]`;
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 && (e10 = function(e11) {
            let [t10] = function e12(t11, r10 = 0) {
              let n10 = [], i10 = r10, s10 = false;
              for (; i10 < t11.length; ) {
                let a10 = t11[i10];
                if ("," === a10) {
                  (s10 || i10 === r10) && n10.push(""), s10 = true, i10++;
                  continue;
                }
                if (s10 = false, "\\" === a10) {
                  i10 += 2;
                  continue;
                }
                if ('"' === a10) {
                  let [e13, r11] = e3(t11, i10 + 1, true);
                  n10.push(e13), i10 = r11;
                  continue;
                }
                if ("}" === a10) return [n10, i10 + 1];
                if ("{" === a10) {
                  let [r11, s11] = e12(t11, i10 + 1);
                  n10.push(r11), i10 = s11;
                  continue;
                }
                let [o10, l2] = e3(t11, i10, false);
                n10.push(o10), i10 = l2;
              }
              return [n10, i10];
            }(e11, 1);
            return t10;
          }(e10)), e10.map((e11) => this.baseColumn.mapFromDriverValue(e11));
        }
        mapToDriverValue(e10, t10 = false) {
          let r10 = e10.map((e11) => null === e11 ? null : e$(this.baseColumn, tt) ? this.baseColumn.mapToDriverValue(e11, true) : this.baseColumn.mapToDriverValue(e11));
          return t10 ? r10 : function e11(t11) {
            return `{${t11.map((t12) => Array.isArray(t12) ? e11(t12) : "string" == typeof t12 ? `"${t12.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"` : `${t12}`).join(",")}}`;
          }(r10);
        }
      }
      class tr extends e4 {
        static [eB] = "PgEnumObjectColumnBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgEnumObjectColumn"), this.config.enum = t10;
        }
        build(e10) {
          return new tn(e10, this.config);
        }
      }
      class tn extends e8 {
        static [eB] = "PgEnumObjectColumn";
        enum;
        enumValues = this.config.enum.enumValues;
        constructor(e10, t10) {
          super(e10, t10), this.enum = t10.enum;
        }
        getSQLType() {
          return this.enum.enumName;
        }
      }
      let ti = Symbol.for("drizzle:isPgEnum");
      class ts extends e4 {
        static [eB] = "PgEnumColumnBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgEnumColumn"), this.config.enum = t10;
        }
        build(e10) {
          return new ta(e10, this.config);
        }
      }
      class ta extends e8 {
        static [eB] = "PgEnumColumn";
        enum = this.config.enum;
        enumValues = this.config.enum.enumValues;
        constructor(e10, t10) {
          super(e10, t10), this.enum = t10.enum;
        }
        getSQLType() {
          return this.enum.enumName;
        }
      }
      function to(e10, t10) {
        var r10;
        let n10, i10;
        return Array.isArray(t10) ? n10 = Object.assign((e11) => new ts(e11 ?? "", n10), { enumName: e10, enumValues: [...t10], schema: void 0, [ti]: true }) : (r10 = void 0, i10 = Object.assign((e11) => new tr(e11 ?? "", i10), { enumName: e10, enumValues: Object.values(t10), schema: r10, [ti]: true }));
      }
      class tl {
        static [eB] = "Subquery";
        constructor(e10, t10, r10, n10 = false, i10 = []) {
          this._ = { brand: "Subquery", sql: e10, selectedFields: t10, alias: r10, isWith: n10, usedTables: i10 };
        }
      }
      class tu extends tl {
        static [eB] = "WithSubquery";
      }
      let tc = (e10, t10) => r ? (n || (n = r.trace.getTracer("drizzle-orm", "0.45.2")), e0((r10, n10) => n10.startActiveSpan(e10, (e11) => {
        try {
          return t10(e11);
        } catch (t11) {
          throw e11.setStatus({ code: r10.SpanStatusCode.ERROR, message: t11 instanceof Error ? t11.message : "Unknown error" }), t11;
        } finally {
          e11.end();
        }
      }), r, n)) : t10(), th = Symbol.for("drizzle:ViewBaseConfig");
      class td {
        static [eB] = "FakePrimitiveParam";
      }
      function tf(e10) {
        return null != e10 && "function" == typeof e10.getSQL;
      }
      class tp {
        static [eB] = "StringChunk";
        value;
        constructor(e10) {
          this.value = Array.isArray(e10) ? e10 : [e10];
        }
        getSQL() {
          return new tg([this]);
        }
      }
      class tg {
        constructor(e10) {
          for (const t10 of (this.queryChunks = e10, e10)) if (e$(t10, eK)) {
            const e11 = t10[eK.Symbol.Schema];
            this.usedTables.push(void 0 === e11 ? t10[eK.Symbol.Name] : e11 + "." + t10[eK.Symbol.Name]);
          }
        }
        static [eB] = "SQL";
        decoder = ty;
        shouldInlineParams = false;
        usedTables = [];
        append(e10) {
          return this.queryChunks.push(...e10.queryChunks), this;
        }
        toQuery(e10) {
          return tc("drizzle.buildSQL", (t10) => {
            let r10 = this.buildQueryFromSourceParams(this.queryChunks, e10);
            return t10?.setAttributes({ "drizzle.query.text": r10.sql, "drizzle.query.params": JSON.stringify(r10.params) }), r10;
          });
        }
        buildQueryFromSourceParams(e10, t10) {
          let r10 = Object.assign({}, t10, { inlineParams: t10.inlineParams || this.shouldInlineParams, paramStartIndex: t10.paramStartIndex || { value: 0 } }), { casing: n10, escapeName: i10, escapeParam: s10, prepareTyping: a10, inlineParams: o10, paramStartIndex: l2 } = r10;
          var u2 = e10.map((e11) => {
            if (e$(e11, tp)) return { sql: e11.value.join(""), params: [] };
            if (e$(e11, tm)) return { sql: i10(e11.value), params: [] };
            if (void 0 === e11) return { sql: "", params: [] };
            if (Array.isArray(e11)) {
              let t11 = [new tp("(")];
              for (let [r11, n11] of e11.entries()) t11.push(n11), r11 < e11.length - 1 && t11.push(new tp(", "));
              return t11.push(new tp(")")), this.buildQueryFromSourceParams(t11, r10);
            }
            if (e$(e11, tg)) return this.buildQueryFromSourceParams(e11.queryChunks, { ...r10, inlineParams: o10 || e11.shouldInlineParams });
            if (e$(e11, eK)) {
              let t11 = e11[eK.Symbol.Schema], r11 = e11[eK.Symbol.Name];
              return { sql: void 0 === t11 || e11[eH] ? i10(r11) : i10(t11) + "." + i10(r11), params: [] };
            }
            if (e$(e11, ej)) {
              let r11 = n10.getColumnCasing(e11);
              if ("indexes" === t10.invokeSource) return { sql: i10(r11), params: [] };
              let s11 = e11.table[eK.Symbol.Schema];
              return { sql: e11.table[eH] || void 0 === s11 ? i10(e11.table[eK.Symbol.Name]) + "." + i10(r11) : i10(s11) + "." + i10(e11.table[eK.Symbol.Name]) + "." + i10(r11), params: [] };
            }
            if (e$(e11, tC)) {
              let t11 = e11[th].schema, r11 = e11[th].name;
              return { sql: void 0 === t11 || e11[th].isAlias ? i10(r11) : i10(t11) + "." + i10(r11), params: [] };
            }
            if (e$(e11, tv)) {
              if (e$(e11.value, tE)) return { sql: s10(l2.value++, e11), params: [e11], typings: ["none"] };
              let t11 = null === e11.value ? null : e11.encoder.mapToDriverValue(e11.value);
              if (e$(t11, tg)) return this.buildQueryFromSourceParams([t11], r10);
              if (o10) return { sql: this.mapInlineParam(t11, r10), params: [] };
              let n11 = ["none"];
              return a10 && (n11 = [a10(e11.encoder)]), { sql: s10(l2.value++, t11), params: [t11], typings: n11 };
            }
            return e$(e11, tE) ? { sql: s10(l2.value++, e11), params: [e11], typings: ["none"] } : e$(e11, tg.Aliased) && void 0 !== e11.fieldAlias ? { sql: i10(e11.fieldAlias), params: [] } : e$(e11, tl) ? e11._.isWith ? { sql: i10(e11._.alias), params: [] } : this.buildQueryFromSourceParams([new tp("("), e11._.sql, new tp(") "), new tm(e11._.alias)], r10) : e11 && "function" == typeof e11 && ti in e11 && true === e11[ti] ? e11.schema ? { sql: i10(e11.schema) + "." + i10(e11.enumName), params: [] } : { sql: i10(e11.enumName), params: [] } : tf(e11) ? e11.shouldOmitSQLParens?.() ? this.buildQueryFromSourceParams([e11.getSQL()], r10) : this.buildQueryFromSourceParams([new tp("("), e11.getSQL(), new tp(")")], r10) : o10 ? { sql: this.mapInlineParam(e11, r10), params: [] } : { sql: s10(l2.value++, e11), params: [e11], typings: ["none"] };
          });
          let c2 = { sql: "", params: [] };
          for (let e11 of u2) c2.sql += e11.sql, c2.params.push(...e11.params), e11.typings?.length && (c2.typings || (c2.typings = []), c2.typings.push(...e11.typings));
          return c2;
        }
        mapInlineParam(e10, { escapeString: t10 }) {
          if (null === e10) return "null";
          if ("number" == typeof e10 || "boolean" == typeof e10) return e10.toString();
          if ("string" == typeof e10) return t10(e10);
          if ("object" == typeof e10) {
            let r10 = e10.toString();
            return "[object Object]" === r10 ? t10(JSON.stringify(e10)) : t10(r10);
          }
          throw Error("Unexpected param value: " + e10);
        }
        getSQL() {
          return this;
        }
        as(e10) {
          return void 0 === e10 ? this : new tg.Aliased(this, e10);
        }
        mapWith(e10) {
          return this.decoder = "function" == typeof e10 ? { mapFromDriverValue: e10 } : e10, this;
        }
        inlineParams() {
          return this.shouldInlineParams = true, this;
        }
        if(e10) {
          return e10 ? this : void 0;
        }
      }
      class tm {
        constructor(e10) {
          this.value = e10;
        }
        static [eB] = "Name";
        brand;
        getSQL() {
          return new tg([this]);
        }
      }
      let ty = { mapFromDriverValue: (e10) => e10 }, tb = { mapToDriverValue: (e10) => e10 };
      ({ ...ty, ...tb });
      class tv {
        constructor(e10, t10 = tb) {
          this.value = e10, this.encoder = t10;
        }
        static [eB] = "Param";
        brand;
        getSQL() {
          return new tg([this]);
        }
      }
      function tw(e10, ...t10) {
        let r10 = [];
        for (let [n10, i10] of ((t10.length > 0 || e10.length > 0 && "" !== e10[0]) && r10.push(new tp(e10[0])), t10.entries())) r10.push(i10, new tp(e10[n10 + 1]));
        return new tg(r10);
      }
      (tJ = tw || (tw = {})).empty = function() {
        return new tg([]);
      }, tJ.fromList = function(e10) {
        return new tg(e10);
      }, tJ.raw = function(e10) {
        return new tg([new tp(e10)]);
      }, tJ.join = function(e10, t10) {
        let r10 = [];
        for (let [n10, i10] of e10.entries()) n10 > 0 && void 0 !== t10 && r10.push(t10), r10.push(i10);
        return new tg(r10);
      }, tJ.identifier = function(e10) {
        return new tm(e10);
      }, tJ.placeholder = function(e10) {
        return new tE(e10);
      }, tJ.param = function(e10, t10) {
        return new tv(e10, t10);
      };
      var t_ = tg || (tg = {});
      class tS {
        constructor(e10, t10) {
          this.sql = e10, this.fieldAlias = t10;
        }
        static [eB] = "SQL.Aliased";
        isSelectionField = false;
        getSQL() {
          return this.sql;
        }
        clone() {
          return new tS(this.sql, this.fieldAlias);
        }
      }
      t_.Aliased = tS;
      class tE {
        constructor(e10) {
          this.name = e10;
        }
        static [eB] = "Placeholder";
        getSQL() {
          return new tg([this]);
        }
      }
      function tx(e10, t10) {
        return e10.map((e11) => {
          if (e$(e11, tE)) {
            if (!(e11.name in t10)) throw Error(`No value for placeholder "${e11.name}" was provided`);
            return t10[e11.name];
          }
          if (e$(e11, tv) && e$(e11.value, tE)) {
            if (!(e11.value.name in t10)) throw Error(`No value for placeholder "${e11.value.name}" was provided`);
            return e11.encoder.mapToDriverValue(t10[e11.value.name]);
          }
          return e11;
        });
      }
      let tT = Symbol.for("drizzle:IsDrizzleView");
      class tC {
        static [eB] = "View";
        [th];
        [tT] = true;
        constructor({ name: e10, schema: t10, selectedFields: r10, query: n10 }) {
          this[th] = { name: e10, originalName: e10, schema: t10, selectedFields: r10, query: n10, isExisting: !n10, isAlias: false };
        }
        getSQL() {
          return new tg([this]);
        }
      }
      function tP(e10, t10) {
        return "object" != typeof t10 || null === t10 || !("mapToDriverValue" in t10) || "function" != typeof t10.mapToDriverValue || tf(e10) || e$(e10, tv) || e$(e10, tE) || e$(e10, ej) || e$(e10, eK) || e$(e10, tC) ? e10 : new tv(e10, t10);
      }
      ej.prototype.getSQL = function() {
        return new tg([this]);
      }, eK.prototype.getSQL = function() {
        return new tg([this]);
      }, tl.prototype.getSQL = function() {
        return new tg([this]);
      };
      let tA = (e10, t10) => tw`${e10} = ${tP(t10, e10)}`, tR = (e10, t10) => tw`${e10} <> ${tP(t10, e10)}`;
      function tN(...e10) {
        let t10 = e10.filter((e11) => void 0 !== e11);
        if (0 !== t10.length) return new tg(1 === t10.length ? t10 : [new tp("("), tw.join(t10, new tp(" and ")), new tp(")")]);
      }
      function tO(...e10) {
        let t10 = e10.filter((e11) => void 0 !== e11);
        if (0 !== t10.length) return new tg(1 === t10.length ? t10 : [new tp("("), tw.join(t10, new tp(" or ")), new tp(")")]);
      }
      function tI(e10) {
        return tw`not ${e10}`;
      }
      let tk = (e10, t10) => tw`${e10} > ${tP(t10, e10)}`, tD = (e10, t10) => tw`${e10} >= ${tP(t10, e10)}`, tL = (e10, t10) => tw`${e10} < ${tP(t10, e10)}`, tM = (e10, t10) => tw`${e10} <= ${tP(t10, e10)}`;
      function tB(e10, t10) {
        return Array.isArray(t10) ? 0 === t10.length ? tw`false` : tw`${e10} in ${t10.map((t11) => tP(t11, e10))}` : tw`${e10} in ${tP(t10, e10)}`;
      }
      function t$(e10, t10) {
        return Array.isArray(t10) ? 0 === t10.length ? tw`true` : tw`${e10} not in ${t10.map((t11) => tP(t11, e10))}` : tw`${e10} not in ${tP(t10, e10)}`;
      }
      function tj(e10) {
        return tw`${e10} is null`;
      }
      function tq(e10) {
        return tw`${e10} is not null`;
      }
      function tF(e10) {
        return tw`exists ${e10}`;
      }
      function tU(e10) {
        return tw`not exists ${e10}`;
      }
      function tQ(e10, t10, r10) {
        return tw`${e10} between ${tP(t10, e10)} and ${tP(r10, e10)}`;
      }
      function tz(e10, t10, r10) {
        return tw`${e10} not between ${tP(t10, e10)} and ${tP(r10, e10)}`;
      }
      function tV(e10, t10) {
        return tw`${e10} like ${t10}`;
      }
      function tH(e10, t10) {
        return tw`${e10} not like ${t10}`;
      }
      function tG(e10, t10) {
        return tw`${e10} ilike ${t10}`;
      }
      function tW(e10, t10) {
        return tw`${e10} not ilike ${t10}`;
      }
      function tK(e10) {
        return tw`${e10} asc`;
      }
      function tX(e10) {
        return tw`${e10} desc`;
      }
      var tJ, tY, tZ, t0, t1, t2 = Object.create, t6 = Object.defineProperty, t5 = Object.getOwnPropertyDescriptor, t3 = Object.getOwnPropertyNames, t4 = Object.getPrototypeOf, t8 = Object.prototype.hasOwnProperty, t7 = (e10, t10) => t6(e10, "name", { value: t10, configurable: true }), t9 = (e10, t10) => () => (e10 && (t10 = e10(e10 = 0)), t10), re = (e10, t10) => () => (t10 || e10((t10 = { exports: {} }).exports, t10), t10.exports), rt = (e10, t10) => {
        for (var r10 in t10) t6(e10, r10, { get: t10[r10], enumerable: true });
      }, rr = (e10, t10, r10, n10) => {
        if (t10 && "object" == typeof t10 || "function" == typeof t10) for (let i10 of t3(t10)) t8.call(e10, i10) || i10 === r10 || t6(e10, i10, { get: () => t10[i10], enumerable: !(n10 = t5(t10, i10)) || n10.enumerable });
        return e10;
      }, rn = (e10, t10, r10) => (r10 = null != e10 ? t2(t4(e10)) : {}, rr(!t10 && e10 && e10.__esModule ? r10 : t6(r10, "default", { value: e10, enumerable: true }), e10)), ri = (e10) => rr(t6({}, "__esModule", { value: true }), e10), rs = (e10, t10, r10) => {
        let n10;
        return (n10 = "symbol" != typeof t10 ? t10 + "" : t10) in e10 ? t6(e10, n10, { enumerable: true, configurable: true, writable: true, value: r10 }) : e10[n10] = r10;
      }, ra = re((e10) => {
        ru(), e10.byteLength = l2, e10.toByteArray = c2, e10.fromByteArray = f2;
        var t10, r10, n10 = [], i10 = [], s10 = "u" > typeof Uint8Array ? Uint8Array : Array, a10 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (t10 = 0, r10 = a10.length; t10 < r10; ++t10) n10[t10] = a10[t10], i10[a10.charCodeAt(t10)] = t10;
        function o10(e11) {
          var t11 = e11.length;
          if (t11 % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
          var r11 = e11.indexOf("=");
          -1 === r11 && (r11 = t11);
          var n11 = r11 === t11 ? 0 : 4 - r11 % 4;
          return [r11, n11];
        }
        function l2(e11) {
          var t11 = o10(e11), r11 = t11[0], n11 = t11[1];
          return (r11 + n11) * 3 / 4 - n11;
        }
        function u2(e11, t11, r11) {
          return (t11 + r11) * 3 / 4 - r11;
        }
        function c2(e11) {
          var t11, r11, n11 = o10(e11), a11 = n11[0], l3 = n11[1], c3 = new s10(u2(e11, a11, l3)), h3 = 0, d3 = l3 > 0 ? a11 - 4 : a11;
          for (r11 = 0; r11 < d3; r11 += 4) t11 = i10[e11.charCodeAt(r11)] << 18 | i10[e11.charCodeAt(r11 + 1)] << 12 | i10[e11.charCodeAt(r11 + 2)] << 6 | i10[e11.charCodeAt(r11 + 3)], c3[h3++] = t11 >> 16 & 255, c3[h3++] = t11 >> 8 & 255, c3[h3++] = 255 & t11;
          return 2 === l3 && (t11 = i10[e11.charCodeAt(r11)] << 2 | i10[e11.charCodeAt(r11 + 1)] >> 4, c3[h3++] = 255 & t11), 1 === l3 && (t11 = i10[e11.charCodeAt(r11)] << 10 | i10[e11.charCodeAt(r11 + 1)] << 4 | i10[e11.charCodeAt(r11 + 2)] >> 2, c3[h3++] = t11 >> 8 & 255, c3[h3++] = 255 & t11), c3;
        }
        function h2(e11) {
          return n10[e11 >> 18 & 63] + n10[e11 >> 12 & 63] + n10[e11 >> 6 & 63] + n10[63 & e11];
        }
        function d2(e11, t11, r11) {
          for (var n11 = [], i11 = t11; i11 < r11; i11 += 3) n11.push(h2((e11[i11] << 16 & 16711680) + (e11[i11 + 1] << 8 & 65280) + (255 & e11[i11 + 2])));
          return n11.join("");
        }
        function f2(e11) {
          for (var t11, r11 = e11.length, i11 = r11 % 3, s11 = [], a11 = 0, o11 = r11 - i11; a11 < o11; a11 += 16383) s11.push(d2(e11, a11, a11 + 16383 > o11 ? o11 : a11 + 16383));
          return 1 === i11 ? s11.push(n10[(t11 = e11[r11 - 1]) >> 2] + n10[t11 << 4 & 63] + "==") : 2 === i11 && s11.push(n10[(t11 = (e11[r11 - 2] << 8) + e11[r11 - 1]) >> 10] + n10[t11 >> 4 & 63] + n10[t11 << 2 & 63] + "="), s11.join("");
        }
        i10[45] = 62, i10[95] = 63, t7(o10, "getLens"), t7(l2, "byteLength"), t7(u2, "_byteLength"), t7(c2, "toByteArray"), t7(h2, "tripletToBase64"), t7(d2, "encodeChunk"), t7(f2, "fromByteArray");
      }), ro = re((e10) => {
        ru(), e10.read = function(e11, t10, r10, n10, i10) {
          var s10, a10, o10 = 8 * i10 - n10 - 1, l2 = (1 << o10) - 1, u2 = l2 >> 1, c2 = -7, h2 = r10 ? i10 - 1 : 0, d2 = r10 ? -1 : 1, f2 = e11[t10 + h2];
          for (h2 += d2, s10 = f2 & (1 << -c2) - 1, f2 >>= -c2, c2 += o10; c2 > 0; s10 = 256 * s10 + e11[t10 + h2], h2 += d2, c2 -= 8) ;
          for (a10 = s10 & (1 << -c2) - 1, s10 >>= -c2, c2 += n10; c2 > 0; a10 = 256 * a10 + e11[t10 + h2], h2 += d2, c2 -= 8) ;
          if (0 === s10) s10 = 1 - u2;
          else {
            if (s10 === l2) return a10 ? NaN : 1 / 0 * (f2 ? -1 : 1);
            a10 += Math.pow(2, n10), s10 -= u2;
          }
          return (f2 ? -1 : 1) * a10 * Math.pow(2, s10 - n10);
        }, e10.write = function(e11, t10, r10, n10, i10, s10) {
          var a10, o10, l2, u2 = 8 * s10 - i10 - 1, c2 = (1 << u2) - 1, h2 = c2 >> 1, d2 = 5960464477539062e-23 * (23 === i10), f2 = n10 ? 0 : s10 - 1, p2 = n10 ? 1 : -1, g2 = +(t10 < 0 || 0 === t10 && 1 / t10 < 0);
          for (isNaN(t10 = Math.abs(t10)) || t10 === 1 / 0 ? (o10 = +!!isNaN(t10), a10 = c2) : (a10 = Math.floor(Math.log(t10) / Math.LN2), t10 * (l2 = Math.pow(2, -a10)) < 1 && (a10--, l2 *= 2), a10 + h2 >= 1 ? t10 += d2 / l2 : t10 += d2 * Math.pow(2, 1 - h2), t10 * l2 >= 2 && (a10++, l2 /= 2), a10 + h2 >= c2 ? (o10 = 0, a10 = c2) : a10 + h2 >= 1 ? (o10 = (t10 * l2 - 1) * Math.pow(2, i10), a10 += h2) : (o10 = t10 * Math.pow(2, h2 - 1) * Math.pow(2, i10), a10 = 0)); i10 >= 8; e11[r10 + f2] = 255 & o10, f2 += p2, o10 /= 256, i10 -= 8) ;
          for (a10 = a10 << i10 | o10, u2 += i10; u2 > 0; e11[r10 + f2] = 255 & a10, f2 += p2, a10 /= 256, u2 -= 8) ;
          e11[r10 + f2 - p2] |= 128 * g2;
        };
      }), rl = re((e10) => {
        ru();
        var t10 = ra(), r10 = ro(), n10 = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
        function i10() {
          try {
            let e11 = new Uint8Array(1), t11 = { foo: t7(function() {
              return 42;
            }, "foo") };
            return Object.setPrototypeOf(t11, Uint8Array.prototype), Object.setPrototypeOf(e11, t11), 42 === e11.foo();
          } catch {
            return false;
          }
        }
        function s10(e11) {
          if (e11 > 2147483647) throw RangeError('The value "' + e11 + '" is invalid for option "size"');
          let t11 = new Uint8Array(e11);
          return Object.setPrototypeOf(t11, a10.prototype), t11;
        }
        function a10(e11, t11, r11) {
          if ("number" == typeof e11) {
            if ("string" == typeof t11) throw TypeError('The "string" argument must be of type string. Received type number');
            return c2(e11);
          }
          return o10(e11, t11, r11);
        }
        function o10(e11, t11, r11) {
          if ("string" == typeof e11) return h2(e11, t11);
          if (ArrayBuffer.isView(e11)) return f2(e11);
          if (null == e11) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e11);
          if (er2(e11, ArrayBuffer) || e11 && er2(e11.buffer, ArrayBuffer) || "u" > typeof SharedArrayBuffer && (er2(e11, SharedArrayBuffer) || e11 && er2(e11.buffer, SharedArrayBuffer))) return p2(e11, t11, r11);
          if ("number" == typeof e11) throw TypeError('The "value" argument must not be of type number. Received type number');
          let n11 = e11.valueOf && e11.valueOf();
          if (null != n11 && n11 !== e11) return a10.from(n11, t11, r11);
          let i11 = g2(e11);
          if (i11) return i11;
          if ("u" > typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e11[Symbol.toPrimitive]) return a10.from(e11[Symbol.toPrimitive]("string"), t11, r11);
          throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e11);
        }
        function l2(e11) {
          if ("number" != typeof e11) throw TypeError('"size" argument must be of type number');
          if (e11 < 0) throw RangeError('The value "' + e11 + '" is invalid for option "size"');
        }
        function u2(e11, t11, r11) {
          return l2(e11), e11 <= 0 ? s10(e11) : void 0 !== t11 ? "string" == typeof r11 ? s10(e11).fill(t11, r11) : s10(e11).fill(t11) : s10(e11);
        }
        function c2(e11) {
          return l2(e11), s10(e11 < 0 ? 0 : 0 | m2(e11));
        }
        function h2(e11, t11) {
          if (("string" != typeof t11 || "" === t11) && (t11 = "utf8"), !a10.isEncoding(t11)) throw TypeError("Unknown encoding: " + t11);
          let r11 = 0 | b2(e11, t11), n11 = s10(r11), i11 = n11.write(e11, t11);
          return i11 !== r11 && (n11 = n11.slice(0, i11)), n11;
        }
        function d2(e11) {
          let t11 = e11.length < 0 ? 0 : 0 | m2(e11.length), r11 = s10(t11);
          for (let n11 = 0; n11 < t11; n11 += 1) r11[n11] = 255 & e11[n11];
          return r11;
        }
        function f2(e11) {
          if (er2(e11, Uint8Array)) {
            let t11 = new Uint8Array(e11);
            return p2(t11.buffer, t11.byteOffset, t11.byteLength);
          }
          return d2(e11);
        }
        function p2(e11, t11, r11) {
          let n11;
          if (t11 < 0 || e11.byteLength < t11) throw RangeError('"offset" is outside of buffer bounds');
          if (e11.byteLength < t11 + (r11 || 0)) throw RangeError('"length" is outside of buffer bounds');
          return Object.setPrototypeOf(n11 = void 0 === t11 && void 0 === r11 ? new Uint8Array(e11) : void 0 === r11 ? new Uint8Array(e11, t11) : new Uint8Array(e11, t11, r11), a10.prototype), n11;
        }
        function g2(e11) {
          if (a10.isBuffer(e11)) {
            let t11 = 0 | m2(e11.length), r11 = s10(t11);
            return 0 === r11.length || e11.copy(r11, 0, 0, t11), r11;
          }
          return void 0 !== e11.length ? "number" != typeof e11.length || en2(e11.length) ? s10(0) : d2(e11) : "Buffer" === e11.type && Array.isArray(e11.data) ? d2(e11.data) : void 0;
        }
        function m2(e11) {
          if (e11 >= 2147483647) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");
          return 0 | e11;
        }
        function y2(e11) {
          return +e11 != e11 && (e11 = 0), a10.alloc(+e11);
        }
        function b2(e11, t11) {
          if (a10.isBuffer(e11)) return e11.length;
          if (ArrayBuffer.isView(e11) || er2(e11, ArrayBuffer)) return e11.byteLength;
          if ("string" != typeof e11) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e11);
          let r11 = e11.length, n11 = arguments.length > 2 && true === arguments[2];
          if (!n11 && 0 === r11) return 0;
          let i11 = false;
          for (; ; ) switch (t11) {
            case "ascii":
            case "latin1":
            case "binary":
              return r11;
            case "utf8":
            case "utf-8":
              return J2(e11).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return 2 * r11;
            case "hex":
              return r11 >>> 1;
            case "base64":
              return ee2(e11).length;
            default:
              if (i11) return n11 ? -1 : J2(e11).length;
              t11 = ("" + t11).toLowerCase(), i11 = true;
          }
        }
        function v2(e11, t11, r11) {
          let n11 = false;
          if ((void 0 === t11 || t11 < 0) && (t11 = 0), t11 > this.length || ((void 0 === r11 || r11 > this.length) && (r11 = this.length), r11 <= 0) || (r11 >>>= 0) <= (t11 >>>= 0)) return "";
          for (e11 || (e11 = "utf8"); ; ) switch (e11) {
            case "hex":
              return k2(this, t11, r11);
            case "utf8":
            case "utf-8":
              return R2(this, t11, r11);
            case "ascii":
              return O2(this, t11, r11);
            case "latin1":
            case "binary":
              return I2(this, t11, r11);
            case "base64":
              return A2(this, t11, r11);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return D2(this, t11, r11);
            default:
              if (n11) throw TypeError("Unknown encoding: " + e11);
              e11 = (e11 + "").toLowerCase(), n11 = true;
          }
        }
        function w2(e11, t11, r11) {
          let n11 = e11[t11];
          e11[t11] = e11[r11], e11[r11] = n11;
        }
        function _2(e11, t11, r11, n11, i11) {
          if (0 === e11.length) return -1;
          if ("string" == typeof r11 ? (n11 = r11, r11 = 0) : r11 > 2147483647 ? r11 = 2147483647 : r11 < -2147483648 && (r11 = -2147483648), en2(r11 *= 1) && (r11 = i11 ? 0 : e11.length - 1), r11 < 0 && (r11 = e11.length + r11), r11 >= e11.length) {
            if (i11) return -1;
            r11 = e11.length - 1;
          } else if (r11 < 0) if (!i11) return -1;
          else r11 = 0;
          if ("string" == typeof t11 && (t11 = a10.from(t11, n11)), a10.isBuffer(t11)) return 0 === t11.length ? -1 : S2(e11, t11, r11, n11, i11);
          if ("number" == typeof t11) return t11 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i11 ? Uint8Array.prototype.indexOf.call(e11, t11, r11) : Uint8Array.prototype.lastIndexOf.call(e11, t11, r11) : S2(e11, [t11], r11, n11, i11);
          throw TypeError("val must be string, number or Buffer");
        }
        function S2(e11, t11, r11, n11, i11) {
          let s11, a11 = 1, o11 = e11.length, l3 = t11.length;
          if (void 0 !== n11 && ("ucs2" === (n11 = String(n11).toLowerCase()) || "ucs-2" === n11 || "utf16le" === n11 || "utf-16le" === n11)) {
            if (e11.length < 2 || t11.length < 2) return -1;
            a11 = 2, o11 /= 2, l3 /= 2, r11 /= 2;
          }
          function u3(e12, t12) {
            return 1 === a11 ? e12[t12] : e12.readUInt16BE(t12 * a11);
          }
          if (t7(u3, "read"), i11) {
            let n12 = -1;
            for (s11 = r11; s11 < o11; s11++) if (u3(e11, s11) === u3(t11, -1 === n12 ? 0 : s11 - n12)) {
              if (-1 === n12 && (n12 = s11), s11 - n12 + 1 === l3) return n12 * a11;
            } else -1 !== n12 && (s11 -= s11 - n12), n12 = -1;
          } else for (r11 + l3 > o11 && (r11 = o11 - l3), s11 = r11; s11 >= 0; s11--) {
            let r12 = true;
            for (let n12 = 0; n12 < l3; n12++) if (u3(e11, s11 + n12) !== u3(t11, n12)) {
              r12 = false;
              break;
            }
            if (r12) return s11;
          }
          return -1;
        }
        function E2(e11, t11, r11, n11) {
          let i11;
          r11 = Number(r11) || 0;
          let s11 = e11.length - r11;
          n11 ? (n11 = Number(n11)) > s11 && (n11 = s11) : n11 = s11;
          let a11 = t11.length;
          for (n11 > a11 / 2 && (n11 = a11 / 2), i11 = 0; i11 < n11; ++i11) {
            let n12 = parseInt(t11.substr(2 * i11, 2), 16);
            if (en2(n12)) break;
            e11[r11 + i11] = n12;
          }
          return i11;
        }
        function x2(e11, t11, r11, n11) {
          return et2(J2(t11, e11.length - r11), e11, r11, n11);
        }
        function T2(e11, t11, r11, n11) {
          return et2(Y2(t11), e11, r11, n11);
        }
        function C2(e11, t11, r11, n11) {
          return et2(ee2(t11), e11, r11, n11);
        }
        function P2(e11, t11, r11, n11) {
          return et2(Z2(t11, e11.length - r11), e11, r11, n11);
        }
        function A2(e11, r11, n11) {
          return 0 === r11 && n11 === e11.length ? t10.fromByteArray(e11) : t10.fromByteArray(e11.slice(r11, n11));
        }
        function R2(e11, t11, r11) {
          r11 = Math.min(e11.length, r11);
          let n11 = [], i11 = t11;
          for (; i11 < r11; ) {
            let t12 = e11[i11], s11 = null, a11 = t12 > 239 ? 4 : t12 > 223 ? 3 : t12 > 191 ? 2 : 1;
            if (i11 + a11 <= r11) {
              let r12, n12, o11, l3;
              switch (a11) {
                case 1:
                  t12 < 128 && (s11 = t12);
                  break;
                case 2:
                  (192 & (r12 = e11[i11 + 1])) == 128 && (l3 = (31 & t12) << 6 | 63 & r12) > 127 && (s11 = l3);
                  break;
                case 3:
                  r12 = e11[i11 + 1], n12 = e11[i11 + 2], (192 & r12) == 128 && (192 & n12) == 128 && (l3 = (15 & t12) << 12 | (63 & r12) << 6 | 63 & n12) > 2047 && (l3 < 55296 || l3 > 57343) && (s11 = l3);
                  break;
                case 4:
                  r12 = e11[i11 + 1], n12 = e11[i11 + 2], o11 = e11[i11 + 3], (192 & r12) == 128 && (192 & n12) == 128 && (192 & o11) == 128 && (l3 = (15 & t12) << 18 | (63 & r12) << 12 | (63 & n12) << 6 | 63 & o11) > 65535 && l3 < 1114112 && (s11 = l3);
              }
            }
            null === s11 ? (s11 = 65533, a11 = 1) : s11 > 65535 && (s11 -= 65536, n11.push(s11 >>> 10 & 1023 | 55296), s11 = 56320 | 1023 & s11), n11.push(s11), i11 += a11;
          }
          return N2(n11);
        }
        function N2(e11) {
          let t11 = e11.length;
          if (t11 <= 4096) return String.fromCharCode.apply(String, e11);
          let r11 = "", n11 = 0;
          for (; n11 < t11; ) r11 += String.fromCharCode.apply(String, e11.slice(n11, n11 += 4096));
          return r11;
        }
        function O2(e11, t11, r11) {
          let n11 = "";
          r11 = Math.min(e11.length, r11);
          for (let i11 = t11; i11 < r11; ++i11) n11 += String.fromCharCode(127 & e11[i11]);
          return n11;
        }
        function I2(e11, t11, r11) {
          let n11 = "";
          r11 = Math.min(e11.length, r11);
          for (let i11 = t11; i11 < r11; ++i11) n11 += String.fromCharCode(e11[i11]);
          return n11;
        }
        function k2(e11, t11, r11) {
          let n11 = e11.length;
          (!t11 || t11 < 0) && (t11 = 0), (!r11 || r11 < 0 || r11 > n11) && (r11 = n11);
          let i11 = "";
          for (let n12 = t11; n12 < r11; ++n12) i11 += ei2[e11[n12]];
          return i11;
        }
        function D2(e11, t11, r11) {
          let n11 = e11.slice(t11, r11), i11 = "";
          for (let e12 = 0; e12 < n11.length - 1; e12 += 2) i11 += String.fromCharCode(n11[e12] + 256 * n11[e12 + 1]);
          return i11;
        }
        function L2(e11, t11, r11) {
          if (e11 % 1 != 0 || e11 < 0) throw RangeError("offset is not uint");
          if (e11 + t11 > r11) throw RangeError("Trying to access beyond buffer length");
        }
        function M2(e11, t11, r11, n11, i11, s11) {
          if (!a10.isBuffer(e11)) throw TypeError('"buffer" argument must be a Buffer instance');
          if (t11 > i11 || t11 < s11) throw RangeError('"value" argument is out of bounds');
          if (r11 + n11 > e11.length) throw RangeError("Index out of range");
        }
        function B2(e11, t11, r11, n11, i11) {
          H2(t11, n11, i11, e11, r11, 7);
          let s11 = Number(t11 & BigInt(4294967295));
          e11[r11++] = s11, s11 >>= 8, e11[r11++] = s11, s11 >>= 8, e11[r11++] = s11, s11 >>= 8, e11[r11++] = s11;
          let a11 = Number(t11 >> BigInt(32) & BigInt(4294967295));
          return e11[r11++] = a11, a11 >>= 8, e11[r11++] = a11, a11 >>= 8, e11[r11++] = a11, a11 >>= 8, e11[r11++] = a11, r11;
        }
        function $2(e11, t11, r11, n11, i11) {
          H2(t11, n11, i11, e11, r11, 7);
          let s11 = Number(t11 & BigInt(4294967295));
          e11[r11 + 7] = s11, s11 >>= 8, e11[r11 + 6] = s11, s11 >>= 8, e11[r11 + 5] = s11, s11 >>= 8, e11[r11 + 4] = s11;
          let a11 = Number(t11 >> BigInt(32) & BigInt(4294967295));
          return e11[r11 + 3] = a11, a11 >>= 8, e11[r11 + 2] = a11, a11 >>= 8, e11[r11 + 1] = a11, a11 >>= 8, e11[r11] = a11, r11 + 8;
        }
        function j2(e11, t11, r11, n11, i11, s11) {
          if (r11 + n11 > e11.length || r11 < 0) throw RangeError("Index out of range");
        }
        function q2(e11, t11, n11, i11, s11) {
          return t11 *= 1, n11 >>>= 0, s11 || j2(e11, t11, n11, 4, 34028234663852886e22, -34028234663852886e22), r10.write(e11, t11, n11, i11, 23, 4), n11 + 4;
        }
        function F2(e11, t11, n11, i11, s11) {
          return t11 *= 1, n11 >>>= 0, s11 || j2(e11, t11, n11, 8, 17976931348623157e292, -17976931348623157e292), r10.write(e11, t11, n11, i11, 52, 8), n11 + 8;
        }
        e10.Buffer = a10, e10.SlowBuffer = y2, e10.INSPECT_MAX_BYTES = 50, e10.kMaxLength = 2147483647, a10.TYPED_ARRAY_SUPPORT = i10(), !a10.TYPED_ARRAY_SUPPORT && "u" > typeof console && "function" == typeof console.error && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), t7(i10, "typedArraySupport"), Object.defineProperty(a10.prototype, "parent", { enumerable: true, get: t7(function() {
          if (a10.isBuffer(this)) return this.buffer;
        }, "get") }), Object.defineProperty(a10.prototype, "offset", { enumerable: true, get: t7(function() {
          if (a10.isBuffer(this)) return this.byteOffset;
        }, "get") }), t7(s10, "createBuffer"), t7(a10, "Buffer"), a10.poolSize = 8192, t7(o10, "from"), a10.from = function(e11, t11, r11) {
          return o10(e11, t11, r11);
        }, Object.setPrototypeOf(a10.prototype, Uint8Array.prototype), Object.setPrototypeOf(a10, Uint8Array), t7(l2, "assertSize"), t7(u2, "alloc"), a10.alloc = function(e11, t11, r11) {
          return u2(e11, t11, r11);
        }, t7(c2, "allocUnsafe"), a10.allocUnsafe = function(e11) {
          return c2(e11);
        }, a10.allocUnsafeSlow = function(e11) {
          return c2(e11);
        }, t7(h2, "fromString"), t7(d2, "fromArrayLike"), t7(f2, "fromArrayView"), t7(p2, "fromArrayBuffer"), t7(g2, "fromObject"), t7(m2, "checked"), t7(y2, "SlowBuffer"), a10.isBuffer = t7(function(e11) {
          return null != e11 && true === e11._isBuffer && e11 !== a10.prototype;
        }, "isBuffer"), a10.compare = t7(function(e11, t11) {
          if (er2(e11, Uint8Array) && (e11 = a10.from(e11, e11.offset, e11.byteLength)), er2(t11, Uint8Array) && (t11 = a10.from(t11, t11.offset, t11.byteLength)), !a10.isBuffer(e11) || !a10.isBuffer(t11)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
          if (e11 === t11) return 0;
          let r11 = e11.length, n11 = t11.length;
          for (let i11 = 0, s11 = Math.min(r11, n11); i11 < s11; ++i11) if (e11[i11] !== t11[i11]) {
            r11 = e11[i11], n11 = t11[i11];
            break;
          }
          return r11 < n11 ? -1 : +(n11 < r11);
        }, "compare"), a10.isEncoding = t7(function(e11) {
          switch (String(e11).toLowerCase()) {
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
        }, "isEncoding"), a10.concat = t7(function(e11, t11) {
          let r11;
          if (!Array.isArray(e11)) throw TypeError('"list" argument must be an Array of Buffers');
          if (0 === e11.length) return a10.alloc(0);
          if (void 0 === t11) for (t11 = 0, r11 = 0; r11 < e11.length; ++r11) t11 += e11[r11].length;
          let n11 = a10.allocUnsafe(t11), i11 = 0;
          for (r11 = 0; r11 < e11.length; ++r11) {
            let t12 = e11[r11];
            if (er2(t12, Uint8Array)) i11 + t12.length > n11.length ? (a10.isBuffer(t12) || (t12 = a10.from(t12)), t12.copy(n11, i11)) : Uint8Array.prototype.set.call(n11, t12, i11);
            else if (a10.isBuffer(t12)) t12.copy(n11, i11);
            else throw TypeError('"list" argument must be an Array of Buffers');
            i11 += t12.length;
          }
          return n11;
        }, "concat"), t7(b2, "byteLength"), a10.byteLength = b2, t7(v2, "slowToString"), a10.prototype._isBuffer = true, t7(w2, "swap"), a10.prototype.swap16 = t7(function() {
          let e11 = this.length;
          if (e11 % 2 != 0) throw RangeError("Buffer size must be a multiple of 16-bits");
          for (let t11 = 0; t11 < e11; t11 += 2) w2(this, t11, t11 + 1);
          return this;
        }, "swap16"), a10.prototype.swap32 = t7(function() {
          let e11 = this.length;
          if (e11 % 4 != 0) throw RangeError("Buffer size must be a multiple of 32-bits");
          for (let t11 = 0; t11 < e11; t11 += 4) w2(this, t11, t11 + 3), w2(this, t11 + 1, t11 + 2);
          return this;
        }, "swap32"), a10.prototype.swap64 = t7(function() {
          let e11 = this.length;
          if (e11 % 8 != 0) throw RangeError("Buffer size must be a multiple of 64-bits");
          for (let t11 = 0; t11 < e11; t11 += 8) w2(this, t11, t11 + 7), w2(this, t11 + 1, t11 + 6), w2(this, t11 + 2, t11 + 5), w2(this, t11 + 3, t11 + 4);
          return this;
        }, "swap64"), a10.prototype.toString = t7(function() {
          let e11 = this.length;
          return 0 === e11 ? "" : 0 == arguments.length ? R2(this, 0, e11) : v2.apply(this, arguments);
        }, "toString"), a10.prototype.toLocaleString = a10.prototype.toString, a10.prototype.equals = t7(function(e11) {
          if (!a10.isBuffer(e11)) throw TypeError("Argument must be a Buffer");
          return this === e11 || 0 === a10.compare(this, e11);
        }, "equals"), a10.prototype.inspect = t7(function() {
          let t11 = "", r11 = e10.INSPECT_MAX_BYTES;
          return t11 = this.toString("hex", 0, r11).replace(/(.{2})/g, "$1 ").trim(), this.length > r11 && (t11 += " ... "), "<Buffer " + t11 + ">";
        }, "inspect"), n10 && (a10.prototype[n10] = a10.prototype.inspect), a10.prototype.compare = t7(function(e11, t11, r11, n11, i11) {
          if (er2(e11, Uint8Array) && (e11 = a10.from(e11, e11.offset, e11.byteLength)), !a10.isBuffer(e11)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e11);
          if (void 0 === t11 && (t11 = 0), void 0 === r11 && (r11 = e11 ? e11.length : 0), void 0 === n11 && (n11 = 0), void 0 === i11 && (i11 = this.length), t11 < 0 || r11 > e11.length || n11 < 0 || i11 > this.length) throw RangeError("out of range index");
          if (n11 >= i11 && t11 >= r11) return 0;
          if (n11 >= i11) return -1;
          if (t11 >= r11) return 1;
          if (t11 >>>= 0, r11 >>>= 0, n11 >>>= 0, i11 >>>= 0, this === e11) return 0;
          let s11 = i11 - n11, o11 = r11 - t11, l3 = Math.min(s11, o11), u3 = this.slice(n11, i11), c3 = e11.slice(t11, r11);
          for (let e12 = 0; e12 < l3; ++e12) if (u3[e12] !== c3[e12]) {
            s11 = u3[e12], o11 = c3[e12];
            break;
          }
          return s11 < o11 ? -1 : +(o11 < s11);
        }, "compare"), t7(_2, "bidirectionalIndexOf"), t7(S2, "arrayIndexOf"), a10.prototype.includes = t7(function(e11, t11, r11) {
          return -1 !== this.indexOf(e11, t11, r11);
        }, "includes"), a10.prototype.indexOf = t7(function(e11, t11, r11) {
          return _2(this, e11, t11, r11, true);
        }, "indexOf"), a10.prototype.lastIndexOf = t7(function(e11, t11, r11) {
          return _2(this, e11, t11, r11, false);
        }, "lastIndexOf"), t7(E2, "hexWrite"), t7(x2, "utf8Write"), t7(T2, "asciiWrite"), t7(C2, "base64Write"), t7(P2, "ucs2Write"), a10.prototype.write = t7(function(e11, t11, r11, n11) {
          if (void 0 === t11) n11 = "utf8", r11 = this.length, t11 = 0;
          else if (void 0 === r11 && "string" == typeof t11) n11 = t11, r11 = this.length, t11 = 0;
          else if (isFinite(t11)) t11 >>>= 0, isFinite(r11) ? (r11 >>>= 0, void 0 === n11 && (n11 = "utf8")) : (n11 = r11, r11 = void 0);
          else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          let i11 = this.length - t11;
          if ((void 0 === r11 || r11 > i11) && (r11 = i11), e11.length > 0 && (r11 < 0 || t11 < 0) || t11 > this.length) throw RangeError("Attempt to write outside buffer bounds");
          n11 || (n11 = "utf8");
          let s11 = false;
          for (; ; ) switch (n11) {
            case "hex":
              return E2(this, e11, t11, r11);
            case "utf8":
            case "utf-8":
              return x2(this, e11, t11, r11);
            case "ascii":
            case "latin1":
            case "binary":
              return T2(this, e11, t11, r11);
            case "base64":
              return C2(this, e11, t11, r11);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return P2(this, e11, t11, r11);
            default:
              if (s11) throw TypeError("Unknown encoding: " + n11);
              n11 = ("" + n11).toLowerCase(), s11 = true;
          }
        }, "write"), a10.prototype.toJSON = t7(function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        }, "toJSON"), t7(A2, "base64Slice"), t7(R2, "utf8Slice"), t7(N2, "decodeCodePointsArray"), t7(O2, "asciiSlice"), t7(I2, "latin1Slice"), t7(k2, "hexSlice"), t7(D2, "utf16leSlice"), a10.prototype.slice = t7(function(e11, t11) {
          let r11 = this.length;
          e11 = ~~e11, t11 = void 0 === t11 ? r11 : ~~t11, e11 < 0 ? (e11 += r11) < 0 && (e11 = 0) : e11 > r11 && (e11 = r11), t11 < 0 ? (t11 += r11) < 0 && (t11 = 0) : t11 > r11 && (t11 = r11), t11 < e11 && (t11 = e11);
          let n11 = this.subarray(e11, t11);
          return Object.setPrototypeOf(n11, a10.prototype), n11;
        }, "slice"), t7(L2, "checkOffset"), a10.prototype.readUintLE = a10.prototype.readUIntLE = t7(function(e11, t11, r11) {
          e11 >>>= 0, t11 >>>= 0, r11 || L2(e11, t11, this.length);
          let n11 = this[e11], i11 = 1, s11 = 0;
          for (; ++s11 < t11 && (i11 *= 256); ) n11 += this[e11 + s11] * i11;
          return n11;
        }, "readUIntLE"), a10.prototype.readUintBE = a10.prototype.readUIntBE = t7(function(e11, t11, r11) {
          e11 >>>= 0, t11 >>>= 0, r11 || L2(e11, t11, this.length);
          let n11 = this[e11 + --t11], i11 = 1;
          for (; t11 > 0 && (i11 *= 256); ) n11 += this[e11 + --t11] * i11;
          return n11;
        }, "readUIntBE"), a10.prototype.readUint8 = a10.prototype.readUInt8 = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 1, this.length), this[e11];
        }, "readUInt8"), a10.prototype.readUint16LE = a10.prototype.readUInt16LE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 2, this.length), this[e11] | this[e11 + 1] << 8;
        }, "readUInt16LE"), a10.prototype.readUint16BE = a10.prototype.readUInt16BE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 2, this.length), this[e11] << 8 | this[e11 + 1];
        }, "readUInt16BE"), a10.prototype.readUint32LE = a10.prototype.readUInt32LE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), (this[e11] | this[e11 + 1] << 8 | this[e11 + 2] << 16) + 16777216 * this[e11 + 3];
        }, "readUInt32LE"), a10.prototype.readUint32BE = a10.prototype.readUInt32BE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), 16777216 * this[e11] + (this[e11 + 1] << 16 | this[e11 + 2] << 8 | this[e11 + 3]);
        }, "readUInt32BE"), a10.prototype.readBigUInt64LE = es2(t7(function(e11) {
          G2(e11 >>>= 0, "offset");
          let t11 = this[e11], r11 = this[e11 + 7];
          (void 0 === t11 || void 0 === r11) && W2(e11, this.length - 8);
          let n11 = t11 + 256 * this[++e11] + 65536 * this[++e11] + 16777216 * this[++e11], i11 = this[++e11] + 256 * this[++e11] + 65536 * this[++e11] + 16777216 * r11;
          return BigInt(n11) + (BigInt(i11) << BigInt(32));
        }, "readBigUInt64LE")), a10.prototype.readBigUInt64BE = es2(t7(function(e11) {
          G2(e11 >>>= 0, "offset");
          let t11 = this[e11], r11 = this[e11 + 7];
          (void 0 === t11 || void 0 === r11) && W2(e11, this.length - 8);
          let n11 = 16777216 * t11 + 65536 * this[++e11] + 256 * this[++e11] + this[++e11], i11 = 16777216 * this[++e11] + 65536 * this[++e11] + 256 * this[++e11] + r11;
          return (BigInt(n11) << BigInt(32)) + BigInt(i11);
        }, "readBigUInt64BE")), a10.prototype.readIntLE = t7(function(e11, t11, r11) {
          e11 >>>= 0, t11 >>>= 0, r11 || L2(e11, t11, this.length);
          let n11 = this[e11], i11 = 1, s11 = 0;
          for (; ++s11 < t11 && (i11 *= 256); ) n11 += this[e11 + s11] * i11;
          return n11 >= (i11 *= 128) && (n11 -= Math.pow(2, 8 * t11)), n11;
        }, "readIntLE"), a10.prototype.readIntBE = t7(function(e11, t11, r11) {
          e11 >>>= 0, t11 >>>= 0, r11 || L2(e11, t11, this.length);
          let n11 = t11, i11 = 1, s11 = this[e11 + --n11];
          for (; n11 > 0 && (i11 *= 256); ) s11 += this[e11 + --n11] * i11;
          return s11 >= (i11 *= 128) && (s11 -= Math.pow(2, 8 * t11)), s11;
        }, "readIntBE"), a10.prototype.readInt8 = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 1, this.length), 128 & this[e11] ? -((255 - this[e11] + 1) * 1) : this[e11];
        }, "readInt8"), a10.prototype.readInt16LE = t7(function(e11, t11) {
          e11 >>>= 0, t11 || L2(e11, 2, this.length);
          let r11 = this[e11] | this[e11 + 1] << 8;
          return 32768 & r11 ? 4294901760 | r11 : r11;
        }, "readInt16LE"), a10.prototype.readInt16BE = t7(function(e11, t11) {
          e11 >>>= 0, t11 || L2(e11, 2, this.length);
          let r11 = this[e11 + 1] | this[e11] << 8;
          return 32768 & r11 ? 4294901760 | r11 : r11;
        }, "readInt16BE"), a10.prototype.readInt32LE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), this[e11] | this[e11 + 1] << 8 | this[e11 + 2] << 16 | this[e11 + 3] << 24;
        }, "readInt32LE"), a10.prototype.readInt32BE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), this[e11] << 24 | this[e11 + 1] << 16 | this[e11 + 2] << 8 | this[e11 + 3];
        }, "readInt32BE"), a10.prototype.readBigInt64LE = es2(t7(function(e11) {
          G2(e11 >>>= 0, "offset");
          let t11 = this[e11], r11 = this[e11 + 7];
          return (void 0 === t11 || void 0 === r11) && W2(e11, this.length - 8), (BigInt(this[e11 + 4] + 256 * this[e11 + 5] + 65536 * this[e11 + 6] + (r11 << 24)) << BigInt(32)) + BigInt(t11 + 256 * this[++e11] + 65536 * this[++e11] + 16777216 * this[++e11]);
        }, "readBigInt64LE")), a10.prototype.readBigInt64BE = es2(t7(function(e11) {
          G2(e11 >>>= 0, "offset");
          let t11 = this[e11], r11 = this[e11 + 7];
          return (void 0 === t11 || void 0 === r11) && W2(e11, this.length - 8), (BigInt((t11 << 24) + 65536 * this[++e11] + 256 * this[++e11] + this[++e11]) << BigInt(32)) + BigInt(16777216 * this[++e11] + 65536 * this[++e11] + 256 * this[++e11] + r11);
        }, "readBigInt64BE")), a10.prototype.readFloatLE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), r10.read(this, e11, true, 23, 4);
        }, "readFloatLE"), a10.prototype.readFloatBE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 4, this.length), r10.read(this, e11, false, 23, 4);
        }, "readFloatBE"), a10.prototype.readDoubleLE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 8, this.length), r10.read(this, e11, true, 52, 8);
        }, "readDoubleLE"), a10.prototype.readDoubleBE = t7(function(e11, t11) {
          return e11 >>>= 0, t11 || L2(e11, 8, this.length), r10.read(this, e11, false, 52, 8);
        }, "readDoubleBE"), t7(M2, "checkInt"), a10.prototype.writeUintLE = a10.prototype.writeUIntLE = t7(function(e11, t11, r11, n11) {
          if (e11 *= 1, t11 >>>= 0, r11 >>>= 0, !n11) {
            let n12 = Math.pow(2, 8 * r11) - 1;
            M2(this, e11, t11, r11, n12, 0);
          }
          let i11 = 1, s11 = 0;
          for (this[t11] = 255 & e11; ++s11 < r11 && (i11 *= 256); ) this[t11 + s11] = e11 / i11 & 255;
          return t11 + r11;
        }, "writeUIntLE"), a10.prototype.writeUintBE = a10.prototype.writeUIntBE = t7(function(e11, t11, r11, n11) {
          if (e11 *= 1, t11 >>>= 0, r11 >>>= 0, !n11) {
            let n12 = Math.pow(2, 8 * r11) - 1;
            M2(this, e11, t11, r11, n12, 0);
          }
          let i11 = r11 - 1, s11 = 1;
          for (this[t11 + i11] = 255 & e11; --i11 >= 0 && (s11 *= 256); ) this[t11 + i11] = e11 / s11 & 255;
          return t11 + r11;
        }, "writeUIntBE"), a10.prototype.writeUint8 = a10.prototype.writeUInt8 = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 1, 255, 0), this[t11] = 255 & e11, t11 + 1;
        }, "writeUInt8"), a10.prototype.writeUint16LE = a10.prototype.writeUInt16LE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 2, 65535, 0), this[t11] = 255 & e11, this[t11 + 1] = e11 >>> 8, t11 + 2;
        }, "writeUInt16LE"), a10.prototype.writeUint16BE = a10.prototype.writeUInt16BE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 2, 65535, 0), this[t11] = e11 >>> 8, this[t11 + 1] = 255 & e11, t11 + 2;
        }, "writeUInt16BE"), a10.prototype.writeUint32LE = a10.prototype.writeUInt32LE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 4, 4294967295, 0), this[t11 + 3] = e11 >>> 24, this[t11 + 2] = e11 >>> 16, this[t11 + 1] = e11 >>> 8, this[t11] = 255 & e11, t11 + 4;
        }, "writeUInt32LE"), a10.prototype.writeUint32BE = a10.prototype.writeUInt32BE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 4, 4294967295, 0), this[t11] = e11 >>> 24, this[t11 + 1] = e11 >>> 16, this[t11 + 2] = e11 >>> 8, this[t11 + 3] = 255 & e11, t11 + 4;
        }, "writeUInt32BE"), t7(B2, "wrtBigUInt64LE"), t7($2, "wrtBigUInt64BE"), a10.prototype.writeBigUInt64LE = es2(t7(function(e11, t11 = 0) {
          return B2(this, e11, t11, BigInt(0), BigInt("0xffffffffffffffff"));
        }, "writeBigUInt64LE")), a10.prototype.writeBigUInt64BE = es2(t7(function(e11, t11 = 0) {
          return $2(this, e11, t11, BigInt(0), BigInt("0xffffffffffffffff"));
        }, "writeBigUInt64BE")), a10.prototype.writeIntLE = t7(function(e11, t11, r11, n11) {
          if (e11 *= 1, t11 >>>= 0, !n11) {
            let n12 = Math.pow(2, 8 * r11 - 1);
            M2(this, e11, t11, r11, n12 - 1, -n12);
          }
          let i11 = 0, s11 = 1, a11 = 0;
          for (this[t11] = 255 & e11; ++i11 < r11 && (s11 *= 256); ) e11 < 0 && 0 === a11 && 0 !== this[t11 + i11 - 1] && (a11 = 1), this[t11 + i11] = (e11 / s11 | 0) - a11 & 255;
          return t11 + r11;
        }, "writeIntLE"), a10.prototype.writeIntBE = t7(function(e11, t11, r11, n11) {
          if (e11 *= 1, t11 >>>= 0, !n11) {
            let n12 = Math.pow(2, 8 * r11 - 1);
            M2(this, e11, t11, r11, n12 - 1, -n12);
          }
          let i11 = r11 - 1, s11 = 1, a11 = 0;
          for (this[t11 + i11] = 255 & e11; --i11 >= 0 && (s11 *= 256); ) e11 < 0 && 0 === a11 && 0 !== this[t11 + i11 + 1] && (a11 = 1), this[t11 + i11] = (e11 / s11 | 0) - a11 & 255;
          return t11 + r11;
        }, "writeIntBE"), a10.prototype.writeInt8 = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 1, 127, -128), e11 < 0 && (e11 = 255 + e11 + 1), this[t11] = 255 & e11, t11 + 1;
        }, "writeInt8"), a10.prototype.writeInt16LE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 2, 32767, -32768), this[t11] = 255 & e11, this[t11 + 1] = e11 >>> 8, t11 + 2;
        }, "writeInt16LE"), a10.prototype.writeInt16BE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 2, 32767, -32768), this[t11] = e11 >>> 8, this[t11 + 1] = 255 & e11, t11 + 2;
        }, "writeInt16BE"), a10.prototype.writeInt32LE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 4, 2147483647, -2147483648), this[t11] = 255 & e11, this[t11 + 1] = e11 >>> 8, this[t11 + 2] = e11 >>> 16, this[t11 + 3] = e11 >>> 24, t11 + 4;
        }, "writeInt32LE"), a10.prototype.writeInt32BE = t7(function(e11, t11, r11) {
          return e11 *= 1, t11 >>>= 0, r11 || M2(this, e11, t11, 4, 2147483647, -2147483648), e11 < 0 && (e11 = 4294967295 + e11 + 1), this[t11] = e11 >>> 24, this[t11 + 1] = e11 >>> 16, this[t11 + 2] = e11 >>> 8, this[t11 + 3] = 255 & e11, t11 + 4;
        }, "writeInt32BE"), a10.prototype.writeBigInt64LE = es2(t7(function(e11, t11 = 0) {
          return B2(this, e11, t11, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }, "writeBigInt64LE")), a10.prototype.writeBigInt64BE = es2(t7(function(e11, t11 = 0) {
          return $2(this, e11, t11, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }, "writeBigInt64BE")), t7(j2, "checkIEEE754"), t7(q2, "writeFloat"), a10.prototype.writeFloatLE = t7(function(e11, t11, r11) {
          return q2(this, e11, t11, true, r11);
        }, "writeFloatLE"), a10.prototype.writeFloatBE = t7(function(e11, t11, r11) {
          return q2(this, e11, t11, false, r11);
        }, "writeFloatBE"), t7(F2, "writeDouble"), a10.prototype.writeDoubleLE = t7(function(e11, t11, r11) {
          return F2(this, e11, t11, true, r11);
        }, "writeDoubleLE"), a10.prototype.writeDoubleBE = t7(function(e11, t11, r11) {
          return F2(this, e11, t11, false, r11);
        }, "writeDoubleBE"), a10.prototype.copy = t7(function(e11, t11, r11, n11) {
          if (!a10.isBuffer(e11)) throw TypeError("argument should be a Buffer");
          if (r11 || (r11 = 0), n11 || 0 === n11 || (n11 = this.length), t11 >= e11.length && (t11 = e11.length), t11 || (t11 = 0), n11 > 0 && n11 < r11 && (n11 = r11), n11 === r11 || 0 === e11.length || 0 === this.length) return 0;
          if (t11 < 0) throw RangeError("targetStart out of bounds");
          if (r11 < 0 || r11 >= this.length) throw RangeError("Index out of range");
          if (n11 < 0) throw RangeError("sourceEnd out of bounds");
          n11 > this.length && (n11 = this.length), e11.length - t11 < n11 - r11 && (n11 = e11.length - t11 + r11);
          let i11 = n11 - r11;
          return this === e11 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t11, r11, n11) : Uint8Array.prototype.set.call(e11, this.subarray(r11, n11), t11), i11;
        }, "copy"), a10.prototype.fill = t7(function(e11, t11, r11, n11) {
          let i11;
          if ("string" == typeof e11) {
            if ("string" == typeof t11 ? (n11 = t11, t11 = 0, r11 = this.length) : "string" == typeof r11 && (n11 = r11, r11 = this.length), void 0 !== n11 && "string" != typeof n11) throw TypeError("encoding must be a string");
            if ("string" == typeof n11 && !a10.isEncoding(n11)) throw TypeError("Unknown encoding: " + n11);
            if (1 === e11.length) {
              let t12 = e11.charCodeAt(0);
              ("utf8" === n11 && t12 < 128 || "latin1" === n11) && (e11 = t12);
            }
          } else "number" == typeof e11 ? e11 &= 255 : "boolean" == typeof e11 && (e11 = Number(e11));
          if (t11 < 0 || this.length < t11 || this.length < r11) throw RangeError("Out of range index");
          if (r11 <= t11) return this;
          if (t11 >>>= 0, r11 = void 0 === r11 ? this.length : r11 >>> 0, e11 || (e11 = 0), "number" == typeof e11) for (i11 = t11; i11 < r11; ++i11) this[i11] = e11;
          else {
            let s11 = a10.isBuffer(e11) ? e11 : a10.from(e11, n11), o11 = s11.length;
            if (0 === o11) throw TypeError('The value "' + e11 + '" is invalid for argument "value"');
            for (i11 = 0; i11 < r11 - t11; ++i11) this[i11 + t11] = s11[i11 % o11];
          }
          return this;
        }, "fill");
        var U2 = {};
        function Q2(e11, t11, r11) {
          var n11;
          U2[e11] = (t7(n11 = class extends r11 {
            constructor() {
              super(), Object.defineProperty(this, "message", { value: t11.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e11}]`, this.stack, delete this.name;
            }
            get code() {
              return e11;
            }
            set code(e12) {
              Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e12, writable: true });
            }
            toString() {
              return `${this.name} [${e11}]: ${this.message}`;
            }
          }, "NodeError"), n11);
        }
        function z2(e11) {
          let t11 = "", r11 = e11.length, n11 = +("-" === e11[0]);
          for (; r11 >= n11 + 4; r11 -= 3) t11 = `_${e11.slice(r11 - 3, r11)}${t11}`;
          return `${e11.slice(0, r11)}${t11}`;
        }
        function V2(e11, t11, r11) {
          G2(t11, "offset"), (void 0 === e11[t11] || void 0 === e11[t11 + r11]) && W2(t11, e11.length - (r11 + 1));
        }
        function H2(e11, t11, r11, n11, i11, s11) {
          if (e11 > r11 || e11 < t11) {
            let n12 = "bigint" == typeof t11 ? "n" : "", i12;
            throw i12 = s11 > 3 ? 0 === t11 || t11 === BigInt(0) ? `>= 0${n12} and < 2${n12} ** ${(s11 + 1) * 8}${n12}` : `>= -(2${n12} ** ${(s11 + 1) * 8 - 1}${n12}) and < 2 ** ${(s11 + 1) * 8 - 1}${n12}` : `>= ${t11}${n12} and <= ${r11}${n12}`, new U2.ERR_OUT_OF_RANGE("value", i12, e11);
          }
          V2(n11, i11, s11);
        }
        function G2(e11, t11) {
          if ("number" != typeof e11) throw new U2.ERR_INVALID_ARG_TYPE(t11, "number", e11);
        }
        function W2(e11, t11, r11) {
          throw Math.floor(e11) !== e11 ? (G2(e11, r11), new U2.ERR_OUT_OF_RANGE(r11 || "offset", "an integer", e11)) : t11 < 0 ? new U2.ERR_BUFFER_OUT_OF_BOUNDS() : new U2.ERR_OUT_OF_RANGE(r11 || "offset", `>= ${+!!r11} and <= ${t11}`, e11);
        }
        t7(Q2, "E"), Q2("ERR_BUFFER_OUT_OF_BOUNDS", function(e11) {
          return e11 ? `${e11} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        }, RangeError), Q2("ERR_INVALID_ARG_TYPE", function(e11, t11) {
          return `The "${e11}" argument must be of type number. Received type ${typeof t11}`;
        }, TypeError), Q2("ERR_OUT_OF_RANGE", function(e11, t11, r11) {
          let n11 = `The value of "${e11}" is out of range.`, i11 = r11;
          return Number.isInteger(r11) && Math.abs(r11) > 4294967296 ? i11 = z2(String(r11)) : "bigint" == typeof r11 && (i11 = String(r11), (r11 > BigInt(2) ** BigInt(32) || r11 < -(BigInt(2) ** BigInt(32))) && (i11 = z2(i11)), i11 += "n"), n11 += ` It must be ${t11}. Received ${i11}`;
        }, RangeError), t7(z2, "addNumericalSeparator"), t7(V2, "checkBounds"), t7(H2, "checkIntBI"), t7(G2, "validateNumber"), t7(W2, "boundsError");
        var K2 = /[^+/0-9A-Za-z-_]/g;
        function X2(e11) {
          if ((e11 = (e11 = e11.split("=")[0]).trim().replace(K2, "")).length < 2) return "";
          for (; e11.length % 4 != 0; ) e11 += "=";
          return e11;
        }
        function J2(e11, t11) {
          t11 = t11 || 1 / 0;
          let r11, n11 = e11.length, i11 = null, s11 = [];
          for (let a11 = 0; a11 < n11; ++a11) {
            if ((r11 = e11.charCodeAt(a11)) > 55295 && r11 < 57344) {
              if (!i11) {
                if (r11 > 56319 || a11 + 1 === n11) {
                  (t11 -= 3) > -1 && s11.push(239, 191, 189);
                  continue;
                }
                i11 = r11;
                continue;
              }
              if (r11 < 56320) {
                (t11 -= 3) > -1 && s11.push(239, 191, 189), i11 = r11;
                continue;
              }
              r11 = (i11 - 55296 << 10 | r11 - 56320) + 65536;
            } else i11 && (t11 -= 3) > -1 && s11.push(239, 191, 189);
            if (i11 = null, r11 < 128) {
              if ((t11 -= 1) < 0) break;
              s11.push(r11);
            } else if (r11 < 2048) {
              if ((t11 -= 2) < 0) break;
              s11.push(r11 >> 6 | 192, 63 & r11 | 128);
            } else if (r11 < 65536) {
              if ((t11 -= 3) < 0) break;
              s11.push(r11 >> 12 | 224, r11 >> 6 & 63 | 128, 63 & r11 | 128);
            } else if (r11 < 1114112) {
              if ((t11 -= 4) < 0) break;
              s11.push(r11 >> 18 | 240, r11 >> 12 & 63 | 128, r11 >> 6 & 63 | 128, 63 & r11 | 128);
            } else throw Error("Invalid code point");
          }
          return s11;
        }
        function Y2(e11) {
          let t11 = [];
          for (let r11 = 0; r11 < e11.length; ++r11) t11.push(255 & e11.charCodeAt(r11));
          return t11;
        }
        function Z2(e11, t11) {
          let r11, n11, i11 = [];
          for (let s11 = 0; s11 < e11.length && !((t11 -= 2) < 0); ++s11) n11 = (r11 = e11.charCodeAt(s11)) >> 8, i11.push(r11 % 256), i11.push(n11);
          return i11;
        }
        function ee2(e11) {
          return t10.toByteArray(X2(e11));
        }
        function et2(e11, t11, r11, n11) {
          let i11;
          for (i11 = 0; i11 < n11 && !(i11 + r11 >= t11.length || i11 >= e11.length); ++i11) t11[i11 + r11] = e11[i11];
          return i11;
        }
        function er2(e11, t11) {
          return e11 instanceof t11 || null != e11 && null != e11.constructor && null != e11.constructor.name && e11.constructor.name === t11.name;
        }
        function en2(e11) {
          return e11 != e11;
        }
        t7(X2, "base64clean"), t7(J2, "utf8ToBytes"), t7(Y2, "asciiToBytes"), t7(Z2, "utf16leToBytes"), t7(ee2, "base64ToBytes"), t7(et2, "blitBuffer"), t7(er2, "isInstance"), t7(en2, "numberIsNaN");
        var ei2 = function() {
          let e11 = "0123456789abcdef", t11 = Array(256);
          for (let r11 = 0; r11 < 16; ++r11) {
            let n11 = 16 * r11;
            for (let i11 = 0; i11 < 16; ++i11) t11[n11 + i11] = e11[r11] + e11[i11];
          }
          return t11;
        }();
        function es2(e11) {
          return typeof BigInt > "u" ? ea2 : e11;
        }
        function ea2() {
          throw Error("BigInt not supported");
        }
        t7(es2, "defineBigIntMethod"), t7(ea2, "BufferBigIntNotDefined");
      }), ru = t9(() => {
        tY = globalThis, tZ = globalThis.setImmediate ?? ((e10) => setTimeout(e10, 0)), t0 = "function" == typeof globalThis.Buffer && "function" == typeof globalThis.Buffer.allocUnsafe ? globalThis.Buffer : rl().Buffer, (t1 = globalThis.process ?? {}).env ?? (t1.env = {});
        try {
          t1.nextTick(() => {
          });
        } catch {
          let e10 = Promise.resolve();
          t1.nextTick = e10.then.bind(e10);
        }
      }), rc = re((e10, t10) => {
        ru();
        var r10, n10 = "object" == typeof Reflect ? Reflect : null, i10 = n10 && "function" == typeof n10.apply ? n10.apply : t7(function(e11, t11, r11) {
          return Function.prototype.apply.call(e11, t11, r11);
        }, "ReflectApply");
        function s10(e11) {
          console && console.warn && console.warn(e11);
        }
        r10 = n10 && "function" == typeof n10.ownKeys ? n10.ownKeys : Object.getOwnPropertySymbols ? t7(function(e11) {
          return Object.getOwnPropertyNames(e11).concat(Object.getOwnPropertySymbols(e11));
        }, "ReflectOwnKeys") : t7(function(e11) {
          return Object.getOwnPropertyNames(e11);
        }, "ReflectOwnKeys"), t7(s10, "ProcessEmitWarning");
        var a10 = Number.isNaN || t7(function(e11) {
          return e11 != e11;
        }, "NumberIsNaN");
        function o10() {
          o10.init.call(this);
        }
        t7(o10, "EventEmitter"), t10.exports = o10, t10.exports.once = v2, o10.EventEmitter = o10, o10.prototype._events = void 0, o10.prototype._eventsCount = 0, o10.prototype._maxListeners = void 0;
        var l2 = 10;
        function u2(e11) {
          if ("function" != typeof e11) throw TypeError('The "listener" argument must be of type Function. Received type ' + typeof e11);
        }
        function c2(e11) {
          return void 0 === e11._maxListeners ? o10.defaultMaxListeners : e11._maxListeners;
        }
        function h2(e11, t11, r11, n11) {
          var i11, a11, o11;
          if (u2(r11), void 0 === (a11 = e11._events) ? (a11 = e11._events = /* @__PURE__ */ Object.create(null), e11._eventsCount = 0) : (void 0 !== a11.newListener && (e11.emit("newListener", t11, r11.listener ? r11.listener : r11), a11 = e11._events), o11 = a11[t11]), void 0 === o11) o11 = a11[t11] = r11, ++e11._eventsCount;
          else if ("function" == typeof o11 ? o11 = a11[t11] = n11 ? [r11, o11] : [o11, r11] : n11 ? o11.unshift(r11) : o11.push(r11), (i11 = c2(e11)) > 0 && o11.length > i11 && !o11.warned) {
            o11.warned = true;
            var l3 = Error("Possible EventEmitter memory leak detected. " + o11.length + " " + String(t11) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            l3.name = "MaxListenersExceededWarning", l3.emitter = e11, l3.type = t11, l3.count = o11.length, s10(l3);
          }
          return e11;
        }
        function d2() {
          if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 == arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
        }
        function f2(e11, t11, r11) {
          var n11 = { fired: false, wrapFn: void 0, target: e11, type: t11, listener: r11 }, i11 = d2.bind(n11);
          return i11.listener = r11, n11.wrapFn = i11, i11;
        }
        function p2(e11, t11, r11) {
          var n11 = e11._events;
          if (void 0 === n11) return [];
          var i11 = n11[t11];
          return void 0 === i11 ? [] : "function" == typeof i11 ? r11 ? [i11.listener || i11] : [i11] : r11 ? b2(i11) : m2(i11, i11.length);
        }
        function g2(e11) {
          var t11 = this._events;
          if (void 0 !== t11) {
            var r11 = t11[e11];
            if ("function" == typeof r11) return 1;
            if (void 0 !== r11) return r11.length;
          }
          return 0;
        }
        function m2(e11, t11) {
          for (var r11 = Array(t11), n11 = 0; n11 < t11; ++n11) r11[n11] = e11[n11];
          return r11;
        }
        function y2(e11, t11) {
          for (; t11 + 1 < e11.length; t11++) e11[t11] = e11[t11 + 1];
          e11.pop();
        }
        function b2(e11) {
          for (var t11 = Array(e11.length), r11 = 0; r11 < t11.length; ++r11) t11[r11] = e11[r11].listener || e11[r11];
          return t11;
        }
        function v2(e11, t11) {
          return new Promise(function(r11, n11) {
            function i11(r12) {
              e11.removeListener(t11, s11), n11(r12);
            }
            function s11() {
              "function" == typeof e11.removeListener && e11.removeListener("error", i11), r11([].slice.call(arguments));
            }
            t7(i11, "errorListener"), t7(s11, "resolver"), _2(e11, t11, s11, { once: true }), "error" !== t11 && w2(e11, i11, { once: true });
          });
        }
        function w2(e11, t11, r11) {
          "function" == typeof e11.on && _2(e11, "error", t11, r11);
        }
        function _2(e11, t11, r11, n11) {
          if ("function" == typeof e11.on) n11.once ? e11.once(t11, r11) : e11.on(t11, r11);
          else if ("function" == typeof e11.addEventListener) e11.addEventListener(t11, t7(function i11(s11) {
            n11.once && e11.removeEventListener(t11, i11), r11(s11);
          }, "wrapListener"));
          else throw TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e11);
        }
        t7(u2, "checkListener"), Object.defineProperty(o10, "defaultMaxListeners", { enumerable: true, get: t7(function() {
          return l2;
        }, "get"), set: t7(function(e11) {
          if ("number" != typeof e11 || e11 < 0 || a10(e11)) throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e11 + ".");
          l2 = e11;
        }, "set") }), o10.init = function() {
          (void 0 === this._events || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
        }, o10.prototype.setMaxListeners = t7(function(e11) {
          if ("number" != typeof e11 || e11 < 0 || a10(e11)) throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e11 + ".");
          return this._maxListeners = e11, this;
        }, "setMaxListeners"), t7(c2, "_getMaxListeners"), o10.prototype.getMaxListeners = t7(function() {
          return c2(this);
        }, "getMaxListeners"), o10.prototype.emit = t7(function(e11) {
          for (var t11 = [], r11 = 1; r11 < arguments.length; r11++) t11.push(arguments[r11]);
          var n11 = "error" === e11, s11 = this._events;
          if (void 0 !== s11) n11 = n11 && void 0 === s11.error;
          else if (!n11) return false;
          if (n11) {
            if (t11.length > 0 && (a11 = t11[0]), a11 instanceof Error) throw a11;
            var a11, o11 = Error("Unhandled error." + (a11 ? " (" + a11.message + ")" : ""));
            throw o11.context = a11, o11;
          }
          var l3 = s11[e11];
          if (void 0 === l3) return false;
          if ("function" == typeof l3) i10(l3, this, t11);
          else for (var u3 = l3.length, c3 = m2(l3, u3), r11 = 0; r11 < u3; ++r11) i10(c3[r11], this, t11);
          return true;
        }, "emit"), t7(h2, "_addListener"), o10.prototype.addListener = t7(function(e11, t11) {
          return h2(this, e11, t11, false);
        }, "addListener"), o10.prototype.on = o10.prototype.addListener, o10.prototype.prependListener = t7(function(e11, t11) {
          return h2(this, e11, t11, true);
        }, "prependListener"), t7(d2, "onceWrapper"), t7(f2, "_onceWrap"), o10.prototype.once = t7(function(e11, t11) {
          return u2(t11), this.on(e11, f2(this, e11, t11)), this;
        }, "once"), o10.prototype.prependOnceListener = t7(function(e11, t11) {
          return u2(t11), this.prependListener(e11, f2(this, e11, t11)), this;
        }, "prependOnceListener"), o10.prototype.removeListener = t7(function(e11, t11) {
          var r11, n11, i11, s11, a11;
          if (u2(t11), void 0 === (n11 = this._events) || void 0 === (r11 = n11[e11])) return this;
          if (r11 === t11 || r11.listener === t11) 0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : (delete n11[e11], n11.removeListener && this.emit("removeListener", e11, r11.listener || t11));
          else if ("function" != typeof r11) {
            for (i11 = -1, s11 = r11.length - 1; s11 >= 0; s11--) if (r11[s11] === t11 || r11[s11].listener === t11) {
              a11 = r11[s11].listener, i11 = s11;
              break;
            }
            if (i11 < 0) return this;
            0 === i11 ? r11.shift() : y2(r11, i11), 1 === r11.length && (n11[e11] = r11[0]), void 0 !== n11.removeListener && this.emit("removeListener", e11, a11 || t11);
          }
          return this;
        }, "removeListener"), o10.prototype.off = o10.prototype.removeListener, o10.prototype.removeAllListeners = t7(function(e11) {
          var t11, r11, n11;
          if (void 0 === (r11 = this._events)) return this;
          if (void 0 === r11.removeListener) return 0 == arguments.length ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : void 0 !== r11[e11] && (0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : delete r11[e11]), this;
          if (0 == arguments.length) {
            var i11, s11 = Object.keys(r11);
            for (n11 = 0; n11 < s11.length; ++n11) "removeListener" !== (i11 = s11[n11]) && this.removeAllListeners(i11);
            return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
          }
          if ("function" == typeof (t11 = r11[e11])) this.removeListener(e11, t11);
          else if (void 0 !== t11) for (n11 = t11.length - 1; n11 >= 0; n11--) this.removeListener(e11, t11[n11]);
          return this;
        }, "removeAllListeners"), t7(p2, "_listeners"), o10.prototype.listeners = t7(function(e11) {
          return p2(this, e11, true);
        }, "listeners"), o10.prototype.rawListeners = t7(function(e11) {
          return p2(this, e11, false);
        }, "rawListeners"), o10.listenerCount = function(e11, t11) {
          return "function" == typeof e11.listenerCount ? e11.listenerCount(t11) : g2.call(e11, t11);
        }, o10.prototype.listenerCount = g2, t7(g2, "listenerCount"), o10.prototype.eventNames = t7(function() {
          return this._eventsCount > 0 ? r10(this._events) : [];
        }, "eventNames"), t7(m2, "arrayClone"), t7(y2, "spliceOne"), t7(b2, "unwrapListeners"), t7(v2, "once"), t7(w2, "addErrorHandlerIfEventEmitter"), t7(_2, "eventTargetAgnosticAddListener");
      }), rh = {};
      function rd(e10) {
        return 0;
      }
      rt(rh, { Socket: () => rm, isIP: () => rd });
      var rf, rp, rg, rm, ry = t9(() => {
        ru(), rf = rn(rc(), 1), t7(rd, "isIP"), rp = /^[^.]+\./, rg = class e10 extends rf.EventEmitter {
          constructor() {
            super(...arguments), rs(this, "opts", {}), rs(this, "connecting", false), rs(this, "pending", true), rs(this, "writable", true), rs(this, "encrypted", false), rs(this, "authorized", false), rs(this, "destroyed", false), rs(this, "ws", null), rs(this, "writeBuffer"), rs(this, "tlsState", 0), rs(this, "tlsRead"), rs(this, "tlsWrite");
          }
          static get poolQueryViaFetch() {
            return e10.opts.poolQueryViaFetch ?? e10.defaults.poolQueryViaFetch;
          }
          static set poolQueryViaFetch(t10) {
            e10.opts.poolQueryViaFetch = t10;
          }
          static get fetchEndpoint() {
            return e10.opts.fetchEndpoint ?? e10.defaults.fetchEndpoint;
          }
          static set fetchEndpoint(t10) {
            e10.opts.fetchEndpoint = t10;
          }
          static get fetchConnectionCache() {
            return true;
          }
          static set fetchConnectionCache(e11) {
            console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
          }
          static get fetchFunction() {
            return e10.opts.fetchFunction ?? e10.defaults.fetchFunction;
          }
          static set fetchFunction(t10) {
            e10.opts.fetchFunction = t10;
          }
          static get webSocketConstructor() {
            return e10.opts.webSocketConstructor ?? e10.defaults.webSocketConstructor;
          }
          static set webSocketConstructor(t10) {
            e10.opts.webSocketConstructor = t10;
          }
          get webSocketConstructor() {
            return this.opts.webSocketConstructor ?? e10.webSocketConstructor;
          }
          set webSocketConstructor(e11) {
            this.opts.webSocketConstructor = e11;
          }
          static get wsProxy() {
            return e10.opts.wsProxy ?? e10.defaults.wsProxy;
          }
          static set wsProxy(t10) {
            e10.opts.wsProxy = t10;
          }
          get wsProxy() {
            return this.opts.wsProxy ?? e10.wsProxy;
          }
          set wsProxy(e11) {
            this.opts.wsProxy = e11;
          }
          static get coalesceWrites() {
            return e10.opts.coalesceWrites ?? e10.defaults.coalesceWrites;
          }
          static set coalesceWrites(t10) {
            e10.opts.coalesceWrites = t10;
          }
          get coalesceWrites() {
            return this.opts.coalesceWrites ?? e10.coalesceWrites;
          }
          set coalesceWrites(e11) {
            this.opts.coalesceWrites = e11;
          }
          static get useSecureWebSocket() {
            return e10.opts.useSecureWebSocket ?? e10.defaults.useSecureWebSocket;
          }
          static set useSecureWebSocket(t10) {
            e10.opts.useSecureWebSocket = t10;
          }
          get useSecureWebSocket() {
            return this.opts.useSecureWebSocket ?? e10.useSecureWebSocket;
          }
          set useSecureWebSocket(e11) {
            this.opts.useSecureWebSocket = e11;
          }
          static get forceDisablePgSSL() {
            return e10.opts.forceDisablePgSSL ?? e10.defaults.forceDisablePgSSL;
          }
          static set forceDisablePgSSL(t10) {
            e10.opts.forceDisablePgSSL = t10;
          }
          get forceDisablePgSSL() {
            return this.opts.forceDisablePgSSL ?? e10.forceDisablePgSSL;
          }
          set forceDisablePgSSL(e11) {
            this.opts.forceDisablePgSSL = e11;
          }
          static get disableSNI() {
            return e10.opts.disableSNI ?? e10.defaults.disableSNI;
          }
          static set disableSNI(t10) {
            e10.opts.disableSNI = t10;
          }
          get disableSNI() {
            return this.opts.disableSNI ?? e10.disableSNI;
          }
          set disableSNI(e11) {
            this.opts.disableSNI = e11;
          }
          static get disableWarningInBrowsers() {
            return e10.opts.disableWarningInBrowsers ?? e10.defaults.disableWarningInBrowsers;
          }
          static set disableWarningInBrowsers(t10) {
            e10.opts.disableWarningInBrowsers = t10;
          }
          get disableWarningInBrowsers() {
            return this.opts.disableWarningInBrowsers ?? e10.disableWarningInBrowsers;
          }
          set disableWarningInBrowsers(e11) {
            this.opts.disableWarningInBrowsers = e11;
          }
          static get pipelineConnect() {
            return e10.opts.pipelineConnect ?? e10.defaults.pipelineConnect;
          }
          static set pipelineConnect(t10) {
            e10.opts.pipelineConnect = t10;
          }
          get pipelineConnect() {
            return this.opts.pipelineConnect ?? e10.pipelineConnect;
          }
          set pipelineConnect(e11) {
            this.opts.pipelineConnect = e11;
          }
          static get subtls() {
            return e10.opts.subtls ?? e10.defaults.subtls;
          }
          static set subtls(t10) {
            e10.opts.subtls = t10;
          }
          get subtls() {
            return this.opts.subtls ?? e10.subtls;
          }
          set subtls(e11) {
            this.opts.subtls = e11;
          }
          static get pipelineTLS() {
            return e10.opts.pipelineTLS ?? e10.defaults.pipelineTLS;
          }
          static set pipelineTLS(t10) {
            e10.opts.pipelineTLS = t10;
          }
          get pipelineTLS() {
            return this.opts.pipelineTLS ?? e10.pipelineTLS;
          }
          set pipelineTLS(e11) {
            this.opts.pipelineTLS = e11;
          }
          static get rootCerts() {
            return e10.opts.rootCerts ?? e10.defaults.rootCerts;
          }
          static set rootCerts(t10) {
            e10.opts.rootCerts = t10;
          }
          get rootCerts() {
            return this.opts.rootCerts ?? e10.rootCerts;
          }
          set rootCerts(e11) {
            this.opts.rootCerts = e11;
          }
          wsProxyAddrForHost(e11, t10) {
            let r10 = this.wsProxy;
            if (void 0 === r10) throw Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
            return "function" == typeof r10 ? r10(e11, t10) : `${r10}?address=${e11}:${t10}`;
          }
          setNoDelay() {
            return this;
          }
          setKeepAlive() {
            return this;
          }
          ref() {
            return this;
          }
          unref() {
            return this;
          }
          connect(e11, t10, r10) {
            this.connecting = true, r10 && this.once("connect", r10);
            let n10 = t7(() => {
              this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
            }, "handleWebSocketOpen"), i10 = t7((e12, t11 = false) => {
              e12.binaryType = "arraybuffer", e12.addEventListener("error", (e13) => {
                this.emit("error", e13), this.emit("close");
              }), e12.addEventListener("message", (e13) => {
                if (0 === this.tlsState) {
                  let t12 = t0.from(e13.data);
                  this.emit("data", t12);
                }
              }), e12.addEventListener("close", () => {
                this.emit("close");
              }), t11 ? n10() : e12.addEventListener("open", n10);
            }, "configureWebSocket"), s10;
            try {
              s10 = this.wsProxyAddrForHost(t10, "string" == typeof e11 ? parseInt(e11, 10) : e11);
            } catch (e12) {
              this.emit("error", e12), this.emit("close");
              return;
            }
            try {
              let e12 = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + s10;
              if (void 0 !== this.webSocketConstructor) this.ws = new this.webSocketConstructor(e12), i10(this.ws);
              else try {
                this.ws = new WebSocket(e12), i10(this.ws);
              } catch {
                this.ws = new __unstable_WebSocket(e12), i10(this.ws);
              }
            } catch (e12) {
              fetch((this.useSecureWebSocket ? "https:" : "http:") + "//" + s10, { headers: { Upgrade: "websocket" } }).then((t11) => {
                if (this.ws = t11.webSocket, null == this.ws) throw e12;
                this.ws.accept(), i10(this.ws, true);
              }).catch((e13) => {
                this.emit("error", Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${e13}`)), this.emit("close");
              });
            }
          }
          async startTls(e11) {
            if (void 0 === this.subtls) throw Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");
            this.tlsState = 1;
            let t10 = await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts), r10 = new this.subtls.WebSocketReadQueue(this.ws), n10 = r10.read.bind(r10), i10 = this.rawWrite.bind(this), { read: s10, write: a10 } = await this.subtls.startTls(e11, t10, n10, i10, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
            this.tlsRead = s10, this.tlsWrite = a10, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit("secureConnection", this), this.tlsReadLoop();
          }
          async tlsReadLoop() {
            for (; ; ) {
              let e11 = await this.tlsRead();
              if (void 0 === e11) break;
              {
                let t10 = t0.from(e11);
                this.emit("data", t10);
              }
            }
          }
          rawWrite(e11) {
            if (!this.coalesceWrites) {
              this.ws && this.ws.send(e11);
              return;
            }
            if (void 0 === this.writeBuffer) this.writeBuffer = e11, setTimeout(() => {
              this.ws && this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
            }, 0);
            else {
              let t10 = new Uint8Array(this.writeBuffer.length + e11.length);
              t10.set(this.writeBuffer), t10.set(e11, this.writeBuffer.length), this.writeBuffer = t10;
            }
          }
          write(e11, t10 = "utf8", r10 = (e12) => {
          }) {
            return 0 === e11.length ? r10() : ("string" == typeof e11 && (e11 = t0.from(e11, t10)), 0 === this.tlsState ? (this.rawWrite(e11), r10()) : 1 === this.tlsState ? this.once("secureConnection", () => {
              this.write(e11, t10, r10);
            }) : (this.tlsWrite(e11), r10())), true;
          }
          end(e11 = t0.alloc(0), t10 = "utf8", r10 = () => {
          }) {
            return this.write(e11, t10, () => {
              this.ws.close(), r10();
            }), this;
          }
          destroy() {
            return this.destroyed = true, this.end();
          }
        }, t7(rg, "Socket"), rs(rg, "defaults", { poolQueryViaFetch: false, fetchEndpoint: t7((e10, t10, r10) => "https://" + (r10?.jwtAuth ? e10.replace(rp, "apiauth.") : e10.replace(rp, "api.")) + "/sql", "fetchEndpoint"), fetchConnectionCache: true, fetchFunction: void 0, webSocketConstructor: void 0, wsProxy: t7((e10) => e10 + "/v2", "wsProxy"), useSecureWebSocket: true, forceDisablePgSSL: true, coalesceWrites: true, pipelineConnect: "password", subtls: void 0, rootCerts: "", pipelineTLS: false, disableSNI: false, disableWarningInBrowsers: false }), rs(rg, "opts", {}), rm = rg;
      }), rb = {};
      function rv(e10, t10 = false) {
        let { protocol: r10 } = new URL(e10), { username: n10, password: i10, host: s10, hostname: a10, port: o10, pathname: l2, search: u2, searchParams: c2, hash: h2 } = new URL("http:" + e10.substring(r10.length));
        i10 = decodeURIComponent(i10), n10 = decodeURIComponent(n10), l2 = decodeURIComponent(l2);
        let d2 = n10 + ":" + i10, f2 = t10 ? Object.fromEntries(c2.entries()) : u2;
        return { href: e10, protocol: r10, auth: d2, username: n10, password: i10, host: s10, hostname: a10, port: o10, pathname: l2, search: u2, query: f2, hash: h2 };
      }
      rt(rb, { parse: () => rv });
      var rw = t9(() => {
        ru(), t7(rv, "parse");
      }), r_ = re((e10) => {
        ru(), e10.parse = function(e11, t11) {
          return new r10(e11, t11).parse();
        };
        var t10 = class e11 {
          constructor(e12, t11) {
            this.source = e12, this.transform = t11 || n10, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
          }
          isEof() {
            return this.position >= this.source.length;
          }
          nextCharacter() {
            var e12 = this.source[this.position++];
            return "\\" === e12 ? { value: this.source[this.position++], escaped: true } : { value: e12, escaped: false };
          }
          record(e12) {
            this.recorded.push(e12);
          }
          newEntry(e12) {
            var t11;
            (this.recorded.length > 0 || e12) && ("NULL" !== (t11 = this.recorded.join("")) || e12 || (t11 = null), null !== t11 && (t11 = this.transform(t11)), this.entries.push(t11), this.recorded = []);
          }
          consumeDimensions() {
            if ("[" === this.source[0]) for (; !this.isEof() && "=" !== this.nextCharacter().value; ) ;
          }
          parse(t11) {
            var r11, n11, i10;
            for (this.consumeDimensions(); !this.isEof(); ) if ("{" !== (r11 = this.nextCharacter()).value || i10) {
              if ("}" !== r11.value || i10) '"' !== r11.value || r11.escaped ? "," !== r11.value || i10 ? this.record(r11.value) : this.newEntry() : (i10 && this.newEntry(true), i10 = !i10);
              else if (this.dimension--, !this.dimension && (this.newEntry(), t11)) return this.entries;
            } else this.dimension++, this.dimension > 1 && (n11 = new e11(this.source.substr(this.position - 1), this.transform), this.entries.push(n11.parse(true)), this.position += n11.position - 2);
            if (0 !== this.dimension) throw Error("array dimension not balanced");
            return this.entries;
          }
        };
        t7(t10, "ArrayParser");
        var r10 = t10;
        function n10(e11) {
          return e11;
        }
        t7(n10, "identity");
      }), rS = re((e10, t10) => {
        ru();
        var r10 = r_();
        t10.exports = { create: t7(function(e11, t11) {
          return { parse: t7(function() {
            return r10.parse(e11, t11);
          }, "parse") };
        }, "create") };
      }), rE = re((e10, t10) => {
        ru();
        var r10 = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, n10 = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, i10 = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, s10 = /^-?infinity$/;
        function a10(e11) {
          var t11 = n10.exec(e11);
          if (t11) {
            var r11 = parseInt(t11[1], 10);
            t11[4] && (r11 = l2(r11));
            var i11 = new Date(r11, parseInt(t11[2], 10) - 1, t11[3]);
            return u2(r11) && i11.setFullYear(r11), i11;
          }
        }
        function o10(e11) {
          if (e11.endsWith("+00")) return 0;
          var t11 = i10.exec(e11.split(" ")[1]);
          if (t11) {
            var r11 = t11[1];
            return "Z" === r11 ? 0 : (3600 * parseInt(t11[2], 10) + 60 * parseInt(t11[3] || 0, 10) + parseInt(t11[4] || 0, 10)) * ("-" === r11 ? -1 : 1) * 1e3;
          }
        }
        function l2(e11) {
          return -(e11 - 1);
        }
        function u2(e11) {
          return e11 >= 0 && e11 < 100;
        }
        t10.exports = t7(function(e11) {
          if (s10.test(e11)) return Number(e11.replace("i", "I"));
          var t11 = r10.exec(e11);
          if (!t11) return a10(e11) || null;
          var n11 = !!t11[8], i11 = parseInt(t11[1], 10);
          n11 && (i11 = l2(i11));
          var c2 = parseInt(t11[2], 10) - 1, h2 = t11[3], d2 = parseInt(t11[4], 10), f2 = parseInt(t11[5], 10), p2 = parseInt(t11[6], 10), g2 = t11[7];
          g2 = g2 ? 1e3 * parseFloat(g2) : 0;
          var m2, y2 = o10(e11);
          return null != y2 ? (m2 = new Date(Date.UTC(i11, c2, h2, d2, f2, p2, g2)), u2(i11) && m2.setUTCFullYear(i11), 0 !== y2 && m2.setTime(m2.getTime() - y2)) : (m2 = new Date(i11, c2, h2, d2, f2, p2, g2), u2(i11) && m2.setFullYear(i11)), m2;
        }, "parseDate"), t7(a10, "getDate"), t7(o10, "timeZoneOffset"), t7(l2, "bcYearToNegativeYear"), t7(u2, "is0To99");
      }), rx = re((e10, t10) => {
        ru(), t10.exports = n10;
        var r10 = Object.prototype.hasOwnProperty;
        function n10(e11) {
          for (var t11 = 1; t11 < arguments.length; t11++) {
            var n11 = arguments[t11];
            for (var i10 in n11) r10.call(n11, i10) && (e11[i10] = n11[i10]);
          }
          return e11;
        }
        t7(n10, "extend");
      }), rT = re((e10, t10) => {
        ru();
        var r10 = rx();
        function n10(e11) {
          if (!(this instanceof n10)) return new n10(e11);
          r10(this, f2(e11));
        }
        t10.exports = n10, t7(n10, "PostgresInterval");
        var i10 = ["seconds", "minutes", "hours", "days", "months", "years"];
        n10.prototype.toPostgres = function() {
          var e11 = i10.filter(this.hasOwnProperty, this);
          return this.milliseconds && 0 > e11.indexOf("seconds") && e11.push("seconds"), 0 === e11.length ? "0" : e11.map(function(e12) {
            var t11 = this[e12] || 0;
            return "seconds" === e12 && this.milliseconds && (t11 = (t11 + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "")), t11 + " " + e12;
          }, this).join(" ");
        };
        var s10 = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, a10 = ["years", "months", "days"], o10 = ["hours", "minutes", "seconds"];
        n10.prototype.toISOString = n10.prototype.toISO = function() {
          return "P" + a10.map(e11, this).join("") + "T" + o10.map(e11, this).join("");
          function e11(e12) {
            var t11 = this[e12] || 0;
            return "seconds" === e12 && this.milliseconds && (t11 = (t11 + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "")), t11 + s10[e12];
          }
        };
        var l2 = "([+-]?\\d+)", u2 = new RegExp([l2 + "\\s+years?", l2 + "\\s+mons?", l2 + "\\s+days?", "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?"].map(function(e11) {
          return "(" + e11 + ")?";
        }).join("\\s*")), c2 = { years: 2, months: 4, days: 6, hours: 9, minutes: 10, seconds: 11, milliseconds: 12 }, h2 = ["hours", "minutes", "seconds", "milliseconds"];
        function d2(e11) {
          return parseInt(e11 + "000000".slice(e11.length), 10) / 1e3;
        }
        function f2(e11) {
          if (!e11) return {};
          var t11 = u2.exec(e11), r11 = "-" === t11[8];
          return Object.keys(c2).reduce(function(e12, n11) {
            var i11 = t11[c2[n11]];
            return i11 && (i11 = "milliseconds" === n11 ? d2(i11) : parseInt(i11, 10)) && (r11 && ~h2.indexOf(n11) && (i11 *= -1), e12[n11] = i11), e12;
          }, {});
        }
        t7(d2, "parseMilliseconds"), t7(f2, "parse");
      }), rC = re((e10, t10) => {
        ru(), t10.exports = t7(function(e11) {
          if (/^\\x/.test(e11)) return new t0(e11.substr(2), "hex");
          for (var t11 = "", r10 = 0; r10 < e11.length; ) if ("\\" !== e11[r10]) t11 += e11[r10], ++r10;
          else if (/[0-7]{3}/.test(e11.substr(r10 + 1, 3))) t11 += String.fromCharCode(parseInt(e11.substr(r10 + 1, 3), 8)), r10 += 4;
          else {
            for (var n10 = 1; r10 + n10 < e11.length && "\\" === e11[r10 + n10]; ) n10++;
            for (var i10 = 0; i10 < Math.floor(n10 / 2); ++i10) t11 += "\\";
            r10 += 2 * Math.floor(n10 / 2);
          }
          return new t0(t11, "binary");
        }, "parseBytea");
      }), rP = re((e10, t10) => {
        ru();
        var r10 = r_(), n10 = rS(), i10 = rE(), s10 = rT(), a10 = rC();
        function o10(e11) {
          return t7(function(t11) {
            return null === t11 ? t11 : e11(t11);
          }, "nullAllowed");
        }
        function l2(e11) {
          return null === e11 ? e11 : "TRUE" === e11 || "t" === e11 || "true" === e11 || "y" === e11 || "yes" === e11 || "on" === e11 || "1" === e11;
        }
        function u2(e11) {
          return e11 ? r10.parse(e11, l2) : null;
        }
        function c2(e11) {
          return parseInt(e11, 10);
        }
        function h2(e11) {
          return e11 ? r10.parse(e11, o10(c2)) : null;
        }
        function d2(e11) {
          return e11 ? r10.parse(e11, o10(function(e12) {
            return w2(e12).trim();
          })) : null;
        }
        t7(o10, "allowNull"), t7(l2, "parseBool"), t7(u2, "parseBoolArray"), t7(c2, "parseBaseTenInt"), t7(h2, "parseIntegerArray"), t7(d2, "parseBigIntegerArray");
        var f2 = t7(function(e11) {
          return e11 ? n10.create(e11, function(e12) {
            return null !== e12 && (e12 = S2(e12)), e12;
          }).parse() : null;
        }, "parsePointArray"), p2 = t7(function(e11) {
          return e11 ? n10.create(e11, function(e12) {
            return null !== e12 && (e12 = parseFloat(e12)), e12;
          }).parse() : null;
        }, "parseFloatArray"), g2 = t7(function(e11) {
          return e11 ? n10.create(e11).parse() : null;
        }, "parseStringArray"), m2 = t7(function(e11) {
          return e11 ? n10.create(e11, function(e12) {
            return null !== e12 && (e12 = i10(e12)), e12;
          }).parse() : null;
        }, "parseDateArray"), y2 = t7(function(e11) {
          return e11 ? n10.create(e11, function(e12) {
            return null !== e12 && (e12 = s10(e12)), e12;
          }).parse() : null;
        }, "parseIntervalArray"), b2 = t7(function(e11) {
          return e11 ? r10.parse(e11, o10(a10)) : null;
        }, "parseByteAArray"), v2 = t7(function(e11) {
          return parseInt(e11, 10);
        }, "parseInteger"), w2 = t7(function(e11) {
          var t11 = String(e11);
          return /^\d+$/.test(t11) ? t11 : e11;
        }, "parseBigInteger"), _2 = t7(function(e11) {
          return e11 ? r10.parse(e11, o10(JSON.parse)) : null;
        }, "parseJsonArray"), S2 = t7(function(e11) {
          return "(" !== e11[0] ? null : { x: parseFloat((e11 = e11.substring(1, e11.length - 1).split(","))[0]), y: parseFloat(e11[1]) };
        }, "parsePoint"), E2 = t7(function(e11) {
          if ("<" !== e11[0] && "(" !== e11[1]) return null;
          for (var t11 = "(", r11 = "", n11 = false, i11 = 2; i11 < e11.length - 1; i11++) {
            if (n11 || (t11 += e11[i11]), ")" === e11[i11]) {
              n11 = true;
              continue;
            }
            n11 && "," !== e11[i11] && (r11 += e11[i11]);
          }
          var s11 = S2(t11);
          return s11.radius = parseFloat(r11), s11;
        }, "parseCircle");
        t10.exports = { init: t7(function(e11) {
          e11(20, w2), e11(21, v2), e11(23, v2), e11(26, v2), e11(700, parseFloat), e11(701, parseFloat), e11(16, l2), e11(1082, i10), e11(1114, i10), e11(1184, i10), e11(600, S2), e11(651, g2), e11(718, E2), e11(1e3, u2), e11(1001, b2), e11(1005, h2), e11(1007, h2), e11(1028, h2), e11(1016, d2), e11(1017, f2), e11(1021, p2), e11(1022, p2), e11(1231, p2), e11(1014, g2), e11(1015, g2), e11(1008, g2), e11(1009, g2), e11(1040, g2), e11(1041, g2), e11(1115, m2), e11(1182, m2), e11(1185, m2), e11(1186, s10), e11(1187, y2), e11(17, a10), e11(114, JSON.parse.bind(JSON)), e11(3802, JSON.parse.bind(JSON)), e11(199, _2), e11(3807, _2), e11(3907, g2), e11(2951, g2), e11(791, g2), e11(1183, g2), e11(1270, g2);
        }, "init") };
      }), rA = re((e10, t10) => {
        function r10(e11) {
          var t11 = e11.readInt32BE(0), r11 = e11.readUInt32BE(4), n10 = "";
          t11 < 0 && (t11 = ~t11 + (0 === r11), r11 = ~r11 + 1 >>> 0, n10 = "-");
          var i10, s10, a10, o10, l2, u2, c2 = "";
          if (i10 = t11 % 1e6, t11 = t11 / 1e6 >>> 0, r11 = (s10 = 4294967296 * i10 + r11) / 1e6 >>> 0, a10 = "" + (s10 - 1e6 * r11), 0 === r11 && 0 === t11) return n10 + a10 + c2;
          for (o10 = "", l2 = 6 - a10.length, u2 = 0; u2 < l2; u2++) o10 += "0";
          if (c2 = o10 + a10 + c2, i10 = t11 % 1e6, t11 = t11 / 1e6 >>> 0, r11 = (s10 = 4294967296 * i10 + r11) / 1e6 >>> 0, a10 = "" + (s10 - 1e6 * r11), 0 === r11 && 0 === t11) return n10 + a10 + c2;
          for (o10 = "", l2 = 6 - a10.length, u2 = 0; u2 < l2; u2++) o10 += "0";
          if (c2 = o10 + a10 + c2, i10 = t11 % 1e6, t11 = t11 / 1e6 >>> 0, r11 = (s10 = 4294967296 * i10 + r11) / 1e6 >>> 0, a10 = "" + (s10 - 1e6 * r11), 0 === r11 && 0 === t11) return n10 + a10 + c2;
          for (o10 = "", l2 = 6 - a10.length, u2 = 0; u2 < l2; u2++) o10 += "0";
          return c2 = o10 + a10 + c2, n10 + (a10 = "" + (s10 = 4294967296 * (i10 = t11 % 1e6) + r11) % 1e6) + c2;
        }
        ru(), t7(r10, "readInt8"), t10.exports = r10;
      }), rR = re((e10, t10) => {
        ru();
        var r10 = rA(), n10 = t7(function(e11, t11, r11, n11, i11) {
          r11 = r11 || 0, n11 = n11 || false, i11 = i11 || function(e12, t12, r12) {
            return e12 * Math.pow(2, r12) + t12;
          };
          var s11 = r11 >> 3, a11 = t7(function(e12) {
            return n11 ? 255 & ~e12 : e12;
          }, "inv"), o11 = 255, l3 = 8 - r11 % 8;
          t11 < l3 && (o11 = 255 << 8 - t11 & 255, l3 = t11), r11 && (o11 >>= r11 % 8);
          var u3 = 0;
          r11 % 8 + t11 >= 8 && (u3 = i11(0, a11(e11[s11]) & o11, l3));
          for (var c3 = t11 + r11 >> 3, h3 = s11 + 1; h3 < c3; h3++) u3 = i11(u3, a11(e11[h3]), 8);
          var d3 = (t11 + r11) % 8;
          return d3 > 0 && (u3 = i11(u3, a11(e11[c3]) >> 8 - d3, d3)), u3;
        }, "parseBits"), i10 = t7(function(e11, t11, r11) {
          var i11 = Math.pow(2, r11 - 1) - 1, s11 = n10(e11, 1), a11 = n10(e11, r11, 1);
          if (0 === a11) return 0;
          var o11 = 1, l3 = n10(e11, t11, r11 + 1, false, t7(function(e12, t12, r12) {
            0 === e12 && (e12 = 1);
            for (var n11 = 1; n11 <= r12; n11++) o11 /= 2, (t12 & 1 << r12 - n11) > 0 && (e12 += o11);
            return e12;
          }, "parsePrecisionBits"));
          return a11 == Math.pow(2, r11 + 1) - 1 ? 0 === l3 ? 0 === s11 ? 1 / 0 : -1 / 0 : NaN : (0 === s11 ? 1 : -1) * Math.pow(2, a11 - i11) * l3;
        }, "parseFloatFromBits"), s10 = t7(function(e11) {
          return 1 == n10(e11, 1) ? -1 * (n10(e11, 15, 1, true) + 1) : n10(e11, 15, 1);
        }, "parseInt16"), a10 = t7(function(e11) {
          return 1 == n10(e11, 1) ? -1 * (n10(e11, 31, 1, true) + 1) : n10(e11, 31, 1);
        }, "parseInt32"), o10 = t7(function(e11) {
          return i10(e11, 23, 8);
        }, "parseFloat32"), l2 = t7(function(e11) {
          return i10(e11, 52, 11);
        }, "parseFloat64"), u2 = t7(function(e11) {
          var t11 = n10(e11, 16, 32);
          if (49152 == t11) return NaN;
          for (var r11 = Math.pow(1e4, n10(e11, 16, 16)), i11 = 0, s11 = n10(e11, 16), a11 = 0; a11 < s11; a11++) i11 += n10(e11, 16, 64 + 16 * a11) * r11, r11 /= 1e4;
          var o11 = Math.pow(10, n10(e11, 16, 48));
          return (0 === t11 ? 1 : -1) * Math.round(i11 * o11) / o11;
        }, "parseNumeric"), c2 = t7(function(e11, t11) {
          var r11 = n10(t11, 1), i11 = n10(t11, 63, 1), s11 = new Date((0 === r11 ? 1 : -1) * i11 / 1e3 + 9466848e5);
          return e11 || s11.setTime(s11.getTime() + 6e4 * s11.getTimezoneOffset()), s11.usec = i11 % 1e3, s11.getMicroSeconds = function() {
            return this.usec;
          }, s11.setMicroSeconds = function(e12) {
            this.usec = e12;
          }, s11.getUTCMicroSeconds = function() {
            return this.usec;
          }, s11;
        }, "parseDate"), h2 = t7(function(e11) {
          for (var t11 = n10(e11, 32), r11 = (n10(e11, 32, 32), n10(e11, 32, 64)), i11 = 96, s11 = [], a11 = 0; a11 < t11; a11++) s11[a11] = n10(e11, 32, i11), i11 += 64;
          var o11 = t7(function(t12) {
            var r12, s12 = n10(e11, 32, i11);
            return (i11 += 32, 4294967295 == s12) ? null : 23 == t12 || 20 == t12 ? (r12 = n10(e11, 8 * s12, i11), i11 += 8 * s12, r12) : 25 == t12 ? e11.toString(this.encoding, i11 >> 3, (i11 += s12 << 3) >> 3) : void console.log("ERROR: ElementType not implemented: " + t12);
          }, "parseElement"), l3 = t7(function(e12, t12) {
            var r12, n11 = [];
            if (e12.length > 1) {
              var i12 = e12.shift();
              for (r12 = 0; r12 < i12; r12++) n11[r12] = l3(e12, t12);
              e12.unshift(i12);
            } else for (r12 = 0; r12 < e12[0]; r12++) n11[r12] = o11(t12);
            return n11;
          }, "parse");
          return l3(s11, r11);
        }, "parseArray"), d2 = t7(function(e11) {
          return e11.toString("utf8");
        }, "parseText"), f2 = t7(function(e11) {
          return null === e11 ? null : n10(e11, 8) > 0;
        }, "parseBool");
        t10.exports = { init: t7(function(e11) {
          e11(20, r10), e11(21, s10), e11(23, a10), e11(26, a10), e11(1700, u2), e11(700, o10), e11(701, l2), e11(16, f2), e11(1114, c2.bind(null, false)), e11(1184, c2.bind(null, true)), e11(1e3, h2), e11(1007, h2), e11(1016, h2), e11(1008, h2), e11(1009, h2), e11(25, d2);
        }, "init") };
      }), rN = re((e10, t10) => {
        ru(), t10.exports = { BOOL: 16, BYTEA: 17, CHAR: 18, INT8: 20, INT2: 21, INT4: 23, REGPROC: 24, TEXT: 25, OID: 26, TID: 27, XID: 28, CID: 29, JSON: 114, XML: 142, PG_NODE_TREE: 194, SMGR: 210, PATH: 602, POLYGON: 604, CIDR: 650, FLOAT4: 700, FLOAT8: 701, ABSTIME: 702, RELTIME: 703, TINTERVAL: 704, CIRCLE: 718, MACADDR8: 774, MONEY: 790, MACADDR: 829, INET: 869, ACLITEM: 1033, BPCHAR: 1042, VARCHAR: 1043, DATE: 1082, TIME: 1083, TIMESTAMP: 1114, TIMESTAMPTZ: 1184, INTERVAL: 1186, TIMETZ: 1266, BIT: 1560, VARBIT: 1562, NUMERIC: 1700, REFCURSOR: 1790, REGPROCEDURE: 2202, REGOPER: 2203, REGOPERATOR: 2204, REGCLASS: 2205, REGTYPE: 2206, UUID: 2950, TXID_SNAPSHOT: 2970, PG_LSN: 3220, PG_NDISTINCT: 3361, PG_DEPENDENCIES: 3402, TSVECTOR: 3614, TSQUERY: 3615, GTSVECTOR: 3642, REGCONFIG: 3734, REGDICTIONARY: 3769, JSONB: 3802, REGNAMESPACE: 4089, REGROLE: 4096 };
      }), rO = re((e10) => {
        ru();
        var t10 = rP(), r10 = rR(), n10 = rS(), i10 = rN();
        e10.getTypeParser = o10, e10.setTypeParser = l2, e10.arrayParser = n10, e10.builtins = i10;
        var s10 = { text: {}, binary: {} };
        function a10(e11) {
          return String(e11);
        }
        function o10(e11, t11) {
          return s10[t11 = t11 || "text"] && s10[t11][e11] || a10;
        }
        function l2(e11, t11, r11) {
          "function" == typeof t11 && (r11 = t11, t11 = "text"), s10[t11][e11] = r11;
        }
        t7(a10, "noParse"), t7(o10, "getTypeParser"), t7(l2, "setTypeParser"), t10.init(function(e11, t11) {
          s10.text[e11] = t11;
        }), r10.init(function(e11, t11) {
          s10.binary[e11] = t11;
        });
      }), rI = re((e10, t10) => {
        ru();
        var r10 = rO();
        function n10(e11) {
          this._types = e11 || r10, this.text = {}, this.binary = {};
        }
        t7(n10, "TypeOverrides"), n10.prototype.getOverrides = function(e11) {
          switch (e11) {
            case "text":
              return this.text;
            case "binary":
              return this.binary;
            default:
              return {};
          }
        }, n10.prototype.setTypeParser = function(e11, t11, r11) {
          "function" == typeof t11 && (r11 = t11, t11 = "text"), this.getOverrides(t11)[e11] = r11;
        }, n10.prototype.getTypeParser = function(e11, t11) {
          return t11 = t11 || "text", this.getOverrides(t11)[e11] || this._types.getTypeParser(e11, t11);
        }, t10.exports = n10;
      });
      function rk(e10) {
        let t10 = 1779033703, r10 = 3144134277, n10 = 1013904242, i10 = 2773480762, s10 = 1359893119, a10 = 2600822924, o10 = 528734635, l2 = 1541459225, u2 = 0, c2 = 0, h2 = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], d2 = t7((e11, t11) => e11 >>> t11 | e11 << 32 - t11, "rrot"), f2 = new Uint32Array(64), p2 = new Uint8Array(64), g2 = t7(() => {
          for (let e12 = 0, t11 = 0; e12 < 16; e12++, t11 += 4) f2[e12] = p2[t11] << 24 | p2[t11 + 1] << 16 | p2[t11 + 2] << 8 | p2[t11 + 3];
          for (let e12 = 16; e12 < 64; e12++) {
            let t11 = d2(f2[e12 - 15], 7) ^ d2(f2[e12 - 15], 18) ^ f2[e12 - 15] >>> 3, r11 = d2(f2[e12 - 2], 17) ^ d2(f2[e12 - 2], 19) ^ f2[e12 - 2] >>> 10;
            f2[e12] = f2[e12 - 16] + t11 + f2[e12 - 7] + r11 | 0;
          }
          let e11 = t10, u3 = r10, g3 = n10, m3 = i10, y3 = s10, b2 = a10, v2 = o10, w2 = l2;
          for (let t11 = 0; t11 < 64; t11++) {
            let r11 = w2 + (d2(y3, 6) ^ d2(y3, 11) ^ d2(y3, 25)) + (y3 & b2 ^ ~y3 & v2) + h2[t11] + f2[t11] | 0, n11 = (d2(e11, 2) ^ d2(e11, 13) ^ d2(e11, 22)) + (e11 & u3 ^ e11 & g3 ^ u3 & g3) | 0;
            w2 = v2, v2 = b2, b2 = y3, y3 = m3 + r11 | 0, m3 = g3, g3 = u3, u3 = e11, e11 = r11 + n11 | 0;
          }
          t10 = t10 + e11 | 0, r10 = r10 + u3 | 0, n10 = n10 + g3 | 0, i10 = i10 + m3 | 0, s10 = s10 + y3 | 0, a10 = a10 + b2 | 0, o10 = o10 + v2 | 0, l2 = l2 + w2 | 0, c2 = 0;
        }, "process"), m2 = t7((e11) => {
          "string" == typeof e11 && (e11 = new TextEncoder().encode(e11));
          for (let t11 = 0; t11 < e11.length; t11++) p2[c2++] = e11[t11], 64 === c2 && g2();
          u2 += e11.length;
        }, "add"), y2 = t7(() => {
          if (p2[c2++] = 128, 64 == c2 && g2(), c2 + 8 > 64) {
            for (; c2 < 64; ) p2[c2++] = 0;
            g2();
          }
          for (; c2 < 58; ) p2[c2++] = 0;
          let e11 = 8 * u2;
          p2[c2++] = e11 / 1099511627776 & 255, p2[c2++] = e11 / 4294967296 & 255, p2[c2++] = e11 >>> 24, p2[c2++] = e11 >>> 16 & 255, p2[c2++] = e11 >>> 8 & 255, p2[c2++] = 255 & e11, g2();
          let h3 = new Uint8Array(32);
          return h3[0] = t10 >>> 24, h3[1] = t10 >>> 16 & 255, h3[2] = t10 >>> 8 & 255, h3[3] = 255 & t10, h3[4] = r10 >>> 24, h3[5] = r10 >>> 16 & 255, h3[6] = r10 >>> 8 & 255, h3[7] = 255 & r10, h3[8] = n10 >>> 24, h3[9] = n10 >>> 16 & 255, h3[10] = n10 >>> 8 & 255, h3[11] = 255 & n10, h3[12] = i10 >>> 24, h3[13] = i10 >>> 16 & 255, h3[14] = i10 >>> 8 & 255, h3[15] = 255 & i10, h3[16] = s10 >>> 24, h3[17] = s10 >>> 16 & 255, h3[18] = s10 >>> 8 & 255, h3[19] = 255 & s10, h3[20] = a10 >>> 24, h3[21] = a10 >>> 16 & 255, h3[22] = a10 >>> 8 & 255, h3[23] = 255 & a10, h3[24] = o10 >>> 24, h3[25] = o10 >>> 16 & 255, h3[26] = o10 >>> 8 & 255, h3[27] = 255 & o10, h3[28] = l2 >>> 24, h3[29] = l2 >>> 16 & 255, h3[30] = l2 >>> 8 & 255, h3[31] = 255 & l2, h3;
        }, "digest");
        return void 0 === e10 ? { add: m2, digest: y2 } : (m2(e10), y2());
      }
      var rD, rL, rM = t9(() => {
        ru(), t7(rk, "sha256");
      }), rB = t9(() => {
        ru(), t7(rD = class e10 {
          constructor() {
            rs(this, "_dataLength", 0), rs(this, "_bufferLength", 0), rs(this, "_state", new Int32Array(4)), rs(this, "_buffer", new ArrayBuffer(68)), rs(this, "_buffer8"), rs(this, "_buffer32"), this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
          }
          static hashByteArray(e11, t10 = false) {
            return this.onePassHasher.start().appendByteArray(e11).end(t10);
          }
          static hashStr(e11, t10 = false) {
            return this.onePassHasher.start().appendStr(e11).end(t10);
          }
          static hashAsciiStr(e11, t10 = false) {
            return this.onePassHasher.start().appendAsciiStr(e11).end(t10);
          }
          static _hex(t10) {
            let r10 = e10.hexChars, n10 = e10.hexOut, i10, s10, a10, o10;
            for (o10 = 0; o10 < 4; o10 += 1) for (s10 = 8 * o10, i10 = t10[o10], a10 = 0; a10 < 8; a10 += 2) n10[s10 + 1 + a10] = r10.charAt(15 & i10), i10 >>>= 4, n10[s10 + 0 + a10] = r10.charAt(15 & i10), i10 >>>= 4;
            return n10.join("");
          }
          static _md5cycle(e11, t10) {
            let r10 = e11[0], n10 = e11[1], i10 = e11[2], s10 = e11[3];
            r10 += (n10 & i10 | ~n10 & s10) + t10[0] - 680876936 | 0, s10 += ((r10 = (r10 << 7 | r10 >>> 25) + n10 | 0) & n10 | ~r10 & i10) + t10[1] - 389564586 | 0, i10 += ((s10 = (s10 << 12 | s10 >>> 20) + r10 | 0) & r10 | ~s10 & n10) + t10[2] + 606105819 | 0, n10 += ((i10 = (i10 << 17 | i10 >>> 15) + s10 | 0) & s10 | ~i10 & r10) + t10[3] - 1044525330 | 0, r10 += ((n10 = (n10 << 22 | n10 >>> 10) + i10 | 0) & i10 | ~n10 & s10) + t10[4] - 176418897 | 0, s10 += ((r10 = (r10 << 7 | r10 >>> 25) + n10 | 0) & n10 | ~r10 & i10) + t10[5] + 1200080426 | 0, i10 += ((s10 = (s10 << 12 | s10 >>> 20) + r10 | 0) & r10 | ~s10 & n10) + t10[6] - 1473231341 | 0, n10 += ((i10 = (i10 << 17 | i10 >>> 15) + s10 | 0) & s10 | ~i10 & r10) + t10[7] - 45705983 | 0, r10 += ((n10 = (n10 << 22 | n10 >>> 10) + i10 | 0) & i10 | ~n10 & s10) + t10[8] + 1770035416 | 0, s10 += ((r10 = (r10 << 7 | r10 >>> 25) + n10 | 0) & n10 | ~r10 & i10) + t10[9] - 1958414417 | 0, i10 += ((s10 = (s10 << 12 | s10 >>> 20) + r10 | 0) & r10 | ~s10 & n10) + t10[10] - 42063 | 0, n10 += ((i10 = (i10 << 17 | i10 >>> 15) + s10 | 0) & s10 | ~i10 & r10) + t10[11] - 1990404162 | 0, r10 += ((n10 = (n10 << 22 | n10 >>> 10) + i10 | 0) & i10 | ~n10 & s10) + t10[12] + 1804603682 | 0, s10 += ((r10 = (r10 << 7 | r10 >>> 25) + n10 | 0) & n10 | ~r10 & i10) + t10[13] - 40341101 | 0, i10 += ((s10 = (s10 << 12 | s10 >>> 20) + r10 | 0) & r10 | ~s10 & n10) + t10[14] - 1502002290 | 0, n10 += ((i10 = (i10 << 17 | i10 >>> 15) + s10 | 0) & s10 | ~i10 & r10) + t10[15] + 1236535329 | 0, r10 += ((n10 = (n10 << 22 | n10 >>> 10) + i10 | 0) & s10 | i10 & ~s10) + t10[1] - 165796510 | 0, s10 += ((r10 = (r10 << 5 | r10 >>> 27) + n10 | 0) & i10 | n10 & ~i10) + t10[6] - 1069501632 | 0, i10 += ((s10 = (s10 << 9 | s10 >>> 23) + r10 | 0) & n10 | r10 & ~n10) + t10[11] + 643717713 | 0, n10 += ((i10 = (i10 << 14 | i10 >>> 18) + s10 | 0) & r10 | s10 & ~r10) + t10[0] - 373897302 | 0, r10 += ((n10 = (n10 << 20 | n10 >>> 12) + i10 | 0) & s10 | i10 & ~s10) + t10[5] - 701558691 | 0, s10 += ((r10 = (r10 << 5 | r10 >>> 27) + n10 | 0) & i10 | n10 & ~i10) + t10[10] + 38016083 | 0, i10 += ((s10 = (s10 << 9 | s10 >>> 23) + r10 | 0) & n10 | r10 & ~n10) + t10[15] - 660478335 | 0, n10 += ((i10 = (i10 << 14 | i10 >>> 18) + s10 | 0) & r10 | s10 & ~r10) + t10[4] - 405537848 | 0, r10 += ((n10 = (n10 << 20 | n10 >>> 12) + i10 | 0) & s10 | i10 & ~s10) + t10[9] + 568446438 | 0, s10 += ((r10 = (r10 << 5 | r10 >>> 27) + n10 | 0) & i10 | n10 & ~i10) + t10[14] - 1019803690 | 0, i10 += ((s10 = (s10 << 9 | s10 >>> 23) + r10 | 0) & n10 | r10 & ~n10) + t10[3] - 187363961 | 0, n10 += ((i10 = (i10 << 14 | i10 >>> 18) + s10 | 0) & r10 | s10 & ~r10) + t10[8] + 1163531501 | 0, r10 += ((n10 = (n10 << 20 | n10 >>> 12) + i10 | 0) & s10 | i10 & ~s10) + t10[13] - 1444681467 | 0, s10 += ((r10 = (r10 << 5 | r10 >>> 27) + n10 | 0) & i10 | n10 & ~i10) + t10[2] - 51403784 | 0, i10 += ((s10 = (s10 << 9 | s10 >>> 23) + r10 | 0) & n10 | r10 & ~n10) + t10[7] + 1735328473 | 0, n10 += ((i10 = (i10 << 14 | i10 >>> 18) + s10 | 0) & r10 | s10 & ~r10) + t10[12] - 1926607734 | 0, r10 += ((n10 = (n10 << 20 | n10 >>> 12) + i10 | 0) ^ i10 ^ s10) + t10[5] - 378558 | 0, s10 += ((r10 = (r10 << 4 | r10 >>> 28) + n10 | 0) ^ n10 ^ i10) + t10[8] - 2022574463 | 0, i10 += ((s10 = (s10 << 11 | s10 >>> 21) + r10 | 0) ^ r10 ^ n10) + t10[11] + 1839030562 | 0, n10 += ((i10 = (i10 << 16 | i10 >>> 16) + s10 | 0) ^ s10 ^ r10) + t10[14] - 35309556 | 0, r10 += ((n10 = (n10 << 23 | n10 >>> 9) + i10 | 0) ^ i10 ^ s10) + t10[1] - 1530992060 | 0, s10 += ((r10 = (r10 << 4 | r10 >>> 28) + n10 | 0) ^ n10 ^ i10) + t10[4] + 1272893353 | 0, i10 += ((s10 = (s10 << 11 | s10 >>> 21) + r10 | 0) ^ r10 ^ n10) + t10[7] - 155497632 | 0, n10 += ((i10 = (i10 << 16 | i10 >>> 16) + s10 | 0) ^ s10 ^ r10) + t10[10] - 1094730640 | 0, r10 += ((n10 = (n10 << 23 | n10 >>> 9) + i10 | 0) ^ i10 ^ s10) + t10[13] + 681279174 | 0, s10 += ((r10 = (r10 << 4 | r10 >>> 28) + n10 | 0) ^ n10 ^ i10) + t10[0] - 358537222 | 0, i10 += ((s10 = (s10 << 11 | s10 >>> 21) + r10 | 0) ^ r10 ^ n10) + t10[3] - 722521979 | 0, n10 += ((i10 = (i10 << 16 | i10 >>> 16) + s10 | 0) ^ s10 ^ r10) + t10[6] + 76029189 | 0, r10 += ((n10 = (n10 << 23 | n10 >>> 9) + i10 | 0) ^ i10 ^ s10) + t10[9] - 640364487 | 0, s10 += ((r10 = (r10 << 4 | r10 >>> 28) + n10 | 0) ^ n10 ^ i10) + t10[12] - 421815835 | 0, i10 += ((s10 = (s10 << 11 | s10 >>> 21) + r10 | 0) ^ r10 ^ n10) + t10[15] + 530742520 | 0, n10 += ((i10 = (i10 << 16 | i10 >>> 16) + s10 | 0) ^ s10 ^ r10) + t10[2] - 995338651 | 0, n10 = (n10 << 23 | n10 >>> 9) + i10 | 0, r10 += (i10 ^ (n10 | ~s10)) + t10[0] - 198630844 | 0, r10 = (r10 << 6 | r10 >>> 26) + n10 | 0, s10 += (n10 ^ (r10 | ~i10)) + t10[7] + 1126891415 | 0, s10 = (s10 << 10 | s10 >>> 22) + r10 | 0, i10 += (r10 ^ (s10 | ~n10)) + t10[14] - 1416354905 | 0, i10 = (i10 << 15 | i10 >>> 17) + s10 | 0, n10 += (s10 ^ (i10 | ~r10)) + t10[5] - 57434055 | 0, n10 = (n10 << 21 | n10 >>> 11) + i10 | 0, r10 += (i10 ^ (n10 | ~s10)) + t10[12] + 1700485571 | 0, r10 = (r10 << 6 | r10 >>> 26) + n10 | 0, s10 += (n10 ^ (r10 | ~i10)) + t10[3] - 1894986606 | 0, s10 = (s10 << 10 | s10 >>> 22) + r10 | 0, i10 += (r10 ^ (s10 | ~n10)) + t10[10] - 1051523 | 0, i10 = (i10 << 15 | i10 >>> 17) + s10 | 0, n10 += (s10 ^ (i10 | ~r10)) + t10[1] - 2054922799 | 0, n10 = (n10 << 21 | n10 >>> 11) + i10 | 0, r10 += (i10 ^ (n10 | ~s10)) + t10[8] + 1873313359 | 0, r10 = (r10 << 6 | r10 >>> 26) + n10 | 0, s10 += (n10 ^ (r10 | ~i10)) + t10[15] - 30611744 | 0, s10 = (s10 << 10 | s10 >>> 22) + r10 | 0, i10 += (r10 ^ (s10 | ~n10)) + t10[6] - 1560198380 | 0, i10 = (i10 << 15 | i10 >>> 17) + s10 | 0, n10 += (s10 ^ (i10 | ~r10)) + t10[13] + 1309151649 | 0, n10 = (n10 << 21 | n10 >>> 11) + i10 | 0, r10 += (i10 ^ (n10 | ~s10)) + t10[4] - 145523070 | 0, r10 = (r10 << 6 | r10 >>> 26) + n10 | 0, s10 += (n10 ^ (r10 | ~i10)) + t10[11] - 1120210379 | 0, s10 = (s10 << 10 | s10 >>> 22) + r10 | 0, i10 += (r10 ^ (s10 | ~n10)) + t10[2] + 718787259 | 0, i10 = (i10 << 15 | i10 >>> 17) + s10 | 0, n10 += (s10 ^ (i10 | ~r10)) + t10[9] - 343485551 | 0, n10 = (n10 << 21 | n10 >>> 11) + i10 | 0, e11[0] = r10 + e11[0] | 0, e11[1] = n10 + e11[1] | 0, e11[2] = i10 + e11[2] | 0, e11[3] = s10 + e11[3] | 0;
          }
          start() {
            return this._dataLength = 0, this._bufferLength = 0, this._state.set(e10.stateIdentity), this;
          }
          appendStr(t10) {
            let r10 = this._buffer8, n10 = this._buffer32, i10 = this._bufferLength, s10, a10;
            for (a10 = 0; a10 < t10.length; a10 += 1) {
              if ((s10 = t10.charCodeAt(a10)) < 128) r10[i10++] = s10;
              else if (s10 < 2048) r10[i10++] = (s10 >>> 6) + 192, r10[i10++] = 63 & s10 | 128;
              else if (s10 < 55296 || s10 > 56319) r10[i10++] = (s10 >>> 12) + 224, r10[i10++] = s10 >>> 6 & 63 | 128, r10[i10++] = 63 & s10 | 128;
              else {
                if ((s10 = (s10 - 55296) * 1024 + (t10.charCodeAt(++a10) - 56320) + 65536) > 1114111) throw Error("Unicode standard supports code points up to U+10FFFF");
                r10[i10++] = (s10 >>> 18) + 240, r10[i10++] = s10 >>> 12 & 63 | 128, r10[i10++] = s10 >>> 6 & 63 | 128, r10[i10++] = 63 & s10 | 128;
              }
              i10 >= 64 && (this._dataLength += 64, e10._md5cycle(this._state, n10), i10 -= 64, n10[0] = n10[16]);
            }
            return this._bufferLength = i10, this;
          }
          appendAsciiStr(t10) {
            let r10 = this._buffer8, n10 = this._buffer32, i10 = this._bufferLength, s10, a10 = 0;
            for (; ; ) {
              for (s10 = Math.min(t10.length - a10, 64 - i10); s10--; ) r10[i10++] = t10.charCodeAt(a10++);
              if (i10 < 64) break;
              this._dataLength += 64, e10._md5cycle(this._state, n10), i10 = 0;
            }
            return this._bufferLength = i10, this;
          }
          appendByteArray(t10) {
            let r10 = this._buffer8, n10 = this._buffer32, i10 = this._bufferLength, s10, a10 = 0;
            for (; ; ) {
              for (s10 = Math.min(t10.length - a10, 64 - i10); s10--; ) r10[i10++] = t10[a10++];
              if (i10 < 64) break;
              this._dataLength += 64, e10._md5cycle(this._state, n10), i10 = 0;
            }
            return this._bufferLength = i10, this;
          }
          getState() {
            let e11 = this._state;
            return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e11[0], e11[1], e11[2], e11[3]] };
          }
          setState(e11) {
            let t10 = e11.buffer, r10 = e11.state, n10 = this._state, i10;
            for (this._dataLength = e11.length, this._bufferLength = e11.buflen, n10[0] = r10[0], n10[1] = r10[1], n10[2] = r10[2], n10[3] = r10[3], i10 = 0; i10 < t10.length; i10 += 1) this._buffer8[i10] = t10.charCodeAt(i10);
          }
          end(t10 = false) {
            let r10 = this._bufferLength, n10 = this._buffer8, i10 = this._buffer32, s10 = (r10 >> 2) + 1;
            this._dataLength += r10;
            let a10 = 8 * this._dataLength;
            if (n10[r10] = 128, n10[r10 + 1] = n10[r10 + 2] = n10[r10 + 3] = 0, i10.set(e10.buffer32Identity.subarray(s10), s10), r10 > 55 && (e10._md5cycle(this._state, i10), i10.set(e10.buffer32Identity)), a10 <= 4294967295) i10[14] = a10;
            else {
              let e11 = a10.toString(16).match(/(.*?)(.{0,8})$/);
              if (null === e11) return;
              let t11 = parseInt(e11[2], 16), r11 = parseInt(e11[1], 16) || 0;
              i10[14] = t11, i10[15] = r11;
            }
            return e10._md5cycle(this._state, i10), t10 ? this._state : e10._hex(this._state);
          }
        }, "Md5"), rs(rD, "stateIdentity", new Int32Array([1732584193, -271733879, -1732584194, 271733878])), rs(rD, "buffer32Identity", new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), rs(rD, "hexChars", "0123456789abcdef"), rs(rD, "hexOut", []), rs(rD, "onePassHasher", new rD()), rL = rD;
      }), r$ = {};
      function rj(e10) {
        return crypto.getRandomValues(t0.alloc(e10));
      }
      function rq(e10) {
        if ("sha256" === e10) return { update: t7(function(e11) {
          return { digest: t7(function() {
            return t0.from(rk(e11));
          }, "digest") };
        }, "update") };
        if ("md5" === e10) return { update: t7(function(e11) {
          return { digest: t7(function() {
            return "string" == typeof e11 ? rL.hashStr(e11) : rL.hashByteArray(e11);
          }, "digest") };
        }, "update") };
        throw Error(`Hash type '${e10}' not supported`);
      }
      function rF(e10, t10) {
        if ("sha256" !== e10) throw Error(`Only sha256 is supported (requested: '${e10}')`);
        return { update: t7(function(e11) {
          return { digest: t7(function() {
            "string" == typeof t10 && (t10 = new TextEncoder().encode(t10)), "string" == typeof e11 && (e11 = new TextEncoder().encode(e11));
            let r10 = t10.length;
            if (r10 > 64) t10 = rk(t10);
            else if (r10 < 64) {
              let e12 = new Uint8Array(64);
              e12.set(t10), t10 = e12;
            }
            let n10 = new Uint8Array(64), i10 = new Uint8Array(64);
            for (let e12 = 0; e12 < 64; e12++) n10[e12] = 54 ^ t10[e12], i10[e12] = 92 ^ t10[e12];
            let s10 = new Uint8Array(e11.length + 64);
            s10.set(n10, 0), s10.set(e11, 64);
            let a10 = new Uint8Array(96);
            return a10.set(i10, 0), a10.set(rk(s10), 64), t0.from(rk(a10));
          }, "digest") };
        }, "update") };
      }
      rt(r$, { createHash: () => rq, createHmac: () => rF, randomBytes: () => rj });
      var rU = t9(() => {
        ru(), rM(), rB(), t7(rj, "randomBytes"), t7(rq, "createHash"), t7(rF, "createHmac");
      }), rQ = re((e10, t10) => {
        ru(), t10.exports = { host: "localhost", user: "win32" === t1.platform ? t1.env.USERNAME : t1.env.USER, database: void 0, password: null, connectionString: void 0, port: 5432, rows: 0, binary: false, max: 10, idleTimeoutMillis: 3e4, client_encoding: "", ssl: false, application_name: void 0, fallback_application_name: void 0, options: void 0, parseInputDatesAsUTC: false, statement_timeout: false, lock_timeout: false, idle_in_transaction_session_timeout: false, query_timeout: false, connect_timeout: 0, keepalives: 1, keepalives_idle: 0 };
        var r10 = rO(), n10 = r10.getTypeParser(20, "text"), i10 = r10.getTypeParser(1016, "text");
        t10.exports.__defineSetter__("parseInt8", function(e11) {
          r10.setTypeParser(20, "text", e11 ? r10.getTypeParser(23, "text") : n10), r10.setTypeParser(1016, "text", e11 ? r10.getTypeParser(1007, "text") : i10);
        });
      }), rz = re((e10, t10) => {
        ru();
        var r10 = (rU(), ri(r$)), n10 = rQ();
        function i10(e11) {
          return '"' + e11.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
        }
        function s10(e11) {
          for (var t11 = "{", r11 = 0; r11 < e11.length; r11++) r11 > 0 && (t11 += ","), null === e11[r11] || typeof e11[r11] > "u" ? t11 += "NULL" : Array.isArray(e11[r11]) ? t11 += s10(e11[r11]) : e11[r11] instanceof t0 ? t11 += "\\\\x" + e11[r11].toString("hex") : t11 += i10(a10(e11[r11]));
          return t11 + "}";
        }
        t7(i10, "escapeElement"), t7(s10, "arrayString");
        var a10 = t7(function(e11, t11) {
          if (null == e11) return null;
          if (e11 instanceof t0) return e11;
          if (ArrayBuffer.isView(e11)) {
            var r11 = t0.from(e11.buffer, e11.byteOffset, e11.byteLength);
            return r11.length === e11.byteLength ? r11 : r11.slice(e11.byteOffset, e11.byteOffset + e11.byteLength);
          }
          return e11 instanceof Date ? n10.parseInputDatesAsUTC ? c2(e11) : u2(e11) : Array.isArray(e11) ? s10(e11) : "object" == typeof e11 ? o10(e11, t11) : e11.toString();
        }, "prepareValue");
        function o10(e11, t11) {
          if (e11 && "function" == typeof e11.toPostgres) {
            if (-1 !== (t11 = t11 || []).indexOf(e11)) throw Error('circular reference detected while preparing "' + e11 + '" for query');
            return t11.push(e11), a10(e11.toPostgres(a10), t11);
          }
          return JSON.stringify(e11);
        }
        function l2(e11, t11) {
          for (e11 = "" + e11; e11.length < t11; ) e11 = "0" + e11;
          return e11;
        }
        function u2(e11) {
          var t11 = -e11.getTimezoneOffset(), r11 = e11.getFullYear(), n11 = r11 < 1;
          n11 && (r11 = Math.abs(r11) + 1);
          var i11 = l2(r11, 4) + "-" + l2(e11.getMonth() + 1, 2) + "-" + l2(e11.getDate(), 2) + "T" + l2(e11.getHours(), 2) + ":" + l2(e11.getMinutes(), 2) + ":" + l2(e11.getSeconds(), 2) + "." + l2(e11.getMilliseconds(), 3);
          return t11 < 0 ? (i11 += "-", t11 *= -1) : i11 += "+", i11 += l2(Math.floor(t11 / 60), 2) + ":" + l2(t11 % 60, 2), n11 && (i11 += " BC"), i11;
        }
        function c2(e11) {
          var t11 = e11.getUTCFullYear(), r11 = t11 < 1;
          r11 && (t11 = Math.abs(t11) + 1);
          var n11 = l2(t11, 4) + "-" + l2(e11.getUTCMonth() + 1, 2) + "-" + l2(e11.getUTCDate(), 2) + "T" + l2(e11.getUTCHours(), 2) + ":" + l2(e11.getUTCMinutes(), 2) + ":" + l2(e11.getUTCSeconds(), 2) + "." + l2(e11.getUTCMilliseconds(), 3);
          return n11 += "+00:00", r11 && (n11 += " BC"), n11;
        }
        function h2(e11, t11, r11) {
          return e11 = "string" == typeof e11 ? { text: e11 } : e11, t11 && ("function" == typeof t11 ? e11.callback = t11 : e11.values = t11), r11 && (e11.callback = r11), e11;
        }
        t7(o10, "prepareObject"), t7(l2, "pad"), t7(u2, "dateToString"), t7(c2, "dateToStringUTC"), t7(h2, "normalizeQueryConfig");
        var d2 = t7(function(e11) {
          return r10.createHash("md5").update(e11, "utf-8").digest("hex");
        }, "md5"), f2 = t7(function(e11, t11, r11) {
          var n11 = d2(t11 + e11);
          return "md5" + d2(t0.concat([t0.from(n11), r11]));
        }, "postgresMd5PasswordHash");
        t10.exports = { prepareValue: t7(function(e11) {
          return a10(e11);
        }, "prepareValueWrapper"), normalizeQueryConfig: h2, postgresMd5PasswordHash: f2, md5: d2 };
      }), rV = {};
      rt(rV, { default: () => rH });
      var rH, rG = t9(() => {
        ru(), rH = {};
      }), rW = re((e10, t10) => {
        ru();
        var r10 = (rU(), ri(r$));
        function n10(e11) {
          if (-1 === e11.indexOf("SCRAM-SHA-256")) throw Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
          let t11 = r10.randomBytes(18).toString("base64");
          return { mechanism: "SCRAM-SHA-256", clientNonce: t11, response: "n,,n=*,r=" + t11, message: "SASLInitialResponse" };
        }
        function i10(e11, t11, r11) {
          if ("SASLInitialResponse" !== e11.message) throw Error("SASL: Last message was not SASLInitialResponse");
          if ("string" != typeof t11) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
          if ("string" != typeof r11) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
          let n11 = u2(r11);
          if (n11.nonce.startsWith(e11.clientNonce)) {
            if (n11.nonce.length === e11.clientNonce.length) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
          } else throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
          var i11 = p2(t11, t0.from(n11.salt, "base64"), n11.iteration), s11 = f2(i11, "Client Key"), a11 = d2(s11), o11 = "n=*,r=" + e11.clientNonce, l3 = "r=" + n11.nonce + ",s=" + n11.salt + ",i=" + n11.iteration, c3 = "c=biws,r=" + n11.nonce, g2 = o11 + "," + l3 + "," + c3, m2 = h2(s11, f2(a11, g2)).toString("base64"), y2 = f2(i11, "Server Key"), b2 = f2(y2, g2);
          e11.message = "SASLResponse", e11.serverSignature = b2.toString("base64"), e11.response = c3 + ",p=" + m2;
        }
        function s10(e11, t11) {
          if ("SASLResponse" !== e11.message) throw Error("SASL: Last message was not SASLResponse");
          if ("string" != typeof t11) throw Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
          let { serverSignature: r11 } = c2(t11);
          if (r11 !== e11.serverSignature) throw Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
        }
        function a10(e11) {
          if ("string" != typeof e11) throw TypeError("SASL: text must be a string");
          return e11.split("").map((t11, r11) => e11.charCodeAt(r11)).every((e12) => e12 >= 33 && e12 <= 43 || e12 >= 45 && e12 <= 126);
        }
        function o10(e11) {
          return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(e11);
        }
        function l2(e11) {
          if ("string" != typeof e11) throw TypeError("SASL: attribute pairs text must be a string");
          return new Map(e11.split(",").map((e12) => {
            if (!/^.=/.test(e12)) throw Error("SASL: Invalid attribute pair entry");
            return [e12[0], e12.substring(2)];
          }));
        }
        function u2(e11) {
          let t11 = l2(e11), r11 = t11.get("r");
          if (r11) {
            if (!a10(r11)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
          } else throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
          let n11 = t11.get("s");
          if (n11) {
            if (!o10(n11)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
          } else throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
          let i11 = t11.get("i");
          if (i11) {
            if (!/^[1-9][0-9]*$/.test(i11)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
          } else throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
          return { nonce: r11, salt: n11, iteration: parseInt(i11, 10) };
        }
        function c2(e11) {
          let t11 = l2(e11).get("v");
          if (t11) {
            if (!o10(t11)) throw Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
          } else throw Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
          return { serverSignature: t11 };
        }
        function h2(e11, t11) {
          if (!t0.isBuffer(e11)) throw TypeError("first argument must be a Buffer");
          if (!t0.isBuffer(t11)) throw TypeError("second argument must be a Buffer");
          if (e11.length !== t11.length) throw Error("Buffer lengths must match");
          if (0 === e11.length) throw Error("Buffers cannot be empty");
          return t0.from(e11.map((r11, n11) => e11[n11] ^ t11[n11]));
        }
        function d2(e11) {
          return r10.createHash("sha256").update(e11).digest();
        }
        function f2(e11, t11) {
          return r10.createHmac("sha256", e11).update(t11).digest();
        }
        function p2(e11, t11, r11) {
          for (var n11 = f2(e11, t0.concat([t11, t0.from([0, 0, 0, 1])])), i11 = n11, s11 = 0; s11 < r11 - 1; s11++) i11 = h2(i11, n11 = f2(e11, n11));
          return i11;
        }
        t7(n10, "startSession"), t7(i10, "continueSession"), t7(s10, "finalizeSession"), t7(a10, "isPrintableChars"), t7(o10, "isBase64"), t7(l2, "parseAttributePairs"), t7(u2, "parseServerFirstMessage"), t7(c2, "parseServerFinalMessage"), t7(h2, "xorBuffers"), t7(d2, "sha256"), t7(f2, "hmacSha256"), t7(p2, "Hi"), t10.exports = { startSession: n10, continueSession: i10, finalizeSession: s10 };
      }), rK = {};
      function rX(...e10) {
        return e10.join("/");
      }
      rt(rK, { join: () => rX });
      var rJ = t9(() => {
        ru(), t7(rX, "join");
      }), rY = {};
      function rZ(e10, t10) {
        t10(Error("No filesystem"));
      }
      rt(rY, { stat: () => rZ });
      var r0 = t9(() => {
        ru(), t7(rZ, "stat");
      }), r1 = {};
      rt(r1, { default: () => r2 });
      var r2, r6 = t9(() => {
        ru(), r2 = {};
      }), r5 = {};
      rt(r5, { StringDecoder: () => r4 });
      var r3, r4, r8 = t9(() => {
        ru(), t7(r3 = class {
          constructor(e10) {
            rs(this, "td"), this.td = new TextDecoder(e10);
          }
          write(e10) {
            return this.td.decode(e10, { stream: true });
          }
          end(e10) {
            return this.td.decode(e10);
          }
        }, "StringDecoder"), r4 = r3;
      }), r7 = re((e10, t10) => {
        ru();
        var { Transform: r10 } = (r6(), ri(r1)), { StringDecoder: n10 } = (r8(), ri(r5)), i10 = Symbol("last"), s10 = Symbol("decoder");
        function a10(e11, t11, r11) {
          let n11;
          if (this.overflow) {
            if (1 === (n11 = this[s10].write(e11).split(this.matcher)).length) return r11();
            n11.shift(), this.overflow = false;
          } else this[i10] += this[s10].write(e11), n11 = this[i10].split(this.matcher);
          this[i10] = n11.pop();
          for (let e12 = 0; e12 < n11.length; e12++) try {
            l2(this, this.mapper(n11[e12]));
          } catch (e13) {
            return r11(e13);
          }
          (this.overflow = this[i10].length > this.maxLength, this.overflow && !this.skipOverflow) ? r11(Error("maximum buffer reached")) : r11();
        }
        function o10(e11) {
          if (this[i10] += this[s10].end(), this[i10]) try {
            l2(this, this.mapper(this[i10]));
          } catch (t11) {
            return e11(t11);
          }
          e11();
        }
        function l2(e11, t11) {
          void 0 !== t11 && e11.push(t11);
        }
        function u2(e11) {
          return e11;
        }
        function c2(e11, t11, l3) {
          switch (e11 = e11 || /\r?\n/, t11 = t11 || u2, l3 = l3 || {}, arguments.length) {
            case 1:
              "function" == typeof e11 ? (t11 = e11, e11 = /\r?\n/) : "object" != typeof e11 || e11 instanceof RegExp || e11[Symbol.split] || (l3 = e11, e11 = /\r?\n/);
              break;
            case 2:
              "function" == typeof e11 ? (l3 = t11, t11 = e11, e11 = /\r?\n/) : "object" == typeof t11 && (l3 = t11, t11 = u2);
          }
          (l3 = Object.assign({}, l3)).autoDestroy = true, l3.transform = a10, l3.flush = o10, l3.readableObjectMode = true;
          let c3 = new r10(l3);
          return c3[i10] = "", c3[s10] = new n10("utf8"), c3.matcher = e11, c3.mapper = t11, c3.maxLength = l3.maxLength, c3.skipOverflow = l3.skipOverflow || false, c3.overflow = false, c3._destroy = function(e12, t12) {
            this._writableState.errorEmitted = false, t12(e12);
          }, c3;
        }
        t7(a10, "transform"), t7(o10, "flush"), t7(l2, "push"), t7(u2, "noop"), t7(c2, "split"), t10.exports = c2;
      }), r9 = re((e10, t10) => {
        ru();
        var r10 = (rJ(), ri(rK)), n10 = (r6(), ri(r1)).Stream, i10 = r7(), s10 = (rG(), ri(rV)), a10 = "win32" === t1.platform, o10 = t1.stderr;
        function l2(e11) {
          return (61440 & e11) == 32768;
        }
        t7(l2, "isRegFile");
        var u2 = ["host", "port", "database", "user", "password"], c2 = u2.length, h2 = u2[c2 - 1];
        function d2() {
          if (o10 instanceof n10 && true === o10.writable) {
            var e11 = Array.prototype.slice.call(arguments).concat(`
`);
            o10.write(s10.format.apply(s10, e11));
          }
        }
        t7(d2, "warn"), Object.defineProperty(t10.exports, "isWin", { get: t7(function() {
          return a10;
        }, "get"), set: t7(function(e11) {
          a10 = e11;
        }, "set") }), t10.exports.warnTo = function(e11) {
          var t11 = o10;
          return o10 = e11, t11;
        }, t10.exports.getFileName = function(e11) {
          var t11 = e11 || t1.env;
          return t11.PGPASSFILE || (a10 ? r10.join(t11.APPDATA || "./", "postgresql", "pgpass.conf") : r10.join(t11.HOME || "./", ".pgpass"));
        }, t10.exports.usePgPass = function(e11, t11) {
          return !Object.prototype.hasOwnProperty.call(t1.env, "PGPASSWORD") && (!!a10 || (t11 = t11 || "<unkn>", l2(e11.mode) ? !(63 & e11.mode) || (d2('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', t11), false) : (d2('WARNING: password file "%s" is not a plain file', t11), false)));
        };
        var f2 = t10.exports.match = function(e11, t11) {
          return u2.slice(0, -1).reduce(function(r11, n11, i11) {
            return 1 == i11 && Number(e11[n11] || 5432) === Number(t11[n11]) ? r11 && true : r11 && ("*" === t11[n11] || t11[n11] === e11[n11]);
          }, true);
        };
        t10.exports.getPassword = function(e11, t11, r11) {
          var n11, s11 = t11.pipe(i10());
          function a11(t12) {
            var r12 = p2(t12);
            r12 && g2(r12) && f2(e11, r12) && (n11 = r12[h2], s11.end());
          }
          t7(a11, "onLine");
          var o11 = t7(function() {
            t11.destroy(), r11(n11);
          }, "onEnd"), l3 = t7(function(e12) {
            t11.destroy(), d2("WARNING: error on reading file: %s", e12), r11(void 0);
          }, "onErr");
          t11.on("error", l3), s11.on("data", a11).on("end", o11).on("error", l3);
        };
        var p2 = t10.exports.parseLine = function(e11) {
          if (e11.length < 11 || e11.match(/^\s+#/)) return null;
          for (var t11 = "", r11 = "", n11 = 0, i11 = 0, s11 = {}, a11 = t7(function(t12, r12, n12) {
            var i12 = e11.substring(r12, n12);
            Object.hasOwnProperty.call(t1.env, "PGPASS_NO_DEESCAPE") || (i12 = i12.replace(/\\([:\\])/g, "$1")), s11[u2[t12]] = i12;
          }, "addToObj"), o11 = 0; o11 < e11.length - 1; o11 += 1) {
            if (t11 = e11.charAt(o11 + 1), r11 = e11.charAt(o11), n11 == c2 - 1) {
              a11(n11, i11);
              break;
            }
            o11 >= 0 && ":" == t11 && "\\" !== r11 && (a11(n11, i11, o11 + 1), i11 = o11 + 2, n11 += 1);
          }
          return s11 = Object.keys(s11).length === c2 ? s11 : null;
        }, g2 = t10.exports.isValidEntry = function(e11) {
          for (var t11 = { 0: function(e12) {
            return e12.length > 0;
          }, 1: function(e12) {
            return "*" === e12 || isFinite(e12 = Number(e12)) && e12 > 0 && e12 < 9007199254740992 && Math.floor(e12) === e12;
          }, 2: function(e12) {
            return e12.length > 0;
          }, 3: function(e12) {
            return e12.length > 0;
          }, 4: function(e12) {
            return e12.length > 0;
          } }, r11 = 0; r11 < u2.length; r11 += 1) if (!(0, t11[r11])(e11[u2[r11]] || "")) return false;
          return true;
        };
      }), ne = re((e10, t10) => {
        ru(), rJ(), ri(rK);
        var r10 = (r0(), ri(rY)), n10 = r9();
        t10.exports = function(e11, t11) {
          var i10 = n10.getFileName();
          r10.stat(i10, function(s10, a10) {
            if (s10 || !n10.usePgPass(a10, i10)) return t11(void 0);
            var o10 = r10.createReadStream(i10);
            n10.getPassword(e11, o10, t11);
          });
        }, t10.exports.warnTo = n10.warnTo;
      }), nt = {};
      rt(nt, { default: () => nr });
      var nr, nn = t9(() => {
        ru(), nr = {};
      }), ni = re((e10, t10) => {
        ru();
        var r10 = (rw(), ri(rb)), n10 = (r0(), ri(rY));
        function i10(e11) {
          if ("/" === e11.charAt(0)) {
            var t11 = e11.split(" ");
            return { host: t11[0], database: t11[1] };
          }
          var i11 = r10.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(e11) ? encodeURI(e11).replace(/\%25(\d\d)/g, "%$1") : e11, true), t11 = i11.query;
          for (var s10 in t11) Array.isArray(t11[s10]) && (t11[s10] = t11[s10][t11[s10].length - 1]);
          var a10 = (i11.auth || ":").split(":");
          if (t11.user = a10[0], t11.password = a10.splice(1).join(":"), t11.port = i11.port, "socket:" == i11.protocol) return t11.host = decodeURI(i11.pathname), t11.database = i11.query.db, t11.client_encoding = i11.query.encoding, t11;
          t11.host || (t11.host = i11.hostname);
          var o10 = i11.pathname;
          if (!t11.host && o10 && /^%2f/i.test(o10)) {
            var l2 = o10.split("/");
            t11.host = decodeURIComponent(l2[0]), o10 = l2.splice(1).join("/");
          }
          switch (o10 && "/" === o10.charAt(0) && (o10 = o10.slice(1) || null), t11.database = o10 && decodeURI(o10), ("true" === t11.ssl || "1" === t11.ssl) && (t11.ssl = true), "0" === t11.ssl && (t11.ssl = false), (t11.sslcert || t11.sslkey || t11.sslrootcert || t11.sslmode) && (t11.ssl = {}), t11.sslcert && (t11.ssl.cert = n10.readFileSync(t11.sslcert).toString()), t11.sslkey && (t11.ssl.key = n10.readFileSync(t11.sslkey).toString()), t11.sslrootcert && (t11.ssl.ca = n10.readFileSync(t11.sslrootcert).toString()), t11.sslmode) {
            case "disable":
              t11.ssl = false;
              break;
            case "prefer":
            case "require":
            case "verify-ca":
            case "verify-full":
              break;
            case "no-verify":
              t11.ssl.rejectUnauthorized = false;
          }
          return t11;
        }
        t7(i10, "parse"), t10.exports = i10, i10.parse = i10;
      }), ns = re((e10, t10) => {
        ru();
        var r10 = (nn(), ri(nt)), n10 = rQ(), i10 = ni().parse, s10 = t7(function(e11, t11, r11) {
          return void 0 === r11 ? r11 = t1.env["PG" + e11.toUpperCase()] : false === r11 || (r11 = t1.env[r11]), t11[e11] || r11 || n10[e11];
        }, "val"), a10 = t7(function() {
          switch (t1.env.PGSSLMODE) {
            case "disable":
              return false;
            case "prefer":
            case "require":
            case "verify-ca":
            case "verify-full":
              return true;
            case "no-verify":
              return { rejectUnauthorized: false };
          }
          return n10.ssl;
        }, "readSSLConfigFromEnvironment"), o10 = t7(function(e11) {
          return "'" + ("" + e11).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
        }, "quoteParamValue"), l2 = t7(function(e11, t11, r11) {
          var n11 = t11[r11];
          null != n11 && e11.push(r11 + "=" + o10(n11));
        }, "add"), u2 = class {
          constructor(e11) {
            (e11 = "string" == typeof e11 ? i10(e11) : e11 || {}).connectionString && (e11 = Object.assign({}, e11, i10(e11.connectionString))), this.user = s10("user", e11), this.database = s10("database", e11), void 0 === this.database && (this.database = this.user), this.port = parseInt(s10("port", e11), 10), this.host = s10("host", e11), Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: s10("password", e11) }), this.binary = s10("binary", e11), this.options = s10("options", e11), this.ssl = typeof e11.ssl > "u" ? a10() : e11.ssl, "string" == typeof this.ssl && "true" === this.ssl && (this.ssl = true), "no-verify" === this.ssl && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = s10("client_encoding", e11), this.replication = s10("replication", e11), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = s10("application_name", e11, "PGAPPNAME"), this.fallback_application_name = s10("fallback_application_name", e11, false), this.statement_timeout = s10("statement_timeout", e11, false), this.lock_timeout = s10("lock_timeout", e11, false), this.idle_in_transaction_session_timeout = s10("idle_in_transaction_session_timeout", e11, false), this.query_timeout = s10("query_timeout", e11, false), void 0 === e11.connectionTimeoutMillis ? this.connect_timeout = t1.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e11.connectionTimeoutMillis / 1e3), false === e11.keepAlive ? this.keepalives = 0 : true === e11.keepAlive && (this.keepalives = 1), "number" == typeof e11.keepAliveInitialDelayMillis && (this.keepalives_idle = Math.floor(e11.keepAliveInitialDelayMillis / 1e3));
          }
          getLibpqConnectionString(e11) {
            var t11 = [];
            l2(t11, this, "user"), l2(t11, this, "password"), l2(t11, this, "port"), l2(t11, this, "application_name"), l2(t11, this, "fallback_application_name"), l2(t11, this, "connect_timeout"), l2(t11, this, "options");
            var n11 = "object" == typeof this.ssl ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
            if (l2(t11, n11, "sslmode"), l2(t11, n11, "sslca"), l2(t11, n11, "sslkey"), l2(t11, n11, "sslcert"), l2(t11, n11, "sslrootcert"), this.database && t11.push("dbname=" + o10(this.database)), this.replication && t11.push("replication=" + o10(this.replication)), this.host && t11.push("host=" + o10(this.host)), this.isDomainSocket) return e11(null, t11.join(" "));
            this.client_encoding && t11.push("client_encoding=" + o10(this.client_encoding)), r10.lookup(this.host, function(r11, n12) {
              return r11 ? e11(r11, null) : (t11.push("hostaddr=" + o10(n12)), e11(null, t11.join(" ")));
            });
          }
        };
        t7(u2, "ConnectionParameters"), t10.exports = u2;
      }), na = re((e10, t10) => {
        ru();
        var r10 = rO(), n10 = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, i10 = class {
          constructor(e11, t11) {
            this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t11, this.RowCtor = null, this.rowAsArray = "array" === e11, this.rowAsArray && (this.parseRow = this._parseRowAsArray);
          }
          addCommandComplete(e11) {
            var t11;
            (t11 = e11.text ? n10.exec(e11.text) : n10.exec(e11.command)) && (this.command = t11[1], t11[3] ? (this.oid = parseInt(t11[2], 10), this.rowCount = parseInt(t11[3], 10)) : t11[2] && (this.rowCount = parseInt(t11[2], 10)));
          }
          _parseRowAsArray(e11) {
            for (var t11 = Array(e11.length), r11 = 0, n11 = e11.length; r11 < n11; r11++) {
              var i11 = e11[r11];
              null !== i11 ? t11[r11] = this._parsers[r11](i11) : t11[r11] = null;
            }
            return t11;
          }
          parseRow(e11) {
            for (var t11 = {}, r11 = 0, n11 = e11.length; r11 < n11; r11++) {
              var i11 = e11[r11], s10 = this.fields[r11].name;
              null !== i11 ? t11[s10] = this._parsers[r11](i11) : t11[s10] = null;
            }
            return t11;
          }
          addRow(e11) {
            this.rows.push(e11);
          }
          addFields(e11) {
            this.fields = e11, this.fields.length && (this._parsers = Array(e11.length));
            for (var t11 = 0; t11 < e11.length; t11++) {
              var n11 = e11[t11];
              this._types ? this._parsers[t11] = this._types.getTypeParser(n11.dataTypeID, n11.format || "text") : this._parsers[t11] = r10.getTypeParser(n11.dataTypeID, n11.format || "text");
            }
          }
        };
        t7(i10, "Result"), t10.exports = i10;
      }), no = re((e10, t10) => {
        ru();
        var { EventEmitter: r10 } = rc(), n10 = na(), i10 = rz(), s10 = class extends r10 {
          constructor(e11, t11, r11) {
            super(), e11 = i10.normalizeQueryConfig(e11, t11, r11), this.text = e11.text, this.values = e11.values, this.rows = e11.rows, this.types = e11.types, this.name = e11.name, this.binary = e11.binary, this.portal = e11.portal || "", this.callback = e11.callback, this._rowMode = e11.rowMode, t1.domain && e11.callback && (this.callback = t1.domain.bind(e11.callback)), this._result = new n10(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
          }
          requiresPreparation() {
            return !!this.name || !!this.rows || !!this.text && !!this.values && this.values.length > 0;
          }
          _checkForMultirow() {
            this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new n10(this._rowMode, this.types), this._results.push(this._result));
          }
          handleRowDescription(e11) {
            this._checkForMultirow(), this._result.addFields(e11.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
          }
          handleDataRow(e11) {
            let t11;
            if (!this._canceledDueToError) {
              try {
                t11 = this._result.parseRow(e11.fields);
              } catch (e12) {
                this._canceledDueToError = e12;
                return;
              }
              this.emit("row", t11, this._result), this._accumulateRows && this._result.addRow(t11);
            }
          }
          handleCommandComplete(e11, t11) {
            this._checkForMultirow(), this._result.addCommandComplete(e11), this.rows && t11.sync();
          }
          handleEmptyQuery(e11) {
            this.rows && e11.sync();
          }
          handleError(e11, t11) {
            if (this._canceledDueToError && (e11 = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e11);
            this.emit("error", e11);
          }
          handleReadyForQuery(e11) {
            if (this._canceledDueToError) return this.handleError(this._canceledDueToError, e11);
            if (this.callback) try {
              this.callback(null, this._results);
            } catch (e12) {
              t1.nextTick(() => {
                throw e12;
              });
            }
            this.emit("end", this._results);
          }
          submit(e11) {
            if ("string" != typeof this.text && "string" != typeof this.name) return Error("A query must have either text or a name. Supplying neither is unsupported.");
            let t11 = e11.parsedStatements[this.name];
            return this.text && t11 && this.text !== t11 ? Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e11) : e11.query(this.text), null);
          }
          hasBeenParsed(e11) {
            return this.name && e11.parsedStatements[this.name];
          }
          handlePortalSuspended(e11) {
            this._getRows(e11, this.rows);
          }
          _getRows(e11, t11) {
            e11.execute({ portal: this.portal, rows: t11 }), t11 ? e11.flush() : e11.sync();
          }
          prepare(e11) {
            this.isPreparedStatement = true, this.hasBeenParsed(e11) || e11.parse({ text: this.text, name: this.name, types: this.types });
            try {
              e11.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: i10.prepareValue });
            } catch (t11) {
              this.handleError(t11, e11);
              return;
            }
            e11.describe({ type: "P", name: this.portal || "" }), this._getRows(e11, this.rows);
          }
          handleCopyInResponse(e11) {
            e11.sendCopyFail("No source stream defined");
          }
          handleCopyData(e11, t11) {
          }
        };
        t7(s10, "Query"), t10.exports = s10;
      }), nl = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.NoticeMessage = e10.DataRowMessage = e10.CommandCompleteMessage = e10.ReadyForQueryMessage = e10.NotificationResponseMessage = e10.BackendKeyDataMessage = e10.AuthenticationMD5Password = e10.ParameterStatusMessage = e10.ParameterDescriptionMessage = e10.RowDescriptionMessage = e10.Field = e10.CopyResponse = e10.CopyDataMessage = e10.DatabaseError = e10.copyDone = e10.emptyQuery = e10.replicationStart = e10.portalSuspended = e10.noData = e10.closeComplete = e10.bindComplete = e10.parseComplete = void 0, e10.parseComplete = { name: "parseComplete", length: 5 }, e10.bindComplete = { name: "bindComplete", length: 5 }, e10.closeComplete = { name: "closeComplete", length: 5 }, e10.noData = { name: "noData", length: 5 }, e10.portalSuspended = { name: "portalSuspended", length: 5 }, e10.replicationStart = { name: "replicationStart", length: 4 }, e10.emptyQuery = { name: "emptyQuery", length: 4 }, e10.copyDone = { name: "copyDone", length: 4 };
        var t10 = class extends Error {
          constructor(e11, t11, r11) {
            super(e11), this.length = t11, this.name = r11;
          }
        };
        t7(t10, "DatabaseError"), e10.DatabaseError = t10;
        var r10 = class {
          constructor(e11, t11) {
            this.length = e11, this.chunk = t11, this.name = "copyData";
          }
        };
        t7(r10, "CopyDataMessage"), e10.CopyDataMessage = r10;
        var n10 = class {
          constructor(e11, t11, r11, n11) {
            this.length = e11, this.name = t11, this.binary = r11, this.columnTypes = Array(n11);
          }
        };
        t7(n10, "CopyResponse"), e10.CopyResponse = n10;
        var i10 = class {
          constructor(e11, t11, r11, n11, i11, s11, a11) {
            this.name = e11, this.tableID = t11, this.columnID = r11, this.dataTypeID = n11, this.dataTypeSize = i11, this.dataTypeModifier = s11, this.format = a11;
          }
        };
        t7(i10, "Field"), e10.Field = i10;
        var s10 = class {
          constructor(e11, t11) {
            this.length = e11, this.fieldCount = t11, this.name = "rowDescription", this.fields = Array(this.fieldCount);
          }
        };
        t7(s10, "RowDescriptionMessage"), e10.RowDescriptionMessage = s10;
        var a10 = class {
          constructor(e11, t11) {
            this.length = e11, this.parameterCount = t11, this.name = "parameterDescription", this.dataTypeIDs = Array(this.parameterCount);
          }
        };
        t7(a10, "ParameterDescriptionMessage"), e10.ParameterDescriptionMessage = a10;
        var o10 = class {
          constructor(e11, t11, r11) {
            this.length = e11, this.parameterName = t11, this.parameterValue = r11, this.name = "parameterStatus";
          }
        };
        t7(o10, "ParameterStatusMessage"), e10.ParameterStatusMessage = o10;
        var l2 = class {
          constructor(e11, t11) {
            this.length = e11, this.salt = t11, this.name = "authenticationMD5Password";
          }
        };
        t7(l2, "AuthenticationMD5Password"), e10.AuthenticationMD5Password = l2;
        var u2 = class {
          constructor(e11, t11, r11) {
            this.length = e11, this.processID = t11, this.secretKey = r11, this.name = "backendKeyData";
          }
        };
        t7(u2, "BackendKeyDataMessage"), e10.BackendKeyDataMessage = u2;
        var c2 = class {
          constructor(e11, t11, r11, n11) {
            this.length = e11, this.processId = t11, this.channel = r11, this.payload = n11, this.name = "notification";
          }
        };
        t7(c2, "NotificationResponseMessage"), e10.NotificationResponseMessage = c2;
        var h2 = class {
          constructor(e11, t11) {
            this.length = e11, this.status = t11, this.name = "readyForQuery";
          }
        };
        t7(h2, "ReadyForQueryMessage"), e10.ReadyForQueryMessage = h2;
        var d2 = class {
          constructor(e11, t11) {
            this.length = e11, this.text = t11, this.name = "commandComplete";
          }
        };
        t7(d2, "CommandCompleteMessage"), e10.CommandCompleteMessage = d2;
        var f2 = class {
          constructor(e11, t11) {
            this.length = e11, this.fields = t11, this.name = "dataRow", this.fieldCount = t11.length;
          }
        };
        t7(f2, "DataRowMessage"), e10.DataRowMessage = f2;
        var p2 = class {
          constructor(e11, t11) {
            this.length = e11, this.message = t11, this.name = "notice";
          }
        };
        t7(p2, "NoticeMessage"), e10.NoticeMessage = p2;
      }), nu = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.Writer = void 0;
        var t10 = class {
          constructor(e11 = 256) {
            this.size = e11, this.offset = 5, this.headerPosition = 0, this.buffer = t0.allocUnsafe(e11);
          }
          ensure(e11) {
            if (this.buffer.length - this.offset < e11) {
              let t11 = this.buffer, r10 = t11.length + (t11.length >> 1) + e11;
              this.buffer = t0.allocUnsafe(r10), t11.copy(this.buffer);
            }
          }
          addInt32(e11) {
            return this.ensure(4), this.buffer[this.offset++] = e11 >>> 24 & 255, this.buffer[this.offset++] = e11 >>> 16 & 255, this.buffer[this.offset++] = e11 >>> 8 & 255, this.buffer[this.offset++] = e11 >>> 0 & 255, this;
          }
          addInt16(e11) {
            return this.ensure(2), this.buffer[this.offset++] = e11 >>> 8 & 255, this.buffer[this.offset++] = e11 >>> 0 & 255, this;
          }
          addCString(e11) {
            if (e11) {
              let t11 = t0.byteLength(e11);
              this.ensure(t11 + 1), this.buffer.write(e11, this.offset, "utf-8"), this.offset += t11;
            } else this.ensure(1);
            return this.buffer[this.offset++] = 0, this;
          }
          addString(e11 = "") {
            let t11 = t0.byteLength(e11);
            return this.ensure(t11), this.buffer.write(e11, this.offset), this.offset += t11, this;
          }
          add(e11) {
            return this.ensure(e11.length), e11.copy(this.buffer, this.offset), this.offset += e11.length, this;
          }
          join(e11) {
            if (e11) {
              this.buffer[this.headerPosition] = e11;
              let t11 = this.offset - (this.headerPosition + 1);
              this.buffer.writeInt32BE(t11, this.headerPosition + 1);
            }
            return this.buffer.slice(5 * !e11, this.offset);
          }
          flush(e11) {
            let t11 = this.join(e11);
            return this.offset = 5, this.headerPosition = 0, this.buffer = t0.allocUnsafe(this.size), t11;
          }
        };
        t7(t10, "Writer"), e10.Writer = t10;
      }), nc = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.serialize = void 0;
        var t10 = nu(), r10 = new t10.Writer(), n10 = t7((e11) => {
          for (let t11 of (r10.addInt16(3).addInt16(0), Object.keys(e11))) r10.addCString(t11).addCString(e11[t11]);
          r10.addCString("client_encoding").addCString("UTF8");
          let n11 = r10.addCString("").flush(), i11 = n11.length + 4;
          return new t10.Writer().addInt32(i11).add(n11).flush();
        }, "startup"), i10 = t7(() => {
          let e11 = t0.allocUnsafe(8);
          return e11.writeInt32BE(8, 0), e11.writeInt32BE(80877103, 4), e11;
        }, "requestSsl"), s10 = t7((e11) => r10.addCString(e11).flush(112), "password"), a10 = t7(function(e11, t11) {
          return r10.addCString(e11).addInt32(t0.byteLength(t11)).addString(t11), r10.flush(112);
        }, "sendSASLInitialResponseMessage"), o10 = t7(function(e11) {
          return r10.addString(e11).flush(112);
        }, "sendSCRAMClientFinalMessage"), l2 = t7((e11) => r10.addCString(e11).flush(81), "query"), u2 = [], c2 = t7((e11) => {
          let t11 = e11.name || "";
          t11.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", t11, t11.length), console.error("This can cause conflicts and silent errors executing queries"));
          let n11 = e11.types || u2, i11 = n11.length, s11 = r10.addCString(t11).addCString(e11.text).addInt16(i11);
          for (let e12 = 0; e12 < i11; e12++) s11.addInt32(n11[e12]);
          return r10.flush(80);
        }, "parse"), h2 = new t10.Writer(), d2 = t7(function(e11, t11) {
          for (let n11 = 0; n11 < e11.length; n11++) {
            let i11 = t11 ? t11(e11[n11], n11) : e11[n11];
            null == i11 ? (r10.addInt16(0), h2.addInt32(-1)) : i11 instanceof t0 ? (r10.addInt16(1), h2.addInt32(i11.length), h2.add(i11)) : (r10.addInt16(0), h2.addInt32(t0.byteLength(i11)), h2.addString(i11));
          }
        }, "writeValues"), f2 = t7((e11 = {}) => {
          let t11 = e11.portal || "", n11 = e11.statement || "", i11 = e11.binary || false, s11 = e11.values || u2, a11 = s11.length;
          return r10.addCString(t11).addCString(n11), r10.addInt16(a11), d2(s11, e11.valueMapper), r10.addInt16(a11), r10.add(h2.flush()), r10.addInt16(+!!i11), r10.flush(66);
        }, "bind"), p2 = t0.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), g2 = t7((e11) => {
          if (!e11 || !e11.portal && !e11.rows) return p2;
          let t11 = e11.portal || "", r11 = e11.rows || 0, n11 = t0.byteLength(t11), i11 = 4 + n11 + 1 + 4, s11 = t0.allocUnsafe(1 + i11);
          return s11[0] = 69, s11.writeInt32BE(i11, 1), s11.write(t11, 5, "utf-8"), s11[n11 + 5] = 0, s11.writeUInt32BE(r11, s11.length - 4), s11;
        }, "execute"), m2 = t7((e11, t11) => {
          let r11 = t0.allocUnsafe(16);
          return r11.writeInt32BE(16, 0), r11.writeInt16BE(1234, 4), r11.writeInt16BE(5678, 6), r11.writeInt32BE(e11, 8), r11.writeInt32BE(t11, 12), r11;
        }, "cancel"), y2 = t7((e11, t11) => {
          let r11 = 4 + t0.byteLength(t11) + 1, n11 = t0.allocUnsafe(1 + r11);
          return n11[0] = e11, n11.writeInt32BE(r11, 1), n11.write(t11, 5, "utf-8"), n11[r11] = 0, n11;
        }, "cstringMessage"), b2 = r10.addCString("P").flush(68), v2 = r10.addCString("S").flush(68), w2 = t7((e11) => e11.name ? y2(68, `${e11.type}${e11.name || ""}`) : "P" === e11.type ? b2 : v2, "describe"), _2 = t7((e11) => y2(67, `${e11.type}${e11.name || ""}`), "close"), S2 = t7((e11) => r10.add(e11).flush(100), "copyData"), E2 = t7((e11) => y2(102, e11), "copyFail"), x2 = t7((e11) => t0.from([e11, 0, 0, 0, 4]), "codeOnlyBuffer"), T2 = x2(72), C2 = x2(83), P2 = x2(88), A2 = x2(99);
        e10.serialize = { startup: n10, password: s10, requestSsl: i10, sendSASLInitialResponseMessage: a10, sendSCRAMClientFinalMessage: o10, query: l2, parse: c2, bind: f2, execute: g2, describe: w2, close: _2, flush: t7(() => T2, "flush"), sync: t7(() => C2, "sync"), end: t7(() => P2, "end"), copyData: S2, copyDone: t7(() => A2, "copyDone"), copyFail: E2, cancel: m2 };
      }), nh = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.BufferReader = void 0;
        var t10 = t0.allocUnsafe(0), r10 = class {
          constructor(e11 = 0) {
            this.offset = e11, this.buffer = t10, this.encoding = "utf-8";
          }
          setBuffer(e11, t11) {
            this.offset = e11, this.buffer = t11;
          }
          int16() {
            let e11 = this.buffer.readInt16BE(this.offset);
            return this.offset += 2, e11;
          }
          byte() {
            let e11 = this.buffer[this.offset];
            return this.offset++, e11;
          }
          int32() {
            let e11 = this.buffer.readInt32BE(this.offset);
            return this.offset += 4, e11;
          }
          uint32() {
            let e11 = this.buffer.readUInt32BE(this.offset);
            return this.offset += 4, e11;
          }
          string(e11) {
            let t11 = this.buffer.toString(this.encoding, this.offset, this.offset + e11);
            return this.offset += e11, t11;
          }
          cstring() {
            let e11 = this.offset, t11 = e11;
            for (; 0 !== this.buffer[t11++]; ) ;
            return this.offset = t11, this.buffer.toString(this.encoding, e11, t11 - 1);
          }
          bytes(e11) {
            let t11 = this.buffer.slice(this.offset, this.offset + e11);
            return this.offset += e11, t11;
          }
        };
        t7(r10, "BufferReader"), e10.BufferReader = r10;
      }), nd = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.Parser = void 0;
        var t10 = nl(), r10 = nh(), n10 = t0.allocUnsafe(0), i10 = class {
          constructor(e11) {
            if (this.buffer = n10, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new r10.BufferReader(), e11?.mode === "binary") throw Error("Binary mode not supported yet");
            this.mode = e11?.mode || "text";
          }
          parse(e11, t11) {
            this.mergeBuffer(e11);
            let r11 = this.bufferOffset + this.bufferLength, i11 = this.bufferOffset;
            for (; i11 + 5 <= r11; ) {
              let e12 = this.buffer[i11], n11 = this.buffer.readUInt32BE(i11 + 1), s10 = 1 + n11;
              if (s10 + i11 <= r11) t11(this.handlePacket(i11 + 5, e12, n11, this.buffer)), i11 += s10;
              else break;
            }
            i11 === r11 ? (this.buffer = n10, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = r11 - i11, this.bufferOffset = i11);
          }
          mergeBuffer(e11) {
            if (this.bufferLength > 0) {
              let t11 = this.bufferLength + e11.byteLength;
              if (t11 + this.bufferOffset > this.buffer.byteLength) {
                let e12;
                if (t11 <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) e12 = this.buffer;
                else {
                  let r11 = 2 * this.buffer.byteLength;
                  for (; t11 >= r11; ) r11 *= 2;
                  e12 = t0.allocUnsafe(r11);
                }
                this.buffer.copy(e12, 0, this.bufferOffset, this.bufferOffset + this.bufferLength), this.buffer = e12, this.bufferOffset = 0;
              }
              e11.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t11;
            } else this.buffer = e11, this.bufferOffset = 0, this.bufferLength = e11.byteLength;
          }
          handlePacket(e11, r11, n11, i11) {
            switch (r11) {
              case 50:
                return t10.bindComplete;
              case 49:
                return t10.parseComplete;
              case 51:
                return t10.closeComplete;
              case 110:
                return t10.noData;
              case 115:
                return t10.portalSuspended;
              case 99:
                return t10.copyDone;
              case 87:
                return t10.replicationStart;
              case 73:
                return t10.emptyQuery;
              case 68:
                return this.parseDataRowMessage(e11, n11, i11);
              case 67:
                return this.parseCommandCompleteMessage(e11, n11, i11);
              case 90:
                return this.parseReadyForQueryMessage(e11, n11, i11);
              case 65:
                return this.parseNotificationMessage(e11, n11, i11);
              case 82:
                return this.parseAuthenticationResponse(e11, n11, i11);
              case 83:
                return this.parseParameterStatusMessage(e11, n11, i11);
              case 75:
                return this.parseBackendKeyData(e11, n11, i11);
              case 69:
                return this.parseErrorMessage(e11, n11, i11, "error");
              case 78:
                return this.parseErrorMessage(e11, n11, i11, "notice");
              case 84:
                return this.parseRowDescriptionMessage(e11, n11, i11);
              case 116:
                return this.parseParameterDescriptionMessage(e11, n11, i11);
              case 71:
                return this.parseCopyInMessage(e11, n11, i11);
              case 72:
                return this.parseCopyOutMessage(e11, n11, i11);
              case 100:
                return this.parseCopyData(e11, n11, i11);
              default:
                return new t10.DatabaseError("received invalid response: " + r11.toString(16), n11, "error");
            }
          }
          parseReadyForQueryMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.string(1);
            return new t10.ReadyForQueryMessage(r11, i11);
          }
          parseCommandCompleteMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.cstring();
            return new t10.CommandCompleteMessage(r11, i11);
          }
          parseCopyData(e11, r11, n11) {
            let i11 = n11.slice(e11, e11 + (r11 - 4));
            return new t10.CopyDataMessage(r11, i11);
          }
          parseCopyInMessage(e11, t11, r11) {
            return this.parseCopyMessage(e11, t11, r11, "copyInResponse");
          }
          parseCopyOutMessage(e11, t11, r11) {
            return this.parseCopyMessage(e11, t11, r11, "copyOutResponse");
          }
          parseCopyMessage(e11, r11, n11, i11) {
            this.reader.setBuffer(e11, n11);
            let s10 = 0 !== this.reader.byte(), a10 = this.reader.int16(), o10 = new t10.CopyResponse(r11, i11, s10, a10);
            for (let e12 = 0; e12 < a10; e12++) o10.columnTypes[e12] = this.reader.int16();
            return o10;
          }
          parseNotificationMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int32(), s10 = this.reader.cstring(), a10 = this.reader.cstring();
            return new t10.NotificationResponseMessage(r11, i11, s10, a10);
          }
          parseRowDescriptionMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int16(), s10 = new t10.RowDescriptionMessage(r11, i11);
            for (let e12 = 0; e12 < i11; e12++) s10.fields[e12] = this.parseField();
            return s10;
          }
          parseField() {
            let e11 = this.reader.cstring(), r11 = this.reader.uint32(), n11 = this.reader.int16(), i11 = this.reader.uint32(), s10 = this.reader.int16(), a10 = this.reader.int32(), o10 = 0 === this.reader.int16() ? "text" : "binary";
            return new t10.Field(e11, r11, n11, i11, s10, a10, o10);
          }
          parseParameterDescriptionMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int16(), s10 = new t10.ParameterDescriptionMessage(r11, i11);
            for (let e12 = 0; e12 < i11; e12++) s10.dataTypeIDs[e12] = this.reader.int32();
            return s10;
          }
          parseDataRowMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int16(), s10 = Array(i11);
            for (let e12 = 0; e12 < i11; e12++) {
              let t11 = this.reader.int32();
              s10[e12] = -1 === t11 ? null : this.reader.string(t11);
            }
            return new t10.DataRowMessage(r11, s10);
          }
          parseParameterStatusMessage(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.cstring(), s10 = this.reader.cstring();
            return new t10.ParameterStatusMessage(r11, i11, s10);
          }
          parseBackendKeyData(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int32(), s10 = this.reader.int32();
            return new t10.BackendKeyDataMessage(r11, i11, s10);
          }
          parseAuthenticationResponse(e11, r11, n11) {
            this.reader.setBuffer(e11, n11);
            let i11 = this.reader.int32(), s10 = { name: "authenticationOk", length: r11 };
            switch (i11) {
              case 0:
                break;
              case 3:
                8 === s10.length && (s10.name = "authenticationCleartextPassword");
                break;
              case 5:
                if (12 === s10.length) {
                  s10.name = "authenticationMD5Password";
                  let e12 = this.reader.bytes(4);
                  return new t10.AuthenticationMD5Password(r11, e12);
                }
                break;
              case 10:
                {
                  let e12;
                  s10.name = "authenticationSASL", s10.mechanisms = [];
                  do
                    (e12 = this.reader.cstring()) && s10.mechanisms.push(e12);
                  while (e12);
                }
                break;
              case 11:
                s10.name = "authenticationSASLContinue", s10.data = this.reader.string(r11 - 8);
                break;
              case 12:
                s10.name = "authenticationSASLFinal", s10.data = this.reader.string(r11 - 8);
                break;
              default:
                throw Error("Unknown authenticationOk message type " + i11);
            }
            return s10;
          }
          parseErrorMessage(e11, r11, n11, i11) {
            this.reader.setBuffer(e11, n11);
            let s10 = {}, a10 = this.reader.string(1);
            for (; "\0" !== a10; ) s10[a10] = this.reader.cstring(), a10 = this.reader.string(1);
            let o10 = s10.M, l2 = "notice" === i11 ? new t10.NoticeMessage(r11, o10) : new t10.DatabaseError(o10, r11, i11);
            return l2.severity = s10.S, l2.code = s10.C, l2.detail = s10.D, l2.hint = s10.H, l2.position = s10.P, l2.internalPosition = s10.p, l2.internalQuery = s10.q, l2.where = s10.W, l2.schema = s10.s, l2.table = s10.t, l2.column = s10.c, l2.dataType = s10.d, l2.constraint = s10.n, l2.file = s10.F, l2.line = s10.L, l2.routine = s10.R, l2;
          }
        };
        t7(i10, "Parser"), e10.Parser = i10;
      }), nf = re((e10) => {
        ru(), Object.defineProperty(e10, "__esModule", { value: true }), e10.DatabaseError = e10.serialize = e10.parse = void 0;
        var t10 = nl();
        Object.defineProperty(e10, "DatabaseError", { enumerable: true, get: t7(function() {
          return t10.DatabaseError;
        }, "get") });
        var r10 = nc();
        Object.defineProperty(e10, "serialize", { enumerable: true, get: t7(function() {
          return r10.serialize;
        }, "get") });
        var n10 = nd();
        function i10(e11, t11) {
          let r11 = new n10.Parser();
          return e11.on("data", (e12) => r11.parse(e12, t11)), new Promise((t12) => e11.on("end", () => t12()));
        }
        t7(i10, "parse"), e10.parse = i10;
      }), np = {};
      function ng({ socket: e10, servername: t10 }) {
        return e10.startTls(t10), e10;
      }
      rt(np, { connect: () => ng });
      var nm = t9(() => {
        ru(), t7(ng, "connect");
      }), ny = re((e10, t10) => {
        ru();
        var r10 = (ry(), ri(rh)), n10 = rc().EventEmitter, { parse: i10, serialize: s10 } = nf(), a10 = s10.flush(), o10 = s10.sync(), l2 = s10.end(), u2 = class extends n10 {
          constructor(e11) {
            super(), e11 = e11 || {}, this.stream = e11.stream || new r10.Socket(), this._keepAlive = e11.keepAlive, this._keepAliveInitialDelayMillis = e11.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e11.ssl || false, this._ending = false, this._emitMessage = false;
            var t11 = this;
            this.on("newListener", function(e12) {
              "message" === e12 && (t11._emitMessage = true);
            });
          }
          connect(e11, t11) {
            var n11 = this;
            this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(e11, t11), this.stream.once("connect", function() {
              n11._keepAlive && n11.stream.setKeepAlive(true, n11._keepAliveInitialDelayMillis), n11.emit("connect");
            });
            let i11 = t7(function(e12) {
              n11._ending && ("ECONNRESET" === e12.code || "EPIPE" === e12.code) || n11.emit("error", e12);
            }, "reportStreamError");
            if (this.stream.on("error", i11), this.stream.on("close", function() {
              n11.emit("end");
            }), !this.ssl) return this.attachListeners(this.stream);
            this.stream.once("data", function(e12) {
              switch (e12.toString("utf8")) {
                case "S":
                  break;
                case "N":
                  return n11.stream.end(), n11.emit("error", Error("The server does not support SSL connections"));
                default:
                  return n11.stream.end(), n11.emit("error", Error("There was an error establishing an SSL connection"));
              }
              var s11 = (nm(), ri(np));
              let a11 = { socket: n11.stream };
              true !== n11.ssl && (Object.assign(a11, n11.ssl), "key" in n11.ssl && (a11.key = n11.ssl.key)), 0 === r10.isIP(t11) && (a11.servername = t11);
              try {
                n11.stream = s11.connect(a11);
              } catch (e13) {
                return n11.emit("error", e13);
              }
              n11.attachListeners(n11.stream), n11.stream.on("error", i11), n11.emit("sslconnect");
            });
          }
          attachListeners(e11) {
            e11.on("end", () => {
              this.emit("end");
            }), i10(e11, (e12) => {
              var t11 = "error" === e12.name ? "errorMessage" : e12.name;
              this._emitMessage && this.emit("message", e12), this.emit(t11, e12);
            });
          }
          requestSsl() {
            this.stream.write(s10.requestSsl());
          }
          startup(e11) {
            this.stream.write(s10.startup(e11));
          }
          cancel(e11, t11) {
            this._send(s10.cancel(e11, t11));
          }
          password(e11) {
            this._send(s10.password(e11));
          }
          sendSASLInitialResponseMessage(e11, t11) {
            this._send(s10.sendSASLInitialResponseMessage(e11, t11));
          }
          sendSCRAMClientFinalMessage(e11) {
            this._send(s10.sendSCRAMClientFinalMessage(e11));
          }
          _send(e11) {
            return !!this.stream.writable && this.stream.write(e11);
          }
          query(e11) {
            this._send(s10.query(e11));
          }
          parse(e11) {
            this._send(s10.parse(e11));
          }
          bind(e11) {
            this._send(s10.bind(e11));
          }
          execute(e11) {
            this._send(s10.execute(e11));
          }
          flush() {
            this.stream.writable && this.stream.write(a10);
          }
          sync() {
            this._ending = true, this._send(a10), this._send(o10);
          }
          ref() {
            this.stream.ref();
          }
          unref() {
            this.stream.unref();
          }
          end() {
            return (this._ending = true, this._connecting && this.stream.writable) ? this.stream.write(l2, () => {
              this.stream.end();
            }) : void this.stream.end();
          }
          close(e11) {
            this._send(s10.close(e11));
          }
          describe(e11) {
            this._send(s10.describe(e11));
          }
          sendCopyFromChunk(e11) {
            this._send(s10.copyData(e11));
          }
          endCopyFrom() {
            this._send(s10.copyDone());
          }
          sendCopyFail(e11) {
            this._send(s10.copyFail(e11));
          }
        };
        t7(u2, "Connection"), t10.exports = u2;
      }), nb = re((e10, t10) => {
        ru();
        var r10 = rc().EventEmitter, n10 = (rG(), ri(rV), rz()), i10 = rW(), s10 = ne(), a10 = rI(), o10 = ns(), l2 = no(), u2 = rQ(), c2 = ny(), h2 = class extends r10 {
          constructor(e11) {
            super(), this.connectionParameters = new o10(e11), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }), this.replication = this.connectionParameters.replication;
            var t11 = e11 || {};
            this._Promise = t11.Promise || tY.Promise, this._types = new a10(t11.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t11.connection || new c2({ stream: t11.stream, ssl: this.connectionParameters.ssl, keepAlive: t11.keepAlive || false, keepAliveInitialDelayMillis: t11.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t11.binary || u2.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t11.connectionTimeoutMillis || 0;
          }
          _errorAllQueries(e11) {
            let t11 = t7((t12) => {
              t1.nextTick(() => {
                t12.handleError(e11, this.connection);
              });
            }, "enqueueError");
            this.activeQuery && (t11(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t11), this.queryQueue.length = 0;
          }
          _connect(e11) {
            var t11 = this, r11 = this.connection;
            if (this._connectionCallback = e11, this._connecting || this._connected) {
              let t12 = Error("Client has already been connected. You cannot reuse a client.");
              t1.nextTick(() => {
                e11(t12);
              });
              return;
            }
            this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
              r11._ending = true, r11.stream.destroy(Error("timeout expired"));
            }, this._connectionTimeoutMillis)), this.host && 0 === this.host.indexOf("/") ? r11.connect(this.host + "/.s.PGSQL." + this.port) : r11.connect(this.port, this.host), r11.on("connect", function() {
              t11.ssl ? r11.requestSsl() : r11.startup(t11.getStartupConf());
            }), r11.on("sslconnect", function() {
              r11.startup(t11.getStartupConf());
            }), this._attachListeners(r11), r11.once("end", () => {
              let e12 = this._ending ? Error("Connection terminated") : Error("Connection terminated unexpectedly");
              clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(e12), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(e12) : this._handleErrorEvent(e12) : this._connectionError || this._handleErrorEvent(e12)), t1.nextTick(() => {
                this.emit("end");
              });
            });
          }
          connect(e11) {
            return e11 ? void this._connect(e11) : new this._Promise((e12, t11) => {
              this._connect((r11) => {
                r11 ? t11(r11) : e12();
              });
            });
          }
          _attachListeners(e11) {
            e11.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e11.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e11.on("authenticationSASL", this._handleAuthSASL.bind(this)), e11.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e11.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e11.on("backendKeyData", this._handleBackendKeyData.bind(this)), e11.on("error", this._handleErrorEvent.bind(this)), e11.on("errorMessage", this._handleErrorMessage.bind(this)), e11.on("readyForQuery", this._handleReadyForQuery.bind(this)), e11.on("notice", this._handleNotice.bind(this)), e11.on("rowDescription", this._handleRowDescription.bind(this)), e11.on("dataRow", this._handleDataRow.bind(this)), e11.on("portalSuspended", this._handlePortalSuspended.bind(this)), e11.on("emptyQuery", this._handleEmptyQuery.bind(this)), e11.on("commandComplete", this._handleCommandComplete.bind(this)), e11.on("parseComplete", this._handleParseComplete.bind(this)), e11.on("copyInResponse", this._handleCopyInResponse.bind(this)), e11.on("copyData", this._handleCopyData.bind(this)), e11.on("notification", this._handleNotification.bind(this));
          }
          _checkPgPass(e11) {
            let t11 = this.connection;
            "function" == typeof this.password ? this._Promise.resolve().then(() => this.password()).then((r11) => {
              if (void 0 !== r11) {
                if ("string" != typeof r11) return void t11.emit("error", TypeError("Password must be a string"));
                this.connectionParameters.password = this.password = r11;
              } else this.connectionParameters.password = this.password = null;
              e11();
            }).catch((e12) => {
              t11.emit("error", e12);
            }) : null !== this.password ? e11() : s10(this.connectionParameters, (t12) => {
              void 0 !== t12 && (this.connectionParameters.password = this.password = t12), e11();
            });
          }
          _handleAuthCleartextPassword(e11) {
            this._checkPgPass(() => {
              this.connection.password(this.password);
            });
          }
          _handleAuthMD5Password(e11) {
            this._checkPgPass(() => {
              let t11 = n10.postgresMd5PasswordHash(this.user, this.password, e11.salt);
              this.connection.password(t11);
            });
          }
          _handleAuthSASL(e11) {
            this._checkPgPass(() => {
              this.saslSession = i10.startSession(e11.mechanisms), this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
            });
          }
          _handleAuthSASLContinue(e11) {
            i10.continueSession(this.saslSession, this.password, e11.data), this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
          }
          _handleAuthSASLFinal(e11) {
            i10.finalizeSession(this.saslSession, e11.data), this.saslSession = null;
          }
          _handleBackendKeyData(e11) {
            this.processID = e11.processID, this.secretKey = e11.secretKey;
          }
          _handleReadyForQuery(e11) {
            this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
            let { activeQuery: t11 } = this;
            this.activeQuery = null, this.readyForQuery = true, t11 && t11.handleReadyForQuery(this.connection), this._pulseQueryQueue();
          }
          _handleErrorWhileConnecting(e11) {
            if (!this._connectionError) {
              if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e11);
              this.emit("error", e11);
            }
          }
          _handleErrorEvent(e11) {
            if (this._connecting) return this._handleErrorWhileConnecting(e11);
            this._queryable = false, this._errorAllQueries(e11), this.emit("error", e11);
          }
          _handleErrorMessage(e11) {
            if (this._connecting) return this._handleErrorWhileConnecting(e11);
            let t11 = this.activeQuery;
            t11 ? (this.activeQuery = null, t11.handleError(e11, this.connection)) : this._handleErrorEvent(e11);
          }
          _handleRowDescription(e11) {
            this.activeQuery.handleRowDescription(e11);
          }
          _handleDataRow(e11) {
            this.activeQuery.handleDataRow(e11);
          }
          _handlePortalSuspended(e11) {
            this.activeQuery.handlePortalSuspended(this.connection);
          }
          _handleEmptyQuery(e11) {
            this.activeQuery.handleEmptyQuery(this.connection);
          }
          _handleCommandComplete(e11) {
            this.activeQuery.handleCommandComplete(e11, this.connection);
          }
          _handleParseComplete(e11) {
            this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
          }
          _handleCopyInResponse(e11) {
            this.activeQuery.handleCopyInResponse(this.connection);
          }
          _handleCopyData(e11) {
            this.activeQuery.handleCopyData(e11, this.connection);
          }
          _handleNotification(e11) {
            this.emit("notification", e11);
          }
          _handleNotice(e11) {
            this.emit("notice", e11);
          }
          getStartupConf() {
            var e11 = this.connectionParameters, t11 = { user: e11.user, database: e11.database }, r11 = e11.application_name || e11.fallback_application_name;
            return r11 && (t11.application_name = r11), e11.replication && (t11.replication = "" + e11.replication), e11.statement_timeout && (t11.statement_timeout = String(parseInt(e11.statement_timeout, 10))), e11.lock_timeout && (t11.lock_timeout = String(parseInt(e11.lock_timeout, 10))), e11.idle_in_transaction_session_timeout && (t11.idle_in_transaction_session_timeout = String(parseInt(e11.idle_in_transaction_session_timeout, 10))), e11.options && (t11.options = e11.options), t11;
          }
          cancel(e11, t11) {
            if (e11.activeQuery === t11) {
              var r11 = this.connection;
              this.host && 0 === this.host.indexOf("/") ? r11.connect(this.host + "/.s.PGSQL." + this.port) : r11.connect(this.port, this.host), r11.on("connect", function() {
                r11.cancel(e11.processID, e11.secretKey);
              });
            } else -1 !== e11.queryQueue.indexOf(t11) && e11.queryQueue.splice(e11.queryQueue.indexOf(t11), 1);
          }
          setTypeParser(e11, t11, r11) {
            return this._types.setTypeParser(e11, t11, r11);
          }
          getTypeParser(e11, t11) {
            return this._types.getTypeParser(e11, t11);
          }
          escapeIdentifier(e11) {
            return '"' + e11.replace(/"/g, '""') + '"';
          }
          escapeLiteral(e11) {
            for (var t11 = false, r11 = "'", n11 = 0; n11 < e11.length; n11++) {
              var i11 = e11[n11];
              "'" === i11 ? r11 += i11 + i11 : "\\" === i11 ? (r11 += i11 + i11, t11 = true) : r11 += i11;
            }
            return r11 += "'", true === t11 && (r11 = " E" + r11), r11;
          }
          _pulseQueryQueue() {
            if (true === this.readyForQuery) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
              this.readyForQuery = false, this.hasExecuted = true;
              let e11 = this.activeQuery.submit(this.connection);
              e11 && t1.nextTick(() => {
                this.activeQuery.handleError(e11, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
              });
            } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
          }
          query(e11, t11, r11) {
            var n11, i11, s11, a11, o11;
            if (null == e11) throw TypeError("Client was passed a null or undefined query");
            return "function" == typeof e11.submit ? (s11 = e11.query_timeout || this.connectionParameters.query_timeout, i11 = n11 = e11, "function" == typeof t11 && (n11.callback = n11.callback || t11)) : (s11 = this.connectionParameters.query_timeout, (n11 = new l2(e11, t11, r11)).callback || (i11 = new this._Promise((e12, t12) => {
              n11.callback = (r12, n12) => r12 ? t12(r12) : e12(n12);
            }))), s11 && (o11 = n11.callback, a11 = setTimeout(() => {
              var e12 = Error("Query read timeout");
              t1.nextTick(() => {
                n11.handleError(e12, this.connection);
              }), o11(e12), n11.callback = () => {
              };
              var t12 = this.queryQueue.indexOf(n11);
              t12 > -1 && this.queryQueue.splice(t12, 1), this._pulseQueryQueue();
            }, s11), n11.callback = (e12, t12) => {
              clearTimeout(a11), o11(e12, t12);
            }), this.binary && !n11.binary && (n11.binary = true), n11._result && !n11._result._types && (n11._result._types = this._types), this._queryable ? this._ending ? t1.nextTick(() => {
              n11.handleError(Error("Client was closed and is not queryable"), this.connection);
            }) : (this.queryQueue.push(n11), this._pulseQueryQueue()) : t1.nextTick(() => {
              n11.handleError(Error("Client has encountered a connection error and is not queryable"), this.connection);
            }), i11;
          }
          ref() {
            this.connection.ref();
          }
          unref() {
            this.connection.unref();
          }
          end(e11) {
            if (this._ending = true, !this.connection._connecting) if (!e11) return this._Promise.resolve();
            else e11();
            if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), !e11) return new this._Promise((e12) => {
              this.connection.once("end", e12);
            });
            this.connection.once("end", e11);
          }
        };
        t7(h2, "Client"), h2.Query = l2, t10.exports = h2;
      }), nv = re((e10, t10) => {
        ru();
        var r10 = rc().EventEmitter, n10 = t7(function() {
        }, "NOOP"), i10 = t7((e11, t11) => {
          let r11 = e11.findIndex(t11);
          return -1 === r11 ? void 0 : e11.splice(r11, 1)[0];
        }, "removeWhere"), s10 = class {
          constructor(e11, t11, r11) {
            this.client = e11, this.idleListener = t11, this.timeoutId = r11;
          }
        };
        t7(s10, "IdleItem");
        var a10 = class {
          constructor(e11) {
            this.callback = e11;
          }
        };
        function o10() {
          throw Error("Release called on client which has already been released to the pool.");
        }
        function l2(e11, t11) {
          let r11, n11;
          return t11 ? { callback: t11, result: void 0 } : { callback: t7(function(e12, t12) {
            e12 ? r11(e12) : n11(t12);
          }, "cb"), result: new e11(function(e12, t12) {
            n11 = e12, r11 = t12;
          }).catch((e12) => {
            throw Error.captureStackTrace(e12), e12;
          }) };
        }
        function u2(e11, t11) {
          return t7(function r11(n11) {
            n11.client = t11, t11.removeListener("error", r11), t11.on("error", () => {
              e11.log("additional client error after disconnection due to error", n11);
            }), e11._remove(t11), e11.emit("error", n11, t11);
          }, "idleListener");
        }
        t7(a10, "PendingItem"), t7(o10, "throwOnDoubleRelease"), t7(l2, "promisify"), t7(u2, "makeIdleListener");
        var c2 = class extends r10 {
          constructor(e11, t11) {
            super(), this.options = Object.assign({}, e11), null != e11 && "password" in e11 && Object.defineProperty(this.options, "password", { configurable: true, enumerable: false, writable: true, value: e11.password }), null != e11 && e11.ssl && e11.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.min = this.options.min || 0, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
            }, this.Client = this.options.Client || t11 || nP().Client, this.Promise = this.options.Promise || tY.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
          }
          _isFull() {
            return this._clients.length >= this.options.max;
          }
          _isAboveMin() {
            return this._clients.length > this.options.min;
          }
          _pulseQueue() {
            if (this.log("pulse queue"), this.ended) return void this.log("pulse queue ended");
            if (this.ending) {
              this.log("pulse queue on ending"), this._idle.length && this._idle.slice().map((e12) => {
                this._remove(e12.client);
              }), this._clients.length || (this.ended = true, this._endCallback());
              return;
            }
            if (!this._pendingQueue.length) return void this.log("no queued requests");
            if (!this._idle.length && this._isFull()) return;
            let e11 = this._pendingQueue.shift();
            if (this._idle.length) {
              let t11 = this._idle.pop();
              clearTimeout(t11.timeoutId);
              let r11 = t11.client;
              r11.ref && r11.ref();
              let n11 = t11.idleListener;
              return this._acquireClient(r11, e11, n11, false);
            }
            if (!this._isFull()) return this.newClient(e11);
            throw Error("unexpected condition");
          }
          _remove(e11) {
            let t11 = i10(this._idle, (t12) => t12.client === e11);
            void 0 !== t11 && clearTimeout(t11.timeoutId), this._clients = this._clients.filter((t12) => t12 !== e11), e11.end(), this.emit("remove", e11);
          }
          connect(e11) {
            if (this.ending) {
              let t12 = Error("Cannot use a pool after calling end on the pool");
              return e11 ? e11(t12) : this.Promise.reject(t12);
            }
            let t11 = l2(this.Promise, e11), r11 = t11.result;
            if (this._isFull() || this._idle.length) {
              if (this._idle.length && t1.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis) return this._pendingQueue.push(new a10(t11.callback)), r11;
              let e12 = t7((e13, r12, n12) => {
                clearTimeout(s11), t11.callback(e13, r12, n12);
              }, "queueCallback"), n11 = new a10(e12), s11 = setTimeout(() => {
                i10(this._pendingQueue, (t12) => t12.callback === e12), n11.timedOut = true, t11.callback(Error("timeout exceeded when trying to connect"));
              }, this.options.connectionTimeoutMillis);
              return s11.unref && s11.unref(), this._pendingQueue.push(n11), r11;
            }
            return this.newClient(new a10(t11.callback)), r11;
          }
          newClient(e11) {
            let t11 = new this.Client(this.options);
            this._clients.push(t11);
            let r11 = u2(this, t11);
            this.log("checking client timeout");
            let i11, s11 = false;
            this.options.connectionTimeoutMillis && (i11 = setTimeout(() => {
              this.log("ending client due to timeout"), s11 = true, t11.connection ? t11.connection.stream.destroy() : t11.end();
            }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t11.connect((o11) => {
              if (i11 && clearTimeout(i11), t11.on("error", r11), o11) this.log("client failed to connect", o11), this._clients = this._clients.filter((e12) => e12 !== t11), s11 && (o11 = Error("Connection terminated due to connection timeout", { cause: o11 })), this._pulseQueue(), e11.timedOut || e11.callback(o11, void 0, n10);
              else {
                if (this.log("new client connected"), 0 !== this.options.maxLifetimeSeconds) {
                  let e12 = setTimeout(() => {
                    this.log("ending client due to expired lifetime"), this._expired.add(t11), -1 !== this._idle.findIndex((e13) => e13.client === t11) && this._acquireClient(t11, new a10((e13, t12, r12) => r12()), r11, false);
                  }, 1e3 * this.options.maxLifetimeSeconds);
                  e12.unref(), t11.once("end", () => clearTimeout(e12));
                }
                return this._acquireClient(t11, e11, r11, true);
              }
            });
          }
          _acquireClient(e11, t11, r11, i11) {
            i11 && this.emit("connect", e11), this.emit("acquire", e11), e11.release = this._releaseOnce(e11, r11), e11.removeListener("error", r11), t11.timedOut ? i11 && this.options.verify ? this.options.verify(e11, e11.release) : e11.release() : i11 && this.options.verify ? this.options.verify(e11, (r12) => {
              if (r12) return e11.release(r12), t11.callback(r12, void 0, n10);
              t11.callback(void 0, e11, e11.release);
            }) : t11.callback(void 0, e11, e11.release);
          }
          _releaseOnce(e11, t11) {
            let r11 = false;
            return (n11) => {
              r11 && o10(), r11 = true, this._release(e11, t11, n11);
            };
          }
          _release(e11, t11, r11) {
            let n11;
            if (e11.on("error", t11), e11._poolUseCount = (e11._poolUseCount || 0) + 1, this.emit("release", r11, e11), r11 || this.ending || !e11._queryable || e11._ending || e11._poolUseCount >= this.options.maxUses) {
              e11._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e11), this._pulseQueue();
              return;
            }
            if (this._expired.has(e11)) {
              this.log("remove expired client"), this._expired.delete(e11), this._remove(e11), this._pulseQueue();
              return;
            }
            this.options.idleTimeoutMillis && this._isAboveMin() && (n11 = setTimeout(() => {
              this.log("remove idle client"), this._remove(e11);
            }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && n11.unref()), this.options.allowExitOnIdle && e11.unref(), this._idle.push(new s10(e11, t11, n11)), this._pulseQueue();
          }
          query(e11, t11, r11) {
            if ("function" == typeof e11) {
              let t12 = l2(this.Promise, e11);
              return tZ(function() {
                return t12.callback(Error("Passing a function as the first parameter to pool.query is not supported"));
              }), t12.result;
            }
            "function" == typeof t11 && (r11 = t11, t11 = void 0);
            let n11 = l2(this.Promise, r11);
            return r11 = n11.callback, this.connect((n12, i11) => {
              if (n12) return r11(n12);
              let s11 = false, a11 = t7((e12) => {
                s11 || (s11 = true, i11.release(e12), r11(e12));
              }, "onError");
              i11.once("error", a11), this.log("dispatching query");
              try {
                i11.query(e11, t11, (e12, t12) => {
                  if (this.log("query dispatched"), i11.removeListener("error", a11), !s11) return s11 = true, i11.release(e12), e12 ? r11(e12) : r11(void 0, t12);
                });
              } catch (e12) {
                return i11.release(e12), r11(e12);
              }
            }), n11.result;
          }
          end(e11) {
            if (this.log("ending"), this.ending) {
              let t12 = Error("Called end on pool more than once");
              return e11 ? e11(t12) : this.Promise.reject(t12);
            }
            this.ending = true;
            let t11 = l2(this.Promise, e11);
            return this._endCallback = t11.callback, this._pulseQueue(), t11.result;
          }
          get waitingCount() {
            return this._pendingQueue.length;
          }
          get idleCount() {
            return this._idle.length;
          }
          get expiredCount() {
            return this._clients.reduce((e11, t11) => e11 + +!!this._expired.has(t11), 0);
          }
          get totalCount() {
            return this._clients.length;
          }
        };
        t7(c2, "Pool"), t10.exports = c2;
      }), nw = {};
      rt(nw, { default: () => n_ });
      var n_, nS = t9(() => {
        ru(), n_ = {};
      }), nE = re((e10, t10) => {
        t10.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: ["database", "libpq", "pg", "postgre", "postgres", "postgresql", "rdbms"], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: { "buffer-writer": "2.0.0", "packet-reader": "1.0.0", "pg-connection-string": "^2.5.0", "pg-pool": "^3.5.2", "pg-protocol": "^1.5.0", "pg-types": "^2.1.0", pgpass: "1.x" }, devDependencies: { async: "2.6.4", bluebird: "3.5.2", co: "4.6.0", "pg-copy-streams": "0.3.0" }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: { "pg-native": { optional: true } }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
      }), nx = re((e10, t10) => {
        ru();
        var r10 = rc().EventEmitter, n10 = (rG(), ri(rV)), i10 = rz(), s10 = t10.exports = function(e11, t11, n11) {
          r10.call(this), e11 = i10.normalizeQueryConfig(e11, t11, n11), this.text = e11.text, this.values = e11.values, this.name = e11.name, this.callback = e11.callback, this.state = "new", this._arrayMode = "array" === e11.rowMode, this._emitRowEvents = false, this.on("newListener", function(e12) {
            "row" === e12 && (this._emitRowEvents = true);
          }.bind(this));
        };
        n10.inherits(s10, r10);
        var a10 = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
        s10.prototype.handleError = function(e11) {
          var t11 = this.native.pq.resultErrorFields();
          if (t11) for (var r11 in t11) e11[a10[r11] || r11] = t11[r11];
          this.callback ? this.callback(e11) : this.emit("error", e11), this.state = "error";
        }, s10.prototype.then = function(e11, t11) {
          return this._getPromise().then(e11, t11);
        }, s10.prototype.catch = function(e11) {
          return this._getPromise().catch(e11);
        }, s10.prototype._getPromise = function() {
          return this._promise || (this._promise = new Promise(function(e11, t11) {
            this._once("end", e11), this._once("error", t11);
          }.bind(this))), this._promise;
        }, s10.prototype.submit = function(e11) {
          this.state = "running";
          var t11 = this;
          this.native = e11.native, e11.native.arrayMode = this._arrayMode;
          var r11 = t7(function(r12, n12, i11) {
            if (e11.native.arrayMode = false, tZ(function() {
              t11.emit("_done");
            }), r12) return t11.handleError(r12);
            t11._emitRowEvents && (i11.length > 1 ? n12.forEach((e12, r13) => {
              e12.forEach((e13) => {
                t11.emit("row", e13, i11[r13]);
              });
            }) : n12.forEach(function(e12) {
              t11.emit("row", e12, i11);
            })), t11.state = "end", t11.emit("end", i11), t11.callback && t11.callback(null, i11);
          }, "after");
          if (t1.domain && (r11 = t1.domain.bind(r11)), this.name) {
            this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", this.name, this.name.length), console.error("This can cause conflicts and silent errors executing queries"));
            var n11 = (this.values || []).map(i10.prepareValue);
            if (e11.namedQueries[this.name]) {
              if (this.text && e11.namedQueries[this.name] !== this.text) {
                let e12 = Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
                return r11(e12);
              }
              return e11.native.execute(this.name, n11, r11);
            }
            return e11.native.prepare(this.name, this.text, n11.length, function(i11) {
              return i11 ? r11(i11) : (e11.namedQueries[t11.name] = t11.text, t11.native.execute(t11.name, n11, r11));
            });
          }
          if (this.values) {
            if (!Array.isArray(this.values)) {
              let e12 = Error("Query values must be an array");
              return r11(e12);
            }
            var s11 = this.values.map(i10.prepareValue);
            e11.native.query(this.text, s11, r11);
          } else e11.native.query(this.text, r11);
        };
      }), nT = re((e10, t10) => {
        ru();
        var r10 = (nS(), ri(nw)), n10 = rI(), i10 = (nE(), rc().EventEmitter), s10 = (rG(), ri(rV)), a10 = ns(), o10 = nx(), l2 = t10.exports = function(e11) {
          i10.call(this), e11 = e11 || {}, this._Promise = e11.Promise || tY.Promise, this._types = new n10(e11.types), this.native = new r10({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
          var t11 = this.connectionParameters = new a10(e11);
          this.user = t11.user, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: t11.password }), this.database = t11.database, this.host = t11.host, this.port = t11.port, this.namedQueries = {};
        };
        l2.Query = o10, s10.inherits(l2, i10), l2.prototype._errorAllQueries = function(e11) {
          let t11 = t7((t12) => {
            t1.nextTick(() => {
              t12.native = this.native, t12.handleError(e11);
            });
          }, "enqueueError");
          this._hasActiveQuery() && (t11(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(t11), this._queryQueue.length = 0;
        }, l2.prototype._connect = function(e11) {
          var t11 = this;
          this._connecting ? t1.nextTick(() => e11(Error("Client has already been connected. You cannot reuse a client."))) : (this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(r11, n11) {
            if (r11) return e11(r11);
            t11.native.connect(n11, function(r12) {
              if (r12) return t11.native.end(), e11(r12);
              t11._connected = true, t11.native.on("error", function(e12) {
                t11._queryable = false, t11._errorAllQueries(e12), t11.emit("error", e12);
              }), t11.native.on("notification", function(e12) {
                t11.emit("notification", { channel: e12.relname, payload: e12.extra });
              }), t11.emit("connect"), t11._pulseQueryQueue(true), e11();
            });
          }));
        }, l2.prototype.connect = function(e11) {
          return e11 ? void this._connect(e11) : new this._Promise((e12, t11) => {
            this._connect((r11) => {
              r11 ? t11(r11) : e12();
            });
          });
        }, l2.prototype.query = function(e11, t11, r11) {
          var n11, i11, s11, a11, l3;
          if (null == e11) throw TypeError("Client was passed a null or undefined query");
          if ("function" == typeof e11.submit) s11 = e11.query_timeout || this.connectionParameters.query_timeout, i11 = n11 = e11, "function" == typeof t11 && (e11.callback = t11);
          else if (s11 = this.connectionParameters.query_timeout, !(n11 = new o10(e11, t11, r11)).callback) {
            let e12, t12;
            i11 = new this._Promise((r12, n12) => {
              e12 = r12, t12 = n12;
            }), n11.callback = (r12, n12) => r12 ? t12(r12) : e12(n12);
          }
          return s11 && (l3 = n11.callback, a11 = setTimeout(() => {
            var e12 = Error("Query read timeout");
            t1.nextTick(() => {
              n11.handleError(e12, this.connection);
            }), l3(e12), n11.callback = () => {
            };
            var t12 = this._queryQueue.indexOf(n11);
            t12 > -1 && this._queryQueue.splice(t12, 1), this._pulseQueryQueue();
          }, s11), n11.callback = (e12, t12) => {
            clearTimeout(a11), l3(e12, t12);
          }), this._queryable ? this._ending ? (n11.native = this.native, t1.nextTick(() => {
            n11.handleError(Error("Client was closed and is not queryable"));
          })) : (this._queryQueue.push(n11), this._pulseQueryQueue()) : (n11.native = this.native, t1.nextTick(() => {
            n11.handleError(Error("Client has encountered a connection error and is not queryable"));
          })), i11;
        }, l2.prototype.end = function(e11) {
          var t11, r11 = this;
          return this._ending = true, this._connected || this.once("connect", this.end.bind(this, e11)), e11 || (t11 = new this._Promise(function(t12, r12) {
            e11 = t7((e12) => e12 ? r12(e12) : t12(), "cb");
          })), this.native.end(function() {
            r11._errorAllQueries(Error("Connection terminated")), t1.nextTick(() => {
              r11.emit("end"), e11 && e11();
            });
          }), t11;
        }, l2.prototype._hasActiveQuery = function() {
          return this._activeQuery && "error" !== this._activeQuery.state && "end" !== this._activeQuery.state;
        }, l2.prototype._pulseQueryQueue = function(e11) {
          if (this._connected && !this._hasActiveQuery()) {
            var t11 = this._queryQueue.shift();
            if (!t11) {
              e11 || this.emit("drain");
              return;
            }
            this._activeQuery = t11, t11.submit(this);
            var r11 = this;
            t11.once("_done", function() {
              r11._pulseQueryQueue();
            });
          }
        }, l2.prototype.cancel = function(e11) {
          this._activeQuery === e11 ? this.native.cancel(function() {
          }) : -1 !== this._queryQueue.indexOf(e11) && this._queryQueue.splice(this._queryQueue.indexOf(e11), 1);
        }, l2.prototype.ref = function() {
        }, l2.prototype.unref = function() {
        }, l2.prototype.setTypeParser = function(e11, t11, r11) {
          return this._types.setTypeParser(e11, t11, r11);
        }, l2.prototype.getTypeParser = function(e11, t11) {
          return this._types.getTypeParser(e11, t11);
        };
      }), nC = re((e10, t10) => {
        ru(), t10.exports = nT();
      }), nP = re((e10, t10) => {
        ru();
        var r10 = nb(), n10 = rQ(), i10 = ny(), s10 = nv(), { DatabaseError: a10 } = nf(), o10 = t7((e11) => {
          var t11;
          return t7(t11 = class extends s10 {
            constructor(t12) {
              super(t12, e11);
            }
          }, "BoundPool"), t11;
        }, "poolFactory"), l2 = t7(function(e11) {
          this.defaults = n10, this.Client = e11, this.Query = this.Client.Query, this.Pool = o10(this.Client), this._pools = [], this.Connection = i10, this.types = rO(), this.DatabaseError = a10;
        }, "PG");
        "u" > typeof t1.env.NODE_PG_FORCE_NATIVE ? t10.exports = new l2(nC()) : (t10.exports = new l2(r10), Object.defineProperty(t10.exports, "native", { configurable: true, enumerable: false, get() {
          var e11 = null;
          try {
            e11 = new l2(nC());
          } catch (e12) {
            if ("MODULE_NOT_FOUND" !== e12.code) throw e12;
          }
          return Object.defineProperty(t10.exports, "native", { value: e11 }), e11;
        } }));
      });
      ru(), ru(), ry(), rw(), ru();
      var nA = Object.defineProperty, nR = Object.defineProperties, nN = Object.getOwnPropertyDescriptors, nO = Object.getOwnPropertySymbols, nI = Object.prototype.hasOwnProperty, nk = Object.prototype.propertyIsEnumerable, nD = t7((e10, t10, r10) => t10 in e10 ? nA(e10, t10, { enumerable: true, configurable: true, writable: true, value: r10 }) : e10[t10] = r10, "__defNormalProp"), nL = t7((e10, t10) => {
        for (var r10 in t10 || (t10 = {})) nI.call(t10, r10) && nD(e10, r10, t10[r10]);
        if (nO) for (var r10 of nO(t10)) nk.call(t10, r10) && nD(e10, r10, t10[r10]);
        return e10;
      }, "__spreadValues"), nM = t7((e10, t10) => nR(e10, nN(t10)), "__spreadProps"), nB = 2 === new Uint8Array(new Uint16Array([258]).buffer)[0], n$ = new TextDecoder(), nj = new TextEncoder(), nq = nj.encode("0123456789abcdef"), nF = nj.encode("0123456789ABCDEF"), nU = nj.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").slice();
      function nQ(e10, { alphabet: t10, scratchArr: r10 } = {}) {
        if (!h) if (h = new Uint16Array(256), d = new Uint16Array(256), nB) for (let e11 = 0; e11 < 256; e11++) h[e11] = nq[15 & e11] << 8 | nq[e11 >>> 4], d[e11] = nF[15 & e11] << 8 | nF[e11 >>> 4];
        else for (let e11 = 0; e11 < 256; e11++) h[e11] = nq[15 & e11] | nq[e11 >>> 4] << 8, d[e11] = nF[15 & e11] | nF[e11 >>> 4] << 8;
        e10.byteOffset % 4 != 0 && (e10 = new Uint8Array(e10));
        let n10 = e10.length, i10 = n10 >>> 2, s10 = r10 || new Uint16Array(n10), a10 = new Uint32Array(e10.buffer, e10.byteOffset, i10), o10 = new Uint32Array(s10.buffer, s10.byteOffset, n10 >>> 1), l2 = "upper" === t10 ? d : h, u2 = 0, c2 = 0, f2;
        if (nB) for (; u2 < i10; ) f2 = a10[u2++], o10[c2++] = l2[f2 >>> 8 & 255] << 16 | l2[255 & f2], o10[c2++] = l2[f2 >>> 24] << 16 | l2[f2 >>> 16 & 255];
        else for (; u2 < i10; ) f2 = a10[u2++], o10[c2++] = l2[f2 >>> 24] << 16 | l2[f2 >>> 16 & 255], o10[c2++] = l2[f2 >>> 8 & 255] << 16 | l2[255 & f2];
        for (u2 <<= 2; u2 < n10; ) s10[u2] = l2[e10[u2++]];
        return n$.decode(s10.subarray(0, n10));
      }
      function nz(e10, t10 = {}) {
        let r10 = "", n10 = e10.length, i10 = Math.ceil(n10 / 504e3), s10 = new Uint16Array(i10 > 1 ? 504e3 : n10);
        for (let n11 = 0; n11 < i10; n11++) {
          let i11 = 504e3 * n11, a10 = i11 + 504e3;
          r10 += nQ(e10.subarray(i11, a10), nM(nL({}, t10), { scratchArr: s10 }));
        }
        return r10;
      }
      function nV(e10, t10 = {}) {
        return "upper" !== t10.alphabet && "function" == typeof e10.toHex ? e10.toHex() : nz(e10, t10);
      }
      nU[62] = 45, nU[63] = 95, t7(nQ, "_toHex"), t7(nz, "_toHexChunked"), t7(nV, "toHex"), ru();
      var nH = class e10 {
        constructor(e11, t10) {
          this.strings = e11, this.values = t10;
        }
        toParameterizedQuery(t10 = { query: "", params: [] }) {
          let { strings: r10, values: n10 } = this;
          for (let i10 = 0, s10 = r10.length; i10 < s10; i10++) if (t10.query += r10[i10], i10 < n10.length) {
            let r11 = n10[i10];
            if (r11 instanceof nW) t10.query += r11.sql;
            else if (r11 instanceof n3) if (r11.queryData instanceof e10) r11.queryData.toParameterizedQuery(t10);
            else {
              if (r11.queryData.params?.length) throw Error("This query is not composable");
              t10.query += r11.queryData.query;
            }
            else {
              let { params: e11 } = t10;
              e11.push(r11), t10.query += "$" + e11.length, (r11 instanceof t0 || ArrayBuffer.isView(r11)) && (t10.query += "::bytea");
            }
          }
          return t10;
        }
      };
      t7(nH, "SqlTemplate");
      var nG = class {
        constructor(e10) {
          this.sql = e10;
        }
      };
      t7(nG, "UnsafeRawSql");
      var nW = nG;
      function nK() {
      }
      ru(), t7(nK, "warnIfBrowser"), ry();
      var nX = rn(rI()), nJ = rn(rz()), nY = class e10 extends Error {
        constructor(t10) {
          super(t10), rs(this, "name", "NeonDbError"), rs(this, "severity"), rs(this, "code"), rs(this, "detail"), rs(this, "hint"), rs(this, "position"), rs(this, "internalPosition"), rs(this, "internalQuery"), rs(this, "where"), rs(this, "schema"), rs(this, "table"), rs(this, "column"), rs(this, "dataType"), rs(this, "constraint"), rs(this, "file"), rs(this, "line"), rs(this, "routine"), rs(this, "sourceError"), "captureStackTrace" in Error && "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, e10);
        }
      };
      t7(nY, "NeonDbError");
      var nZ = "transaction() expects an array of queries, or a function returning an array of queries", n0 = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
      function n1(e10) {
        return e10 instanceof t0 ? "\\x" + nV(e10) : e10;
      }
      function n2(e10) {
        let { query: t10, params: r10 } = e10 instanceof nH ? e10.toParameterizedQuery() : e10;
        return { query: t10, params: r10.map((e11) => n1((0, nJ.prepareValue)(e11))) };
      }
      function n6(e10, { arrayMode: t10, fullResults: r10, fetchOptions: n10, isolationLevel: i10, readOnly: s10, deferrable: a10, authToken: o10, disableWarningInBrowsers: l2 } = {}) {
        let u2;
        if (!e10) throw Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
        try {
          u2 = rv(e10);
        } catch {
          throw Error("Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(e10));
        }
        let { protocol: c2, username: h2, hostname: d2, port: f2, pathname: p2 } = u2;
        if ("postgres:" !== c2 && "postgresql:" !== c2 || !h2 || !d2 || !p2) throw Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
        function g2(e11, ...t11) {
          if (!(Array.isArray(e11) && Array.isArray(e11.raw) && Array.isArray(t11))) throw Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');
          return new n3(m2, new nH(e11, t11));
        }
        async function m2(u3, c3, h3) {
          let p3, { fetchEndpoint: g3, fetchFunction: m3 } = rm, y2 = Array.isArray(u3) ? { queries: u3.map((e11) => n2(e11)) } : n2(u3), b2 = n10 ?? {}, v2 = t10 ?? false, w2 = r10 ?? false, _2 = i10, S2 = s10, E2 = a10;
          void 0 !== h3 && (void 0 !== h3.fetchOptions && (b2 = { ...b2, ...h3.fetchOptions }), void 0 !== h3.arrayMode && (v2 = h3.arrayMode), void 0 !== h3.fullResults && (w2 = h3.fullResults), void 0 !== h3.isolationLevel && (_2 = h3.isolationLevel), void 0 !== h3.readOnly && (S2 = h3.readOnly), void 0 !== h3.deferrable && (E2 = h3.deferrable)), void 0 === c3 || Array.isArray(c3) || void 0 === c3.fetchOptions || (b2 = { ...b2, ...c3.fetchOptions });
          let x2 = o10;
          Array.isArray(c3) || c3?.authToken === void 0 || (x2 = c3.authToken);
          let T2 = "function" == typeof g3 ? g3(d2, f2, { jwtAuth: void 0 !== x2 }) : g3, C2 = { "Neon-Connection-String": e10, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" }, P2 = await n8(x2);
          P2 && (C2.Authorization = `Bearer ${P2}`), Array.isArray(u3) && (void 0 !== _2 && (C2["Neon-Batch-Isolation-Level"] = _2), void 0 !== S2 && (C2["Neon-Batch-Read-Only"] = String(S2)), void 0 !== E2 && (C2["Neon-Batch-Deferrable"] = String(E2))), l2 || rm.disableWarningInBrowsers || nK();
          try {
            p3 = await (m3 ?? fetch)(T2, { method: "POST", body: JSON.stringify(y2), headers: C2, ...b2 });
          } catch (t11) {
            let e11 = new nY(`Error connecting to database: ${t11}`);
            throw e11.sourceError = t11, e11;
          }
          if (p3.ok) {
            let e11 = await p3.json();
            if (Array.isArray(u3)) {
              let t11 = e11.results;
              if (!Array.isArray(t11)) throw new nY("Neon internal error: unexpected result format");
              return t11.map((e12, t12) => {
                let r11 = c3[t12] ?? {};
                return n4(e12, { arrayMode: r11.arrayMode ?? v2, fullResults: r11.fullResults ?? w2, types: r11.types });
              });
            }
            {
              let t11 = c3 ?? {};
              return n4(e11, { arrayMode: t11.arrayMode ?? v2, fullResults: t11.fullResults ?? w2, types: t11.types });
            }
          }
          {
            let { status: e11 } = p3;
            if (400 === e11) {
              let e12 = await p3.json(), t11 = new nY(e12.message);
              for (let r11 of n0) t11[r11] = e12[r11] ?? void 0;
              throw t11;
            }
            {
              let t11 = await p3.text();
              throw new nY(`Server error (HTTP status ${e11}): ${t11}`);
            }
          }
        }
        return t7(g2, "templateFn"), g2.query = (e11, t11, r11) => new n3(m2, { query: e11, params: t11 ?? [] }, r11), g2.unsafe = (e11) => new nW(e11), g2.transaction = async (e11, t11) => {
          if ("function" == typeof e11 && (e11 = e11(g2)), !Array.isArray(e11)) throw Error(nZ);
          return e11.forEach((e12) => {
            if (!(e12 instanceof n3)) throw Error(nZ);
          }), m2(e11.map((e12) => e12.queryData), e11.map((e12) => e12.opts ?? {}), t11);
        }, t7(m2, "execute"), g2;
      }
      t7(n1, "encodeBuffersAsBytea"), t7(n2, "prepareQuery"), t7(n6, "neon");
      var n5 = class {
        constructor(e10, t10, r10) {
          this.execute = e10, this.queryData = t10, this.opts = r10;
        }
        then(e10, t10) {
          return this.execute(this.queryData, this.opts).then(e10, t10);
        }
        catch(e10) {
          return this.execute(this.queryData, this.opts).catch(e10);
        }
        finally(e10) {
          return this.execute(this.queryData, this.opts).finally(e10);
        }
      };
      t7(n5, "NeonQueryPromise");
      var n3 = n5;
      function n4(e10, { arrayMode: t10, fullResults: r10, types: n10 }) {
        let i10 = new nX.default(n10), s10 = e10.fields.map((e11) => e11.name), a10 = e10.fields.map((e11) => i10.getTypeParser(e11.dataTypeID)), o10 = true === t10 ? e10.rows.map((e11) => e11.map((e12, t11) => null === e12 ? null : a10[t11](e12))) : e10.rows.map((e11) => Object.fromEntries(e11.map((e12, t11) => [s10[t11], null === e12 ? null : a10[t11](e12)])));
        return r10 ? (e10.viaNeonFetch = true, e10.rowAsArray = t10, e10.rows = o10, e10._parsers = a10, e10._types = i10, e10) : o10;
      }
      async function n8(e10) {
        if ("string" == typeof e10) return e10;
        if ("function" == typeof e10) try {
          return await Promise.resolve(e10());
        } catch (t10) {
          let e11 = new nY("Error getting auth token.");
          throw t10 instanceof Error && (e11 = new nY(`Error getting auth token: ${t10.message}`)), e11;
        }
      }
      t7(n4, "processQueryResult"), t7(n8, "getAuthToken"), ru();
      var n7 = rn(nP());
      ru();
      var n9 = rn(nP()), ie = class extends n9.Client {
        constructor(e10) {
          super(e10), this.config = e10;
        }
        get neonConfig() {
          return this.connection.stream;
        }
        connect(e10) {
          let { neonConfig: t10 } = this;
          t10.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && t10.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
          let r10 = "string" != typeof this.config && this.config?.host !== void 0 || "string" != typeof this.config && this.config?.connectionString !== void 0 || void 0 !== t1.env.PGHOST, n10 = t1.env.USER ?? t1.env.USERNAME;
          if (!r10 && "localhost" === this.host && this.user === n10 && this.database === n10 && null === this.password) throw Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${n10}, db: ${n10}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
          let i10 = super.connect(e10), s10 = t10.pipelineTLS && this.ssl, a10 = "password" === t10.pipelineConnect;
          if (!s10 && !t10.pipelineConnect) return i10;
          let o10 = this.connection;
          if (s10 && o10.on("connect", () => o10.stream.emit("data", "S")), a10) {
            o10.removeAllListeners("authenticationCleartextPassword"), o10.removeAllListeners("readyForQuery"), o10.once("readyForQuery", () => o10.on("readyForQuery", this._handleReadyForQuery.bind(this)));
            let e11 = this.ssl ? "sslconnect" : "connect";
            o10.on(e11, () => {
              this.neonConfig.disableWarningInBrowsers || nK(), this._handleAuthCleartextPassword(), this._handleReadyForQuery();
            });
          }
          return i10;
        }
        async _handleAuthSASLContinue(e10) {
          if (typeof crypto > "u" || void 0 === crypto.subtle || void 0 === crypto.subtle.importKey) throw Error("Cannot use SASL auth when `crypto.subtle` is not defined");
          let t10 = crypto.subtle, r10 = this.saslSession, n10 = this.password, i10 = e10.data;
          if ("SASLInitialResponse" !== r10.message || "string" != typeof n10 || "string" != typeof i10) throw Error("SASL: protocol error");
          let s10 = Object.fromEntries(i10.split(",").map((e11) => {
            if (!/^.=/.test(e11)) throw Error("SASL: Invalid attribute pair entry");
            return [e11[0], e11.substring(2)];
          })), a10 = s10.r, o10 = s10.s, l2 = s10.i;
          if (!a10 || !/^[!-+--~]+$/.test(a10)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
          if (!o10 || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(o10)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");
          if (!l2 || !/^[1-9][0-9]*$/.test(l2)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");
          if (!a10.startsWith(r10.clientNonce)) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
          if (a10.length === r10.clientNonce.length) throw Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
          let u2 = parseInt(l2, 10), c2 = t0.from(o10, "base64"), h2 = new TextEncoder(), d2 = h2.encode(n10), f2 = await t10.importKey("raw", d2, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), p2 = new Uint8Array(await t10.sign("HMAC", f2, t0.concat([c2, t0.from([0, 0, 0, 1])]))), g2 = p2;
          for (var m2 = 0; m2 < u2 - 1; m2++) p2 = new Uint8Array(await t10.sign("HMAC", f2, p2)), g2 = t0.from(g2.map((e11, t11) => g2[t11] ^ p2[t11]));
          let y2 = g2, b2 = await t10.importKey("raw", y2, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), v2 = new Uint8Array(await t10.sign("HMAC", b2, h2.encode("Client Key"))), w2 = await t10.digest("SHA-256", v2), _2 = "n=*,r=" + r10.clientNonce, S2 = "r=" + a10 + ",s=" + o10 + ",i=" + u2, E2 = "c=biws,r=" + a10, x2 = _2 + "," + S2 + "," + E2, T2 = await t10.importKey("raw", w2, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
          var C2 = new Uint8Array(await t10.sign("HMAC", T2, h2.encode(x2))), P2 = t0.from(v2.map((e11, t11) => v2[t11] ^ C2[t11])).toString("base64");
          let A2 = await t10.importKey("raw", y2, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), R2 = await t10.sign("HMAC", A2, h2.encode("Server Key")), N2 = await t10.importKey("raw", R2, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
          var O2 = t0.from(await t10.sign("HMAC", N2, h2.encode(x2)));
          r10.message = "SASLResponse", r10.serverSignature = O2.toString("base64"), r10.response = E2 + ",p=" + P2, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
        }
      };
      t7(ie, "NeonClient"), ry();
      var it = rn(ns());
      function ir(e10, t10) {
        let r10, n10;
        return t10 ? { callback: t10, result: void 0 } : { callback: t7(function(e11, t11) {
          e11 ? r10(e11) : n10(t11);
        }, "cb"), result: new e10(function(e11, t11) {
          n10 = e11, r10 = t11;
        }) };
      }
      t7(ir, "promisify"), t7(class extends n7.Pool {
        constructor() {
          super(...arguments), rs(this, "Client", ie), rs(this, "hasFetchUnsupportedListeners", false), rs(this, "addListener", this.on);
        }
        on(e10, t10) {
          return "error" !== e10 && (this.hasFetchUnsupportedListeners = true), super.on(e10, t10);
        }
        query(e10, t10, r10) {
          if (!rm.poolQueryViaFetch || this.hasFetchUnsupportedListeners || "function" == typeof e10) return super.query(e10, t10, r10);
          "function" == typeof t10 && (r10 = t10, t10 = void 0);
          let n10 = ir(this.Promise, r10);
          r10 = n10.callback;
          try {
            let n11 = new it.default(this.options), i10 = encodeURIComponent, s10 = encodeURI, a10 = `postgresql://${i10(n11.user)}:${i10(n11.password)}@${i10(n11.host)}/${s10(n11.database)}`, o10 = "string" == typeof e10 ? e10 : e10.text, l2 = t10 ?? e10.values ?? [];
            n6(a10, { fullResults: true, arrayMode: "array" === e10.rowMode }).query(o10, l2, { types: e10.types ?? this.options?.types }).then((e11) => r10(void 0, e11)).catch((e11) => r10(e11));
          } catch (e11) {
            r10(e11);
          }
          return n10.result;
        }
      }, "NeonPool"), ry();
      var ii = rn(nP());
      ii.DatabaseError, ii.defaults, ii.escapeIdentifier, ii.escapeLiteral;
      var is = ii.types;
      class ia {
        static [eB] = "ConsoleLogWriter";
        write(e10) {
          console.log(e10);
        }
      }
      class io {
        static [eB] = "DefaultLogger";
        writer;
        constructor(e10) {
          this.writer = e10?.writer ?? new ia();
        }
        logQuery(e10, t10) {
          let r10 = t10.map((e11) => {
            try {
              return JSON.stringify(e11);
            } catch {
              return String(e11);
            }
          }), n10 = r10.length ? ` -- params: [${r10.join(", ")}]` : "";
          this.writer.write(`Query: ${e10}${n10}`);
        }
      }
      class il {
        static [eB] = "NoopLogger";
        logQuery() {
        }
      }
      class iu {
        static [eB] = "QueryPromise";
        [Symbol.toStringTag] = "QueryPromise";
        catch(e10) {
          return this.then(void 0, e10);
        }
        finally(e10) {
          return this.then((t10) => (e10?.(), t10), (t10) => {
            throw e10?.(), t10;
          });
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
      }
      class ic {
        constructor(e10) {
          this.table = e10;
        }
        static [eB] = "ColumnAliasProxyHandler";
        get(e10, t10) {
          return "table" === t10 ? this.table : e10[t10];
        }
      }
      class ih {
        constructor(e10, t10) {
          this.alias = e10, this.replaceOriginalName = t10;
        }
        static [eB] = "TableAliasProxyHandler";
        get(e10, t10) {
          if (t10 === eK.Symbol.IsAlias) return true;
          if (t10 === eK.Symbol.Name || this.replaceOriginalName && t10 === eK.Symbol.OriginalName) return this.alias;
          if (t10 === th) return { ...e10[th], name: this.alias, isAlias: true };
          if (t10 === eK.Symbol.Columns) {
            let t11 = e10[eK.Symbol.Columns];
            if (!t11) return t11;
            let r11 = {};
            return Object.keys(t11).map((n10) => {
              r11[n10] = new Proxy(t11[n10], new ic(new Proxy(e10, this)));
            }), r11;
          }
          let r10 = e10[t10];
          return e$(r10, ej) ? new Proxy(r10, new ic(new Proxy(e10, this))) : r10;
        }
      }
      class id {
        constructor(e10) {
          this.alias = e10;
        }
        static [eB] = "RelationTableAliasProxyHandler";
        get(e10, t10) {
          return "sourceTable" === t10 ? ip(e10.sourceTable, this.alias) : e10[t10];
        }
      }
      function ip(e10, t10) {
        return new Proxy(e10, new ih(t10, false));
      }
      function ig(e10, t10) {
        return new Proxy(e10, new ic(new Proxy(e10.table, new ih(t10, false))));
      }
      function im(e10, t10) {
        return new tg.Aliased(iy(e10.sql, t10), e10.fieldAlias);
      }
      function iy(e10, t10) {
        return tw.join(e10.queryChunks.map((e11) => e$(e11, ej) ? ig(e11, t10) : e$(e11, tg) ? iy(e11, t10) : e$(e11, tg.Aliased) ? im(e11, t10) : e11));
      }
      class ib {
        static [eB] = "SelectionProxyHandler";
        config;
        constructor(e10) {
          this.config = { ...e10 };
        }
        get(e10, t10) {
          if ("_" === t10) return { ...e10._, selectedFields: new Proxy(e10._.selectedFields, this) };
          if (t10 === th) return { ...e10[th], selectedFields: new Proxy(e10[th].selectedFields, this) };
          if ("symbol" == typeof t10) return e10[t10];
          let r10 = (e$(e10, tl) ? e10._.selectedFields : e$(e10, tC) ? e10[th].selectedFields : e10)[t10];
          if (e$(r10, tg.Aliased)) {
            if ("sql" === this.config.sqlAliasedBehavior && !r10.isSelectionField) return r10.sql;
            let e11 = r10.clone();
            return e11.isSelectionField = true, e11;
          }
          if (e$(r10, tg)) {
            if ("sql" === this.config.sqlBehavior) return r10;
            throw Error(`You tried to reference "${t10}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
          }
          return e$(r10, ej) ? this.config.alias ? new Proxy(r10, new ic(new Proxy(r10.table, new ih(this.config.alias, this.config.replaceOriginalName ?? false)))) : r10 : "object" != typeof r10 || null === r10 ? r10 : new Proxy(r10, new ib(this.config));
        }
      }
      function iv(e10, t10) {
        return Object.entries(e10).reduce((e11, [r10, n10]) => {
          if ("string" != typeof r10) return e11;
          let i10 = t10 ? [...t10, r10] : [r10];
          return e$(n10, ej) || e$(n10, tg) || e$(n10, tg.Aliased) || e$(n10, tl) ? e11.push({ path: i10, field: n10 }) : e$(n10, eK) ? e11.push(...iv(n10[eK.Symbol.Columns], i10)) : e11.push(...iv(n10, i10)), e11;
        }, []);
      }
      function iw(e10, t10) {
        let r10 = Object.keys(e10), n10 = Object.keys(t10);
        if (r10.length !== n10.length) return false;
        for (let [e11, t11] of r10.entries()) if (t11 !== n10[e11]) return false;
        return true;
      }
      function i_(e10, t10) {
        let r10 = Object.entries(t10).filter(([, e11]) => void 0 !== e11).map(([t11, r11]) => e$(r11, tg) || e$(r11, ej) ? [t11, r11] : [t11, new tv(r11, e10[eK.Symbol.Columns][t11])]);
        if (0 === r10.length) throw Error("No values to set");
        return Object.fromEntries(r10);
      }
      function iS(e10) {
        return e10[eK.Symbol.Columns];
      }
      function iE(e10) {
        return e$(e10, tl) ? e10._.alias : e$(e10, tC) ? e10[th].name : e$(e10, tg) ? void 0 : e10[eK.Symbol.IsAlias] ? e10[eK.Symbol.Name] : e10[eK.Symbol.BaseName];
      }
      function ix(e10, t10) {
        return { name: "string" == typeof e10 && e10.length > 0 ? e10 : "", config: "object" == typeof e10 ? e10 : t10 };
      }
      "u" < typeof TextDecoder || new TextDecoder();
      class iT extends e4 {
        static [eB] = "PgIntColumnBaseBuilder";
        generatedAlwaysAsIdentity(e10) {
          if (e10) {
            let { name: t10, ...r10 } = e10;
            this.config.generatedIdentity = { type: "always", sequenceName: t10, sequenceOptions: r10 };
          } else this.config.generatedIdentity = { type: "always" };
          return this.config.hasDefault = true, this.config.notNull = true, this;
        }
        generatedByDefaultAsIdentity(e10) {
          if (e10) {
            let { name: t10, ...r10 } = e10;
            this.config.generatedIdentity = { type: "byDefault", sequenceName: t10, sequenceOptions: r10 };
          } else this.config.generatedIdentity = { type: "byDefault" };
          return this.config.hasDefault = true, this.config.notNull = true, this;
        }
      }
      class iC extends iT {
        static [eB] = "PgBigInt53Builder";
        constructor(e10) {
          super(e10, "number", "PgBigInt53");
        }
        build(e10) {
          return new iP(e10, this.config);
        }
      }
      class iP extends e8 {
        static [eB] = "PgBigInt53";
        getSQLType() {
          return "bigint";
        }
        mapFromDriverValue(e10) {
          return "number" == typeof e10 ? e10 : Number(e10);
        }
      }
      class iA extends iT {
        static [eB] = "PgBigInt64Builder";
        constructor(e10) {
          super(e10, "bigint", "PgBigInt64");
        }
        build(e10) {
          return new iR(e10, this.config);
        }
      }
      class iR extends e8 {
        static [eB] = "PgBigInt64";
        getSQLType() {
          return "bigint";
        }
        mapFromDriverValue(e10) {
          return BigInt(e10);
        }
      }
      function iN(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return "number" === n10.mode ? new iC(r10) : new iA(r10);
      }
      class iO extends e4 {
        static [eB] = "PgBigSerial53Builder";
        constructor(e10) {
          super(e10, "number", "PgBigSerial53"), this.config.hasDefault = true, this.config.notNull = true;
        }
        build(e10) {
          return new iI(e10, this.config);
        }
      }
      class iI extends e8 {
        static [eB] = "PgBigSerial53";
        getSQLType() {
          return "bigserial";
        }
        mapFromDriverValue(e10) {
          return "number" == typeof e10 ? e10 : Number(e10);
        }
      }
      class ik extends e4 {
        static [eB] = "PgBigSerial64Builder";
        constructor(e10) {
          super(e10, "bigint", "PgBigSerial64"), this.config.hasDefault = true;
        }
        build(e10) {
          return new iD(e10, this.config);
        }
      }
      class iD extends e8 {
        static [eB] = "PgBigSerial64";
        getSQLType() {
          return "bigserial";
        }
        mapFromDriverValue(e10) {
          return BigInt(e10);
        }
      }
      function iL(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return "number" === n10.mode ? new iO(r10) : new ik(r10);
      }
      class iM extends e4 {
        static [eB] = "PgBooleanBuilder";
        constructor(e10) {
          super(e10, "boolean", "PgBoolean");
        }
        build(e10) {
          return new iB(e10, this.config);
        }
      }
      class iB extends e8 {
        static [eB] = "PgBoolean";
        getSQLType() {
          return "boolean";
        }
      }
      function i$(e10) {
        return new iM(e10 ?? "");
      }
      class ij extends e4 {
        static [eB] = "PgCharBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgChar"), this.config.length = t10.length, this.config.enumValues = t10.enum;
        }
        build(e10) {
          return new iq(e10, this.config);
        }
      }
      class iq extends e8 {
        static [eB] = "PgChar";
        length = this.config.length;
        enumValues = this.config.enumValues;
        getSQLType() {
          return void 0 === this.length ? "char" : `char(${this.length})`;
        }
      }
      function iF(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new ij(r10, n10);
      }
      class iU extends e4 {
        static [eB] = "PgCidrBuilder";
        constructor(e10) {
          super(e10, "string", "PgCidr");
        }
        build(e10) {
          return new iQ(e10, this.config);
        }
      }
      class iQ extends e8 {
        static [eB] = "PgCidr";
        getSQLType() {
          return "cidr";
        }
      }
      function iz(e10) {
        return new iU(e10 ?? "");
      }
      class iV extends e4 {
        static [eB] = "PgCustomColumnBuilder";
        constructor(e10, t10, r10) {
          super(e10, "custom", "PgCustomColumn"), this.config.fieldConfig = t10, this.config.customTypeParams = r10;
        }
        build(e10) {
          return new iH(e10, this.config);
        }
      }
      class iH extends e8 {
        static [eB] = "PgCustomColumn";
        sqlName;
        mapTo;
        mapFrom;
        constructor(e10, t10) {
          super(e10, t10), this.sqlName = t10.customTypeParams.dataType(t10.fieldConfig), this.mapTo = t10.customTypeParams.toDriver, this.mapFrom = t10.customTypeParams.fromDriver;
        }
        getSQLType() {
          return this.sqlName;
        }
        mapFromDriverValue(e10) {
          return "function" == typeof this.mapFrom ? this.mapFrom(e10) : e10;
        }
        mapToDriverValue(e10) {
          return "function" == typeof this.mapTo ? this.mapTo(e10) : e10;
        }
      }
      function iG(e10) {
        return (t10, r10) => {
          let { name: n10, config: i10 } = ix(t10, r10);
          return new iV(n10, i10, e10);
        };
      }
      class iW extends e4 {
        static [eB] = "PgDateColumnBaseBuilder";
        defaultNow() {
          return this.default(tw`now()`);
        }
      }
      class iK extends iW {
        static [eB] = "PgDateBuilder";
        constructor(e10) {
          super(e10, "date", "PgDate");
        }
        build(e10) {
          return new iX(e10, this.config);
        }
      }
      class iX extends e8 {
        static [eB] = "PgDate";
        getSQLType() {
          return "date";
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? new Date(e10) : e10;
        }
        mapToDriverValue(e10) {
          return e10.toISOString();
        }
      }
      class iJ extends iW {
        static [eB] = "PgDateStringBuilder";
        constructor(e10) {
          super(e10, "string", "PgDateString");
        }
        build(e10) {
          return new iY(e10, this.config);
        }
      }
      class iY extends e8 {
        static [eB] = "PgDateString";
        getSQLType() {
          return "date";
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? e10 : e10.toISOString().slice(0, -14);
        }
      }
      function iZ(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return n10?.mode === "date" ? new iK(r10) : new iJ(r10);
      }
      class i0 extends e4 {
        static [eB] = "PgDoublePrecisionBuilder";
        constructor(e10) {
          super(e10, "number", "PgDoublePrecision");
        }
        build(e10) {
          return new i1(e10, this.config);
        }
      }
      class i1 extends e8 {
        static [eB] = "PgDoublePrecision";
        getSQLType() {
          return "double precision";
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? Number.parseFloat(e10) : e10;
        }
      }
      function i2(e10) {
        return new i0(e10 ?? "");
      }
      class i6 extends e4 {
        static [eB] = "PgInetBuilder";
        constructor(e10) {
          super(e10, "string", "PgInet");
        }
        build(e10) {
          return new i5(e10, this.config);
        }
      }
      class i5 extends e8 {
        static [eB] = "PgInet";
        getSQLType() {
          return "inet";
        }
      }
      function i3(e10) {
        return new i6(e10 ?? "");
      }
      class i4 extends iT {
        static [eB] = "PgIntegerBuilder";
        constructor(e10) {
          super(e10, "number", "PgInteger");
        }
        build(e10) {
          return new i8(e10, this.config);
        }
      }
      class i8 extends e8 {
        static [eB] = "PgInteger";
        getSQLType() {
          return "integer";
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? Number.parseInt(e10) : e10;
        }
      }
      function i7(e10) {
        return new i4(e10 ?? "");
      }
      class i9 extends e4 {
        static [eB] = "PgIntervalBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgInterval"), this.config.intervalConfig = t10;
        }
        build(e10) {
          return new se(e10, this.config);
        }
      }
      class se extends e8 {
        static [eB] = "PgInterval";
        fields = this.config.intervalConfig.fields;
        precision = this.config.intervalConfig.precision;
        getSQLType() {
          let e10 = this.fields ? ` ${this.fields}` : "", t10 = this.precision ? `(${this.precision})` : "";
          return `interval${e10}${t10}`;
        }
      }
      function st(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new i9(r10, n10);
      }
      class sr extends e4 {
        static [eB] = "PgJsonBuilder";
        constructor(e10) {
          super(e10, "json", "PgJson");
        }
        build(e10) {
          return new sn(e10, this.config);
        }
      }
      class sn extends e8 {
        static [eB] = "PgJson";
        constructor(e10, t10) {
          super(e10, t10);
        }
        getSQLType() {
          return "json";
        }
        mapToDriverValue(e10) {
          return JSON.stringify(e10);
        }
        mapFromDriverValue(e10) {
          if ("string" == typeof e10) try {
            return JSON.parse(e10);
          } catch {
          }
          return e10;
        }
      }
      function si(e10) {
        return new sr(e10 ?? "");
      }
      class ss extends e4 {
        static [eB] = "PgJsonbBuilder";
        constructor(e10) {
          super(e10, "json", "PgJsonb");
        }
        build(e10) {
          return new sa(e10, this.config);
        }
      }
      class sa extends e8 {
        static [eB] = "PgJsonb";
        constructor(e10, t10) {
          super(e10, t10);
        }
        getSQLType() {
          return "jsonb";
        }
        mapToDriverValue(e10) {
          return JSON.stringify(e10);
        }
        mapFromDriverValue(e10) {
          if ("string" == typeof e10) try {
            return JSON.parse(e10);
          } catch {
          }
          return e10;
        }
      }
      function so(e10) {
        return new ss(e10 ?? "");
      }
      class sl extends e4 {
        static [eB] = "PgLineBuilder";
        constructor(e10) {
          super(e10, "array", "PgLine");
        }
        build(e10) {
          return new su(e10, this.config);
        }
      }
      class su extends e8 {
        static [eB] = "PgLine";
        getSQLType() {
          return "line";
        }
        mapFromDriverValue(e10) {
          let [t10, r10, n10] = e10.slice(1, -1).split(",");
          return [Number.parseFloat(t10), Number.parseFloat(r10), Number.parseFloat(n10)];
        }
        mapToDriverValue(e10) {
          return `{${e10[0]},${e10[1]},${e10[2]}}`;
        }
      }
      class sc extends e4 {
        static [eB] = "PgLineABCBuilder";
        constructor(e10) {
          super(e10, "json", "PgLineABC");
        }
        build(e10) {
          return new sh(e10, this.config);
        }
      }
      class sh extends e8 {
        static [eB] = "PgLineABC";
        getSQLType() {
          return "line";
        }
        mapFromDriverValue(e10) {
          let [t10, r10, n10] = e10.slice(1, -1).split(",");
          return { a: Number.parseFloat(t10), b: Number.parseFloat(r10), c: Number.parseFloat(n10) };
        }
        mapToDriverValue(e10) {
          return `{${e10.a},${e10.b},${e10.c}}`;
        }
      }
      function sd(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return n10?.mode && "tuple" !== n10.mode ? new sc(r10) : new sl(r10);
      }
      class sf extends e4 {
        static [eB] = "PgMacaddrBuilder";
        constructor(e10) {
          super(e10, "string", "PgMacaddr");
        }
        build(e10) {
          return new sp(e10, this.config);
        }
      }
      class sp extends e8 {
        static [eB] = "PgMacaddr";
        getSQLType() {
          return "macaddr";
        }
      }
      function sg(e10) {
        return new sf(e10 ?? "");
      }
      class sm extends e4 {
        static [eB] = "PgMacaddr8Builder";
        constructor(e10) {
          super(e10, "string", "PgMacaddr8");
        }
        build(e10) {
          return new sy(e10, this.config);
        }
      }
      class sy extends e8 {
        static [eB] = "PgMacaddr8";
        getSQLType() {
          return "macaddr8";
        }
      }
      function sb(e10) {
        return new sm(e10 ?? "");
      }
      class sv extends e4 {
        static [eB] = "PgNumericBuilder";
        constructor(e10, t10, r10) {
          super(e10, "string", "PgNumeric"), this.config.precision = t10, this.config.scale = r10;
        }
        build(e10) {
          return new sw(e10, this.config);
        }
      }
      class sw extends e8 {
        static [eB] = "PgNumeric";
        precision;
        scale;
        constructor(e10, t10) {
          super(e10, t10), this.precision = t10.precision, this.scale = t10.scale;
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? e10 : String(e10);
        }
        getSQLType() {
          return void 0 !== this.precision && void 0 !== this.scale ? `numeric(${this.precision}, ${this.scale})` : void 0 === this.precision ? "numeric" : `numeric(${this.precision})`;
        }
      }
      class s_ extends e4 {
        static [eB] = "PgNumericNumberBuilder";
        constructor(e10, t10, r10) {
          super(e10, "number", "PgNumericNumber"), this.config.precision = t10, this.config.scale = r10;
        }
        build(e10) {
          return new sS(e10, this.config);
        }
      }
      class sS extends e8 {
        static [eB] = "PgNumericNumber";
        precision;
        scale;
        constructor(e10, t10) {
          super(e10, t10), this.precision = t10.precision, this.scale = t10.scale;
        }
        mapFromDriverValue(e10) {
          return "number" == typeof e10 ? e10 : Number(e10);
        }
        mapToDriverValue = String;
        getSQLType() {
          return void 0 !== this.precision && void 0 !== this.scale ? `numeric(${this.precision}, ${this.scale})` : void 0 === this.precision ? "numeric" : `numeric(${this.precision})`;
        }
      }
      class sE extends e4 {
        static [eB] = "PgNumericBigIntBuilder";
        constructor(e10, t10, r10) {
          super(e10, "bigint", "PgNumericBigInt"), this.config.precision = t10, this.config.scale = r10;
        }
        build(e10) {
          return new sx(e10, this.config);
        }
      }
      class sx extends e8 {
        static [eB] = "PgNumericBigInt";
        precision;
        scale;
        constructor(e10, t10) {
          super(e10, t10), this.precision = t10.precision, this.scale = t10.scale;
        }
        mapFromDriverValue = BigInt;
        mapToDriverValue = String;
        getSQLType() {
          return void 0 !== this.precision && void 0 !== this.scale ? `numeric(${this.precision}, ${this.scale})` : void 0 === this.precision ? "numeric" : `numeric(${this.precision})`;
        }
      }
      function sT(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10), i10 = n10?.mode;
        return "number" === i10 ? new s_(r10, n10?.precision, n10?.scale) : "bigint" === i10 ? new sE(r10, n10?.precision, n10?.scale) : new sv(r10, n10?.precision, n10?.scale);
      }
      class sC extends e4 {
        static [eB] = "PgPointTupleBuilder";
        constructor(e10) {
          super(e10, "array", "PgPointTuple");
        }
        build(e10) {
          return new sP(e10, this.config);
        }
      }
      class sP extends e8 {
        static [eB] = "PgPointTuple";
        getSQLType() {
          return "point";
        }
        mapFromDriverValue(e10) {
          if ("string" == typeof e10) {
            let [t10, r10] = e10.slice(1, -1).split(",");
            return [Number.parseFloat(t10), Number.parseFloat(r10)];
          }
          return [e10.x, e10.y];
        }
        mapToDriverValue(e10) {
          return `(${e10[0]},${e10[1]})`;
        }
      }
      class sA extends e4 {
        static [eB] = "PgPointObjectBuilder";
        constructor(e10) {
          super(e10, "json", "PgPointObject");
        }
        build(e10) {
          return new sR(e10, this.config);
        }
      }
      class sR extends e8 {
        static [eB] = "PgPointObject";
        getSQLType() {
          return "point";
        }
        mapFromDriverValue(e10) {
          if ("string" == typeof e10) {
            let [t10, r10] = e10.slice(1, -1).split(",");
            return { x: Number.parseFloat(t10), y: Number.parseFloat(r10) };
          }
          return e10;
        }
        mapToDriverValue(e10) {
          return `(${e10.x},${e10.y})`;
        }
      }
      function sN(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return n10?.mode && "tuple" !== n10.mode ? new sA(r10) : new sC(r10);
      }
      function sO(e10, t10) {
        let r10 = new DataView(new ArrayBuffer(8));
        for (let n10 = 0; n10 < 8; n10++) r10.setUint8(n10, e10[t10 + n10]);
        return r10.getFloat64(0, true);
      }
      function sI(e10) {
        let t10 = function(e11) {
          let t11 = [];
          for (let r11 = 0; r11 < e11.length; r11 += 2) t11.push(Number.parseInt(e11.slice(r11, r11 + 2), 16));
          return new Uint8Array(t11);
        }(e10), r10 = 0, n10 = t10[0];
        r10 += 1;
        let i10 = new DataView(t10.buffer), s10 = i10.getUint32(r10, 1 === n10);
        if (r10 += 4, 536870912 & s10 && (i10.getUint32(r10, 1 === n10), r10 += 4), (65535 & s10) == 1) {
          let e11 = sO(t10, r10), n11 = sO(t10, r10 += 8);
          return r10 += 8, [e11, n11];
        }
        throw Error("Unsupported geometry type");
      }
      class sk extends e4 {
        static [eB] = "PgGeometryBuilder";
        constructor(e10) {
          super(e10, "array", "PgGeometry");
        }
        build(e10) {
          return new sD(e10, this.config);
        }
      }
      class sD extends e8 {
        static [eB] = "PgGeometry";
        getSQLType() {
          return "geometry(point)";
        }
        mapFromDriverValue(e10) {
          return sI(e10);
        }
        mapToDriverValue(e10) {
          return `point(${e10[0]} ${e10[1]})`;
        }
      }
      class sL extends e4 {
        static [eB] = "PgGeometryObjectBuilder";
        constructor(e10) {
          super(e10, "json", "PgGeometryObject");
        }
        build(e10) {
          return new sM(e10, this.config);
        }
      }
      class sM extends e8 {
        static [eB] = "PgGeometryObject";
        getSQLType() {
          return "geometry(point)";
        }
        mapFromDriverValue(e10) {
          let t10 = sI(e10);
          return { x: t10[0], y: t10[1] };
        }
        mapToDriverValue(e10) {
          return `point(${e10.x} ${e10.y})`;
        }
      }
      function sB(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return n10?.mode && "tuple" !== n10.mode ? new sL(r10) : new sk(r10);
      }
      class s$ extends e4 {
        static [eB] = "PgRealBuilder";
        constructor(e10, t10) {
          super(e10, "number", "PgReal"), this.config.length = t10;
        }
        build(e10) {
          return new sj(e10, this.config);
        }
      }
      class sj extends e8 {
        static [eB] = "PgReal";
        constructor(e10, t10) {
          super(e10, t10);
        }
        getSQLType() {
          return "real";
        }
        mapFromDriverValue = (e10) => "string" == typeof e10 ? Number.parseFloat(e10) : e10;
      }
      function sq(e10) {
        return new s$(e10 ?? "");
      }
      class sF extends e4 {
        static [eB] = "PgSerialBuilder";
        constructor(e10) {
          super(e10, "number", "PgSerial"), this.config.hasDefault = true, this.config.notNull = true;
        }
        build(e10) {
          return new sU(e10, this.config);
        }
      }
      class sU extends e8 {
        static [eB] = "PgSerial";
        getSQLType() {
          return "serial";
        }
      }
      function sQ(e10) {
        return new sF(e10 ?? "");
      }
      class sz extends iT {
        static [eB] = "PgSmallIntBuilder";
        constructor(e10) {
          super(e10, "number", "PgSmallInt");
        }
        build(e10) {
          return new sV(e10, this.config);
        }
      }
      class sV extends e8 {
        static [eB] = "PgSmallInt";
        getSQLType() {
          return "smallint";
        }
        mapFromDriverValue = (e10) => "string" == typeof e10 ? Number(e10) : e10;
      }
      function sH(e10) {
        return new sz(e10 ?? "");
      }
      class sG extends e4 {
        static [eB] = "PgSmallSerialBuilder";
        constructor(e10) {
          super(e10, "number", "PgSmallSerial"), this.config.hasDefault = true, this.config.notNull = true;
        }
        build(e10) {
          return new sW(e10, this.config);
        }
      }
      class sW extends e8 {
        static [eB] = "PgSmallSerial";
        getSQLType() {
          return "smallserial";
        }
      }
      function sK(e10) {
        return new sG(e10 ?? "");
      }
      class sX extends e4 {
        static [eB] = "PgTextBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgText"), this.config.enumValues = t10.enum;
        }
        build(e10) {
          return new sJ(e10, this.config);
        }
      }
      class sJ extends e8 {
        static [eB] = "PgText";
        enumValues = this.config.enumValues;
        getSQLType() {
          return "text";
        }
      }
      function sY(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new sX(r10, n10);
      }
      class sZ extends iW {
        constructor(e10, t10, r10) {
          super(e10, "string", "PgTime"), this.withTimezone = t10, this.precision = r10, this.config.withTimezone = t10, this.config.precision = r10;
        }
        static [eB] = "PgTimeBuilder";
        build(e10) {
          return new s0(e10, this.config);
        }
      }
      class s0 extends e8 {
        static [eB] = "PgTime";
        withTimezone;
        precision;
        constructor(e10, t10) {
          super(e10, t10), this.withTimezone = t10.withTimezone, this.precision = t10.precision;
        }
        getSQLType() {
          let e10 = void 0 === this.precision ? "" : `(${this.precision})`;
          return `time${e10}${this.withTimezone ? " with time zone" : ""}`;
        }
      }
      function s1(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new sZ(r10, n10.withTimezone ?? false, n10.precision);
      }
      class s2 extends iW {
        static [eB] = "PgTimestampBuilder";
        constructor(e10, t10, r10) {
          super(e10, "date", "PgTimestamp"), this.config.withTimezone = t10, this.config.precision = r10;
        }
        build(e10) {
          return new s6(e10, this.config);
        }
      }
      class s6 extends e8 {
        static [eB] = "PgTimestamp";
        withTimezone;
        precision;
        constructor(e10, t10) {
          super(e10, t10), this.withTimezone = t10.withTimezone, this.precision = t10.precision;
        }
        getSQLType() {
          let e10 = void 0 === this.precision ? "" : ` (${this.precision})`;
          return `timestamp${e10}${this.withTimezone ? " with time zone" : ""}`;
        }
        mapFromDriverValue(e10) {
          return "string" == typeof e10 ? new Date(this.withTimezone ? e10 : e10 + "+0000") : e10;
        }
        mapToDriverValue = (e10) => e10.toISOString();
      }
      class s5 extends iW {
        static [eB] = "PgTimestampStringBuilder";
        constructor(e10, t10, r10) {
          super(e10, "string", "PgTimestampString"), this.config.withTimezone = t10, this.config.precision = r10;
        }
        build(e10) {
          return new s3(e10, this.config);
        }
      }
      class s3 extends e8 {
        static [eB] = "PgTimestampString";
        withTimezone;
        precision;
        constructor(e10, t10) {
          super(e10, t10), this.withTimezone = t10.withTimezone, this.precision = t10.precision;
        }
        getSQLType() {
          let e10 = void 0 === this.precision ? "" : `(${this.precision})`;
          return `timestamp${e10}${this.withTimezone ? " with time zone" : ""}`;
        }
        mapFromDriverValue(e10) {
          if ("string" == typeof e10) return e10;
          let t10 = e10.toISOString().slice(0, -1).replace("T", " ");
          if (this.withTimezone) {
            let r10 = e10.getTimezoneOffset();
            return `${t10}${r10 <= 0 ? "+" : "-"}${Math.floor(Math.abs(r10) / 60).toString().padStart(2, "0")}`;
          }
          return t10;
        }
      }
      function s4(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return n10?.mode === "string" ? new s5(r10, n10.withTimezone ?? false, n10.precision) : new s2(r10, n10?.withTimezone ?? false, n10?.precision);
      }
      class s8 extends e4 {
        static [eB] = "PgUUIDBuilder";
        constructor(e10) {
          super(e10, "string", "PgUUID");
        }
        defaultRandom() {
          return this.default(tw`gen_random_uuid()`);
        }
        build(e10) {
          return new s7(e10, this.config);
        }
      }
      class s7 extends e8 {
        static [eB] = "PgUUID";
        getSQLType() {
          return "uuid";
        }
      }
      function s9(e10) {
        return new s8(e10 ?? "");
      }
      class ae extends e4 {
        static [eB] = "PgVarcharBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgVarchar"), this.config.length = t10.length, this.config.enumValues = t10.enum;
        }
        build(e10) {
          return new at(e10, this.config);
        }
      }
      class at extends e8 {
        static [eB] = "PgVarchar";
        length = this.config.length;
        enumValues = this.config.enumValues;
        getSQLType() {
          return void 0 === this.length ? "varchar" : `varchar(${this.length})`;
        }
      }
      function ar(e10, t10 = {}) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new ae(r10, n10);
      }
      class an extends e4 {
        static [eB] = "PgBinaryVectorBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgBinaryVector"), this.config.dimensions = t10.dimensions;
        }
        build(e10) {
          return new ai(e10, this.config);
        }
      }
      class ai extends e8 {
        static [eB] = "PgBinaryVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `bit(${this.dimensions})`;
        }
      }
      function as(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new an(r10, n10);
      }
      class aa extends e4 {
        static [eB] = "PgHalfVectorBuilder";
        constructor(e10, t10) {
          super(e10, "array", "PgHalfVector"), this.config.dimensions = t10.dimensions;
        }
        build(e10) {
          return new ao(e10, this.config);
        }
      }
      class ao extends e8 {
        static [eB] = "PgHalfVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `halfvec(${this.dimensions})`;
        }
        mapToDriverValue(e10) {
          return JSON.stringify(e10);
        }
        mapFromDriverValue(e10) {
          return e10.slice(1, -1).split(",").map((e11) => Number.parseFloat(e11));
        }
      }
      function al(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new aa(r10, n10);
      }
      class au extends e4 {
        static [eB] = "PgSparseVectorBuilder";
        constructor(e10, t10) {
          super(e10, "string", "PgSparseVector"), this.config.dimensions = t10.dimensions;
        }
        build(e10) {
          return new ac(e10, this.config);
        }
      }
      class ac extends e8 {
        static [eB] = "PgSparseVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `sparsevec(${this.dimensions})`;
        }
      }
      function ah(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new au(r10, n10);
      }
      class ad extends e4 {
        static [eB] = "PgVectorBuilder";
        constructor(e10, t10) {
          super(e10, "array", "PgVector"), this.config.dimensions = t10.dimensions;
        }
        build(e10) {
          return new af(e10, this.config);
        }
      }
      class af extends e8 {
        static [eB] = "PgVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `vector(${this.dimensions})`;
        }
        mapToDriverValue(e10) {
          return JSON.stringify(e10);
        }
        mapFromDriverValue(e10) {
          return e10.slice(1, -1).split(",").map((e11) => Number.parseFloat(e11));
        }
      }
      function ap(e10, t10) {
        let { name: r10, config: n10 } = ix(e10, t10);
        return new ad(r10, n10);
      }
      let ag = Symbol.for("drizzle:PgInlineForeignKeys"), am = Symbol.for("drizzle:EnableRLS");
      class ay extends eK {
        static [eB] = "PgTable";
        static Symbol = Object.assign({}, eK.Symbol, { InlineForeignKeys: ag, EnableRLS: am });
        [ag] = [];
        [am] = false;
        [eK.Symbol.ExtraConfigBuilder] = void 0;
        [eK.Symbol.ExtraConfigColumns] = {};
      }
      let ab = (e10, t10, r10) => function(e11, t11, r11, n10, i10 = e11) {
        let s10 = new ay(e11, n10, i10), a10 = "function" == typeof t11 ? t11({ bigint: iN, bigserial: iL, boolean: i$, char: iF, cidr: iz, customType: iG, date: iZ, doublePrecision: i2, inet: i3, integer: i7, interval: st, json: si, jsonb: so, line: sd, macaddr: sg, macaddr8: sb, numeric: sT, point: sN, geometry: sB, real: sq, serial: sQ, smallint: sH, smallserial: sK, text: sY, time: s1, timestamp: s4, uuid: s9, varchar: ar, bit: as, halfvec: al, sparsevec: ah, vector: ap }) : t11, o10 = Object.fromEntries(Object.entries(a10).map(([e12, t12]) => {
          t12.setName(e12);
          let r12 = t12.build(s10);
          return s10[ag].push(...t12.buildForeignKeys(r12, s10)), [e12, r12];
        })), l2 = Object.fromEntries(Object.entries(a10).map(([e12, t12]) => (t12.setName(e12), [e12, t12.buildExtraConfigColumn(s10)]))), u2 = Object.assign(s10, o10);
        return u2[eK.Symbol.Columns] = o10, u2[eK.Symbol.ExtraConfigColumns] = l2, r11 && (u2[ay.Symbol.ExtraConfigBuilder] = r11), Object.assign(u2, { enableRLS: () => (u2[ay.Symbol.EnableRLS] = true, u2) });
      }(e10, t10, r10, void 0);
      class av {
        constructor(e10, t10) {
          this.name = e10, this.value = t10;
        }
        static [eB] = "PgCheckBuilder";
        brand;
        build(e10) {
          return new aw(e10, this);
        }
      }
      class aw {
        constructor(e10, t10) {
          this.table = e10, this.name = t10.name, this.value = t10.value;
        }
        static [eB] = "PgCheck";
        name;
        value;
      }
      class a_ {
        constructor(e10, t10) {
          this.unique = e10, this.name = t10;
        }
        static [eB] = "PgIndexBuilderOn";
        on(...e10) {
          return new aS(e10.map((e11) => {
            if (e$(e11, tg)) return e11;
            let t10 = new e9(e11.name, !!e11.keyAsName, e11.columnType, e11.indexConfig);
            return e11.indexConfig = JSON.parse(JSON.stringify(e11.defaultConfig)), t10;
          }), this.unique, false, this.name);
        }
        onOnly(...e10) {
          return new aS(e10.map((e11) => {
            if (e$(e11, tg)) return e11;
            let t10 = new e9(e11.name, !!e11.keyAsName, e11.columnType, e11.indexConfig);
            return e11.indexConfig = e11.defaultConfig, t10;
          }), this.unique, true, this.name);
        }
        using(e10, ...t10) {
          return new aS(t10.map((e11) => {
            if (e$(e11, tg)) return e11;
            let t11 = new e9(e11.name, !!e11.keyAsName, e11.columnType, e11.indexConfig);
            return e11.indexConfig = JSON.parse(JSON.stringify(e11.defaultConfig)), t11;
          }), this.unique, true, this.name, e10);
        }
      }
      class aS {
        static [eB] = "PgIndexBuilder";
        config;
        constructor(e10, t10, r10, n10, i10 = "btree") {
          this.config = { name: n10, columns: e10, unique: t10, only: r10, method: i10 };
        }
        concurrently() {
          return this.config.concurrently = true, this;
        }
        with(e10) {
          return this.config.with = e10, this;
        }
        where(e10) {
          return this.config.where = e10, this;
        }
        build(e10) {
          return new aE(this.config, e10);
        }
      }
      class aE {
        static [eB] = "PgIndex";
        config;
        constructor(e10, t10) {
          this.config = { ...e10, table: t10 };
        }
      }
      function ax(e10) {
        return new a_(false, e10);
      }
      function aT(e10) {
        return new a_(true, e10);
      }
      class aC {
        constructor(e10, t10) {
          this.name = e10, t10 && (this.as = t10.as, this.for = t10.for, this.to = t10.to, this.using = t10.using, this.withCheck = t10.withCheck);
        }
        static [eB] = "PgPolicy";
        as;
        for;
        to;
        using;
        withCheck;
        _linkedTable;
        link(e10) {
          return this._linkedTable = e10, this;
        }
      }
      function aP(...e10) {
        return e10[0].columns ? new aA(e10[0].columns, e10[0].name) : new aA(e10);
      }
      class aA {
        static [eB] = "PgPrimaryKeyBuilder";
        columns;
        name;
        constructor(e10, t10) {
          this.columns = e10, this.name = t10;
        }
        build(e10) {
          return new aR(e10, this.columns, this.name);
        }
      }
      class aR {
        constructor(e10, t10, r10) {
          this.table = e10, this.columns = t10, this.name = r10;
        }
        static [eB] = "PgPrimaryKey";
        columns;
        name;
        getName() {
          return this.name ?? `${this.table[ay.Symbol.Name]}_${this.columns.map((e10) => e10.name).join("_")}_pk`;
        }
      }
      let aN = Symbol.for("drizzle:PgViewConfig");
      function aO(e10) {
        return (e10.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((e11) => e11.toLowerCase()).join("_");
      }
      function aI(e10) {
        return (e10.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((e11, t10, r10) => e11 + (0 === r10 ? t10.toLowerCase() : `${t10[0].toUpperCase()}${t10.slice(1)}`), "");
      }
      function ak(e10) {
        return e10;
      }
      class aD {
        static [eB] = "CasingCache";
        cache = {};
        cachedTables = {};
        convert;
        constructor(e10) {
          this.convert = "snake_case" === e10 ? aO : "camelCase" === e10 ? aI : ak;
        }
        getColumnCasing(e10) {
          if (!e10.keyAsName) return e10.name;
          let t10 = e10.table[eK.Symbol.Schema] ?? "public", r10 = e10.table[eK.Symbol.OriginalName], n10 = `${t10}.${r10}.${e10.name}`;
          return this.cache[n10] || this.cacheTable(e10.table), this.cache[n10];
        }
        cacheTable(e10) {
          let t10 = e10[eK.Symbol.Schema] ?? "public", r10 = e10[eK.Symbol.OriginalName], n10 = `${t10}.${r10}`;
          if (!this.cachedTables[n10]) {
            for (let t11 of Object.values(e10[eK.Symbol.Columns])) {
              let e11 = `${n10}.${t11.name}`;
              this.cache[e11] = this.convert(t11.name);
            }
            this.cachedTables[n10] = true;
          }
        }
        clearCache() {
          this.cache = {}, this.cachedTables = {};
        }
      }
      class aL extends Error {
        static [eB] = "DrizzleError";
        constructor({ message: e10, cause: t10 }) {
          super(e10), this.name = "DrizzleError", this.cause = t10;
        }
      }
      class aM extends Error {
        constructor(e10, t10, r10) {
          super(`Failed query: ${e10}
params: ${t10}`), this.query = e10, this.params = t10, this.cause = r10, Error.captureStackTrace(this, aM), r10 && (this.cause = r10);
        }
      }
      class aB extends aL {
        static [eB] = "TransactionRollbackError";
        constructor() {
          super({ message: "Rollback" });
        }
      }
      class a$ {
        constructor(e10, t10, r10) {
          this.sourceTable = e10, this.referencedTable = t10, this.relationName = r10, this.referencedTableName = t10[eK.Symbol.Name];
        }
        static [eB] = "Relation";
        referencedTableName;
        fieldName;
      }
      class aj {
        constructor(e10, t10) {
          this.table = e10, this.config = t10;
        }
        static [eB] = "Relations";
      }
      class aq extends a$ {
        constructor(e10, t10, r10, n10) {
          super(e10, t10, r10?.relationName), this.config = r10, this.isNullable = n10;
        }
        static [eB] = "One";
        withFieldName(e10) {
          let t10 = new aq(this.sourceTable, this.referencedTable, this.config, this.isNullable);
          return t10.fieldName = e10, t10;
        }
      }
      class aF extends a$ {
        constructor(e10, t10, r10) {
          super(e10, t10, r10?.relationName), this.config = r10;
        }
        static [eB] = "Many";
        withFieldName(e10) {
          let t10 = new aF(this.sourceTable, this.referencedTable, this.config);
          return t10.fieldName = e10, t10;
        }
      }
      function aU(e10) {
        return { one: function(t10, r10) {
          return new aq(e10, t10, r10, r10?.fields.reduce((e11, t11) => e11 && t11.notNull, true) ?? false);
        }, many: function(t10, r10) {
          return new aF(e10, t10, r10);
        } };
      }
      class aQ extends tC {
        static [eB] = "PgViewBase";
      }
      class az {
        static [eB] = "PgDialect";
        casing;
        constructor(e10) {
          this.casing = new aD(e10?.casing);
        }
        async migrate(e10, t10, r10) {
          let n10 = "string" == typeof r10 ? "__drizzle_migrations" : r10.migrationsTable ?? "__drizzle_migrations", i10 = "string" == typeof r10 ? "drizzle" : r10.migrationsSchema ?? "drizzle", s10 = tw`
			CREATE TABLE IF NOT EXISTS ${tw.identifier(i10)}.${tw.identifier(n10)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
          await t10.execute(tw`CREATE SCHEMA IF NOT EXISTS ${tw.identifier(i10)}`), await t10.execute(s10);
          let a10 = (await t10.all(tw`select id, hash, created_at from ${tw.identifier(i10)}.${tw.identifier(n10)} order by created_at desc limit 1`))[0];
          await t10.transaction(async (t11) => {
            for await (let r11 of e10) if (!a10 || Number(a10.created_at) < r11.folderMillis) {
              for (let e11 of r11.sql) await t11.execute(tw.raw(e11));
              await t11.execute(tw`insert into ${tw.identifier(i10)}.${tw.identifier(n10)} ("hash", "created_at") values(${r11.hash}, ${r11.folderMillis})`);
            }
          });
        }
        escapeName(e10) {
          return `"${e10.replace(/"/g, '""')}"`;
        }
        escapeParam(e10) {
          return `$${e10 + 1}`;
        }
        escapeString(e10) {
          return `'${e10.replace(/'/g, "''")}'`;
        }
        buildWithCTE(e10) {
          if (!e10?.length) return;
          let t10 = [tw`with `];
          for (let [r10, n10] of e10.entries()) t10.push(tw`${tw.identifier(n10._.alias)} as (${n10._.sql})`), r10 < e10.length - 1 && t10.push(tw`, `);
          return t10.push(tw` `), tw.join(t10);
        }
        buildDeleteQuery({ table: e10, where: t10, returning: r10, withList: n10 }) {
          let i10 = this.buildWithCTE(n10), s10 = r10 ? tw` returning ${this.buildSelection(r10, { isSingleTable: true })}` : void 0, a10 = t10 ? tw` where ${t10}` : void 0;
          return tw`${i10}delete from ${e10}${a10}${s10}`;
        }
        buildUpdateSet(e10, t10) {
          let r10 = e10[eK.Symbol.Columns], n10 = Object.keys(r10).filter((e11) => void 0 !== t10[e11] || r10[e11]?.onUpdateFn !== void 0), i10 = n10.length;
          return tw.join(n10.flatMap((e11, n11) => {
            let s10 = r10[e11], a10 = s10.onUpdateFn?.(), o10 = t10[e11] ?? (e$(a10, tg) ? a10 : tw.param(a10, s10)), l2 = tw`${tw.identifier(this.casing.getColumnCasing(s10))} = ${o10}`;
            return n11 < i10 - 1 ? [l2, tw.raw(", ")] : [l2];
          }));
        }
        buildUpdateQuery({ table: e10, set: t10, where: r10, returning: n10, withList: i10, from: s10, joins: a10 }) {
          let o10 = this.buildWithCTE(i10), l2 = e10[ay.Symbol.Name], u2 = e10[ay.Symbol.Schema], c2 = e10[ay.Symbol.OriginalName], h2 = l2 === c2 ? void 0 : l2, d2 = tw`${u2 ? tw`${tw.identifier(u2)}.` : void 0}${tw.identifier(c2)}${h2 && tw` ${tw.identifier(h2)}`}`, f2 = this.buildUpdateSet(e10, t10), p2 = s10 && tw.join([tw.raw(" from "), this.buildFromTable(s10)]), g2 = this.buildJoins(a10), m2 = n10 ? tw` returning ${this.buildSelection(n10, { isSingleTable: !s10 })}` : void 0, y2 = r10 ? tw` where ${r10}` : void 0;
          return tw`${o10}update ${d2} set ${f2}${p2}${g2}${y2}${m2}`;
        }
        buildSelection(e10, { isSingleTable: t10 = false } = {}) {
          let r10 = e10.length, n10 = e10.flatMap(({ field: e11 }, n11) => {
            let i10 = [];
            if (e$(e11, tg.Aliased) && e11.isSelectionField) i10.push(tw.identifier(e11.fieldAlias));
            else if (e$(e11, tg.Aliased) || e$(e11, tg)) {
              let r11 = e$(e11, tg.Aliased) ? e11.sql : e11;
              t10 ? i10.push(new tg(r11.queryChunks.map((e12) => e$(e12, e8) ? tw.identifier(this.casing.getColumnCasing(e12)) : e12))) : i10.push(r11), e$(e11, tg.Aliased) && i10.push(tw` as ${tw.identifier(e11.fieldAlias)}`);
            } else if (e$(e11, ej)) t10 ? i10.push(tw.identifier(this.casing.getColumnCasing(e11))) : i10.push(e11);
            else if (e$(e11, tl)) {
              let t11 = Object.entries(e11._.selectedFields);
              if (1 === t11.length) {
                let r11 = t11[0][1], n12 = e$(r11, tg) ? r11.decoder : e$(r11, ej) ? { mapFromDriverValue: (e12) => r11.mapFromDriverValue(e12) } : r11.sql.decoder;
                n12 && (e11._.sql.decoder = n12);
              }
              i10.push(e11);
            }
            return n11 < r10 - 1 && i10.push(tw`, `), i10;
          });
          return tw.join(n10);
        }
        buildJoins(e10) {
          if (!e10 || 0 === e10.length) return;
          let t10 = [];
          for (let [r10, n10] of e10.entries()) {
            0 === r10 && t10.push(tw` `);
            let i10 = n10.table, s10 = n10.lateral ? tw` lateral` : void 0, a10 = n10.on ? tw` on ${n10.on}` : void 0;
            if (e$(i10, ay)) {
              let e11 = i10[ay.Symbol.Name], r11 = i10[ay.Symbol.Schema], o10 = i10[ay.Symbol.OriginalName], l2 = e11 === o10 ? void 0 : n10.alias;
              t10.push(tw`${tw.raw(n10.joinType)} join${s10} ${r11 ? tw`${tw.identifier(r11)}.` : void 0}${tw.identifier(o10)}${l2 && tw` ${tw.identifier(l2)}`}${a10}`);
            } else if (e$(i10, tC)) {
              let e11 = i10[th].name, r11 = i10[th].schema, o10 = i10[th].originalName, l2 = e11 === o10 ? void 0 : n10.alias;
              t10.push(tw`${tw.raw(n10.joinType)} join${s10} ${r11 ? tw`${tw.identifier(r11)}.` : void 0}${tw.identifier(o10)}${l2 && tw` ${tw.identifier(l2)}`}${a10}`);
            } else t10.push(tw`${tw.raw(n10.joinType)} join${s10} ${i10}${a10}`);
            r10 < e10.length - 1 && t10.push(tw` `);
          }
          return tw.join(t10);
        }
        buildFromTable(e10) {
          if (e$(e10, eK) && e10[eK.Symbol.IsAlias]) {
            let t10 = tw`${tw.identifier(e10[eK.Symbol.OriginalName])}`;
            return e10[eK.Symbol.Schema] && (t10 = tw`${tw.identifier(e10[eK.Symbol.Schema])}.${t10}`), tw`${t10} ${tw.identifier(e10[eK.Symbol.Name])}`;
          }
          return e10;
        }
        buildSelectQuery({ withList: e10, fields: t10, fieldsFlat: r10, where: n10, having: i10, table: s10, joins: a10, orderBy: o10, groupBy: l2, limit: u2, offset: c2, lockingClause: h2, distinct: d2, setOperators: f2 }) {
          let p2, g2, m2, y2 = r10 ?? iv(t10);
          for (let e11 of y2) {
            let t11;
            if (e$(e11.field, ej) && e11.field.table[eq] !== (e$(s10, tl) ? s10._.alias : e$(s10, aQ) ? s10[th].name : e$(s10, tg) ? void 0 : s10[eq]) && (t11 = e11.field.table, !a10?.some(({ alias: e12 }) => e12 === (t11[eK.Symbol.IsAlias] ? t11[eq] : t11[eK.Symbol.BaseName])))) {
              let t12 = e11.field.table[eq];
              throw Error(`Your "${e11.path.join("->")}" field references a column "${t12}"."${e11.field.name}", but the table "${t12}" is not part of the query! Did you forget to join it?`);
            }
          }
          let b2 = !a10 || 0 === a10.length, v2 = this.buildWithCTE(e10);
          d2 && (p2 = true === d2 ? tw` distinct` : tw` distinct on (${tw.join(d2.on, tw`, `)})`);
          let w2 = this.buildSelection(y2, { isSingleTable: b2 }), _2 = this.buildFromTable(s10), S2 = this.buildJoins(a10), E2 = n10 ? tw` where ${n10}` : void 0, x2 = i10 ? tw` having ${i10}` : void 0;
          o10 && o10.length > 0 && (g2 = tw` order by ${tw.join(o10, tw`, `)}`), l2 && l2.length > 0 && (m2 = tw` group by ${tw.join(l2, tw`, `)}`);
          let T2 = "object" == typeof u2 || "number" == typeof u2 && u2 >= 0 ? tw` limit ${u2}` : void 0, C2 = c2 ? tw` offset ${c2}` : void 0, P2 = tw.empty();
          if (h2) {
            let e11 = tw` for ${tw.raw(h2.strength)}`;
            h2.config.of && e11.append(tw` of ${tw.join(Array.isArray(h2.config.of) ? h2.config.of : [h2.config.of], tw`, `)}`), h2.config.noWait ? e11.append(tw` nowait`) : h2.config.skipLocked && e11.append(tw` skip locked`), P2.append(e11);
          }
          let A2 = tw`${v2}select${p2} ${w2} from ${_2}${S2}${E2}${m2}${x2}${g2}${T2}${C2}${P2}`;
          return f2.length > 0 ? this.buildSetOperations(A2, f2) : A2;
        }
        buildSetOperations(e10, t10) {
          let [r10, ...n10] = t10;
          if (!r10) throw Error("Cannot pass undefined values to any set operator");
          return 0 === n10.length ? this.buildSetOperationQuery({ leftSelect: e10, setOperator: r10 }) : this.buildSetOperations(this.buildSetOperationQuery({ leftSelect: e10, setOperator: r10 }), n10);
        }
        buildSetOperationQuery({ leftSelect: e10, setOperator: { type: t10, isAll: r10, rightSelect: n10, limit: i10, orderBy: s10, offset: a10 } }) {
          let o10, l2 = tw`(${e10.getSQL()}) `, u2 = tw`(${n10.getSQL()})`;
          if (s10 && s10.length > 0) {
            let e11 = [];
            for (let t11 of s10) if (e$(t11, e8)) e11.push(tw.identifier(t11.name));
            else if (e$(t11, tg)) {
              for (let e12 = 0; e12 < t11.queryChunks.length; e12++) {
                let r11 = t11.queryChunks[e12];
                e$(r11, e8) && (t11.queryChunks[e12] = tw.identifier(r11.name));
              }
              e11.push(tw`${t11}`);
            } else e11.push(tw`${t11}`);
            o10 = tw` order by ${tw.join(e11, tw`, `)} `;
          }
          let c2 = "object" == typeof i10 || "number" == typeof i10 && i10 >= 0 ? tw` limit ${i10}` : void 0, h2 = tw.raw(`${t10} ${r10 ? "all " : ""}`), d2 = a10 ? tw` offset ${a10}` : void 0;
          return tw`${l2}${h2}${u2}${o10}${c2}${d2}`;
        }
        buildInsertQuery({ table: e10, values: t10, onConflict: r10, returning: n10, withList: i10, select: s10, overridingSystemValue_: a10 }) {
          let o10 = [], l2 = Object.entries(e10[eK.Symbol.Columns]).filter(([e11, t11]) => !t11.shouldDisableInsert()), u2 = l2.map(([, e11]) => tw.identifier(this.casing.getColumnCasing(e11)));
          if (s10) e$(t10, tg) ? o10.push(t10) : o10.push(t10.getSQL());
          else for (let [e11, r11] of (o10.push(tw.raw("values ")), t10.entries())) {
            let n11 = [];
            for (let [e12, t11] of l2) {
              let i11 = r11[e12];
              if (void 0 === i11 || e$(i11, tv) && void 0 === i11.value) if (void 0 !== t11.defaultFn) {
                let e13 = t11.defaultFn(), r12 = e$(e13, tg) ? e13 : tw.param(e13, t11);
                n11.push(r12);
              } else if (t11.default || void 0 === t11.onUpdateFn) n11.push(tw`default`);
              else {
                let e13 = t11.onUpdateFn(), r12 = e$(e13, tg) ? e13 : tw.param(e13, t11);
                n11.push(r12);
              }
              else n11.push(i11);
            }
            o10.push(n11), e11 < t10.length - 1 && o10.push(tw`, `);
          }
          let c2 = this.buildWithCTE(i10), h2 = tw.join(o10), d2 = n10 ? tw` returning ${this.buildSelection(n10, { isSingleTable: true })}` : void 0, f2 = r10 ? tw` on conflict ${r10}` : void 0, p2 = true === a10 ? tw`overriding system value ` : void 0;
          return tw`${c2}insert into ${e10} ${u2} ${p2}${h2}${f2}${d2}`;
        }
        buildRefreshMaterializedViewQuery({ view: e10, concurrently: t10, withNoData: r10 }) {
          let n10 = t10 ? tw` concurrently` : void 0, i10 = r10 ? tw` with no data` : void 0;
          return tw`refresh materialized view${n10} ${e10}${i10}`;
        }
        prepareTyping(e10) {
          if (e$(e10, sa) || e$(e10, sn)) return "json";
          if (e$(e10, sw)) return "decimal";
          if (e$(e10, s0)) return "time";
          if (e$(e10, s6) || e$(e10, s3)) return "timestamp";
          if (e$(e10, iX) || e$(e10, iY)) return "date";
          else if (e$(e10, s7)) return "uuid";
          else return "none";
        }
        sqlToQuery(e10, t10) {
          return e10.toQuery({ casing: this.casing, escapeName: this.escapeName, escapeParam: this.escapeParam, escapeString: this.escapeString, prepareTyping: this.prepareTyping, invokeSource: t10 });
        }
        buildRelationalQueryWithoutPK({ fullSchema: e10, schema: t10, tableNamesMap: r10, table: n10, tableConfig: i10, queryConfig: s10, tableAlias: a10, nestedQueryRelation: o10, joinOn: l2 }) {
          let u2, c2 = [], h2, d2, f2 = [], p2, g2 = [];
          if (true === s10) c2 = Object.entries(i10.columns).map(([e11, t11]) => ({ dbKey: t11.name, tsKey: e11, field: ig(t11, a10), relationTableTsKey: void 0, isJson: false, selection: [] }));
          else {
            let n11 = Object.fromEntries(Object.entries(i10.columns).map(([e11, t11]) => [e11, ig(t11, a10)]));
            if (s10.where) {
              let e11 = "function" == typeof s10.where ? s10.where(n11, { and: tN, between: tQ, eq: tA, exists: tF, gt: tk, gte: tD, ilike: tG, inArray: tB, isNull: tj, isNotNull: tq, like: tV, lt: tL, lte: tM, ne: tR, not: tI, notBetween: tz, notExists: tU, notLike: tH, notIlike: tW, notInArray: t$, or: tO, sql: tw }) : s10.where;
              p2 = e11 && iy(e11, a10);
            }
            let o11 = [], l3 = [];
            if (s10.columns) {
              let e11 = false;
              for (let [t11, r11] of Object.entries(s10.columns)) void 0 !== r11 && t11 in i10.columns && (e11 || true !== r11 || (e11 = true), l3.push(t11));
              l3.length > 0 && (l3 = e11 ? l3.filter((e12) => s10.columns?.[e12] === true) : Object.keys(i10.columns).filter((e12) => !l3.includes(e12)));
            } else l3 = Object.keys(i10.columns);
            for (let e11 of l3) {
              let t11 = i10.columns[e11];
              o11.push({ tsKey: e11, value: t11 });
            }
            let u3 = [];
            if (s10.with && (u3 = Object.entries(s10.with).filter((e11) => !!e11[1]).map(([e11, t11]) => ({ tsKey: e11, queryConfig: t11, relation: i10.relations[e11] }))), s10.extras) for (let [e11, t11] of Object.entries("function" == typeof s10.extras ? s10.extras(n11, { sql: tw }) : s10.extras)) o11.push({ tsKey: e11, value: im(t11, a10) });
            for (let { tsKey: e11, value: t11 } of o11) c2.push({ dbKey: e$(t11, tg.Aliased) ? t11.fieldAlias : i10.columns[e11].name, tsKey: e11, field: e$(t11, ej) ? ig(t11, a10) : t11, relationTableTsKey: void 0, isJson: false, selection: [] });
            let m2 = "function" == typeof s10.orderBy ? s10.orderBy(n11, { sql: tw, asc: tK, desc: tX }) : s10.orderBy ?? [];
            for (let { tsKey: n12, queryConfig: i11, relation: o12 } of (Array.isArray(m2) || (m2 = [m2]), f2 = m2.map((e11) => e$(e11, ej) ? ig(e11, a10) : iy(e11, a10)), h2 = s10.limit, d2 = s10.offset, u3)) {
              let s11 = function(e11, t11, r11) {
                if (e$(r11, aq) && r11.config) return { fields: r11.config.fields, references: r11.config.references };
                let n13 = t11[eX(r11.referencedTable)];
                if (!n13) throw Error(`Table "${r11.referencedTable[eK.Symbol.Name]}" not found in schema`);
                let i12 = e11[n13];
                if (!i12) throw Error(`Table "${n13}" not found in schema`);
                let s12 = r11.sourceTable, a11 = t11[eX(s12)];
                if (!a11) throw Error(`Table "${s12[eK.Symbol.Name]}" not found in schema`);
                let o13 = [];
                for (let e12 of Object.values(i12.relations)) (r11.relationName && r11 !== e12 && e12.relationName === r11.relationName || !r11.relationName && e12.referencedTable === r11.sourceTable) && o13.push(e12);
                if (o13.length > 1) throw r11.relationName ? Error(`There are multiple relations with name "${r11.relationName}" in table "${n13}"`) : Error(`There are multiple relations between "${n13}" and "${r11.sourceTable[eK.Symbol.Name]}". Please specify relation name`);
                if (o13[0] && e$(o13[0], aq) && o13[0].config) return { fields: o13[0].config.references, references: o13[0].config.fields };
                throw Error(`There is not enough information to infer relation "${a11}.${r11.fieldName}"`);
              }(t10, r10, o12), l4 = r10[eX(o12.referencedTable)], u4 = `${a10}_${n12}`, h3 = tN(...s11.fields.map((e11, t11) => tA(ig(s11.references[t11], u4), ig(e11, a10)))), d3 = this.buildRelationalQueryWithoutPK({ fullSchema: e10, schema: t10, tableNamesMap: r10, table: e10[l4], tableConfig: t10[l4], queryConfig: e$(o12, aq) ? true === i11 ? { limit: 1 } : { ...i11, limit: 1 } : i11, tableAlias: u4, joinOn: h3, nestedQueryRelation: o12 }), f3 = tw`${tw.identifier(u4)}.${tw.identifier("data")}`.as(n12);
              g2.push({ on: tw`true`, table: new tl(d3.sql, {}, u4), alias: u4, joinType: "left", lateral: true }), c2.push({ dbKey: n12, tsKey: n12, field: f3, relationTableTsKey: l4, isJson: true, selection: d3.selection });
            }
          }
          if (0 === c2.length) throw new aL({ message: `No fields selected for table "${i10.tsName}" ("${a10}")` });
          if (p2 = tN(l2, p2), o10) {
            let e11 = tw`json_build_array(${tw.join(c2.map(({ field: e12, tsKey: t12, isJson: r11 }) => r11 ? tw`${tw.identifier(`${a10}_${t12}`)}.${tw.identifier("data")}` : e$(e12, tg.Aliased) ? e12.sql : e12), tw`, `)})`;
            e$(o10, aF) && (e11 = tw`coalesce(json_agg(${e11}${f2.length > 0 ? tw` order by ${tw.join(f2, tw`, `)}` : void 0}), '[]'::json)`);
            let t11 = [{ dbKey: "data", tsKey: "data", field: e11.as("data"), isJson: true, relationTableTsKey: i10.tsName, selection: c2 }];
            void 0 !== h2 || void 0 !== d2 || f2.length > 0 ? (u2 = this.buildSelectQuery({ table: ip(n10, a10), fields: {}, fieldsFlat: [{ path: [], field: tw.raw("*") }], where: p2, limit: h2, offset: d2, orderBy: f2, setOperators: [] }), p2 = void 0, h2 = void 0, d2 = void 0, f2 = []) : u2 = ip(n10, a10), u2 = this.buildSelectQuery({ table: e$(u2, ay) ? u2 : new tl(u2, {}, a10), fields: {}, fieldsFlat: t11.map(({ field: e12 }) => ({ path: [], field: e$(e12, ej) ? ig(e12, a10) : e12 })), joins: g2, where: p2, limit: h2, offset: d2, orderBy: f2, setOperators: [] });
          } else u2 = this.buildSelectQuery({ table: ip(n10, a10), fields: {}, fieldsFlat: c2.map(({ field: e11 }) => ({ path: [], field: e$(e11, ej) ? ig(e11, a10) : e11 })), joins: g2, where: p2, limit: h2, offset: d2, orderBy: f2, setOperators: [] });
          return { tableTsKey: i10.tsName, sql: u2, selection: c2 };
        }
      }
      class aV {
        static [eB] = "TypedQueryBuilder";
        getSelectedFields() {
          return this._.selectedFields;
        }
      }
      class aH {
        static [eB] = "PgSelectBuilder";
        fields;
        session;
        dialect;
        withList = [];
        distinct;
        constructor(e10) {
          this.fields = e10.fields, this.session = e10.session, this.dialect = e10.dialect, e10.withList && (this.withList = e10.withList), this.distinct = e10.distinct;
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        from(e10) {
          let t10, r10 = !!this.fields;
          return t10 = this.fields ? this.fields : e$(e10, tl) ? Object.fromEntries(Object.keys(e10._.selectedFields).map((t11) => [t11, e10[t11]])) : e$(e10, aQ) ? e10[th].selectedFields : e$(e10, tg) ? {} : iS(e10), new aW({ table: e10, fields: t10, isPartialSelect: r10, session: this.session, dialect: this.dialect, withList: this.withList, distinct: this.distinct }).setToken(this.authToken);
        }
      }
      class aG extends aV {
        static [eB] = "PgSelectQueryBuilder";
        _;
        config;
        joinsNotNullableMap;
        tableName;
        isPartialSelect;
        session;
        dialect;
        cacheConfig = void 0;
        usedTables = /* @__PURE__ */ new Set();
        constructor({ table: e10, fields: t10, isPartialSelect: r10, session: n10, dialect: i10, withList: s10, distinct: a10 }) {
          for (const o10 of (super(), this.config = { withList: s10, table: e10, fields: { ...t10 }, distinct: a10, setOperators: [] }, this.isPartialSelect = r10, this.session = n10, this.dialect = i10, this._ = { selectedFields: t10, config: this.config }, this.tableName = iE(e10), this.joinsNotNullableMap = "string" == typeof this.tableName ? { [this.tableName]: true } : {}, on(e10))) this.usedTables.add(o10);
        }
        getUsedTables() {
          return [...this.usedTables];
        }
        createJoin(e10, t10) {
          return (r10, n10) => {
            let i10 = this.tableName, s10 = iE(r10);
            for (let e11 of on(r10)) this.usedTables.add(e11);
            if ("string" == typeof s10 && this.config.joins?.some((e11) => e11.alias === s10)) throw Error(`Alias "${s10}" is already used in this query`);
            if (!this.isPartialSelect && (1 === Object.keys(this.joinsNotNullableMap).length && "string" == typeof i10 && (this.config.fields = { [i10]: this.config.fields }), "string" == typeof s10 && !e$(r10, tg))) {
              let e11 = e$(r10, tl) ? r10._.selectedFields : e$(r10, tC) ? r10[th].selectedFields : r10[eK.Symbol.Columns];
              this.config.fields[s10] = e11;
            }
            if ("function" == typeof n10 && (n10 = n10(new Proxy(this.config.fields, new ib({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })))), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: n10, table: r10, joinType: e10, alias: s10, lateral: t10 }), "string" == typeof s10) switch (e10) {
              case "left":
                this.joinsNotNullableMap[s10] = false;
                break;
              case "right":
                this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e11]) => [e11, false])), this.joinsNotNullableMap[s10] = true;
                break;
              case "cross":
              case "inner":
                this.joinsNotNullableMap[s10] = true;
                break;
              case "full":
                this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e11]) => [e11, false])), this.joinsNotNullableMap[s10] = false;
            }
            return this;
          };
        }
        leftJoin = this.createJoin("left", false);
        leftJoinLateral = this.createJoin("left", true);
        rightJoin = this.createJoin("right", false);
        innerJoin = this.createJoin("inner", false);
        innerJoinLateral = this.createJoin("inner", true);
        fullJoin = this.createJoin("full", false);
        crossJoin = this.createJoin("cross", false);
        crossJoinLateral = this.createJoin("cross", true);
        createSetOperator(e10, t10) {
          return (r10) => {
            let n10 = "function" == typeof r10 ? r10(aX()) : r10;
            if (!iw(this.getSelectedFields(), n10.getSelectedFields())) throw Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
            return this.config.setOperators.push({ type: e10, isAll: t10, rightSelect: n10 }), this;
          };
        }
        union = this.createSetOperator("union", false);
        unionAll = this.createSetOperator("union", true);
        intersect = this.createSetOperator("intersect", false);
        intersectAll = this.createSetOperator("intersect", true);
        except = this.createSetOperator("except", false);
        exceptAll = this.createSetOperator("except", true);
        addSetOperators(e10) {
          return this.config.setOperators.push(...e10), this;
        }
        where(e10) {
          return "function" == typeof e10 && (e10 = e10(new Proxy(this.config.fields, new ib({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })))), this.config.where = e10, this;
        }
        having(e10) {
          return "function" == typeof e10 && (e10 = e10(new Proxy(this.config.fields, new ib({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })))), this.config.having = e10, this;
        }
        groupBy(...e10) {
          if ("function" == typeof e10[0]) {
            let t10 = e10[0](new Proxy(this.config.fields, new ib({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
            this.config.groupBy = Array.isArray(t10) ? t10 : [t10];
          } else this.config.groupBy = e10;
          return this;
        }
        orderBy(...e10) {
          if ("function" == typeof e10[0]) {
            let t10 = e10[0](new Proxy(this.config.fields, new ib({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" }))), r10 = Array.isArray(t10) ? t10 : [t10];
            this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = r10 : this.config.orderBy = r10;
          } else this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = e10 : this.config.orderBy = e10;
          return this;
        }
        limit(e10) {
          return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = e10 : this.config.limit = e10, this;
        }
        offset(e10) {
          return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = e10 : this.config.offset = e10, this;
        }
        for(e10, t10 = {}) {
          return this.config.lockingClause = { strength: e10, config: t10 }, this;
        }
        getSQL() {
          return this.dialect.buildSelectQuery(this.config);
        }
        toSQL() {
          let { typings: e10, ...t10 } = this.dialect.sqlToQuery(this.getSQL());
          return t10;
        }
        as(e10) {
          let t10 = [];
          if (t10.push(...on(this.config.table)), this.config.joins) for (let e11 of this.config.joins) t10.push(...on(e11.table));
          return new Proxy(new tl(this.getSQL(), this.config.fields, e10, false, [...new Set(t10)]), new ib({ alias: e10, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
        }
        getSelectedFields() {
          return new Proxy(this.config.fields, new ib({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
        }
        $dynamic() {
          return this;
        }
        $withCache(e10) {
          return this.cacheConfig = void 0 === e10 ? { config: {}, enable: true, autoInvalidate: true } : false === e10 ? { enable: false } : { enable: true, autoInvalidate: true, ...e10 }, this;
        }
      }
      class aW extends aG {
        static [eB] = "PgSelect";
        _prepare(e10) {
          let { session: t10, config: r10, dialect: n10, joinsNotNullableMap: i10, authToken: s10, cacheConfig: a10, usedTables: o10 } = this;
          if (!t10) throw Error("Cannot execute a query on a query builder. Please use a database instance instead.");
          let { fields: l2 } = r10;
          return tc("drizzle.prepareQuery", () => {
            let r11 = iv(l2), u2 = t10.prepareQuery(n10.sqlToQuery(this.getSQL()), r11, e10, true, void 0, { type: "select", tables: [...o10] }, a10);
            return u2.joinsNotNullableMap = i10, u2.setToken(s10);
          });
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute = (e10) => tc("drizzle.operation", () => this._prepare().execute(e10, this.authToken));
      }
      for (let e10 of [iu]) for (let t10 of Object.getOwnPropertyNames(e10.prototype)) "constructor" !== t10 && Object.defineProperty(aW.prototype, t10, Object.getOwnPropertyDescriptor(e10.prototype, t10) || /* @__PURE__ */ Object.create(null));
      function aK(e10, t10) {
        return (r10, n10, ...i10) => {
          let s10 = [n10, ...i10].map((r11) => ({ type: e10, isAll: t10, rightSelect: r11 }));
          for (let e11 of s10) if (!iw(r10.getSelectedFields(), e11.rightSelect.getSelectedFields())) throw Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
          return r10.addSetOperators(s10);
        };
      }
      let aX = () => ({ union: aJ, unionAll: aY, intersect: aZ, intersectAll: a0, except: a1, exceptAll: a2 }), aJ = aK("union", false), aY = aK("union", true), aZ = aK("intersect", false), a0 = aK("intersect", true), a1 = aK("except", false), a2 = aK("except", true);
      class a6 {
        static [eB] = "PgQueryBuilder";
        dialect;
        dialectConfig;
        constructor(e10) {
          this.dialect = e$(e10, az) ? e10 : void 0, this.dialectConfig = e$(e10, az) ? void 0 : e10;
        }
        $with = (e10, t10) => {
          let r10 = this;
          return { as: (n10) => ("function" == typeof n10 && (n10 = n10(r10)), new Proxy(new tu(n10.getSQL(), t10 ?? ("getSelectedFields" in n10 ? n10.getSelectedFields() ?? {} : {}), e10, true), new ib({ alias: e10, sqlAliasedBehavior: "alias", sqlBehavior: "error" }))) };
        };
        with(...e10) {
          let t10 = this;
          return { select: function(r10) {
            return new aH({ fields: r10 ?? void 0, session: void 0, dialect: t10.getDialect(), withList: e10 });
          }, selectDistinct: function(e11) {
            return new aH({ fields: e11 ?? void 0, session: void 0, dialect: t10.getDialect(), distinct: true });
          }, selectDistinctOn: function(e11, r10) {
            return new aH({ fields: r10 ?? void 0, session: void 0, dialect: t10.getDialect(), distinct: { on: e11 } });
          } };
        }
        select(e10) {
          return new aH({ fields: e10 ?? void 0, session: void 0, dialect: this.getDialect() });
        }
        selectDistinct(e10) {
          return new aH({ fields: e10 ?? void 0, session: void 0, dialect: this.getDialect(), distinct: true });
        }
        selectDistinctOn(e10, t10) {
          return new aH({ fields: t10 ?? void 0, session: void 0, dialect: this.getDialect(), distinct: { on: e10 } });
        }
        getDialect() {
          return this.dialect || (this.dialect = new az(this.dialectConfig)), this.dialect;
        }
      }
      class a5 {
        constructor(e10, t10) {
          this.name = e10, this.schema = t10;
        }
        static [eB] = "PgDefaultViewBuilderCore";
        config = {};
        with(e10) {
          return this.config.with = e10, this;
        }
      }
      class a3 extends a5 {
        static [eB] = "PgViewBuilder";
        as(e10) {
          "function" == typeof e10 && (e10 = e10(new a6()));
          let t10 = new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }), r10 = new Proxy(e10.getSelectedFields(), t10);
          return new Proxy(new oe({ pgConfig: this.config, config: { name: this.name, schema: this.schema, selectedFields: r10, query: e10.getSQL().inlineParams() } }), t10);
        }
      }
      class a4 extends a5 {
        static [eB] = "PgManualViewBuilder";
        columns;
        constructor(e10, t10, r10) {
          super(e10, r10), this.columns = iS(ab(e10, t10));
        }
        existing() {
          return new Proxy(new oe({ pgConfig: void 0, config: { name: this.name, schema: this.schema, selectedFields: this.columns, query: void 0 } }), new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }));
        }
        as(e10) {
          return new Proxy(new oe({ pgConfig: this.config, config: { name: this.name, schema: this.schema, selectedFields: this.columns, query: e10.inlineParams() } }), new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }));
        }
      }
      class a8 {
        constructor(e10, t10) {
          this.name = e10, this.schema = t10;
        }
        static [eB] = "PgMaterializedViewBuilderCore";
        config = {};
        using(e10) {
          return this.config.using = e10, this;
        }
        with(e10) {
          return this.config.with = e10, this;
        }
        tablespace(e10) {
          return this.config.tablespace = e10, this;
        }
        withNoData() {
          return this.config.withNoData = true, this;
        }
      }
      class a7 extends a8 {
        static [eB] = "PgMaterializedViewBuilder";
        as(e10) {
          "function" == typeof e10 && (e10 = e10(new a6()));
          let t10 = new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }), r10 = new Proxy(e10.getSelectedFields(), t10);
          return new Proxy(new or({ pgConfig: { with: this.config.with, using: this.config.using, tablespace: this.config.tablespace, withNoData: this.config.withNoData }, config: { name: this.name, schema: this.schema, selectedFields: r10, query: e10.getSQL().inlineParams() } }), t10);
        }
      }
      class a9 extends a8 {
        static [eB] = "PgManualMaterializedViewBuilder";
        columns;
        constructor(e10, t10, r10) {
          super(e10, r10), this.columns = iS(ab(e10, t10));
        }
        existing() {
          return new Proxy(new or({ pgConfig: { tablespace: this.config.tablespace, using: this.config.using, with: this.config.with, withNoData: this.config.withNoData }, config: { name: this.name, schema: this.schema, selectedFields: this.columns, query: void 0 } }), new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }));
        }
        as(e10) {
          return new Proxy(new or({ pgConfig: { tablespace: this.config.tablespace, using: this.config.using, with: this.config.with, withNoData: this.config.withNoData }, config: { name: this.name, schema: this.schema, selectedFields: this.columns, query: e10.inlineParams() } }), new ib({ alias: this.name, sqlBehavior: "error", sqlAliasedBehavior: "alias", replaceOriginalName: true }));
        }
      }
      class oe extends aQ {
        static [eB] = "PgView";
        [aN];
        constructor({ pgConfig: e10, config: t10 }) {
          super(t10), e10 && (this[aN] = { with: e10.with });
        }
      }
      let ot = Symbol.for("drizzle:PgMaterializedViewConfig");
      class or extends aQ {
        static [eB] = "PgMaterializedView";
        [ot];
        constructor({ pgConfig: e10, config: t10 }) {
          super(t10), this[ot] = { with: e10?.with, using: e10?.using, tablespace: e10?.tablespace, withNoData: e10?.withNoData };
        }
      }
      function on(e10) {
        return e$(e10, ay) ? [e10[eF] ? `${e10[eF]}.${e10[eK.Symbol.BaseName]}` : e10[eK.Symbol.BaseName]] : e$(e10, tl) ? e10._.usedTables ?? [] : e$(e10, tg) ? e10.usedTables ?? [] : [];
      }
      class oi extends iu {
        constructor(e10, t10, r10, n10) {
          super(), this.session = t10, this.dialect = r10, this.config = { table: e10, withList: n10 };
        }
        static [eB] = "PgDelete";
        config;
        cacheConfig;
        where(e10) {
          return this.config.where = e10, this;
        }
        returning(e10 = this.config.table[eK.Symbol.Columns]) {
          return this.config.returningFields = e10, this.config.returning = iv(e10), this;
        }
        getSQL() {
          return this.dialect.buildDeleteQuery(this.config);
        }
        toSQL() {
          let { typings: e10, ...t10 } = this.dialect.sqlToQuery(this.getSQL());
          return t10;
        }
        _prepare(e10) {
          return tc("drizzle.prepareQuery", () => this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, e10, true, void 0, { type: "delete", tables: on(this.config.table) }, this.cacheConfig));
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute = (e10) => tc("drizzle.operation", () => this._prepare().execute(e10, this.authToken));
        getSelectedFields() {
          return this.config.returningFields ? new Proxy(this.config.returningFields, new ib({ alias: this.config.table[eq], sqlAliasedBehavior: "alias", sqlBehavior: "error" })) : void 0;
        }
        $dynamic() {
          return this;
        }
      }
      class os {
        constructor(e10, t10, r10, n10, i10) {
          this.table = e10, this.session = t10, this.dialect = r10, this.withList = n10, this.overridingSystemValue_ = i10;
        }
        static [eB] = "PgInsertBuilder";
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        overridingSystemValue() {
          return this.overridingSystemValue_ = true, this;
        }
        values(e10) {
          if (0 === (e10 = Array.isArray(e10) ? e10 : [e10]).length) throw Error("values() must be called with at least one value");
          let t10 = e10.map((e11) => {
            let t11 = {}, r10 = this.table[eK.Symbol.Columns];
            for (let n10 of Object.keys(e11)) {
              let i10 = e11[n10];
              t11[n10] = e$(i10, tg) ? i10 : new tv(i10, r10[n10]);
            }
            return t11;
          });
          return new oa(this.table, t10, this.session, this.dialect, this.withList, false, this.overridingSystemValue_).setToken(this.authToken);
        }
        select(e10) {
          let t10 = "function" == typeof e10 ? e10(new a6()) : e10;
          if (!e$(t10, tg) && !iw(this.table[eU], t10._.selectedFields)) throw Error("Insert select error: selected fields are not the same or are in a different order compared to the table definition");
          return new oa(this.table, t10, this.session, this.dialect, this.withList, true);
        }
      }
      class oa extends iu {
        constructor(e10, t10, r10, n10, i10, s10, a10) {
          super(), this.session = r10, this.dialect = n10, this.config = { table: e10, values: t10, withList: i10, select: s10, overridingSystemValue_: a10 };
        }
        static [eB] = "PgInsert";
        config;
        cacheConfig;
        returning(e10 = this.config.table[eK.Symbol.Columns]) {
          return this.config.returningFields = e10, this.config.returning = iv(e10), this;
        }
        onConflictDoNothing(e10 = {}) {
          if (void 0 === e10.target) this.config.onConflict = tw`do nothing`;
          else {
            let t10 = "";
            t10 = Array.isArray(e10.target) ? e10.target.map((e11) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(e11))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(e10.target));
            let r10 = e10.where ? tw` where ${e10.where}` : void 0;
            this.config.onConflict = tw`(${tw.raw(t10)})${r10} do nothing`;
          }
          return this;
        }
        onConflictDoUpdate(e10) {
          if (e10.where && (e10.targetWhere || e10.setWhere)) throw Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
          let t10 = e10.where ? tw` where ${e10.where}` : void 0, r10 = e10.targetWhere ? tw` where ${e10.targetWhere}` : void 0, n10 = e10.setWhere ? tw` where ${e10.setWhere}` : void 0, i10 = this.dialect.buildUpdateSet(this.config.table, i_(this.config.table, e10.set)), s10 = "";
          return s10 = Array.isArray(e10.target) ? e10.target.map((e11) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(e11))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(e10.target)), this.config.onConflict = tw`(${tw.raw(s10)})${r10} do update set ${i10}${t10}${n10}`, this;
        }
        getSQL() {
          return this.dialect.buildInsertQuery(this.config);
        }
        toSQL() {
          let { typings: e10, ...t10 } = this.dialect.sqlToQuery(this.getSQL());
          return t10;
        }
        _prepare(e10) {
          return tc("drizzle.prepareQuery", () => this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, e10, true, void 0, { type: "insert", tables: on(this.config.table) }, this.cacheConfig));
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute = (e10) => tc("drizzle.operation", () => this._prepare().execute(e10, this.authToken));
        getSelectedFields() {
          return this.config.returningFields ? new Proxy(this.config.returningFields, new ib({ alias: this.config.table[eq], sqlAliasedBehavior: "alias", sqlBehavior: "error" })) : void 0;
        }
        $dynamic() {
          return this;
        }
      }
      class oo {
        constructor(e10, t10, r10, n10) {
          this.table = e10, this.session = t10, this.dialect = r10, this.withList = n10;
        }
        static [eB] = "PgUpdateBuilder";
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        set(e10) {
          return new ol(this.table, i_(this.table, e10), this.session, this.dialect, this.withList).setToken(this.authToken);
        }
      }
      class ol extends iu {
        constructor(e10, t10, r10, n10, i10) {
          super(), this.session = r10, this.dialect = n10, this.config = { set: t10, table: e10, withList: i10, joins: [] }, this.tableName = iE(e10), this.joinsNotNullableMap = "string" == typeof this.tableName ? { [this.tableName]: true } : {};
        }
        static [eB] = "PgUpdate";
        config;
        tableName;
        joinsNotNullableMap;
        cacheConfig;
        from(e10) {
          let t10 = iE(e10);
          return "string" == typeof t10 && (this.joinsNotNullableMap[t10] = true), this.config.from = e10, this;
        }
        getTableLikeFields(e10) {
          return e$(e10, ay) ? e10[eK.Symbol.Columns] : e$(e10, tl) ? e10._.selectedFields : e10[th].selectedFields;
        }
        createJoin(e10) {
          return (t10, r10) => {
            let n10 = iE(t10);
            if ("string" == typeof n10 && this.config.joins.some((e11) => e11.alias === n10)) throw Error(`Alias "${n10}" is already used in this query`);
            if ("function" == typeof r10) {
              let e11 = this.config.from && !e$(this.config.from, tg) ? this.getTableLikeFields(this.config.from) : void 0;
              r10 = r10(new Proxy(this.config.table[eK.Symbol.Columns], new ib({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })), e11 && new Proxy(e11, new ib({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
            }
            if (this.config.joins.push({ on: r10, table: t10, joinType: e10, alias: n10 }), "string" == typeof n10) switch (e10) {
              case "left":
                this.joinsNotNullableMap[n10] = false;
                break;
              case "right":
                this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e11]) => [e11, false])), this.joinsNotNullableMap[n10] = true;
                break;
              case "inner":
                this.joinsNotNullableMap[n10] = true;
                break;
              case "full":
                this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e11]) => [e11, false])), this.joinsNotNullableMap[n10] = false;
            }
            return this;
          };
        }
        leftJoin = this.createJoin("left");
        rightJoin = this.createJoin("right");
        innerJoin = this.createJoin("inner");
        fullJoin = this.createJoin("full");
        where(e10) {
          return this.config.where = e10, this;
        }
        returning(e10) {
          if (!e10 && (e10 = Object.assign({}, this.config.table[eK.Symbol.Columns]), this.config.from)) {
            let t10 = iE(this.config.from);
            if ("string" == typeof t10 && this.config.from && !e$(this.config.from, tg)) {
              let r10 = this.getTableLikeFields(this.config.from);
              e10[t10] = r10;
            }
            for (let t11 of this.config.joins) {
              let r10 = iE(t11.table);
              if ("string" == typeof r10 && !e$(t11.table, tg)) {
                let n10 = this.getTableLikeFields(t11.table);
                e10[r10] = n10;
              }
            }
          }
          return this.config.returningFields = e10, this.config.returning = iv(e10), this;
        }
        getSQL() {
          return this.dialect.buildUpdateQuery(this.config);
        }
        toSQL() {
          let { typings: e10, ...t10 } = this.dialect.sqlToQuery(this.getSQL());
          return t10;
        }
        _prepare(e10) {
          let t10 = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, e10, true, void 0, { type: "insert", tables: on(this.config.table) }, this.cacheConfig);
          return t10.joinsNotNullableMap = this.joinsNotNullableMap, t10;
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute = (e10) => this._prepare().execute(e10, this.authToken);
        getSelectedFields() {
          return this.config.returningFields ? new Proxy(this.config.returningFields, new ib({ alias: this.config.table[eq], sqlAliasedBehavior: "alias", sqlBehavior: "error" })) : void 0;
        }
        $dynamic() {
          return this;
        }
      }
      class ou extends tg {
        constructor(e10) {
          super(ou.buildEmbeddedCount(e10.source, e10.filters).queryChunks), this.params = e10, this.mapWith(Number), this.session = e10.session, this.sql = ou.buildCount(e10.source, e10.filters);
        }
        sql;
        token;
        static [eB] = "PgCountBuilder";
        [Symbol.toStringTag] = "PgCountBuilder";
        session;
        static buildEmbeddedCount(e10, t10) {
          return tw`(select count(*) from ${e10}${tw.raw(" where ").if(t10)}${t10})`;
        }
        static buildCount(e10, t10) {
          return tw`select count(*) as count from ${e10}${tw.raw(" where ").if(t10)}${t10};`;
        }
        setToken(e10) {
          return this.token = e10, this;
        }
        then(e10, t10) {
          return Promise.resolve(this.session.count(this.sql, this.token)).then(e10, t10);
        }
        catch(e10) {
          return this.then(void 0, e10);
        }
        finally(e10) {
          return this.then((t10) => (e10?.(), t10), (t10) => {
            throw e10?.(), t10;
          });
        }
      }
      class oc {
        constructor(e10, t10, r10, n10, i10, s10, a10) {
          this.fullSchema = e10, this.schema = t10, this.tableNamesMap = r10, this.table = n10, this.tableConfig = i10, this.dialect = s10, this.session = a10;
        }
        static [eB] = "PgRelationalQueryBuilder";
        findMany(e10) {
          return new oh(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e10 || {}, "many");
        }
        findFirst(e10) {
          return new oh(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e10 ? { ...e10, limit: 1 } : { limit: 1 }, "first");
        }
      }
      class oh extends iu {
        constructor(e10, t10, r10, n10, i10, s10, a10, o10, l2) {
          super(), this.fullSchema = e10, this.schema = t10, this.tableNamesMap = r10, this.table = n10, this.tableConfig = i10, this.dialect = s10, this.session = a10, this.config = o10, this.mode = l2;
        }
        static [eB] = "PgRelationalQuery";
        _prepare(e10) {
          return tc("drizzle.prepareQuery", () => {
            let { query: t10, builtQuery: r10 } = this._toSQL();
            return this.session.prepareQuery(r10, void 0, e10, true, (e11, r11) => {
              let n10 = e11.map((e12) => function e13(t11, r12, n11, i10, s10 = (e14) => e14) {
                let a10 = {};
                for (let [o10, l2] of i10.entries()) if (l2.isJson) {
                  let i11 = r12.relations[l2.tsKey], u2 = n11[o10], c2 = "string" == typeof u2 ? JSON.parse(u2) : u2;
                  a10[l2.tsKey] = e$(i11, aq) ? c2 && e13(t11, t11[l2.relationTableTsKey], c2, l2.selection, s10) : c2.map((r13) => e13(t11, t11[l2.relationTableTsKey], r13, l2.selection, s10));
                } else {
                  let e14, t12 = s10(n11[o10]), r13 = l2.field;
                  e14 = e$(r13, ej) ? r13 : e$(r13, tg) ? r13.decoder : r13.sql.decoder, a10[l2.tsKey] = null === t12 ? null : e14.mapFromDriverValue(t12);
                }
                return a10;
              }(this.schema, this.tableConfig, e12, t10.selection, r11));
              return "first" === this.mode ? n10[0] : n10;
            });
          });
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        _getQuery() {
          return this.dialect.buildRelationalQueryWithoutPK({ fullSchema: this.fullSchema, schema: this.schema, tableNamesMap: this.tableNamesMap, table: this.table, tableConfig: this.tableConfig, queryConfig: this.config, tableAlias: this.tableConfig.tsName });
        }
        getSQL() {
          return this._getQuery().sql;
        }
        _toSQL() {
          let e10 = this._getQuery(), t10 = this.dialect.sqlToQuery(e10.sql);
          return { query: e10, builtQuery: t10 };
        }
        toSQL() {
          return this._toSQL().builtQuery;
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute() {
          return tc("drizzle.operation", () => this._prepare().execute(void 0, this.authToken));
        }
      }
      class od extends iu {
        constructor(e10, t10, r10, n10) {
          super(), this.execute = e10, this.sql = t10, this.query = r10, this.mapBatchResult = n10;
        }
        static [eB] = "PgRaw";
        getSQL() {
          return this.sql;
        }
        getQuery() {
          return this.query;
        }
        mapResult(e10, t10) {
          return t10 ? this.mapBatchResult(e10) : e10;
        }
        _prepare() {
          return this;
        }
        isResponseInArrayMode() {
          return false;
        }
      }
      class of extends iu {
        constructor(e10, t10, r10) {
          super(), this.session = t10, this.dialect = r10, this.config = { view: e10 };
        }
        static [eB] = "PgRefreshMaterializedView";
        config;
        concurrently() {
          if (void 0 !== this.config.withNoData) throw Error("Cannot use concurrently and withNoData together");
          return this.config.concurrently = true, this;
        }
        withNoData() {
          if (void 0 !== this.config.concurrently) throw Error("Cannot use concurrently and withNoData together");
          return this.config.withNoData = true, this;
        }
        getSQL() {
          return this.dialect.buildRefreshMaterializedViewQuery(this.config);
        }
        toSQL() {
          let { typings: e10, ...t10 } = this.dialect.sqlToQuery(this.getSQL());
          return t10;
        }
        _prepare(e10) {
          return tc("drizzle.prepareQuery", () => this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, e10, true));
        }
        prepare(e10) {
          return this._prepare(e10);
        }
        authToken;
        setToken(e10) {
          return this.authToken = e10, this;
        }
        execute = (e10) => tc("drizzle.operation", () => this._prepare().execute(e10, this.authToken));
      }
      class op {
        constructor(e10, t10, r10) {
          if (this.dialect = e10, this.session = t10, this._ = r10 ? { schema: r10.schema, fullSchema: r10.fullSchema, tableNamesMap: r10.tableNamesMap, session: t10 } : { schema: void 0, fullSchema: {}, tableNamesMap: {}, session: t10 }, this.query = {}, this._.schema) for (const [n10, i10] of Object.entries(this._.schema)) this.query[n10] = new oc(r10.fullSchema, this._.schema, this._.tableNamesMap, r10.fullSchema[n10], i10, e10, t10);
          this.$cache = { invalidate: async (e11) => {
          } };
        }
        static [eB] = "PgDatabase";
        query;
        $with = (e10, t10) => {
          let r10 = this;
          return { as: (n10) => ("function" == typeof n10 && (n10 = n10(new a6(r10.dialect))), new Proxy(new tu(n10.getSQL(), t10 ?? ("getSelectedFields" in n10 ? n10.getSelectedFields() ?? {} : {}), e10, true), new ib({ alias: e10, sqlAliasedBehavior: "alias", sqlBehavior: "error" }))) };
        };
        $count(e10, t10) {
          return new ou({ source: e10, filters: t10, session: this.session });
        }
        $cache;
        with(...e10) {
          let t10 = this;
          return { select: function(r10) {
            return new aH({ fields: r10 ?? void 0, session: t10.session, dialect: t10.dialect, withList: e10 });
          }, selectDistinct: function(r10) {
            return new aH({ fields: r10 ?? void 0, session: t10.session, dialect: t10.dialect, withList: e10, distinct: true });
          }, selectDistinctOn: function(r10, n10) {
            return new aH({ fields: n10 ?? void 0, session: t10.session, dialect: t10.dialect, withList: e10, distinct: { on: r10 } });
          }, update: function(r10) {
            return new oo(r10, t10.session, t10.dialect, e10);
          }, insert: function(r10) {
            return new os(r10, t10.session, t10.dialect, e10);
          }, delete: function(r10) {
            return new oi(r10, t10.session, t10.dialect, e10);
          } };
        }
        select(e10) {
          return new aH({ fields: e10 ?? void 0, session: this.session, dialect: this.dialect });
        }
        selectDistinct(e10) {
          return new aH({ fields: e10 ?? void 0, session: this.session, dialect: this.dialect, distinct: true });
        }
        selectDistinctOn(e10, t10) {
          return new aH({ fields: t10 ?? void 0, session: this.session, dialect: this.dialect, distinct: { on: e10 } });
        }
        update(e10) {
          return new oo(e10, this.session, this.dialect);
        }
        insert(e10) {
          return new os(e10, this.session, this.dialect);
        }
        delete(e10) {
          return new oi(e10, this.session, this.dialect);
        }
        refreshMaterializedView(e10) {
          return new of(e10, this.session, this.dialect);
        }
        authToken;
        execute(e10) {
          let t10 = "string" == typeof e10 ? tw.raw(e10) : e10.getSQL(), r10 = this.dialect.sqlToQuery(t10), n10 = this.session.prepareQuery(r10, void 0, void 0, false);
          return new od(() => n10.execute(void 0, this.authToken), t10, r10, (e11) => n10.mapResult(e11, true));
        }
        transaction(e10, t10) {
          return this.session.transaction(e10, t10);
        }
      }
      class og {
        static [eB] = "Cache";
      }
      class om extends og {
        strategy() {
          return "all";
        }
        static [eB] = "NoopCache";
        async get(e10) {
        }
        async put(e10, t10, r10, n10) {
        }
        async onMutate(e10) {
        }
      }
      async function oy(e10, t10) {
        let r10 = `${e10}-${JSON.stringify(t10)}`, n10 = new TextEncoder().encode(r10);
        return [...new Uint8Array(await crypto.subtle.digest("SHA-256", n10))].map((e11) => e11.toString(16).padStart(2, "0")).join("");
      }
      class ob {
        constructor(e10, t10, r10, n10) {
          this.query = e10, this.cache = t10, this.queryMetadata = r10, this.cacheConfig = n10, t10 && "all" === t10.strategy() && void 0 === n10 && (this.cacheConfig = { enable: true, autoInvalidate: true }), this.cacheConfig?.enable || (this.cacheConfig = void 0);
        }
        authToken;
        getQuery() {
          return this.query;
        }
        mapResult(e10, t10) {
          return e10;
        }
        setToken(e10) {
          return this.authToken = e10, this;
        }
        static [eB] = "PgPreparedQuery";
        joinsNotNullableMap;
        async queryWithCache(e10, t10, r10) {
          if (void 0 === this.cache || e$(this.cache, om) || void 0 === this.queryMetadata || this.cacheConfig && !this.cacheConfig.enable) try {
            return await r10();
          } catch (r11) {
            throw new aM(e10, t10, r11);
          }
          if (("insert" === this.queryMetadata.type || "update" === this.queryMetadata.type || "delete" === this.queryMetadata.type) && this.queryMetadata.tables.length > 0) try {
            let [e11] = await Promise.all([r10(), this.cache.onMutate({ tables: this.queryMetadata.tables })]);
            return e11;
          } catch (r11) {
            throw new aM(e10, t10, r11);
          }
          if (!this.cacheConfig) try {
            return await r10();
          } catch (r11) {
            throw new aM(e10, t10, r11);
          }
          if ("select" === this.queryMetadata.type) {
            let n10 = await this.cache.get(this.cacheConfig.tag ?? await oy(e10, t10), this.queryMetadata.tables, void 0 !== this.cacheConfig.tag, this.cacheConfig.autoInvalidate);
            if (void 0 === n10) {
              let n11;
              try {
                n11 = await r10();
              } catch (r11) {
                throw new aM(e10, t10, r11);
              }
              return await this.cache.put(this.cacheConfig.tag ?? await oy(e10, t10), n11, this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [], void 0 !== this.cacheConfig.tag, this.cacheConfig.config), n11;
            }
            return n10;
          }
          try {
            return await r10();
          } catch (r11) {
            throw new aM(e10, t10, r11);
          }
        }
      }
      class ov {
        constructor(e10) {
          this.dialect = e10;
        }
        static [eB] = "PgSession";
        execute(e10, t10) {
          return tc("drizzle.operation", () => tc("drizzle.prepareQuery", () => this.prepareQuery(this.dialect.sqlToQuery(e10), void 0, void 0, false)).setToken(t10).execute(void 0, t10));
        }
        all(e10) {
          return this.prepareQuery(this.dialect.sqlToQuery(e10), void 0, void 0, false).all();
        }
        async count(e10, t10) {
          return Number((await this.execute(e10, t10))[0].count);
        }
      }
      class ow extends op {
        constructor(e10, t10, r10, n10 = 0) {
          super(e10, t10, r10), this.schema = r10, this.nestedIndex = n10;
        }
        static [eB] = "PgTransaction";
        rollback() {
          throw new aB();
        }
        getTransactionConfigSQL(e10) {
          let t10 = [];
          return e10.isolationLevel && t10.push(`isolation level ${e10.isolationLevel}`), e10.accessMode && t10.push(e10.accessMode), "boolean" == typeof e10.deferrable && t10.push(e10.deferrable ? "deferrable" : "not deferrable"), tw.raw(t10.join(" "));
        }
        setTransaction(e10) {
          return this.session.execute(tw`set transaction ${this.getTransactionConfigSQL(e10)}`);
        }
      }
      let o_ = { arrayMode: false, fullResults: true }, oS = { arrayMode: true, fullResults: true };
      class oE extends ob {
        constructor(e10, t10, r10, n10, i10, s10, a10, o10, l2) {
          super(t10, n10, i10, s10), this.client = e10, this.logger = r10, this.fields = a10, this._isResponseInArrayMode = o10, this.customResultMapper = l2, this.clientQuery = e10.query ?? e10;
        }
        static [eB] = "NeonHttpPreparedQuery";
        clientQuery;
        async execute(e10 = {}, t10 = this.authToken) {
          let r10 = tx(this.query.params, e10);
          this.logger.logQuery(this.query.sql, r10);
          let { fields: n10, clientQuery: i10, query: s10, customResultMapper: a10 } = this;
          if (!n10 && !a10) return this.queryWithCache(s10.sql, r10, async () => i10(s10.sql, r10, void 0 === t10 ? o_ : { ...o_, authToken: t10 }));
          let o10 = await this.queryWithCache(s10.sql, r10, async () => await i10(s10.sql, r10, void 0 === t10 ? oS : { ...oS, authToken: t10 }));
          return this.mapResult(o10);
        }
        mapResult(e10) {
          if (!this.fields && !this.customResultMapper) return e10;
          let t10 = e10.rows;
          return this.customResultMapper ? this.customResultMapper(t10) : t10.map((e11) => function(e12, t11, r10) {
            let n10 = {}, i10 = e12.reduce((e13, { path: i11, field: s10 }, a10) => {
              let o10;
              o10 = e$(s10, ej) ? s10 : e$(s10, tg) ? s10.decoder : e$(s10, tl) ? s10._.sql.decoder : s10.sql.decoder;
              let l2 = e13;
              for (let [e14, u2] of i11.entries()) if (e14 < i11.length - 1) u2 in l2 || (l2[u2] = {}), l2 = l2[u2];
              else {
                let e15 = t11[a10], c2 = l2[u2] = null === e15 ? null : o10.mapFromDriverValue(e15);
                if (r10 && e$(s10, ej) && 2 === i11.length) {
                  let e16 = i11[0];
                  e16 in n10 ? "string" == typeof n10[e16] && n10[e16] !== s10.table[eq] && (n10[e16] = false) : n10[e16] = null === c2 && s10.table[eq];
                }
              }
              return e13;
            }, {});
            if (r10 && Object.keys(n10).length > 0) for (let [e13, t12] of Object.entries(n10)) "string" != typeof t12 || r10[t12] || (i10[e13] = null);
            return i10;
          }(this.fields, e11, this.joinsNotNullableMap));
        }
        all(e10 = {}) {
          let t10 = tx(this.query.params, e10);
          return this.logger.logQuery(this.query.sql, t10), this.clientQuery(this.query.sql, t10, void 0 === this.authToken ? o_ : { ...o_, authToken: this.authToken }).then((e11) => e11.rows);
        }
        values(e10 = {}, t10) {
          let r10 = tx(this.query.params, e10);
          return this.logger.logQuery(this.query.sql, r10), this.clientQuery(this.query.sql, r10, { arrayMode: true, fullResults: true, authToken: t10 }).then((e11) => e11.rows);
        }
        isResponseInArrayMode() {
          return this._isResponseInArrayMode;
        }
      }
      class ox extends ov {
        constructor(e10, t10, r10, n10 = {}) {
          super(t10), this.client = e10, this.schema = r10, this.options = n10, this.clientQuery = e10.query ?? e10, this.logger = n10.logger ?? new il(), this.cache = n10.cache ?? new om();
        }
        static [eB] = "NeonHttpSession";
        clientQuery;
        logger;
        cache;
        prepareQuery(e10, t10, r10, n10, i10, s10, a10) {
          return new oE(this.client, e10, this.logger, this.cache, s10, a10, t10, n10, i10);
        }
        async batch(e10) {
          let t10 = [], r10 = [];
          for (let n10 of e10) {
            let e11 = n10._prepare(), i10 = e11.getQuery();
            t10.push(e11), r10.push(this.clientQuery(i10.sql, i10.params, { fullResults: true, arrayMode: e11.isResponseInArrayMode() }));
          }
          return (await this.client.transaction(r10, oS)).map((e11, r11) => t10[r11].mapResult(e11, true));
        }
        async query(e10, t10) {
          return this.logger.logQuery(e10, t10), await this.clientQuery(e10, t10, { arrayMode: true, fullResults: true });
        }
        async queryObjects(e10, t10) {
          return this.clientQuery(e10, t10, { arrayMode: false, fullResults: true });
        }
        async count(e10, t10) {
          return Number((await this.execute(e10, t10)).rows[0].count);
        }
        async transaction(e10, t10 = {}) {
          throw Error("No transactions support in neon-http driver");
        }
      }
      class oT extends ow {
        static [eB] = "NeonHttpTransaction";
        async transaction(e10) {
          throw Error("No transactions support in neon-http driver");
        }
      }
      class oC {
        constructor(e10, t10, r10 = {}) {
          this.client = e10, this.dialect = t10, this.options = r10, this.initMappers();
        }
        static [eB] = "NeonHttpDriver";
        createSession(e10) {
          return new ox(this.client, this.dialect, e10, { logger: this.options.logger, cache: this.options.cache });
        }
        initMappers() {
          is.setTypeParser(is.builtins.TIMESTAMPTZ, (e10) => e10), is.setTypeParser(is.builtins.TIMESTAMP, (e10) => e10), is.setTypeParser(is.builtins.DATE, (e10) => e10), is.setTypeParser(is.builtins.INTERVAL, (e10) => e10), is.setTypeParser(1231, (e10) => e10), is.setTypeParser(1115, (e10) => e10), is.setTypeParser(1185, (e10) => e10), is.setTypeParser(1187, (e10) => e10), is.setTypeParser(1182, (e10) => e10);
        }
      }
      function oP(e10, t10, r10, n10) {
        return new Proxy(e10, { get(e11, i10) {
          let s10 = e11[i10];
          return "function" != typeof s10 && ("object" != typeof s10 || null === s10) ? s10 : n10 ? oP(s10, t10, r10) : "query" === i10 ? oP(s10, t10, r10, true) : new Proxy(s10, { apply(e12, n11, s11) {
            let a10 = e12.call(n11, ...s11);
            return "object" == typeof a10 && null !== a10 && "setToken" in a10 && "function" == typeof a10.setToken && a10.setToken(t10), r10(e12, i10, a10);
          } });
        } });
      }
      class oA extends op {
        static [eB] = "NeonHttpDatabase";
        $withAuth(e10) {
          return this.authToken = e10, oP(this, e10, (t10, r10, n10) => "with" === r10 ? oP(n10, e10, (e11, t11, r11) => r11) : n10);
        }
        async batch(e10) {
          return this.session.batch(e10);
        }
      }
      function oR(e10, t10 = {}) {
        let r10, n10, i10 = new az({ casing: t10.casing });
        if (true === t10.logger ? r10 = new io() : false !== t10.logger && (r10 = t10.logger), t10.schema) {
          let e11 = function(e12, t11) {
            1 === Object.keys(e12).length && "default" in e12 && !e$(e12.default, eK) && (e12 = e12.default);
            let r11 = {}, n11 = {}, i11 = {};
            for (let [s11, a11] of Object.entries(e12)) if (e$(a11, eK)) {
              let e13 = eX(a11), t12 = n11[e13];
              for (let n12 of (r11[e13] = s11, i11[s11] = { tsName: s11, dbName: a11[eK.Symbol.Name], schema: a11[eK.Symbol.Schema], columns: a11[eK.Symbol.Columns], relations: t12?.relations ?? {}, primaryKey: t12?.primaryKey ?? [] }, Object.values(a11[eK.Symbol.Columns]))) n12.primary && i11[s11].primaryKey.push(n12);
              let o10 = a11[eK.Symbol.ExtraConfigBuilder]?.(a11[eK.Symbol.ExtraConfigColumns]);
              if (o10) for (let e14 of Object.values(o10)) e$(e14, aA) && i11[s11].primaryKey.push(...e14.columns);
            } else if (e$(a11, aj)) {
              let e13, s12 = eX(a11.table), o10 = r11[s12];
              for (let [r12, l2] of Object.entries(a11.config(t11(a11.table)))) if (o10) {
                let t12 = i11[o10];
                t12.relations[r12] = l2, e13 && t12.primaryKey.push(...e13);
              } else s12 in n11 || (n11[s12] = { relations: {}, primaryKey: e13 }), n11[s12].relations[r12] = l2;
            }
            return { tables: i11, tableNamesMap: r11 };
          }(t10.schema, aU);
          n10 = { fullSchema: t10.schema, schema: e11.tables, tableNamesMap: e11.tableNamesMap };
        }
        let s10 = new oC(e10, i10, { logger: r10, cache: t10.cache }).createSession(n10), a10 = new oA(i10, s10, n10);
        return a10.$client = e10, a10.$cache = t10.cache, a10.$cache && (a10.$cache.invalidate = t10.cache?.onMutate), a10;
      }
      function oN(...e10) {
        if ("string" == typeof e10[0]) return oR(n6(e10[0]), e10[1]);
        if (function(e11) {
          if ("object" != typeof e11 || null === e11 || "Object" !== e11.constructor.name) return false;
          if ("logger" in e11) {
            let t10 = typeof e11.logger;
            return "boolean" === t10 || "object" === t10 && "function" == typeof e11.logger.logQuery || "undefined" === t10;
          }
          if ("schema" in e11) {
            let t10 = typeof e11.schema;
            return "object" === t10 || "undefined" === t10;
          }
          if ("casing" in e11) {
            let t10 = typeof e11.casing;
            return "string" === t10 || "undefined" === t10;
          }
          if ("mode" in e11) return "default" === e11.mode && "planetscale" === e11.mode && void 0 === e11.mode;
          if ("connection" in e11) {
            let t10 = typeof e11.connection;
            return "string" === t10 || "object" === t10 || "undefined" === t10;
          }
          if ("client" in e11) {
            let t10 = typeof e11.client;
            return "object" === t10 || "function" === t10 || "undefined" === t10;
          }
          return 0 === Object.keys(e11).length;
        }(e10[0])) {
          let { connection: t10, client: r10, ...n10 } = e10[0];
          if (r10) return oR(r10, n10);
          if ("object" == typeof t10) {
            let { connectionString: e11, ...r11 } = t10;
            return oR(n6(e11, r11), n10);
          }
          return oR(n6(t10), n10);
        }
        return oR(e10[0], e10[1]);
      }
      (oN || (oN = {})).mock = function(e10) {
        return oR({}, e10);
      };
      let oO = iG({ dataType: () => "tsvector" }), oI = to("entity_type", ["parent", "subsidiary", "associate", "nonprofit"]), ok = to("document_category", ["annual_report", "financial_result", "policy_code_framework", "reg30", "reg46", "subsidiary_financial", "certification", "agm", "egm", "shareholding_pattern", "trading_window", "related_party", "corporate_announcement", "newspaper_publication", "integrated_filing", "corporate_document"]), oD = to("translation_job_status", ["queued", "running", "completed", "failed"]), oL = to("activity_action", ["create", "update", "delete", "publish", "unpublish", "duplicate"]), oM = to("activity_entity", ["document", "group_company", "user", "product", "product_category"]), oB = to("product_status", ["draft", "in_review", "approved", "scheduled", "published", "archived"]), o$ = to("product_entity_role", ["manufacturer", "distributor", "licensor", "marketer"]), oj = ab("users", { id: s9("id").defaultRandom().primaryKey(), email: sY("email").notNull().unique(), passwordHash: sY("password_hash").notNull(), name: sY("name"), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }), oq = ab("sessions", { id: sY("id").primaryKey(), userId: s9("user_id").notNull().references(() => oj.id, { onDelete: "cascade" }), expiresAt: s4("expires_at", { withTimezone: true }).notNull() }, (e10) => [ax("sessions_user_id_idx").on(e10.userId)]), oF = ab("group_companies", { id: s9("id").defaultRandom().primaryKey(), slug: sY("slug").notNull().unique(), name: sY("name").notNull(), description: sY("description"), entityType: oI("entity_type").notNull(), cin: sY("cin"), websiteUrl: sY("website_url"), displayOrder: i7("display_order").notNull().default(0), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }), oU = ab("documents", { id: s9("id").defaultRandom().primaryKey(), category: ok("category").notNull(), subcategory: sY("subcategory"), title: sY("title").notNull(), description: sY("description"), fileUrl: sY("file_url"), fileSizeBytes: iN("file_size_bytes", { mode: "number" }), period: sY("period"), eventDate: iZ("event_date"), entityId: s9("entity_id").references(() => oF.id, { onDelete: "set null" }), externalLink: sY("external_link"), displayOrder: i7("display_order").notNull().default(0), isPublished: i$("is_published").notNull().default(true), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("documents_category_idx").on(e10.category), ax("documents_category_published_order_idx").on(e10.category, e10.isPublished, e10.displayOrder), ax("documents_entity_id_idx").on(e10.entityId)]), oQ = ab("languages", { code: sY("code").primaryKey(), name: sY("name").notNull(), nativeName: sY("native_name").notNull(), isDefault: i$("is_default").notNull().default(false), isActive: i$("is_active").notNull().default(true), displayOrder: i7("display_order").notNull().default(0), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull() }), oz = ab("document_translations", { documentId: s9("document_id").notNull().references(() => oU.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), title: sY("title").notNull(), description: sY("description"), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.documentId, e10.locale] }), ax("document_translations_locale_idx").on(e10.locale)]), oV = ab("page_metadata_translations", { pagePath: sY("page_path").notNull(), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), title: sY("title").notNull(), description: sY("description"), keywords: sY("keywords"), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.pagePath, e10.locale] }), ax("page_meta_translations_locale_idx").on(e10.locale)]), oH = ab("ui_strings", { key: sY("key").notNull(), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), value: sY("value").notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.key, e10.locale] }), ax("ui_strings_locale_idx").on(e10.locale)]), oG = ab("translation_jobs", { id: s9("id").defaultRandom().primaryKey(), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), status: oD("status").notNull().default("queued"), totalItems: i7("total_items").notNull().default(0), completedItems: i7("completed_items").notNull().default(0), errorMessage: sY("error_message"), startedAt: s4("started_at", { withTimezone: true }), finishedAt: s4("finished_at", { withTimezone: true }), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), createdBy: s9("created_by").references(() => oj.id, { onDelete: "set null" }) }, (e10) => [ax("translation_jobs_locale_status_idx").on(e10.locale, e10.status)]), oW = ab("pages", { id: s9("id").defaultRandom().primaryKey(), path: sY("path").notNull().unique(), label: sY("label").notNull(), isPublished: i$("is_published").notNull().default(true), showInNav: i$("show_in_nav").notNull().default(false), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("pages_path_idx").on(e10.path)]), oK = ab("page_blocks", { id: s9("id").defaultRandom().primaryKey(), pageId: s9("page_id").notNull().references(() => oW.id, { onDelete: "cascade" }), blockType: sY("block_type").notNull(), displayOrder: i7("display_order").notNull().default(0), isLocked: i$("is_locked").notNull().default(false), props: so("props").notNull().default({}), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("page_blocks_page_order_idx").on(e10.pageId, e10.displayOrder)]), oX = ab("page_block_translations", { blockId: s9("block_id").notNull().references(() => oK.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), props: so("props").notNull().default({}), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.blockId, e10.locale] }), ax("page_block_translations_locale_idx").on(e10.locale)]), oJ = ab("page_versions", { id: s9("id").defaultRandom().primaryKey(), pageId: s9("page_id").notNull().references(() => oW.id, { onDelete: "cascade" }), snapshot: so("snapshot").notNull(), label: sY("label"), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), createdBy: s9("created_by").references(() => oj.id, { onDelete: "set null" }) }, (e10) => [ax("page_versions_page_created_idx").on(e10.pageId, e10.createdAt)]), oY = ab("page_text_overrides", { pagePath: sY("page_path").notNull(), key: sY("key").notNull(), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), value: sY("value").notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull(), updatedBy: s9("updated_by").references(() => oj.id, { onDelete: "set null" }) }, (e10) => [aP({ columns: [e10.pagePath, e10.key, e10.locale] }), ax("page_text_overrides_path_locale_idx").on(e10.pagePath, e10.locale)]), oZ = ab("page_metadata", { pagePath: sY("page_path").primaryKey(), title: sY("title").notNull(), description: sY("description"), ogImage: sY("og_image"), keywords: sY("keywords"), canonical: sY("canonical"), noIndex: i$("no_index").notNull().default(false), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull(), updatedBy: s9("updated_by").references(() => oj.id, { onDelete: "set null" }) }), o0 = ab("activity_log", { id: s9("id").defaultRandom().primaryKey(), userId: s9("user_id").references(() => oj.id, { onDelete: "set null" }), userEmail: sY("user_email").notNull(), action: oL("action").notNull(), entityType: oM("entity_type").notNull(), entityId: s9("entity_id"), entityTitle: sY("entity_title").notNull(), detail: sY("detail"), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("activity_log_created_at_idx").on(e10.createdAt)]), o1 = ab("product_categories", { id: s9("id").defaultRandom().primaryKey(), slug: sY("slug").notNull().unique(), label: sY("label").notNull(), description: sY("description"), heroImage: sY("hero_image"), icon: sY("icon"), displayOrder: i7("display_order").notNull().default(0), isActive: i$("is_active").notNull().default(true), deletedAt: s4("deleted_at", { withTimezone: true }), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("product_categories_active_order_idx").on(e10.displayOrder).where(tw`${e10.isActive} = true AND ${e10.deletedAt} IS NULL`)]), o2 = ab("product_category_translations", { categoryId: s9("category_id").notNull().references(() => o1.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), label: sY("label").notNull(), description: sY("description"), slug: sY("slug"), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.categoryId, e10.locale] }), ax("product_category_translations_locale_idx").on(e10.locale), aT("product_category_translations_locale_slug_unique").on(e10.locale, e10.slug).where(tw`${e10.slug} IS NOT NULL`)]), o6 = ab("products", { id: s9("id").defaultRandom().primaryKey(), slug: sY("slug").notNull().unique(), name: sY("name").notNull(), description: sY("description"), attributes: so("attributes").$type().notNull().default({}), synonyms: sY("synonyms").array().notNull().default([]), status: oB("status").notNull().default("draft"), publishedAt: s4("published_at", { withTimezone: true }), displayOrder: i7("display_order").notNull().default(0), deletedAt: s4("deleted_at", { withTimezone: true }), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull(), createdBy: s9("created_by").references(() => oj.id, { onDelete: "set null" }), updatedBy: s9("updated_by").references(() => oj.id, { onDelete: "set null" }), searchVector: oO("search_vector").generatedAlwaysAs(tw`to_tsvector('simple'::regconfig,
            coalesce(name,'') || ' ' ||  2472.20
            coalesce(attributes->>'casNumber','') || ' ' ||
            array_join_space(synonyms))`) }, (e10) => [ax("products_published_order_idx").on(e10.displayOrder, e10.name).where(tw`${e10.status} = 'published' AND ${e10.deletedAt} IS NULL`), ax("products_updated_at_idx").on(tw`${e10.updatedAt} DESC`), ax("products_search_idx").using("gin", e10.searchVector), ax("products_name_trgm_idx").using("gin", tw`lower(${e10.name}) gin_trgm_ops`), ax("products_cas_idx").on(tw`lower(${e10.attributes}->>'casNumber')`), ax("products_scheduled_idx").on(e10.publishedAt).where(tw`${e10.status} = 'scheduled'`)]), o5 = ab("product_translations", { productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), name: sY("name").notNull(), description: sY("description"), attributes: so("attributes").$type().notNull().default({}), synonyms: sY("synonyms").array().notNull().default([]), slug: sY("slug"), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull(), searchVector: oO("search_vector").generatedAlwaysAs(tw`to_tsvector('simple'::regconfig,
            coalesce(name,'') || ' ' ||
            coalesce(description,'') || ' ' ||
            array_join_space(synonyms))`) }, (e10) => [aP({ columns: [e10.productId, e10.locale] }), ax("product_translations_locale_idx").on(e10.locale), aT("product_translations_locale_slug_unique").on(e10.locale, e10.slug).where(tw`${e10.slug} IS NOT NULL`), ax("product_translations_search_idx").using("gin", e10.searchVector), ax("product_translations_name_trgm_idx").using("gin", tw`lower(${e10.name}) gin_trgm_ops`)]), o3 = ab("product_to_categories", { productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), categoryId: s9("category_id").notNull().references(() => o1.id, { onDelete: "restrict" }), subCategory: sY("sub_category"), isPrimary: i$("is_primary").notNull().default(false), displayOrder: i7("display_order").notNull().default(0) }, (e10) => [aP({ columns: [e10.productId, e10.categoryId] }), aT("product_to_categories_primary_unique").on(e10.productId).where(tw`${e10.isPrimary} = true`), ax("product_to_categories_listing_idx").on(e10.categoryId, e10.subCategory, e10.displayOrder), ax("product_to_categories_product_idx").on(e10.productId)]), o4 = ab("product_to_entities", { productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), entityId: s9("entity_id").notNull().references(() => oF.id, { onDelete: "cascade" }), role: o$("role").notNull().default("manufacturer"), displayOrder: i7("display_order").notNull().default(0) }, (e10) => [aP({ columns: [e10.productId, e10.entityId, e10.role] }), ax("product_to_entities_product_idx").on(e10.productId, e10.displayOrder), ax("product_to_entities_entity_idx").on(e10.entityId)]), o8 = ab("product_documents", { productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), documentId: s9("document_id").notNull().references(() => oU.id, { onDelete: "cascade" }), slot: sY("slot"), displayOrder: i7("display_order").notNull().default(0) }, (e10) => [aP({ columns: [e10.productId, e10.documentId] }), ax("product_documents_product_idx").on(e10.productId, e10.displayOrder), ax("product_documents_document_idx").on(e10.documentId)]), o7 = ab("product_images", { id: s9("id").defaultRandom().primaryKey(), productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), url: sY("url").notNull(), width: i7("width"), height: i7("height"), isPrimary: i$("is_primary").notNull().default(false), displayOrder: i7("display_order").notNull().default(0), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [ax("product_images_product_order_idx").on(e10.productId, e10.displayOrder), aT("product_images_primary_unique").on(e10.productId).where(tw`${e10.isPrimary} = true`)]), o9 = ab("product_image_translations", { imageId: s9("image_id").notNull().references(() => o7.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), altText: sY("alt_text").notNull(), caption: sY("caption"), updatedAt: s4("updated_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aP({ columns: [e10.imageId, e10.locale] }), ax("product_image_translations_locale_idx").on(e10.locale)]), le = ab("product_url_aliases", { id: s9("id").defaultRandom().primaryKey(), productId: s9("product_id").notNull().references(() => o6.id, { onDelete: "cascade" }), locale: sY("locale").notNull().references(() => oQ.code, { onDelete: "cascade" }), categorySlug: sY("category_slug").notNull(), productSlug: sY("product_slug").notNull(), createdAt: s4("created_at", { withTimezone: true }).defaultNow().notNull() }, (e10) => [aT("product_url_aliases_lookup_unique").on(e10.locale, e10.categorySlug, e10.productSlug), ax("product_url_aliases_product_idx").on(e10.productId)]);
      e.s(["activityActionEnum", 0, oL, "activityEntityEnum", 0, oM, "activityLog", 0, o0, "documentCategoryEnum", 0, ok, "documentTranslations", 0, oz, "documents", 0, oU, "entityTypeEnum", 0, oI, "groupCompanies", 0, oF, "languages", 0, oQ, "pageBlockTranslations", 0, oX, "pageBlocks", 0, oK, "pageMetadata", 0, oZ, "pageMetadataTranslations", 0, oV, "pageTextOverrides", 0, oY, "pageVersions", 0, oJ, "pages", 0, oW, "productCategories", 0, o1, "productCategoryTranslations", 0, o2, "productDocuments", 0, o8, "productEntityRoleEnum", 0, o$, "productImageTranslations", 0, o9, "productImages", 0, o7, "productStatusEnum", 0, oB, "productToCategories", 0, o3, "productToEntities", 0, o4, "productTranslations", 0, o5, "productUrlAliases", 0, le, "products", 0, o6, "sessions", 0, oq, "translationJobStatusEnum", 0, oD, "translationJobs", 0, oG, "uiStrings", 0, oH, "users", 0, oj], 31903);
      var lt = e.i(31903);
      let lr = process.env.DATABASE_URL;
      if (!lr) throw Error("DATABASE_URL is not set. Add it to .env.local or your Vercel project env.");
      let ln = oN(n6(lr), { schema: lt });
      async function li() {
        try {
          return await ln.select().from(oQ).where(tA(oQ.isActive, true)).orderBy(tK(oQ.displayOrder), tK(oQ.code));
        } catch {
          return [];
        }
      }
      let ls = (0, eM.unstable_cache)(li, ["i18n-active-locales"], { tags: ["i18n:locales"], revalidate: 3600 });
      async function la() {
        let e10 = await ls();
        return 0 === e10.length ? ["en"] : e10.map((e11) => e11.code);
      }
      let lo = null;
      async function ll() {
        let e10 = Date.now();
        if (lo && lo.expiresAt > e10) return lo.codes;
        let t10 = await la();
        return lo = { codes: t10, expiresAt: e10 + 6e4 }, t10;
      }
      async function lu(e10) {
        let { pathname: t10, search: r10, searchParams: n10 } = e10.nextUrl, i10 = e10.cookies.has("astonea_session"), s10 = "1" === n10.get("edit") && i10;
        if ("/admin/login" === t10 && i10) {
          let t11 = e10.nextUrl.clone();
          return t11.pathname = "/admin", P.redirect(t11);
        }
        if (t10.startsWith("/admin") && "/admin/login" !== t10 && !i10) {
          let r11 = e10.nextUrl.clone();
          return r11.pathname = "/admin/login", r11.searchParams.set("next", t10), P.redirect(r11);
        }
        if (t10.startsWith("/admin")) return P.next();
        let a10 = t10.split("/").filter(Boolean)[0] ?? "";
        if ((await ll()).includes(a10) && "en" !== a10) {
          let r11 = new Headers(e10.headers);
          return r11.set("x-locale", a10), r11.set("x-pathname", t10), s10 && r11.set("x-cms-edit", "1"), P.next({ request: { headers: r11 } });
        }
        if ("en" === a10) {
          let r11 = t10.replace(/^\/en(?=\/|$)/, "") || "/", n11 = e10.nextUrl.clone();
          return n11.pathname = r11, P.redirect(n11);
        }
        let o10 = e10.nextUrl.clone();
        o10.pathname = `/en${t10}`, o10.search = r10;
        let l2 = new Headers(e10.headers);
        return l2.set("x-locale", "en"), l2.set("x-pathname", t10), s10 && l2.set("x-cms-edit", "1"), P.rewrite(o10, { request: { headers: l2 } });
      }
      ll().catch(() => {
      }), e.s(["config", 0, { matcher: ["/((?!_next|api|favicon|.*\\..*).*)"] }, "middleware", 0, lu], 99446);
      let lc = { ...e.i(99446) }, lh = "/middleware", ld = lc.middleware || lc.default;
      if ("function" != typeof ld) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${lh}" must export a function named \`middleware\` or a default function.`);
      let lf = (e10) => ew({ ...e10, IncrementalCache: eL, incrementalCacheHandler: null, page: lh, handler: async (...e11) => {
        try {
          return await ld(...e11);
        } catch (i10) {
          let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
          throw await o(i10, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i10;
        }
      } });
      async function lp(e10, t10) {
        let r10 = await lf({ request: { url: e10.url, method: e10.method, headers: (0, p.toNodeOutgoingHttpHeaders)(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: lh }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r10.waitUntil), r10.response;
      }
      e.s(["default", 0, lf, "handler", 0, lp], 42738);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_055zztu.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_055zztu = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_055zztu.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_055zztu.js", { otherChunks: ["chunks/[root-of-the-server]__0fq~heb._.js", "chunks/node_modules_next_0~vyq1w._.js"], runtimeModuleIds: [38022] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
      var r, n = ((r = n || {})[r.Runtime = 0] = "Runtime", r[r.Parent = 1] = "Parent", r[r.Update = 2] = "Update", r);
      let o = /* @__PURE__ */ new WeakMap();
      function u(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let l = u.prototype, i = Object.prototype.hasOwnProperty, a = "u" > typeof Symbol && Symbol.toStringTag;
      function s(e2, t2, r2) {
        i.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function c(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = f(t2), e2[t2] = r2), r2;
      }
      function f(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function h(e2, t2) {
        s(e2, "__esModule", { value: true }), a && s(e2, a, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) s(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? s(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : s(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      function d(e2, t2) {
        (null != t2 ? c(this.c, t2) : this.m).exports = e2;
      }
      l.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = c(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, h(n2, e2);
      }, l.j = function(e2, t2) {
        var r2, n2;
        let u2, l2, a2;
        null != t2 ? l2 = (u2 = c(this.c, t2)).exports : (u2 = this.m, l2 = this.e);
        let s2 = (r2 = u2, n2 = l2, (a2 = o.get(r2)) || (o.set(r2, a2 = []), r2.exports = r2.namespaceObject = new Proxy(n2, { get(e3, t3) {
          if (i.call(e3, t3) || "default" === t3 || "__esModule" === t3) return Reflect.get(e3, t3);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t3);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t3 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t3.includes(r3) || t3.push(r3);
          return t3;
        } })), a2);
        "object" == typeof e2 && null !== e2 && s2.push(e2);
      }, l.v = d, l.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? c(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let p = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, m = [null, p({}), p([]), p(p)];
      function b(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !m.includes(t3); t3 = p(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), h(t2, n2), t2;
      }
      function y(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function g(e2) {
        let t2 = K(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = b(r2, y(r2), r2 && r2.__esModule);
      }
      function w(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function O(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function _() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      l.i = g, l.A = function(e2) {
        return this.r(e2)(g.bind(this));
      }, l.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, l.r = function(e2) {
        return K(e2, this.m).exports;
      }, l.f = function(e2) {
        function t2(t3) {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let k = Symbol("turbopack queues"), j = Symbol("turbopack exports"), C = Symbol("turbopack error");
      function P(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      l.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = _(), a2 = Object.assign(i2, { [j]: r2.exports, [k]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[j] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (k in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [j]: {}, [k]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[j] = e5, P(t4);
                }, (e5) => {
                  r4[C] = e5, P(t4);
                }), r4;
              }
            }
            return { [j]: e4, [k]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[C]) throw e4[C];
            return e4[j];
          }), { promise: u3, resolve: l3 } = _(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[k](a3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(a2[C] = e3) : u2(a2[j]), P(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let v = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function E(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      v.prototype = URL.prototype, l.U = v, l.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, l.g = globalThis;
      let U = u.prototype, R = /* @__PURE__ */ new Map();
      l.M = R;
      let x = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return q(e2, t2, A(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!R.has(e3) || x.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => M.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) M.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = q(e2, t2, A(n3));
            M.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = q(e2, t2, A(r2.path)), l2)) M.has(o3) || M.set(o3, n2);
        }
        for (let e3 of o2) x.has(e3) || x.set(e3, n2);
        await n2;
      }
      U.l = function(e2) {
        return $(n.Parent, this.m.id, e2);
      };
      let T = Promise.resolve(void 0), S = /* @__PURE__ */ new WeakMap();
      function q(t2, r2, o2) {
        let u2 = e.loadChunkCached(t2, o2), l2 = S.get(u2);
        if (void 0 === l2) {
          let e2 = S.set.bind(S, u2, T);
          l2 = u2.then(e2).catch((e3) => {
            let u3;
            switch (t2) {
              case n.Runtime:
                u3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case n.Parent:
                u3 = `from module ${r2}`;
                break;
              case n.Update:
                u3 = "from an HMR update";
                break;
              default:
                E(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let l3 = Error(`Failed to load chunk ${o2} ${u3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw l3.name = "ChunkLoadError", l3;
          }), S.set(u2, l2);
        }
        return l2;
      }
      function A(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      U.L = function(e2) {
        return q(n.Parent, this.m.id, e2);
      }, U.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, U.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, U.q = function(e2, t2) {
        d.call(this, `${e2}`, t2);
      }, U.b = function(e2, r2, n2, o2) {
        let u2 = "SharedWorker" === e2.name, l2 = [n2.map((e3) => A(e3)).reverse(), ""];
        for (let e3 of t) l2.push(globalThis[e3]);
        let i2 = new URL(A(r2), location.origin), a2 = JSON.stringify(l2);
        return u2 ? i2.searchParams.set("params", a2) : i2.hash = "#params=" + encodeURIComponent(a2), new e2(i2, o2 ? { ...o2, type: void 0 } : void 0);
      };
      let N = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      l.w = function(t2, r2, o2) {
        return e.loadWebAssembly(n.Parent, this.m.id, t2, r2, o2);
      }, l.u = function(t2, r2) {
        return e.loadWebAssemblyModule(n.Parent, this.m.id, t2, r2);
      };
      let I = {};
      l.c = I;
      let K = (e2, t2) => {
        let r2 = I[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return L(e2, n.Parent, t2.id);
      };
      function L(e2, t2, r2) {
        let n2 = R.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              E(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let o2 = f(e2), l2 = o2.exports;
        I[e2] = o2;
        let i2 = new u(o2, l2);
        try {
          n2(i2, o2, l2);
        } catch (e3) {
          throw o2.error = e3, e3;
        }
        return o2.namespaceObject && o2.exports !== o2.namespaceObject && b(o2.exports, o2.namespaceObject), o2;
      }
      function W(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let u2 = e2[o2];
            for (let u3 = r3; u3 < o2; u3++) {
              let r4 = e2[u3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let l2 = n3 ?? u2, i2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (i2 || (l2 === u2 && Object.defineProperty(u2, "name", { value: "module evaluation" }), i2 = true), t3.set(r4, l2));
            }
            r3 = o2 + 1;
          }
        }(t2, R)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : b(n2, y(n2), true);
      }
      l.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? b(t2.default, y(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), l.x = B, e = { registerChunk(e2, t2) {
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(e2);
        F.add(r2), function(e3) {
          let t3 = D.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && z(r3.runtimeModuleIds, r3.chunkPath);
            D.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? z(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = O(e4);
            if (F.has(t4)) continue;
            n2.add(t4);
            let r4 = D.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), D.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && z(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = O(e3), N.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await X(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => X(r2, n2) };
      let F = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Map();
      function z(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = I[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          L(t3, n.Runtime, e3);
        }(t2, r2);
      }
      async function X(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let H = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: W }, H.forEach(W);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|api|favicon|.*\\..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_root_of_the_server_0fq_heb();
    require_node_modules_next_0_vyq1w();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_055zztu();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\dev\\astonea", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 15, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "root": "C:\\dev\\astonea", "resolveAlias": { "next-intl/config": "./i18n/request.ts" } }, "distDirRoot": ".next" };
var BuildId = "Zuk-Ryfa5VvxKWZJHmGQj";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/activity", "regex": "^/admin/activity(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/activity(?:/)?$" }, { "page": "/admin/documents", "regex": "^/admin/documents(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/documents(?:/)?$" }, { "page": "/admin/documents/export.csv", "regex": "^/admin/documents/export\\.csv(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/documents/export\\.csv(?:/)?$" }, { "page": "/admin/group-companies", "regex": "^/admin/group\\-companies(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/group\\-companies(?:/)?$" }, { "page": "/admin/languages", "regex": "^/admin/languages(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/languages(?:/)?$" }, { "page": "/admin/login", "regex": "^/admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/login(?:/)?$" }, { "page": "/admin/pages", "regex": "^/admin/pages(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/pages(?:/)?$" }, { "page": "/admin/products", "regex": "^/admin/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/products(?:/)?$" }, { "page": "/admin/products/categories", "regex": "^/admin/products/categories(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/products/categories(?:/)?$" }, { "page": "/admin/seo", "regex": "^/admin/seo(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/seo(?:/)?$" }, { "page": "/admin/seo/edit", "regex": "^/admin/seo/edit(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/seo/edit(?:/)?$" }, { "page": "/admin/users", "regex": "^/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/users(?:/)?$" }], "dynamic": [{ "page": "/admin/documents/[id]/edit", "regex": "^/admin/documents/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/documents/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/admin/pages/[id]/edit", "regex": "^/admin/pages/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/pages/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/admin/products/[id]/edit", "regex": "^/admin/products/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/products/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/[locale]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)(?:/)?$" }, { "page": "/[locale]/about-us", "regex": "^/([^/]+?)/about\\-us(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/about\\-us(?:/)?$" }, { "page": "/[locale]/agm", "regex": "^/([^/]+?)/agm(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/agm(?:/)?$" }, { "page": "/[locale]/annual-reports", "regex": "^/([^/]+?)/annual\\-reports(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/annual\\-reports(?:/)?$" }, { "page": "/[locale]/board-meetings", "regex": "^/([^/]+?)/board\\-meetings(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/board\\-meetings(?:/)?$" }, { "page": "/[locale]/board-of-directors", "regex": "^/([^/]+?)/board\\-of\\-directors(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/board\\-of\\-directors(?:/)?$" }, { "page": "/[locale]/career", "regex": "^/([^/]+?)/career(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/career(?:/)?$" }, { "page": "/[locale]/certifications", "regex": "^/([^/]+?)/certifications(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/certifications(?:/)?$" }, { "page": "/[locale]/codes", "regex": "^/([^/]+?)/codes(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/codes(?:/)?$" }, { "page": "/[locale]/contact-us", "regex": "^/([^/]+?)/contact\\-us(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/contact\\-us(?:/)?$" }, { "page": "/[locale]/corporate-announcements", "regex": "^/([^/]+?)/corporate\\-announcements(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/corporate\\-announcements(?:/)?$" }, { "page": "/[locale]/corporate-documents", "regex": "^/([^/]+?)/corporate\\-documents(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/corporate\\-documents(?:/)?$" }, { "page": "/[locale]/corporate-governance", "regex": "^/([^/]+?)/corporate\\-governance(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/corporate\\-governance(?:/)?$" }, { "page": "/[locale]/csr", "regex": "^/([^/]+?)/csr(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/csr(?:/)?$" }, { "page": "/[locale]/egm", "regex": "^/([^/]+?)/egm(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/egm(?:/)?$" }, { "page": "/[locale]/financial-results", "regex": "^/([^/]+?)/financial\\-results(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/financial\\-results(?:/)?$" }, { "page": "/[locale]/frameworks", "regex": "^/([^/]+?)/frameworks(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/frameworks(?:/)?$" }, { "page": "/[locale]/governance-policies-codes-and-frameworks", "regex": "^/([^/]+?)/governance\\-policies\\-codes\\-and\\-frameworks(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/governance\\-policies\\-codes\\-and\\-frameworks(?:/)?$" }, { "page": "/[locale]/group-companies", "regex": "^/([^/]+?)/group\\-companies(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/group\\-companies(?:/)?$" }, { "page": "/[locale]/integrated-filings", "regex": "^/([^/]+?)/integrated\\-filings(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/integrated\\-filings(?:/)?$" }, { "page": "/[locale]/integrated-finance", "regex": "^/([^/]+?)/integrated\\-finance(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/integrated\\-finance(?:/)?$" }, { "page": "/[locale]/integrated-governance", "regex": "^/([^/]+?)/integrated\\-governance(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/integrated\\-governance(?:/)?$" }, { "page": "/[locale]/investor-grievances", "regex": "^/([^/]+?)/investor\\-grievances(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/investor\\-grievances(?:/)?$" }, { "page": "/[locale]/investor-insights", "regex": "^/([^/]+?)/investor\\-insights(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/investor\\-insights(?:/)?$" }, { "page": "/[locale]/key-milestone", "regex": "^/([^/]+?)/key\\-milestone(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/key\\-milestone(?:/)?$" }, { "page": "/[locale]/leadership-panel", "regex": "^/([^/]+?)/leadership\\-panel(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/leadership\\-panel(?:/)?$" }, { "page": "/[locale]/manufacturing-facility", "regex": "^/([^/]+?)/manufacturing\\-facility(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/manufacturing\\-facility(?:/)?$" }, { "page": "/[locale]/meetings", "regex": "^/([^/]+?)/meetings(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/meetings(?:/)?$" }, { "page": "/[locale]/newspaper-publications", "regex": "^/([^/]+?)/newspaper\\-publications(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/newspaper\\-publications(?:/)?$" }, { "page": "/[locale]/policies", "regex": "^/([^/]+?)/policies(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/policies(?:/)?$" }, { "page": "/[locale]/products", "regex": "^/([^/]+?)/products(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/products(?:/)?$" }, { "page": "/[locale]/products/[category]", "regex": "^/([^/]+?)/products/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPcategory": "nxtPcategory" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/products/(?<nxtPcategory>[^/]+?)(?:/)?$" }, { "page": "/[locale]/products/[category]/[slug]", "regex": "^/([^/]+?)/products/([^/]+?)/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPcategory": "nxtPcategory", "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/products/(?<nxtPcategory>[^/]+?)/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/[locale]/public-offering", "regex": "^/([^/]+?)/public\\-offering(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/public\\-offering(?:/)?$" }, { "page": "/[locale]/registrar-share-transfer-agent", "regex": "^/([^/]+?)/registrar\\-share\\-transfer\\-agent(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/registrar\\-share\\-transfer\\-agent(?:/)?$" }, { "page": "/[locale]/related-party-transactions", "regex": "^/([^/]+?)/related\\-party\\-transactions(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/related\\-party\\-transactions(?:/)?$" }, { "page": "/[locale]/sebi-lodr-regulation-30-disclosures", "regex": "^/([^/]+?)/sebi\\-lodr\\-regulation\\-30\\-disclosures(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/sebi\\-lodr\\-regulation\\-30\\-disclosures(?:/)?$" }, { "page": "/[locale]/sebi-lodr-regulation-46-disclosures", "regex": "^/([^/]+?)/sebi\\-lodr\\-regulation\\-46\\-disclosures(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/sebi\\-lodr\\-regulation\\-46\\-disclosures(?:/)?$" }, { "page": "/[locale]/shareholding-pattern", "regex": "^/([^/]+?)/shareholding\\-pattern(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/shareholding\\-pattern(?:/)?$" }, { "page": "/[locale]/subsidiaries", "regex": "^/([^/]+?)/subsidiaries(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/subsidiaries(?:/)?$" }, { "page": "/[locale]/trading-window-closure", "regex": "^/([^/]+?)/trading\\-window\\-closure(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/trading\\-window\\-closure(?:/)?$" }, { "page": "/[locale]/vision-and-mission", "regex": "^/([^/]+?)/vision\\-and\\-mission(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/vision\\-and\\-mission(?:/)?$" }, { "page": "/[locale]/what-we-do", "regex": "^/([^/]+?)/what\\-we\\-do(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/what\\-we\\-do(?:/)?$" }, { "page": "/[locale]/[...slug]", "regex": "^/([^/]+?)/(.+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/(?<nxtPslug>.+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "e6a57a56f894d6261cbe133bb4218eeb", "previewModeSigningKey": "348c932a059ac0512ded6399aeb3d1cfaae025eea0538a4333b0e65fd0931e1f", "previewModeEncryptionKey": "e403531cff578555f58ffb81625f4e21afd6b89f84d2855d5191122fa18158d8" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__0fq~heb._.js", "server/edge/chunks/node_modules_next_0~vyq1w._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_055zztu.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_055zztu.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|api|favicon|.*\\..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!_next|api|favicon|.*\\..*).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "Zuk-Ryfa5VvxKWZJHmGQj", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "S+LFG0kl+2mFkDZ8+V5DcXuymFVD6XZuiX2cRwPSaFA=", "__NEXT_PREVIEW_MODE_ID": "e6a57a56f894d6261cbe133bb4218eeb", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "e403531cff578555f58ffb81625f4e21afd6b89f84d2855d5191122fa18158d8", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "348c932a059ac0512ded6399aeb3d1cfaae025eea0538a4333b0e65fd0931e1f" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/[locale]/[...slug]/page": "/[locale]/[...slug]", "/[locale]/about-us/page": "/[locale]/about-us", "/[locale]/agm/page": "/[locale]/agm", "/[locale]/annual-reports/page": "/[locale]/annual-reports", "/[locale]/board-meetings/page": "/[locale]/board-meetings", "/[locale]/board-of-directors/page": "/[locale]/board-of-directors", "/[locale]/career/page": "/[locale]/career", "/[locale]/certifications/page": "/[locale]/certifications", "/[locale]/codes/page": "/[locale]/codes", "/[locale]/contact-us/page": "/[locale]/contact-us", "/[locale]/corporate-announcements/page": "/[locale]/corporate-announcements", "/[locale]/corporate-documents/page": "/[locale]/corporate-documents", "/[locale]/corporate-governance/page": "/[locale]/corporate-governance", "/[locale]/csr/page": "/[locale]/csr", "/[locale]/egm/page": "/[locale]/egm", "/[locale]/financial-results/page": "/[locale]/financial-results", "/[locale]/frameworks/page": "/[locale]/frameworks", "/[locale]/governance-policies-codes-and-frameworks/page": "/[locale]/governance-policies-codes-and-frameworks", "/[locale]/group-companies/page": "/[locale]/group-companies", "/[locale]/integrated-filings/page": "/[locale]/integrated-filings", "/[locale]/integrated-finance/page": "/[locale]/integrated-finance", "/[locale]/integrated-governance/page": "/[locale]/integrated-governance", "/[locale]/investor-grievances/page": "/[locale]/investor-grievances", "/[locale]/investor-insights/page": "/[locale]/investor-insights", "/[locale]/key-milestone/page": "/[locale]/key-milestone", "/[locale]/leadership-panel/page": "/[locale]/leadership-panel", "/[locale]/manufacturing-facility/page": "/[locale]/manufacturing-facility", "/[locale]/meetings/page": "/[locale]/meetings", "/[locale]/newspaper-publications/page": "/[locale]/newspaper-publications", "/[locale]/page": "/[locale]", "/[locale]/policies/page": "/[locale]/policies", "/[locale]/products/[category]/[slug]/page": "/[locale]/products/[category]/[slug]", "/[locale]/products/[category]/page": "/[locale]/products/[category]", "/[locale]/products/page": "/[locale]/products", "/[locale]/public-offering/page": "/[locale]/public-offering", "/[locale]/registrar-share-transfer-agent/page": "/[locale]/registrar-share-transfer-agent", "/[locale]/related-party-transactions/page": "/[locale]/related-party-transactions", "/[locale]/sebi-lodr-regulation-30-disclosures/page": "/[locale]/sebi-lodr-regulation-30-disclosures", "/[locale]/sebi-lodr-regulation-46-disclosures/page": "/[locale]/sebi-lodr-regulation-46-disclosures", "/[locale]/shareholding-pattern/page": "/[locale]/shareholding-pattern", "/[locale]/subsidiaries/page": "/[locale]/subsidiaries", "/[locale]/trading-window-closure/page": "/[locale]/trading-window-closure", "/[locale]/vision-and-mission/page": "/[locale]/vision-and-mission", "/[locale]/what-we-do/page": "/[locale]/what-we-do", "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/admin/(authed)/activity/page": "/admin/activity", "/admin/(authed)/documents/[id]/edit/page": "/admin/documents/[id]/edit", "/admin/(authed)/documents/export.csv/route": "/admin/documents/export.csv", "/admin/(authed)/documents/page": "/admin/documents", "/admin/(authed)/group-companies/page": "/admin/group-companies", "/admin/(authed)/languages/page": "/admin/languages", "/admin/(authed)/page": "/admin", "/admin/(authed)/pages/[id]/edit/page": "/admin/pages/[id]/edit", "/admin/(authed)/pages/page": "/admin/pages", "/admin/(authed)/products/[id]/edit/page": "/admin/products/[id]/edit", "/admin/(authed)/products/categories/page": "/admin/products/categories", "/admin/(authed)/products/page": "/admin/products", "/admin/(authed)/seo/edit/page": "/admin/seo/edit", "/admin/(authed)/seo/page": "/admin/seo", "/admin/(authed)/users/page": "/admin/users", "/admin/login/page": "/admin/login" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/admin/languages": { "maxDuration": 300 } } };
var PagesManifest = { "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};

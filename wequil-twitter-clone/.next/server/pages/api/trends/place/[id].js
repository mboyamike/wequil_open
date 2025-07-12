"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/trends/place/[id]";
exports.ids = ["pages/api/trends/place/[id]"];
exports.modules = {

/***/ "(api)/./src/lib/api/auth.ts":
/*!*****************************!*\
  !*** ./src/lib/api/auth.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AUTH\": () => (/* binding */ AUTH)\n/* harmony export */ });\nconst AUTH = {\n    headers: {\n        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL2FwaS9hdXRoLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTyxNQUFNQSxJQUFJLEdBQTBCO0lBQ3pDQyxPQUFPLEVBQUU7UUFDUEMsYUFBYSxFQUFFLENBQUMsT0FBTyxFQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0Msb0JBQW9CLENBQVcsQ0FBQztLQUN0RTtDQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZXF1aWwtdHdpdHRlci1jbG9uZS8uL3NyYy9saWIvYXBpL2F1dGgudHM/ODgzYyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgQVVUSDogUmVhZG9ubHk8UmVxdWVzdEluaXQ+ID0ge1xuICBoZWFkZXJzOiB7XG4gICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Byb2Nlc3MuZW52LlRXSVRURVJfQkVBUkVSX1RPS0VOIGFzIHN0cmluZ31gXG4gIH1cbn07XG4iXSwibmFtZXMiOlsiQVVUSCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwicHJvY2VzcyIsImVudiIsIlRXSVRURVJfQkVBUkVSX1RPS0VOIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/lib/api/auth.ts\n");

/***/ }),

/***/ "(api)/./src/pages/api/trends/place/[id].ts":
/*!********************************************!*\
  !*** ./src/pages/api/trends/place/[id].ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ placeIdEndpoint)\n/* harmony export */ });\n/* harmony import */ var _lib_api_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lib/api/auth */ \"(api)/./src/lib/api/auth.ts\");\n\nasync function placeIdEndpoint(req, res) {\n    const { id , limit  } = req.query;\n    const response = await fetch(`https://api.twitter.com/1.1/trends/place.json?id=${id}`, _lib_api_auth__WEBPACK_IMPORTED_MODULE_0__.AUTH);\n    const rawData = await response.json();\n    const data = \"errors\" in rawData ? rawData : {\n        trends: rawData[0].trends,\n        location: rawData[0].locations[0].name\n    };\n    const limitParam = limit ? parseInt(limit, 10) : null;\n    let formattedTrends = limitParam && !(\"errors\" in data) ? data.trends : null;\n    if (formattedTrends) {\n        const filteredTrends = formattedTrends.filter(({ tweet_volume  })=>tweet_volume);\n        formattedTrends = filteredTrends.map(({ url , ...rest })=>({\n                ...rest,\n                url: url.replace(/http.*.com/, \"\")\n            })).sort((a, b)=>b.tweet_volume - a.tweet_volume);\n        if (limitParam) formattedTrends = formattedTrends.slice(0, limitParam);\n    }\n    const formattedData = formattedTrends ? {\n        ...data,\n        trends: formattedTrends\n    } : null;\n    res.status(response.status).json(formattedData ?? data);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3RyZW5kcy9wbGFjZS9baWRdLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXFDO0FBY3RCLGVBQWVDLGVBQWUsQ0FDM0NDLEdBQW1CLEVBQ25CQyxHQUFvRCxFQUNyQztJQUNmLE1BQU0sRUFBRUMsRUFBRSxHQUFFQyxLQUFLLEdBQUUsR0FBR0gsR0FBRyxDQUFDSSxLQUFLO0lBRS9CLE1BQU1DLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQzFCLENBQUMsaURBQWlELEVBQUVKLEVBQUUsQ0FBQyxDQUFDLEVBQ3hESiwrQ0FBSSxDQUNMO0lBRUQsTUFBTVMsT0FBTyxHQUFJLE1BQU1GLFFBQVEsQ0FBQ0csSUFBSSxFQUFFO0lBRXRDLE1BQU1DLElBQUksR0FDUixRQUFRLElBQUlGLE9BQU8sR0FDZkEsT0FBTyxHQUNQO1FBQUVHLE1BQU0sRUFBRUgsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDRyxNQUFNO1FBQUVDLFFBQVEsRUFBRUosT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUNDLElBQUk7S0FBRTtJQUUzRSxNQUFNQyxVQUFVLEdBQUdYLEtBQUssR0FBR1ksUUFBUSxDQUFDWixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSTtJQUVyRCxJQUFJYSxlQUFlLEdBQUdGLFVBQVUsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJTCxJQUFJLENBQUMsR0FBR0EsSUFBSSxDQUFDQyxNQUFNLEdBQUcsSUFBSTtJQUU1RSxJQUFJTSxlQUFlLEVBQUU7UUFDbkIsTUFBTUMsY0FBYyxHQUFHRCxlQUFlLENBQUNFLE1BQU0sQ0FDM0MsQ0FBQyxFQUFFQyxZQUFZLEdBQUUsR0FBS0EsWUFBWSxDQUNuQztRQUVESCxlQUFlLEdBQUdDLGNBQWMsQ0FDN0JHLEdBQUcsQ0FBQyxDQUFDLEVBQUVDLEdBQUcsR0FBRSxHQUFHQyxJQUFJLEVBQUUsR0FBSyxDQUFDO2dCQUMxQixHQUFHQSxJQUFJO2dCQUNQRCxHQUFHLEVBQUVBLEdBQUcsQ0FBQ0UsT0FBTyxlQUFlLEVBQUUsQ0FBQzthQUNuQyxDQUFDLENBQUMsQ0FDRkMsSUFBSSxDQUFDLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxHQUFLQSxDQUFDLENBQUNQLFlBQVksR0FBR00sQ0FBQyxDQUFDTixZQUFZLENBQUMsQ0FBQztRQUVuRCxJQUFJTCxVQUFVLEVBQUVFLGVBQWUsR0FBR0EsZUFBZSxDQUFDVyxLQUFLLENBQUMsQ0FBQyxFQUFFYixVQUFVLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTWMsYUFBYSxHQUFHWixlQUFlLEdBQ2pDO1FBQUUsR0FBR1AsSUFBSTtRQUFFQyxNQUFNLEVBQUVNLGVBQWU7S0FBRSxHQUNwQyxJQUFJO0lBRVJmLEdBQUcsQ0FBQzRCLE1BQU0sQ0FBQ3hCLFFBQVEsQ0FBQ3dCLE1BQU0sQ0FBQyxDQUFDckIsSUFBSSxDQUFDb0IsYUFBYSxJQUFJbkIsSUFBSSxDQUFDLENBQUM7QUFDMUQsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlcXVpbC10d2l0dGVyLWNsb25lLy4vc3JjL3BhZ2VzL2FwaS90cmVuZHMvcGxhY2UvW2lkXS50cz8wOTQxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFVVEggfSBmcm9tICdAbGliL2FwaS9hdXRoJztcbmltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IHR5cGUge1xuICBUcmVuZHNEYXRhLFxuICBFcnJvclJlc3BvbnNlLFxuICBUcmVuZHNSZXNwb25zZSxcbiAgRmlsdGVyZWRUcmVuZHNcbn0gZnJvbSAnQGxpYi90eXBlcy9wbGFjZSc7XG5cbnR5cGUgUGxhY2VJZEVuZHBvaW50UXVlcnkgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxpbWl0Pzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcGxhY2VJZEVuZHBvaW50KFxuICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICByZXM6IE5leHRBcGlSZXNwb25zZTxUcmVuZHNSZXNwb25zZSB8IEVycm9yUmVzcG9uc2U+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBpZCwgbGltaXQgfSA9IHJlcS5xdWVyeSBhcyBQbGFjZUlkRW5kcG9pbnRRdWVyeTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgIGBodHRwczovL2FwaS50d2l0dGVyLmNvbS8xLjEvdHJlbmRzL3BsYWNlLmpzb24/aWQ9JHtpZH1gLFxuICAgIEFVVEhcbiAgKTtcblxuICBjb25zdCByYXdEYXRhID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKSkgYXMgVHJlbmRzRGF0YSB8IEVycm9yUmVzcG9uc2U7XG5cbiAgY29uc3QgZGF0YSA9XG4gICAgJ2Vycm9ycycgaW4gcmF3RGF0YVxuICAgICAgPyByYXdEYXRhXG4gICAgICA6IHsgdHJlbmRzOiByYXdEYXRhWzBdLnRyZW5kcywgbG9jYXRpb246IHJhd0RhdGFbMF0ubG9jYXRpb25zWzBdLm5hbWUgfTtcblxuICBjb25zdCBsaW1pdFBhcmFtID0gbGltaXQgPyBwYXJzZUludChsaW1pdCwgMTApIDogbnVsbDtcblxuICBsZXQgZm9ybWF0dGVkVHJlbmRzID0gbGltaXRQYXJhbSAmJiAhKCdlcnJvcnMnIGluIGRhdGEpID8gZGF0YS50cmVuZHMgOiBudWxsO1xuXG4gIGlmIChmb3JtYXR0ZWRUcmVuZHMpIHtcbiAgICBjb25zdCBmaWx0ZXJlZFRyZW5kcyA9IGZvcm1hdHRlZFRyZW5kcy5maWx0ZXIoXG4gICAgICAoeyB0d2VldF92b2x1bWUgfSkgPT4gdHdlZXRfdm9sdW1lXG4gICAgKSBhcyBGaWx0ZXJlZFRyZW5kcztcblxuICAgIGZvcm1hdHRlZFRyZW5kcyA9IGZpbHRlcmVkVHJlbmRzXG4gICAgICAubWFwKCh7IHVybCwgLi4ucmVzdCB9KSA9PiAoe1xuICAgICAgICAuLi5yZXN0LFxuICAgICAgICB1cmw6IHVybC5yZXBsYWNlKC9odHRwLiouY29tLywgJycpXG4gICAgICB9KSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnR3ZWV0X3ZvbHVtZSAtIGEudHdlZXRfdm9sdW1lKTtcblxuICAgIGlmIChsaW1pdFBhcmFtKSBmb3JtYXR0ZWRUcmVuZHMgPSBmb3JtYXR0ZWRUcmVuZHMuc2xpY2UoMCwgbGltaXRQYXJhbSk7XG4gIH1cblxuICBjb25zdCBmb3JtYXR0ZWREYXRhID0gZm9ybWF0dGVkVHJlbmRzXG4gICAgPyB7IC4uLmRhdGEsIHRyZW5kczogZm9ybWF0dGVkVHJlbmRzIH1cbiAgICA6IG51bGw7XG5cbiAgcmVzLnN0YXR1cyhyZXNwb25zZS5zdGF0dXMpLmpzb24oZm9ybWF0dGVkRGF0YSA/PyBkYXRhKTtcbn1cbiJdLCJuYW1lcyI6WyJBVVRIIiwicGxhY2VJZEVuZHBvaW50IiwicmVxIiwicmVzIiwiaWQiLCJsaW1pdCIsInF1ZXJ5IiwicmVzcG9uc2UiLCJmZXRjaCIsInJhd0RhdGEiLCJqc29uIiwiZGF0YSIsInRyZW5kcyIsImxvY2F0aW9uIiwibG9jYXRpb25zIiwibmFtZSIsImxpbWl0UGFyYW0iLCJwYXJzZUludCIsImZvcm1hdHRlZFRyZW5kcyIsImZpbHRlcmVkVHJlbmRzIiwiZmlsdGVyIiwidHdlZXRfdm9sdW1lIiwibWFwIiwidXJsIiwicmVzdCIsInJlcGxhY2UiLCJzb3J0IiwiYSIsImIiLCJzbGljZSIsImZvcm1hdHRlZERhdGEiLCJzdGF0dXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/trends/place/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/trends/place/[id].ts"));
module.exports = __webpack_exports__;

})();
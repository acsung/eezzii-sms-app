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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/Layout.js":
/*!******************************!*\
  !*** ./components/Layout.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Layout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction Layout({ children }) {\n    const [menuOpen, setMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        style: {\n            fontFamily: 'sans-serif'\n        },\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: ()=>setMenuOpen(!menuOpen),\n                style: {\n                    position: 'fixed',\n                    top: 20,\n                    left: 20,\n                    zIndex: 10\n                },\n                children: \"\\uD83D\\uDCCB Menu\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this),\n            menuOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    position: 'fixed',\n                    top: 0,\n                    left: 0,\n                    width: 250,\n                    height: '100%',\n                    background: '#f4f4f4',\n                    padding: 20,\n                    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',\n                    zIndex: 9\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                        children: \"\\uD83D\\uDCC1 Navigation\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                        lineNumber: 30,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        style: {\n                            listStyle: 'none',\n                            padding: 0\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    onClick: ()=>router.push('/'),\n                                    style: {\n                                        background: 'none',\n                                        border: 'none',\n                                        padding: 10\n                                    },\n                                    children: \"\\uD83D\\uDCE4 SMS Blaster\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                    lineNumber: 33,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                lineNumber: 32,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    onClick: ()=>router.push('/inbox'),\n                                    style: {\n                                        background: 'none',\n                                        border: 'none',\n                                        padding: 10\n                                    },\n                                    children: \"\\uD83D\\uDCE8 Inbox\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                    lineNumber: 40,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                lineNumber: 39,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    onClick: ()=>router.push('/templates'),\n                                    style: {\n                                        background: 'none',\n                                        border: 'none',\n                                        padding: 10\n                                    },\n                                    children: \"\\uD83D\\uDCCB Templates\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                    lineNumber: 47,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                lineNumber: 46,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    onClick: ()=>router.push('/scheduled'),\n                                    style: {\n                                        background: 'none',\n                                        border: 'none',\n                                        padding: 10\n                                    },\n                                    children: \"\\uD83D\\uDD52 Scheduled\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                    lineNumber: 54,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                lineNumber: 53,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    onClick: ()=>router.push('/settings'),\n                                    style: {\n                                        background: 'none',\n                                        border: 'none',\n                                        padding: 10\n                                    },\n                                    children: \"⚙️ Settings\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                    lineNumber: 61,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                                lineNumber: 60,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                        lineNumber: 31,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                lineNumber: 19,\n                columnNumber: 9\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    marginLeft: menuOpen ? 270 : 20,\n                    padding: 20\n                },\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n                lineNumber: 72,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\components\\\\Layout.js\",\n        lineNumber: 9,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvTGF5b3V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWdDO0FBQ087QUFFeEIsU0FBU0UsT0FBTyxFQUFFQyxRQUFRLEVBQUU7SUFDekMsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdMLCtDQUFRQSxDQUFDO0lBQ3pDLE1BQU1NLFNBQVNMLHNEQUFTQTtJQUV4QixxQkFDRSw4REFBQ007UUFBSUMsT0FBTztZQUFFQyxZQUFZO1FBQWE7OzBCQUVyQyw4REFBQ0M7Z0JBQ0NDLFNBQVMsSUFBTU4sWUFBWSxDQUFDRDtnQkFDNUJJLE9BQU87b0JBQUVJLFVBQVU7b0JBQVNDLEtBQUs7b0JBQUlDLE1BQU07b0JBQUlDLFFBQVE7Z0JBQUc7MEJBQUc7Ozs7OztZQUs5RFgsMEJBQ0MsOERBQUNHO2dCQUFJQyxPQUFPO29CQUNWSSxVQUFVO29CQUNWQyxLQUFLO29CQUNMQyxNQUFNO29CQUNORSxPQUFPO29CQUNQQyxRQUFRO29CQUNSQyxZQUFZO29CQUNaQyxTQUFTO29CQUNUQyxXQUFXO29CQUNYTCxRQUFRO2dCQUNWOztrQ0FDRSw4REFBQ007a0NBQUc7Ozs7OztrQ0FDSiw4REFBQ0M7d0JBQUdkLE9BQU87NEJBQUVlLFdBQVc7NEJBQVFKLFNBQVM7d0JBQUU7OzBDQUN6Qyw4REFBQ0s7MENBQ0MsNEVBQUNkO29DQUNDQyxTQUFTLElBQU1MLE9BQU9tQixJQUFJLENBQUM7b0NBQzNCakIsT0FBTzt3Q0FBRVUsWUFBWTt3Q0FBUVEsUUFBUTt3Q0FBUVAsU0FBUztvQ0FBRzs4Q0FBRzs7Ozs7Ozs7Ozs7MENBSWhFLDhEQUFDSzswQ0FDQyw0RUFBQ2Q7b0NBQ0NDLFNBQVMsSUFBTUwsT0FBT21CLElBQUksQ0FBQztvQ0FDM0JqQixPQUFPO3dDQUFFVSxZQUFZO3dDQUFRUSxRQUFRO3dDQUFRUCxTQUFTO29DQUFHOzhDQUFHOzs7Ozs7Ozs7OzswQ0FJaEUsOERBQUNLOzBDQUNDLDRFQUFDZDtvQ0FDQ0MsU0FBUyxJQUFNTCxPQUFPbUIsSUFBSSxDQUFDO29DQUMzQmpCLE9BQU87d0NBQUVVLFlBQVk7d0NBQVFRLFFBQVE7d0NBQVFQLFNBQVM7b0NBQUc7OENBQUc7Ozs7Ozs7Ozs7OzBDQUloRSw4REFBQ0s7MENBQ0MsNEVBQUNkO29DQUNDQyxTQUFTLElBQU1MLE9BQU9tQixJQUFJLENBQUM7b0NBQzNCakIsT0FBTzt3Q0FBRVUsWUFBWTt3Q0FBUVEsUUFBUTt3Q0FBUVAsU0FBUztvQ0FBRzs4Q0FBRzs7Ozs7Ozs7Ozs7MENBSWhFLDhEQUFDSzswQ0FDQyw0RUFBQ2Q7b0NBQ0NDLFNBQVMsSUFBTUwsT0FBT21CLElBQUksQ0FBQztvQ0FDM0JqQixPQUFPO3dDQUFFVSxZQUFZO3dDQUFRUSxRQUFRO3dDQUFRUCxTQUFTO29DQUFHOzhDQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFTdEUsOERBQUNaO2dCQUFJQyxPQUFPO29CQUFFbUIsWUFBWXZCLFdBQVcsTUFBTTtvQkFBSWUsU0FBUztnQkFBRzswQkFDeERoQjs7Ozs7Ozs7Ozs7O0FBSVQiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYWNzdW5cXERvY3VtZW50c1xcZWV6emlpLXNtcy1hcHBcXGNvbXBvbmVudHNcXExheW91dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCBbbWVudU9wZW4sIHNldE1lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyB9fT5cclxuICAgICAgey8qIFRvZ2dsZSBCdXR0b24gKi99XHJcbiAgICAgIDxidXR0b24gXHJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TWVudU9wZW4oIW1lbnVPcGVuKX1cclxuICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogJ2ZpeGVkJywgdG9wOiAyMCwgbGVmdDogMjAsIHpJbmRleDogMTAgfX0+XHJcbiAgICAgICAg8J+TiyBNZW51XHJcbiAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgey8qIFNpZGViYXIgTWVudSAqL31cclxuICAgICAge21lbnVPcGVuICYmIChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICB3aWR0aDogMjUwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2Y0ZjRmNCcsXHJcbiAgICAgICAgICBwYWRkaW5nOiAyMCxcclxuICAgICAgICAgIGJveFNoYWRvdzogJzJweCAwIDVweCByZ2JhKDAsMCwwLDAuMiknLFxyXG4gICAgICAgICAgekluZGV4OiA5XHJcbiAgICAgICAgfX0+XHJcbiAgICAgICAgICA8aDM+8J+TgSBOYXZpZ2F0aW9uPC9oMz5cclxuICAgICAgICAgIDx1bCBzdHlsZT17eyBsaXN0U3R5bGU6ICdub25lJywgcGFkZGluZzogMCB9fT5cclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb3V0ZXIucHVzaCgnLycpfSBcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIHBhZGRpbmc6IDEwIH19PlxyXG4gICAgICAgICAgICAgICAg8J+TpCBTTVMgQmxhc3RlclxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJvdXRlci5wdXNoKCcvaW5ib3gnKX0gXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnbm9uZScsIGJvcmRlcjogJ25vbmUnLCBwYWRkaW5nOiAxMCB9fT5cclxuICAgICAgICAgICAgICAgIPCfk6ggSW5ib3hcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb3V0ZXIucHVzaCgnL3RlbXBsYXRlcycpfSBcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIHBhZGRpbmc6IDEwIH19PlxyXG4gICAgICAgICAgICAgICAg8J+TiyBUZW1wbGF0ZXNcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb3V0ZXIucHVzaCgnL3NjaGVkdWxlZCcpfSBcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIHBhZGRpbmc6IDEwIH19PlxyXG4gICAgICAgICAgICAgICAg8J+VkiBTY2hlZHVsZWRcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb3V0ZXIucHVzaCgnL3NldHRpbmdzJyl9IFxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgcGFkZGluZzogMTAgfX0+XHJcbiAgICAgICAgICAgICAgICDimpnvuI8gU2V0dGluZ3NcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7LyogUGFnZSBDb250ZW50ICovfVxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkxlZnQ6IG1lbnVPcGVuID8gMjcwIDogMjAsIHBhZGRpbmc6IDIwIH19PlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlUm91dGVyIiwiTGF5b3V0IiwiY2hpbGRyZW4iLCJtZW51T3BlbiIsInNldE1lbnVPcGVuIiwicm91dGVyIiwiZGl2Iiwic3R5bGUiLCJmb250RmFtaWx5IiwiYnV0dG9uIiwib25DbGljayIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsInpJbmRleCIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZCIsInBhZGRpbmciLCJib3hTaGFkb3ciLCJoMyIsInVsIiwibGlzdFN0eWxlIiwibGkiLCJwdXNoIiwiYm9yZGVyIiwibWFyZ2luTGVmdCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/Layout.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Layout */ \"(pages-dir-node)/./components/Layout.js\");\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Layout__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\pages\\\\_app.js\",\n            lineNumber: 6,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\acsun\\\\Documents\\\\eezzii-sms-app\\\\pages\\\\_app.js\",\n        lineNumber: 5,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBeUM7QUFFekMsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQyxxQkFDRSw4REFBQ0gsMERBQU1BO2tCQUNMLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUEiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYWNzdW5cXERvY3VtZW50c1xcZWV6emlpLXNtcy1hcHBcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9MYXlvdXQnXHJcblxyXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dD5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcFxyXG4iXSwibmFtZXMiOlsiTGF5b3V0IiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();
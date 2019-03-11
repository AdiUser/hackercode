/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
}

body {
    line-height: 1;
}

ol, ul {
    list-style: none;
}

blockquote, q {
    quotes: none;
}

blockquote:before, blockquote:after, q:before, q:after {
    content: '';
    content: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

body, html {
    font-family: 'Rubik', sans-serif;
}

#front {
    background-color: #ffffff;
}

#owl-graph {
    position: absolute;
    top: 4%;
    width: 30vw;
}

#bulb-front {
    position: absolute;
    height: 48%;
    bottom: -8%;
    right: 5%;
}

.head-area {
    position: absolute;
    float: left;
    left: 50%;
    //top: 20%;
    transform: translate(-50%, -50%);
}

.head-area h1 {
    font-size: 10vw;
    font-weight: bold;
    letter-spacing: 5px;
    display: inline-flex;
    flex-wrap: nowrap;
    text-shadow: #545353 2px 4px 3px ;
}

.head-area h4 {
    font-size: 2vw;
    font-weight: bold;
}

.head-area h3 {
    font-size: 1.5vw;
}

.choice-area {
    margin-top: 3%;
    font-size: 1.4vw;
}

#choice-qst {
    margin: 0 5px 0 0;
}

.choice-ans {
    font-size: 1.8vw;
    text-transform: capitalize;
    text-decoration: underline;
    color: #01b19b;
}

.choice-ans:hover {
    color: #c3d71f;
}

/*=========== MENU ==============*/
#menu-hack {
    z-index: 9999;
    position: absolute;
    display : inline-flex;
    flex-wrap: nowrap;
    right: 0;
    margin: 4% 10%;
}

#menu-hack li a {
    margin: 0 15px 0 0;
    background-color: #00b29a;
    color: #fff;
    padding: 10px 20px;
    box-shadow: #cac3c3 2px 2px 6px;
}

#menu-hack li a:hover {
    background-color: #e85e53;
    text-decoration: none;
    box-shadow: #dc3434 1px 1px 3px;
}

/*===============================*/
.right-slide-x {
    max-width: 50%;
    background-color: blue;
    border-radius: 20%
}

.right-slide-view {
    background-color: coral;
    height: 100px;
    text-align: center;
}

.slider-wrapper {
    padding: 2.5%;
    //height: 100%;
}

.slide-arrow {
    position: absolute;
    top: 35%;
    display: block;
    cursor: pointer;
    font-size: 3vw;
    z-index: 999;
}
.arrow-prev {
     left: -25px;
}
.arrow-next {
    right: -25px;;
}

/* the slides */
.right-slide-view {
    margin: 0 10px;
}

/* ---- reset ---- */

body {
  margin: 0;
  font: normal 75% Arial, Helvetica, sans-serif;
}

canvas {
  display: block;
  vertical-align: bottom;
}
/* ---- particles.js container ---- */

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #c3c3c3;
}

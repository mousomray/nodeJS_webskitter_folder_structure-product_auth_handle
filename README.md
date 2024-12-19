# How to setup webskitter file folder structure ? 
1) npm i route-label
2) npm i morgan
3) npm i body-parser

# Coding area 
1) Write important Application credential on .env file
2) Create a file index.js in your config folder and define apllication configaration
3) Create a module utils in helper folder and handle utils module
4) Create a folder module there will be all folders which will be our pages just like product,about, banner etc. 
5) In module nested folder just like product there will be three products controller, model and repository. 
6) Controller will be our admin controller , model will be our api model and in repository folder there will be keep our mongoDB code
7) Create a router folder in module there will be api, admin and auth router which will be defined in .env file
8) Create a webservice folder all api controller will be present there 
9) Handle this whole name routing system in app.js file code is already present 
10) All route will be operate through route lebel not direct route just like <%= generateUrl('product')%> product is my route name

# How to Apply CK editor?
1) Put ck editor js link in your common head.ejs file
2) Put ck edit code in your ejs with script tag 
3) Which field you want to keep under ckEditor that input should be textarea 
4) When you show textarea field when you show list of data for ejs you have to use<%- %> in the place of <%= %> and for react you have to use dangeraously set innerhtml



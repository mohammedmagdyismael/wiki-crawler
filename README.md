
# ready-express-app

<div style="display: inline-block !important;"><img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/mohammedmagdyismael/ready-express-app"></div>
<div style="display: inline-block;"><img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/mohammedmagdyismael/ready-express-app/Node.js CI/master"></div>

## Install & Run
```sh
git clone https://github.com/mohammedmagdyismael/sn_backend.git
cd sn_backend
npm i
npm start
```

## Swagger Doc

you can display swagger doc for your project at 
```
http://localhost:5000/api/docs/
```

to configure your API endpoint with swagger follow sample example in
```
/my-app/routes/api/sample_controller/get.js
```

## Project structure
```
my-app
├── README.md
├── server.js
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── routes
│   └── api
│       └── sample_controller
│           ├── get.js
│           ├── post.js
│           ├── put.js
│           └── delete.js
├── config
│   ├── bugsnag.js
│   ├── db.js
│   ├── default.json
│   ├── swagger.js
│   └── google-analytics.js
├── middleware
├── models
│   └── sample_model.js
└── .github
    └── workflows
        └── nodejs.yml [CI file]
```

## Database connections
### SQL

### NoSQL (support: mongodb)

you can use mongoose to connect to mongo Atlas as a cloud db or your local mongodb server.

For mongo Atlas:

go to ```sn_backend/config/default.json``` and set your connection string

```
 "mongoURI": "<your_connection_string>"
```


## Bugsnag [Bug tracker]
https://docs.bugsnag.com/platforms/javascript/express/

to integrate your bugsnag dashboard with the app, all you've to do is:
go to ```sn_backend/config/default.json``` and set your API key string

```
 "bugsnag_API_KEY":"<API_Key>"
```


* mongoose
* GoogleAnyltics


//pipeline

## Social
![GitHub followers](https://img.shields.io/github/followers/mohammedmagdyismael?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/mohammedmagdyismael/ready-express-app?style=social)

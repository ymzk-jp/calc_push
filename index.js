// ###### Sun Jul 29 15:11:51 JST 2018
'use strict';
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const fetch = require('isomorphic-fetch');
const PORT = process.env.PORT || 3000;
const debug = require('debug')('app:server');
const http = require('http');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

app.use('/', express.static(path.join(__dirname, 'views')));
// app.set('public', __dirname + '/public');
app.set('view engine', 'ejs');
const server = app.listen(PORT, function () {
    console.log('http://localhost:' + server.address().port);
    console.log('http://localhost:' + server.address().port + '/message');
    console.log('http://localhost:' + server.address().port + '/query?name=Kevin');
    console.log('http://localhost:' + server.address().port + '/fetch');
    console.log('http://localhost:' + server.address().port + '/select');
    console.log('http://localhost:' + server.address().port + '/select/1');
    console.log('http://localhost:' + server.address().port + '/select1/1');
    console.log('http://localhost:' + server.address().port + '/select/all');
    console.log('http://localhost:' + server.address().port + '/add/A');
});


connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});



app.get('/', (req, res, next) => {
    res.render('pages/user');
});

app.get('/message', (req, res, next) => {
    res.render('pages/message', {
        message: 'hello ejs'
    });
});

app.get('/query', (req, res, next) => {
    res.render('pages/query', {
        name: req.query.name
    });
});


app.get('/fetch', async (req, res) => {
    // ちゃんとやる場合はサニタイズしてから渡す
    const response = await fetch('https://euxn-lazy-api.herokuapp.com/')
    const json = await response.json()
    res.render('pages/fetch', {
        spentMs: json.spentMs
    })
})

app.get('/select', (req, res, next) => {
    res.send('select');
});

//http://localhost:3000/select/all
app.get('/select/:id', (req, res, next) => {
    const target = req.params.id
    if (target === "all") {
        let query = 'select * from item;'
        try {
            connection.query(query, (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.contentType('application/json');
                res.json(rows);
                console.log(rows);
            });
        } catch (err) {
            throw err;
        }
    } else {
        let query = 'select * from item where item = ?;'
        try {
            connection.query(query, [target], (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.contentType('application/json');
                res.json(rows);
                console.log(rows);
            });
        } catch (err) {
            throw err;
        }
    }
});


//http://localhost:3000/select1/1
app.get('/select:id/:dd', (req, res, next) => {
    let query = 'select * from item;'
    try {
        connection.query(query, (err, rows, fields) => {
            res.json(rows);
            console.log(req.params); //=>{ id: '1', dd: '1' }
        });
    } catch (err) {
        throw err;
    }
});




//http://localhost:3000/add/A
app.get('/add/:user', (req, res, next) => {
    let target = req.params.user;
    console.log(target);
    console.log("AAA");
    let query = 'update item set count = count+1 WHERE item = ?';
    try {
        connection.query(query, [target], (err, rows, fields) => {
            let query = 'select * from item where item = ?;';
            connection.query(query, [target], (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.contentType("application/json");
                res.json(rows);
                console.log(JSON.stringify(rows));
            });
        });
    } catch (err) {
        throw err;
    }
});





// レスポンスが返ってこなくなるのでコメントアウト。ただし、セッションが残ってしまうので将来的に対処する必要がある
// connection.end();
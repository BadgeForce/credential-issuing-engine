
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const REST_API = 'http://127.0.0.1:8008';
const IPFS_API = 'http://127.0.0.1:8080';
const request = require('request');

app.use(cors());
app.use(bodyParser.raw({type: 'application/octet-stream'}));

const PORT = 3010;

app.get('/state', (req, res) => {
        const uri = `${REST_API}${req.originalUrl}`;
        console.log("STATE QUERY: ", uri)
        request.get({
            url: uri, 
            headers: {'Content-Type': 'application/json'}
        }, (err, response) => {
            if(err) {
                console.log(err)
                res.status(500).json(err);
            } 
            res.status(response.statusCode).json(response.body)
        })
})

app.get('/ipfs/:hash', (req, res) => {
    const uri = `${IPFS_API}${req.originalUrl}`;
    console.log("IPFS QUERY: ", uri)
    request.get({
        url: uri, 
        headers: {'Content-Type': 'application/json'}
    }, (err, response) => {
        if(err) {
            console.log(err)
            res.status(500).json(err);
        } 
        res.status(response.statusCode).json(response.body)
    })
})

app.get('/batch_statuses', (req, res) => {
    const uri = `${REST_API}${req.originalUrl}`;
    console.log(uri)
    request.get({
        url: uri, 
        headers: {'Content-Type': 'application/json'}
    }, (err, response) => {
        if(err) {
            console.log(err)
            res.status(500).json(err);
        } 
        res.status(response.statusCode).json(response.body)
    })
})

app.post('/batches', (req, res) => {
    request.post({
        url: `${REST_API}${req.originalUrl}`,
        body: req.body,
        headers: {'Content-Type': 'application/octet-stream'}
    }, (err, response) => {
        if(err) res.status(500).json(err);
        res.status(200).json({link: JSON.parse(response.body).link.replace('127.0.0.1:8008', `127.0.0.1:${PORT}`)});
    })
})

app.listen(PORT, () => console.log('Proxy Server Listening on Port 3010'));

// 02a82eac0120f1111ca7998bc2689e248be449d6c00cc408b55065268274dd164f
const http= require('http');
const fs = require('fs');
const path = require('path');
const url = require("url");
const port = 3000;
const {agregarUsuario, tablaUsuarios, editar, eliminar, realizarTransferencia, tablaTransferencias} = require('./query');
const { stringify } = require('querystring');

http.createServer(async (req,res)=>{

    if(req.url == "/" && req.method == "GET"){
        
        fs.readFile(path.join(__dirname,"..", "index.html"), (error, html)=>{
            if(error){
                console.log(error);
                res.statusCode = 500;
                res.end(error)
            }else{
                res.setHeader("Content-Type", "text/html");
                res.statusCode = 201;
                res.end(html);
            }
        });
    }

    if(req.url == "/style"){
        fs.readFile(path.join(__dirname,"..", "/assets/css/style.css"),(error, style)=>{
        if(error){
            console.log(error);
            res.statusCode = 500;
            res.end(error);
        }
        else{
            res.setHeader("Content-Type", "text/css");
            res.end(style);
        }
        });
        
    }

    if (req.url == "/script") {
        fs.readFile(path.join(__dirname, "..", "/assets/js/script.js"), (error, script) => {
            if (error) {
                console.log(error);
                res.statusCode = 500;
                res.end(error);
            }
            else {
                res.setHeader("Content-Type", "text/javascript");
                res.end(script);
            }
        });

    }

    if(req.url == "/logotipo"){
        fs.readFile(path.join(__dirname,"..", "/assets/img/solar-logo2.png"), (error, logotipo)=>{
        if (error) {
            console.log(error);
            res.statusCode = 500;
            res.end(error);
        }
        else {
            res.setHeader("Content-Type", "image/jpeg");
            res.end(logotipo);
        }
    });

}
    if(req.url == "/favicon"){
        fs.readFile(path.join(__dirname,"..", "/assets/img/favicon.svg"),(error, favicon)=>{
            if (error) {
                console.log(error);
                res.statusCode = 500;
                res.end(error);
            }
            else {
                res.setHeader("Content-Type", "image/svg+xml");
                res.end(favicon);
            } 
        });
    }

    if(req.url == "/usuario" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk) =>{
            body += chunk;
        });

        req.on("end", async()=>{
            try{
            const datos = Object.values(JSON.parse(body));
            const respuesta = await agregarUsuario(datos);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));
            }catch(error){
                res.statusCode = 500;
                res.end("Error en server ", error);
            }
        });
    };

    if(req.url == "/usuarios" && req.method == "GET"){
        try{
        const registros = await tablaUsuarios();
        //console.log(registros.rows);
        res.statusCode = 201;
        res.end(JSON.stringify(registros.rows));
        }catch(error){
            res.statusCode = 500;
            res.end("Error en server ", error);
        }
    };

    if (req.url.startsWith("/usuario") && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
        body += chunk;
        });
        req.on("end", async () => {
            try{
        const datos = Object.values(JSON.parse(body));
        const respuesta = await editar(datos);
        res.statusCode = 201;
        res.end(JSON.stringify(respuesta));
            }catch(error){
                res.statusCode = 500;
                res.end("Error en server ", error);
            }
        });
    }

    if (req.url.startsWith("/usuario") && req.method == "DELETE") {
        try{
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);
        res.statusCode = 201;
        res.end(JSON.stringify(respuesta));
        }catch(error){
            res.statusCode = 500;
            res.end("Error en server ", error);
        }
    }

    if(req.url == "/transferencia" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk; 
        });

        req.on("end", async () =>{
            try{
            const datos = Object.values(JSON.parse(body));
            const respuesta = await realizarTransferencia(datos);
            if(typeof respuesta == "string"){
                const objError = {
                    error: respuesta,
                }
                res.end(JSON.stringify(objError));
            }else{
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            }
            }catch(error){
                res.statusCode = 500;
                res.end("Error en server ", error);
            }
        });
    }
    
    if(req.url == "/transferencias" && req.method == "GET"){
        try{
            const registros = await tablaTransferencias();
            //console.log(registros);
            res.end(JSON.stringify(registros));
        }catch(error){
            res.statusCode = 500;
            res.end("Error en server ", error);
        }      
    };

}).listen(port, ()=> console.log(`SERVER ON, PUERTO: ${port}`));
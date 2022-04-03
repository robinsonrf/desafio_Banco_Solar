const http= require('http');
const fs = require('fs');
const path = require('path');
const url = require("url");
const port = 3000;
const {agregarUsuario, tablaUsuarios, editar, eliminar, realizarTransferencia, tablaTransferencias} = require('./query');

http.createServer(async (req,res)=>{

    if(req.url == "/" && req.method == "GET"){
        
        fs.readFile(path.join(__dirname,"..", "index.html"), (error, html)=>{
            if(error){
                console.log(error);
                res.estatusCode = 500;
                res.end(error)
            }else{
                res.setHeader("Content-Type", "text/html");
                res.estatusCode = 201;
                res.end(html);
            }
        });
    }

    if(req.url == "/style"){
        res.setHeader("Content-Type", "text/css");
        const css = fs.readFileSync(path.join(__dirname,"..", "/assets/css/style.css"));
        res.end(css);
    }

    if(req.url == "/script"){
        res.setHeader("Content-Type", "text/javascript");
        const script = fs.readFileSync(path.join(__dirname,"..", "/assets/js/script.js"));
        res.end(script);
    }

    if(req.url == "/logotipo"){
        res.setHeader("Content-Type", "image/jpeg");
        const logo = fs.readFileSync(path.join(__dirname,"..", "/assets/img/solar-logo2.png"));
        res.end(logo);
    }
    if(req.url == "/favicon"){
        res.setHeader("Content-Type", "image/svg+xml");
        const favicon = fs.readFileSync(path.join(__dirname,"..", "/assets/img/favicon.svg"));
        res.end(favicon);
    }

    if(req.url == "/usuario" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk) =>{
            body += chunk;
        });

        req.on("end", async()=>{
            const datos = Object.values(JSON.parse(body));
            const respuesta = await agregarUsuario(datos);
            res.end(JSON.stringify(respuesta));
        });
    };

    if(req.url == "/usuarios" && req.method == "GET"){
        const registros = await tablaUsuarios();
        //console.log(registros.rows);
        res.end(JSON.stringify(registros.rows));
    }

    if (req.url.startsWith("/usuario") && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
        body += chunk;
        });
        req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await editar(datos);
        res.end(JSON.stringify(respuesta));
        });
    }

    if (req.url.startsWith("/usuario") && req.method == "DELETE") {
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);
        res.end(JSON.stringify(respuesta));
    }



    if(req.url == "/transferencia" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk; 
        });

        req.on("end", async () =>{
            const datos = Object.values(JSON.parse(body));
            const respuesta = await realizarTransferencia(datos);
            res.end(JSON.stringify(respuesta))
        });
    }

    
    
    
    
    if(req.url == "/transferencias" && req.method == "GET"){
        const registros = await tablaTransferencias();
        //console.log(registros);
        res.end(JSON.stringify(registros));
    }

}).listen(port, ()=> console.log(`SERVER ON, PUERTO: ${port}`));
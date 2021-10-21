import express from "express";
import path from "path";
// const  { allGame,addGame,oneGame,updateGame,removeGame, allGameEventLog, oneGameEventLog, addGameEventLog} = require("../db/queries/game");
// const  { allProduct,addProduct,oneProduct,updateProduct,removeProduct} = require("../db/queries/class");
// const  { allProduct,addProduct,oneProduct,updateProduct,removeProduct} = require("../db/queries/admin");


const router = express.Router();


router.get('/', (req,res)=>{
    // console.log("HECK YEAH WE HERE")
    res.send('server is up and running=====by--YA BOI')
})


router.get("*", async (req,res,next)=>{
    let location=process.env.PWD;
    // console.log(location)
    try{
        // await LogEvent(req);
        res.status(404).sendFile(path.join(location,"/public/404page.html"));
    } catch (error) {
        next(error);
    }
});

export default router;



/* 

    async function LogEvent(req){
        // console.log("loging event")
        let log={
            Method: req.method,
            Url: req.url,
            body: JSON.stringify(req.body),
            morganRes: null,
            TimeStamp: new Date()
        }
        // console.log("Sending Querry")
        let other = await  addGameEventLog(log);
    }


    router.get("/api/games", async (req,res,next)=>{
        try{
            // console.log("======the request1",req.method)
            // console.log("======the request2",req.url)
            // console.log("======the request3",req.body)
            // console.log("======the request4","no morgan")
            // let test = new Date()
            // console.log("======the request5",test)
            await LogEvent(req);
            let data = await allGame();
            res.json(data);
        } catch (error){
            next(error);
        }
    });

    router.get("/api/games/:id", async (req,res,next)=>{
        let {id}=req.params;
        try{
            await LogEvent(req);
            let [data] = await oneGame(id);
            res.json(data);
        } catch (error) {
            next(error);
        }
    })

    router.post("/api/games", async (req,res,next)=>{
        try{
            
            let newdata = req.body;
            let data = await allGame();

            newdata.GameID=data[0].GameID+1;

            // console.log(data[0].GameID);
            // console.log(newdata);
            await LogEvent(req);
            let other = await addGame(newdata);
            // console.log("other",other)
            res.json(newdata);
        } catch (error) {
            next(error);
        }
    })

    router.put("/api/games/:id", async (req,res,next)=>{
        let {id}=req.params;
        let newdata = req.body;
        try{
            await LogEvent(req);
            let other = await updateGame(newdata,id);
            res.json("Content updated at id:"+id);
        } catch (error) {
            next(error);
        }
    })

    router.delete("/api/games/:id", async (req,res,next)=>{
        let {id}=req.params;
        try{
            await LogEvent(req);
            let other = await removeGame(id);
            res.json("Content removed at id:"+id);
        } catch (error) {
            next(error);
        }
    })

    //  log routes
    router.get("/api/games/admin/eventlogs", async (req,res,next)=>{
        try{
            let data = await allGameEventLog();
            res.json(data);
        } catch (error){
            next(error);
        }
    });

    router.get("/api/games/admin/eventlogs/:id", async (req,res,next)=>{
        let {id}=req.params;
        try{
            let [data] = await oneGameEventLog(id);
            res.json(data);
        } catch (error) {
            next(error);
        }
    });

*/
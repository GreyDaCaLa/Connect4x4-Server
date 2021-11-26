






export const checkWinner=(gb)=>{
    let resH=null;
    let resV=null;
    let resDU=null;
    let resDD=null;
    //check vertical wins
    resV=checkVertWin(gb);

    //check horizontal wins
    resH=checkHorzWin(gb);

    //check diagnol wins
    resDU=checkDiagLRUWin(gb);
    resDD=checkDiagLRDWin(gb);

    console.log("is there a winer???")
    if(resV){
        console.log("YES Its:",resV )
        // setWinner(resV);
        return(resV)

    }else if(resH){
        console.log("YES Its:",resH )
        // setWinner(resH);
        return(resH)

    }else if(resDU){
        console.log("YES Its:",resDU)
        // setWinner(resDU);
        return(resDU)

    }
    else if(resDD){
        console.log("YES Its:",resDD)
        // setWinner(resDD);
        return(resDD)

    }
    else{
        console.log("No Winner Yet")
        return 0
    }

    //return what?


}

const plrInSlot=(plyr,slot)=>{
    return (plyr===slot[0]||plyr==slot[1]);
}

const checkVertWin=(gb)=>{
    console.log("====checkVertWin")
    // let winner = null;
    const players = ['1','2','3','4'];

    for(let plyr of players){
        for(let ri=5;ri>2;ri--){
            for(let ci=0;ci<gb.length;ci++){
                // console.log("")
                // console.log(`plyr:${plyr} | ci:${ci} | ri:${ri}`)
                if(plrInSlot(plyr,gb[ci][ri]) &&
                plrInSlot(plyr,gb[ci][ri-1]) && 
                plrInSlot(plyr,gb[ci][ri-2]) && 
                plrInSlot(plyr,gb[ci][ri-3]) ){
                    return plyr

                }



            }
        }
    }

    return null
}

const checkHorzWin=(gb)=>{
    console.log("====checkHorzDWin")
    // let winner = null;
    const players = ['1','2','3','4'];

    // let boardslots=[
    //   [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    //   [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
    //   [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
    //   [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
    //   [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
    //   [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]
    // ]

    for(let plyr of players){
        for(let ri=5;ri>-1;ri--){
            for(let ci=0;ci<4;ci++){
                // console.log("")
                // console.log(`plyr:${plyr} | ci:${ci} | ri:${ri}`)
                if(plrInSlot(plyr,gb[ci][ri]) &&
                plrInSlot(plyr,gb[ci+1][ri]) && 
                plrInSlot(plyr,gb[ci+2][ri]) && 
                plrInSlot(plyr,gb[ci+3][ri]) ){
                    return plyr;

                }



            }
        }
    }

    return null
}

const checkDiagLRUWin=(gb)=>{
    console.log("====checkDiagLRUWin")
    const players = ['1','2','3','4'];

    // let boardslots=[
    //   [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    //   [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
    //   [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
    //   [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
    //   [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
    //   [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]
    // ]

    for(let plyr of players){
        for(let ri=5;ri>2;ri--){
            for(let ci=0;ci<4;ci++){
                // console.log("")
                // console.log(`plyr:${plyr} | ci:${ci} | ri:${ri}`)
                if(plrInSlot(plyr,gb[ci][ri]) &&
                plrInSlot(plyr,gb[ci+1][ri-1]) && 
                plrInSlot(plyr,gb[ci+2][ri-2]) && 
                plrInSlot(plyr,gb[ci+3][ri-3]) ){
                    return plyr;

                }



            }
        }
    }

    return null
}

const checkDiagLRDWin=(gb)=>{
    console.log("====checkDiagLRDWin")
    // let winner = null;
    const players = ['1','2','3','4'];

    // let boardslots=[
    //   [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    //   [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
    //   [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
    //   [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
    //   [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
    //   [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]
    // ]

    for(let plyr of players){
        for(let ri=5;ri>2;ri--){
            for(let ci=6;ci>2;ci--){
                // console.log("")
                // console.log(`plyr:${plyr} | ci:${ci} | ri:${ri}`)
                if(plrInSlot(plyr,gb[ci][ri]) &&
                plrInSlot(plyr,gb[ci-1][ri-1]) && 
                plrInSlot(plyr,gb[ci-2][ri-2]) && 
                plrInSlot(plyr,gb[ci-3][ri-3]) ){
                    return plyr;
                }

            }
        }
    }

    return null
}
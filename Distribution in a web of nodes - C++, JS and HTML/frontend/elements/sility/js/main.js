var csvStringState;
async function readTextFile()
{
    await fetch('http://34.69.40.232:5000/prueba2.txt', {mode: 'no-cors'})
    //35.188.134.148
    .then(response => response.text())
    .then(data=> {
        var someText = data.replace(/(\r\n|\n|\r)/gm, "\n" );
        csvStringState = someText.split("`");
        console.log(typeof (csvStringState));
        console.log(csvStringState);
    })
    .catch(error => console.error(error));
}


// var csvStringState = readTextFile();
var objeto = {};
var csvConfig = {
    noheader:false,
    trim:true}

    function createPro(nProces)
    {
        for (let index = 0; index < nProces; index++) 
        {
            $(".bolas").append("<div id = 'procesador' class = 'bola_p1'></div>");
        }
    }

    function createMat(n)
    {
        for (let index = 0; index < n; index++) {
            $(".matrices").append("<span class='dot'></span>");
            
        }
    }

    function writeNum(clase,n, tag1, tag2)
    {
        $( clase ).replaceWith( tag1+ n + tag2 );
    }

    function resolveAfter1Seconds() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('resolved');
          }, 1000);
        });
      }

async function Simulation() {
    await readTextFile();
    console.log(csvStringState[0])
    const stateArrayInit=await csv(csvConfig).fromString(csvStringState[0]);
    console.log("stateArrayInit " + stateArrayInit[0].procesT);
    var nProces = stateArrayInit[0].procesT;
    console.log("nProces " + nProces);
    createPro(nProces);
    createMat(100);
    for (let index = 0; index < csvStringState.length; index++) {
        
            console.log("State it: " + index);
            const stateArray=await csv(csvConfig).fromString(csvStringState[index]);
            //console.log(stateArray);

            if(stateArray.length != 0 )
            {
                console.log(stateArray);
                nodeList = document.querySelectorAll("div.bola_p1");
                nodeListM = document.querySelectorAll(".dot");
                for (let k = 0; k < stateArrayInit.length; k++) {
                    await resolveAfter1Seconds();
                    if(stateArray[k].matrizCreada == "0" || stateArray[k].matrizCreada == "1")
                    {
                        if (stateArray[k].hold == "1") {
                            var id = stateArray[k].idMatriz;
                            console.log("Hold:" + stateArray[k].idMatriz);
                            nodeListM[id].style.backgroundColor = "purple";
                            countH++;
                            hold = true;
                            writeNum(".numT",countH,"<h4 class=numT>","</h4>" );
                        }else if (stateArray[k].mult == "1") {
                            var id = stateArray[k].idMatriz;
                            nodeListM[id].style.backgroundColor = "blue";
                            await resolveAfter1Seconds() - .5;
                            nodeListM[id].style.backgroundColor = "black";
                            if(hold == true)
                            {
                                countH-=1;
                                hold = false
                                writeNum(".numT",countH,"<h4 class=numT>","</h4>" );
                            }
                            console.log("Mult:" + stateArray[k].idMatriz);
                            console.log("borrar " + stateArray[k].idMatriz);
        
                        }else{ 
                        }
                    }
                    await resolveAfter1Seconds();
                    if (fail == true) {
                    var num = countF;
                    writeNum(".numF",num,"<h4 class=numF>","</h4>");
                    fail = false;
                    }
                    var status = stateArray[k].working;
                    console.log("STATUS: " + status);
                    if (status == 0) {
                        var id = stateArray[k].nProces;
                        console.log("Este es el id:" + id);
                        console.log("Estoy en NO TRABAJO:");
                        // let idx = stateArray.findIndex(i => i.nProces === id);
                        // console.log("Este es su indice de id " + idx);
                        nodeList[id].style.backgroundColor = "red";

                    }else if(status == 1){

                        var id = stateArray[k].nProces;
                        console.log("Estoy en TRABAJANDO:");
                        nodeList[id].style.backgroundColor = "green";

                    }else if(status == 3){
                        var id = stateArray[k].nProces;
                        console.log("Estoy en RC:");
                        nodeList[id].style.backgroundColor = "yellow";
                        writeNum(".sign","RC","<div class = sign>","</div>");
                        await resolveAfter1Seconds();
                        writeNum(".sign","","<div class = sign>","</div>");
                        //nodeList[id].style.backgroundColor = "red";
                        fail = true;
                        ++countF; 
                    }else if(status == 2){
                        var id = stateArray[k].nProces;
                        console.log("Estoy en RB:");
                        nodeList[id].style.backgroundColor = "yellow";
                        writeNum(".sign","RB","<div class = sign>","</div>");
                        await resolveAfter1Seconds();
                        writeNum(".sign","","<div class = sign>","</div>");
                        //nodeList[id].style.backgroundColor = "red";
                        fail = true;
                        ++countF; 
                    }else{}
                        var num = stateArray[k].nFinish;
                        writeNum(".numC",num,"<h4 class=numC>","</h4>");                     

                    
                }
        }else{
            console.log("nada");
        }
        

    }
        
  }
  
Simulation();

var n = 6;
var holdList;
var nodeList;
var nodeListM;
var fail = false;
var hold = false;
var temp = 0;
var countH = 0;
var countF = 0;
var countC = 0;
var arr = new Array();



   

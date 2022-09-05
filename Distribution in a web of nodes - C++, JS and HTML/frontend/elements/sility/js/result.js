var csvStringState;
async function readTextFile()
{
    await fetch('http://34.69.40.232:5000/resultados.txt', {mode: 'no-cors'})
    //35.188.134.148
    .then(response => response.text())
    .then(data=> {
        var someText = data.replace(/(\r\n|\n|\r)/gm, "\n" );
        csvStringState = someText.split(",");
        console.log(typeof (csvStringState));
        console.log(csvStringState);
    })
    .catch(error => console.error(error));
}


function writeNum(clase,n, tag1, tag2)
  {
    $( clase ).replaceWith( tag1+ n + tag2 );
  }

async function putResults() 
{
  await readTextFile();

  const result = csvStringState[0];
  writeNum(".terminados",result,"<p>","</p>")

  const result2 = csvStringState[1];
  writeNum(".reciclados",result2,"<p>","</p>")

}

putResults();
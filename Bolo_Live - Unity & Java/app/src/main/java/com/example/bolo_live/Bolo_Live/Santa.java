package com.example.bolo_live.Bolo_Live;

public class Santa //Atributos genericos
{
    protected static Santa instance =  null;
    protected Tuple[] santaList;
    protected Tuple c;
    public Santa(){
        

        santaList = new Tuple[5];

        santaList[0] = new Tuple<String, String>("2111","Santa");
        santaList[1] = new Tuple<String, String> ("2112","Santa");
        santaList[2] = new Tuple<String, String>("2113","Santa");
        santaList[3] = new Tuple<String, String>("2114","Santa");
        santaList[4] = new Tuple<String, String>("2115","Santa");
    }

    

    public static Santa getInstance()
    {
        if(instance == null)
        {
            instance = new Santa();

        }
        return instance;

    }
    public Tuple search(String numSerie) throws ModelNotFoundException
    {

            for (int i = 0; i < 5; i++) 
            {
                c = null;
                if( santaList[i].getNumSerie().equals(numSerie))
                {
                    c = santaList[i];
                    return c;
                }
                    
            }
            if(c == null)
                throw new ModelNotFoundException(numSerie);
            
        return c;
    }
    
}
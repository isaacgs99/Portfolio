package com.example.bolo_live.Bolo_Live;

public class Normal //Atributos genericos
{
    protected static Normal instance =  null;
    protected Tuple[] normalList;
    protected Tuple c;
    public Normal(){
        

        normalList = new Tuple[5];

        normalList[0] = new Tuple<String, String>("3111","Normal");
        normalList[1] = new Tuple<String, String> ("3112","Normal");
        normalList[2] = new Tuple<String, String>("3113","Normal");
        normalList[3] = new Tuple<String, String>("3114","Normal");
        normalList[4] = new Tuple<String, String>("3115","Normal");
    }

    

    public static Normal getInstance()
    {
        if(instance == null)
        {
            instance = new Normal();

        }
        return instance;

    }
    public Tuple search(String numSerie) throws ModelNotFoundException
    {

            for (int i = 0; i < 5; i++) 
            {
                c = null;
                if( normalList[i].getNumSerie().equals(numSerie))
                {
                    c = normalList[i];
                    return c;
                }
                    
            }
            if(c == null)
                throw new ModelNotFoundException(numSerie);
            
        return c;
    }
    
}
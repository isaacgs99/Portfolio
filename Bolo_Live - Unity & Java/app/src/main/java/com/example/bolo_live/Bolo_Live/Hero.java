package com.example.bolo_live.Bolo_Live;

public class Hero //Atributos genericos
{
    protected static Hero instance =  null;
    protected Tuple[] heroList;
    protected Tuple c;
    public Hero(){
        

        heroList = new Tuple[5];

        heroList[0] = new Tuple<String, String>("1111","Hero");
        heroList[1] = new Tuple<String, String>("1112","Hero");
        heroList[2] = new Tuple<String, String>("1113","Hero");
        heroList[3] = new Tuple<String, String>("1114","Hero");
        heroList[4] = new Tuple<String, String>("1115","Hero");
    }

    

    public static Hero getInstance()
    {
        if(instance == null)
        {
            instance = new Hero();

        }
        return instance;

    }
    public Tuple search(String numSerie) throws ModelNotFoundException
    {

            for (int i = 0; i < 5; i++) 
            {
                c = null;
                if( heroList[i].getNumSerie().equals(numSerie))
                {
                    c = heroList[i];
                    return c;
                }
                    
            }
            if(c == null)
                throw new ModelNotFoundException(numSerie);
            
        return c;
    }
    
}
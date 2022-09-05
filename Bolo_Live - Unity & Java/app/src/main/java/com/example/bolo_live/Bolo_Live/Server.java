package com.example.bolo_live.Bolo_Live;

public class Server //Base de datos de cada modelo
{
    Hero h; //Modelos de heroes
    Santa s; //Modelos de Santa
    Normal n; //Modelos normales
    
   protected String numSerie; 

   public Server()
   {
    h = Hero.getInstance();
    s = Santa.getInstance();
    n = Normal.getInstance();

   }
   
   /**
    * @return the model
    */
   public String getNumSerie() 
   {
       return numSerie;
   }

   public Tuple search(String numSerie) throws ModelNotFoundException
        {
            String direction = numSerie.substring(0,1);

            if (direction.equals("1")) 
                {
                    return h.search(numSerie);
                 
            } else if(direction.equals("2"))
                    {
                        return s.search(numSerie);
                    
            } else if(direction.equals("3"))
                {
                    return n.search(numSerie);
    
                }else{
                throw new ModelNotFoundException(numSerie);
            }
    
        }

}
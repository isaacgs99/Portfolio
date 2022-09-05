package com.example.bolo_live.Bolo_Live;

public class Tuple<NumSerie, Model>
{
   protected NumSerie numSerie;
   protected Model model;

   public Tuple(NumSerie numSerie, Model model)
   {
       this.numSerie= numSerie;
       this.model = model;
   
   }

   /**
    * @return the model
    */
   public Model getModel() {
      return model;
   }

   /**
    * @return the numSerie
    */
   public NumSerie getNumSerie() {
      return numSerie;
   }

   public String toString()
   {
      return numSerie +" "+ model;
   }
   
   
   
}
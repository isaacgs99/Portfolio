package com.example.bolo_live.Bolo_Live;

import java.util.ArrayList;
import java.util.Scanner;

public class Juguetes{
  
protected ArrayList<String> liverpool= new ArrayList <String>(); //Creamos el arrayList
   public Juguetes()
   {
    
    liverpool.add("hotwheels");
    liverpool.add("barbie"); 
    }

    /**
     * @return the liverpool
     */
    public ArrayList<String> getLiverpool() {
        return liverpool;
    }
}
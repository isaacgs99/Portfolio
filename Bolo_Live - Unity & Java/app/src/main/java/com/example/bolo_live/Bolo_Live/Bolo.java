package com.example.bolo_live.Bolo_Live;

import android.widget.Toast;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Bolo extends Juguetes //Atributos genericos
{
    protected static Bolo instance =  null;
    protected Tuple[] boloList;
    protected Tuple b;
    protected int cont = 0;
    protected Scanner keyboard = new Scanner(System.in);
    protected String r;
    protected Juguetes j = new Juguetes();
    protected boolean found= false; 
    protected ArrayList<String> toys = new ArrayList <String>(); //Creamos el arrayList

    public Bolo(){
        boloList = new Tuple[10];
        j = new Juguetes();
        
    }

    public void save(Tuple t) 
    {
            boloList[cont++] = t;
           
    }

    public void askGif(String er){
        r = er;
        toys.add(r); //agregamos regalo a arrayList

    }//aqui el usuario solicita el regalo

    public String check(){
        ArrayList<String> liverpool = j.getLiverpool();

        ArrayList<String> c = new ArrayList<>(liverpool);

        c.retainAll(toys);
        
            
        return c.toString();

    }

    public void sendGift(){
       
            System.out.println("Tu hijo/a te mando una lista de productos que quiere\n");
            System.out.println(check());

        

    }//envia solicitud y costo a los padres
        
}
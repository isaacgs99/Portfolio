package com.example.bolo_live.Bolo_Live;

public class ModelNotFoundException extends Exception
{
    protected String numSerie;
    public ModelNotFoundException(String numSerie)
    {
        this.numSerie = numSerie;

    }
    
    @Override
    public String toString()
    {
        return new String(numSerie + " No fue encontrado");

    }

}
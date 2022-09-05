package com.example.bolo_live;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.bolo_live.Bolo_Live.Bolo;
import com.example.bolo_live.Bolo_Live.ModelNotFoundException;
import com.example.bolo_live.Bolo_Live.Server;
import com.example.bolo_live.Bolo_Live.Tuple;

public class comunica extends AppCompatActivity {

    private String mensaje;
    private int paso = 0;

    Tuple resultado;
    String a;
    String b;
    Bolo bol;
    String boloN;
    String conti = "Y";

    EditText caja;
    TextView respuesta;
    TextView nombre;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.comunicacion);
        caja = findViewById(R.id.caja);
        respuesta = findViewById(R.id.textViewRespuesta);
        nombre = findViewById(R.id.textViewBolo);
        mensaje = getIntent().getStringExtra("codigo");
        paso++;
        Server s = new Server();

        try {
            resultado = s.search(mensaje);

            boloN = resultado.toString();

            Toast.makeText(this, (boloN + " tu codigo a sido verificado" ), Toast.LENGTH_LONG).show();
            Toast.makeText(this, "Ponle nombre a tu Bolo!", Toast.LENGTH_LONG).show();
            respuesta.setText("Ponme un nombre");
            caja.setHint("Ponle nombre a tu Bolo!");

        }
        catch (ModelNotFoundException e)
        {
            System.out.println(e.toString());
        }
    }

    public void enviale(View view) {
        mensaje = caja.getText().toString();
        if(paso==0){

        } else if(paso == 1) {
            paso++;
            Tuple<String,String> t = new Tuple<>( boloN, mensaje);
            nombre.setText("Bolo " + t.getModel()+ ":");
            Toast.makeText(this, ("Tu Bolo se conocera como: "+ t.getModel()), Toast.LENGTH_LONG).show();
            bol = new Bolo();
            bol.save(t);

            mensaje = "Y";
            respuesta.setText("Que juguete quieres poner en tu lista?");
            caja.setHint("Escribe el nombre de tu juguete");

        } else if(paso == 2){
            paso = 3;
            bol.askGif(mensaje);
            Toast.makeText(this, ("Juguete "+mensaje+" agregado a la lista"), Toast.LENGTH_LONG).show();
            respuesta.setText("Quieres poner mas regalos?");
            caja.setHint("Y/N  SI/NO");

        } else if(paso == 3){

            if(mensaje.equalsIgnoreCase("Y") || mensaje.equalsIgnoreCase("SI")){
                respuesta.setText("Escribe el juguete que deseas");
                caja.setHint("Escribe el nombre de tu juguete");
                paso = 2;
            } else {
                respuesta.setText("Tu hijo a deseado: "+ bol.check());
                paso = 4;
            }
        } else {
            Toast.makeText(this, ("Feliz Navidad!!"), Toast.LENGTH_LONG).show();
        }
        caja.setText("");

        //respuesta.setText(mensaje);
    }

}


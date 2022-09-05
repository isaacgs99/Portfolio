package com.example.bolo_live;

import android.content.Intent;
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

public class MainActivity extends AppCompatActivity {

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        caja = findViewById(R.id.cajaI);
        Toast.makeText(this, "Escanea el codigo de tu bolo", Toast.LENGTH_LONG).show();
    }

    public void enviale(View view) {
        mensaje = caja.getText().toString();
        Intent otra = new Intent(this,comunica.class);
        otra.putExtra("codigo",mensaje);
        startActivity(otra);
    }

}


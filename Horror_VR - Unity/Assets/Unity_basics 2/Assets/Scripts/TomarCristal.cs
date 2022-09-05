using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TomarCristal : MonoBehaviour 
{
	public Text scoreText;
	int score = 0;
	private void OnTriggerEnter(Collider other) 
	{	
		if(other.gameObject.CompareTag("Crystal"))
		{
			score++;
			scoreText.text = "Score: " + score.ToString();
			Destroy(other.gameObject);
		}
	}
}

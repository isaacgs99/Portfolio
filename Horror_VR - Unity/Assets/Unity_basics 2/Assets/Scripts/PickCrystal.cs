using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PickCrystal : MonoBehaviour {

	public Text scoreText, winText;
	public AudioClip crystalSound;
	public int maxScore = 0;
	private int score = 0;

	private void Update() {
		if(score == maxScore)
			winText.gameObject.SetActive(true);
	}

	private void OnTriggerEnter(Collider other) {
		if(other.CompareTag("Crystal"))
		{
			Destroy(other.gameObject);
			scoreText.text = string.Format("Score: {0}", ++score);
			AudioSource.PlayClipAtPoint(crystalSound, other.gameObject.transform.position);
		}		
	}
}

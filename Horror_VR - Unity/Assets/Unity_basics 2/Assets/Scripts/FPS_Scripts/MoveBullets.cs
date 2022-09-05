using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveBullets : MonoBehaviour {

	public float speed;
	public float timeAlive;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		transform.position += transform.forward * speed * Time.deltaTime;
		timeAlive-=Time.deltaTime;
		
		if(timeAlive <= 0)
		{
			Destroy(transform.gameObject);
		}

	}

	private void OnTriggerEnter(Collider other) {
		if(other.gameObject.CompareTag("Enemy"))
		{
			Destroy(other.gameObject);
			Destroy(transform.gameObject);
		}
	}
}

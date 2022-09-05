using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Flotar : MonoBehaviour {

	public float height = 1.0f;
	public float speed = 0.2f;
	float x = 0, y = 0, z = 0, randomStart = 0;
	// Use this for initialization
	void Start () 
	{
		x = transform.position.x;
		y = Random.Range(transform.position.y-height, transform.position.y+height);
		z = transform.position.z;
		randomStart = Random.Range(1, 10);
		transform.position = new Vector3(x, y, z);
	}
	
	// Update is called once per frame
	void Update () 
	{
		float newY = y + Mathf.Sin((Time.time + randomStart)  * speed) * height;
		transform.position = new Vector3(x, newY, z);
		
	}
}

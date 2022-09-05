using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnEnemies : MonoBehaviour {

	public GameObject enemyPrefab;
	public float spawnTime;
	private float nextSpawn;
	// Use this for initialization
	void Start () {
		nextSpawn = 0;
	}
	
	// Update is called once per frame
	void Update () {
		
		if(Random.Range(0, 500) <= 10)
		{
			Vector3 position = new Vector3(Random.Range(-10.0f, 10.0f), 2, Random.Range(-10.0f, 10.0f));
			Instantiate(enemyPrefab, position, Quaternion.identity);
		}
	}
}

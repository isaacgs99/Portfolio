using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityStandardAssets.Cameras;
public class MoverAutomatico : MonoBehaviour {

	public GameObject posiciones;
	public List<float> tiemposEspera;
	private List<Transform> posicionesLista;
	public float speed;
	private Transform target;
	private int targetIndex;
	private bool canMove;
	private FreeLookCam freeLookCam;
	// Use this for initialization
	void Start () {
		targetIndex = 0;
		posicionesLista = new List<Transform>();
		freeLookCam = transform.GetComponent<FreeLookCam>();

		foreach(Transform posicion in posiciones.transform)
			posicionesLista.Add(posicion);
		
		if(posicionesLista.Count > 0)
			setNewTarget();

		StartCoroutine(waitFor(tiemposEspera[targetIndex]));
	}

	void setNewTarget()
	{
		target = posicionesLista[targetIndex];
		// freeLookCam.SetTarget(target);
	}
	// Update is called once per frame
	void Update () {

		if(canMove)
			transform.position = Vector3.MoveTowards(transform.position, target.position, speed*Time.deltaTime);
	}

	private void OnTriggerEnter(Collider other) {	
		Debug.Log(tiemposEspera[targetIndex]);
		StartCoroutine(waitFor(tiemposEspera[targetIndex]));
		setNewTarget();
	}

	IEnumerator waitFor(float seconds)
	{
		canMove = false;
		yield return new WaitForSeconds(seconds);
		targetIndex = (targetIndex+1) % posicionesLista.Count;
		canMove = true;
	}

}

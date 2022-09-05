using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class showhideTarget : MonoBehaviour {
    public GameObject target;

    private bool active;
    //use this  for initialization

    void Start () {
        active = target.activeInHierarchy;
    }

    //Update is called once per frame

    void Update () {
    }

    private void OnTriggerEnter(Collider other)
    {
        StartCoroutine((startShow()));
    }

    IEnumerator startShow()
    {
        yield return new WaitForSeconds(2);
            active= !active;
            target.SetActive(active);
        yield return 0;
    }
}
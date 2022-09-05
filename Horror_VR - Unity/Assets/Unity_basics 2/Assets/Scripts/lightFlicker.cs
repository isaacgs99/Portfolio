using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class lightFlicker : MonoBehaviour
{
    public Light lightSource;
    public float maxIntensity = 10;
    public int numberFlicker = 5;
    private float timeSpent = 2000;
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    private void OnTriggerEnter(Collider other)
    {
        StartCoroutine(startFlicker());
    }

    IEnumerator startFlicker()
    {
        while(numberFlicker> 0)
        {
            float value = Mathf.Cos(timeSpent) * maxIntensity;
            float newIntensity = value >= 0 ? value : -value;
            lightSource.intensity = newIntensity;
            timeSpent += Time.deltaTime;
            if (value <0 && value > -0.05)
                numberFlicker--;
            yield return 0;
        }
    }
}

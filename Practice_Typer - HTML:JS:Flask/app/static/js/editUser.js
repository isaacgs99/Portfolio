const updateUser = async (event) => {
    event.preventDefault(); // prevent form submission
    const form = event.target;
    const data = {
        fname: form.fname.value,
        lname: form.lname.value,
        username: form.username.value
    };
    await fetch("/dash/settings/edit", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetch('/dash/settings/edit').then(_ => window.location.href = '/dash/settings')

        })
        .catch(error => console.error(error));
}

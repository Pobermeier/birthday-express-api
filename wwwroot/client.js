(function () {
  const birthdayList = document.getElementById('birthday-list');
  const addBirthdayForm = document.getElementById('add-birthday-form');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const birthdayInput = document.getElementById('birthday');

  addBirthdayForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const users = await (
      await fetch('http://localhost:5003/birthday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstNameInput.value,
          last_name: lastNameInput.value,
          birthday: Math.round(
            new Date(birthdayInput.value).getTime() / 1000,
          ).toString(),
        }),
      })
    ).json();

    await updateUIwithFetchedData(birthdayList, users);
  });

  window.addEventListener('load', async () => {
    const users = await (await fetch('http://localhost:5003/birthday')).json();
    await updateUIwithFetchedData(birthdayList, users);
  });
})();

async function updateUIwithFetchedData(uiElement, userData) {
  if (uiElement) {
    uiElement.innerHTML = '';

    if (!userData || userData.length === 0) {
      uiElement.innerHTML = '<p>No data available</p>';
    } else {
      uiElement.innerHTML += `<table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Birthday</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
          </table>`;
      const tableBody = document.querySelector('#birthday-list tbody');
      userData.forEach((user) => {
        tableBody.innerHTML += `
          <tr>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${new Date(parseInt(user.birthday) * 1000).toDateString()}</td>
            <td><button class="btn btn-info">Edit</button>&nbsp;<button class="btn btn-danger del-btn" data-userId=${
              user.id
            }>Delete</button></td>
          </tr>
          `;
      });
    }
  }
}

'use strict';

(function () {
  const birthdayList = document.getElementById('birthday-list');
  const addBirthdayForm = document.getElementById('add-birthday-form');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const birthdayInput = document.getElementById('birthday');
  const alertContainer = document.getElementById('alerts');

  window.addEventListener('load', async () => {
    const users = await (await fetch('http://localhost:5003/birthday')).json();
    await updateUIwithFetchedData(birthdayList, users);
    showAlert('Data successfully fetched from server!', 'info');
  });

  birthdayList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('del-btn')) {
      const id = e.target.dataset.userid;

      const users = await (
        await fetch(`http://localhost:5003/birthday/${id}`, {
          method: 'DELETE',
        })
      ).json();

      await updateUIwithFetchedData(birthdayList, users);

      showAlert('User deleted!', 'danger');
    } else if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.userid;

      const infoRow = document.querySelector(
        `tr[data-userid="${id}"]:not(.hidden)`,
      );
      const editRow = document.querySelector(`tr[data-userid="${id}"].hidden`);

      infoRow.classList.add('hidden');
      editRow.classList.remove('hidden');
    } else if (e.target.classList.contains('cancel-edit-btn')) {
      const id = e.target.dataset.userid;

      const editRow = document.querySelector(
        `tr[data-userid="${id}"]:not(.hidden)`,
      );
      const infoRow = document.querySelector(`tr[data-userid="${id}"].hidden`);

      infoRow.classList.remove('hidden');
      editRow.classList.add('hidden');
    } else if (e.target.classList.contains('save-edit-btn')) {
      const id = e.target.dataset.userid;

      const firstNameInput = document.querySelector(
        `tr[data-userid="${id}"] #edit-first-name-${id}`,
      );
      const lastNameInput = document.querySelector(
        `tr[data-userid="${id}"] #edit-last-name-${id}`,
      );
      const birthdayInput = document.querySelector(
        `tr[data-userid="${id}"] #edit-birthday-${id}`,
      );

      const users = await (
        await fetch(`http://localhost:5003/birthday/${id}`, {
          method: 'PUT',
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

      firstNameInput.value = '';
      lastNameInput.value = '';
      birthdayInput.value = '';

      const editRow = document.querySelector(
        `tr[data-userid="${id}"]:not(.hidden)`,
      );
      const infoRow = document.querySelector(`tr[data-userid="${id}"].hidden`);

      infoRow.classList.remove('hidden');
      editRow.classList.add('hidden');

      showAlert(
        'User data successfully edited and saved to database!',
        'success',
      );

      await updateUIwithFetchedData(birthdayList, users);
    }
  });

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

    firstNameInput.value = '';
    lastNameInput.value = '';
    birthdayInput.value = '';

    showAlert('User successfully added!', 'success');

    await updateUIwithFetchedData(birthdayList, users);
  });

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
          const birthday = new Date(parseInt(user.birthday) * 1000);
          const year = birthday.getFullYear();
          let month = birthday.getMonth() + 1;
          month = addLeadingZero(month);
          let day = birthday.getDate();
          day = addLeadingZero(day);

          tableBody.innerHTML += `
            <tr data-userId=${user.id}>
              <td>${user.first_name}</td>
              <td>${user.last_name}</td>
              <td>${new Date(
                parseInt(user.birthday) * 1000,
              ).toDateString()}</td>
              <td><button class="btn btn-info edit-btn" data-userId=${
                user.id
              }>Edit</button>&nbsp;<button class="btn btn-danger del-btn" data-userId=${
            user.id
          }>Delete</button></td>
            </tr>
            <tr data-userId=${user.id} class="hidden">
              <td><label for="edit-first-name"><strong>First Name:</strong></label>&nbsp;<input type="text" name="edit-first-name" id="edit-first-name-${
                user.id
              }" required value="${user.first_name}"></td>
              <td><label for="edit-last-name"><strong>Last Name:</strong></label>&nbsp;<input type="text" name="edit-last-name" id="edit-last-name-${
                user.id
              }" required value="${user.last_name}"></td>
              <td><label for="edit-birthday"><strong>Birthday:</strong></label>&nbsp;<input type="date" name="edit-birthday" id="edit-birthday-${
                user.id
              }" required value="${year}-${month}-${day}"></td>
              <td><button class="btn btn-info save-edit-btn" data-userId=${
                user.id
              }>Save</button>&nbsp;<button class="btn btn-danger cancel-edit-btn" data-userId=${
            user.id
          }>Cancel</button></td>
            </tr>
            `;
        });
      }
    }
  }

  function addLeadingZero(numberToCheck) {
    if (numberToCheck <= 9) return `0${numberToCheck}`;
    else return numberToCheck;
  }

  function showAlert(text, type) {
    const alertId = generateUUID();

    alertContainer.innerHTML += `
      <div class="alert alert-${type}" data-alertid="${alertId}" role="alert">
        ${text}
      </div>
    `;

    setTimeout(() => {
      document.querySelector(`[data-alertid="${alertId}"]`).remove();
    }, 3000);
  }

  function generateUUID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
})();

'use strict';

(function () {
  const birthdayList = document.getElementById('birthday-list');
  const addBirthdayForm = document.getElementById('add-birthday-form');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const birthdayInput = document.getElementById('birthday');
  const alertContainer = document.getElementById('alerts');

  window.addEventListener('load', async () => {
    const users = await (
      await fetch(`http://${window.location.hostname}:5003/birthday`)
    ).json();
    await updateUIwithFetchedData(birthdayList, users);
    showAlert('Data successfully fetched from server!', 'info');
  });

  birthdayList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('del-btn')) {
      const id = e.target.dataset.userid;

      const users = await (
        await fetch(`http://${window.location.hostname}:5003/birthday/${id}`, {
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
        await fetch(`http://${window.location.hostname}:5003/birthday/${id}`, {
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
      await fetch(`http://${window.location.hostname}:5003/birthday`, {
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
                <th scope="col"></th>
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
              ).toLocaleDateString()}</td>
              <td class="text-align-right"><button class="btn btn-info edit-btn" data-userId=${
                user.id
              }><svg class="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
              <path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
            </svg></button><button class="btn btn-danger del-btn" data-userId=${
              user.id
            }><svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
          <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
        </svg></button></td>
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
              <td class="text-align-right"><button class="btn btn-info save-edit-btn" data-userId=${
                user.id
              }><svg class="bi bi-check2" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg></button><button class="btn btn-danger cancel-edit-btn" data-userId=${
              user.id
            }><svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
          <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
        </svg></button></td>
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

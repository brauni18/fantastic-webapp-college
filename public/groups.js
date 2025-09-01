

fetch('/groups')
  .then(response => response.json())
  .then(data => {
    console.log(data); // log the groups data
  })


  .catch(error => console.error('error the groups cant upload:', error));  fetch('/groups/<group-id>/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('you added to the group:', data);
    })
    .catch(error => console.error('error, you not added to a group (try again) :', error));

const groupList = document.getElementById('group-list');

fetch('/groups')
  .then(response => response.json())
  .then(groups => {
    groups.forEach(group => {
      const listItem = document.createElement('li');
      listItem.textContent = group.name;
      groupList.appendChild(listItem);
    });
  });

    const createGroupForm = document.getElementById('create-group-form');
  
  createGroupForm.addEventListener('submit', event => {
    event.preventDefault();
  
    const formData = new FormData(createGroupForm);
    const groupData = {
      name: formData.get('name'),
      description: formData.get('description')
    };
  

    fetch('/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groupData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('group created:', data);
      })
      .catch(error => console.error('error at group created:', error));
  });

fetch('/groups/<group-id>/join', { method: 'POST' })
  .then(response => {
    if (!response.ok) {
      throw new Error('error joining group: ');
    }
    return response.json();
  })
  .then(data => {
    console.log('add to group:', data);
  })
  .catch(error => {
    alert('error: ' + error.message);
  });

  const createCommunityButton = document.getElementById('create-Community');
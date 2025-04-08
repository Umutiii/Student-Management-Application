GetAllStudents();

// Student list retrieval
// Fetch all students from the API and display them in the table
function GetAllStudents() {

    const studentList = document.getElementById('studentList');

    fetch('https://localhost:7202/api/Students/', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to retrieve data');
            }
            return response.json();
        })
        .then(students => {
            studentList.innerHTML = "";
            students.forEach(student => {
                studentList.innerHTML += `<tr>
                    <th scope="row">${student.no}</th>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.class}</td>
                    <td class="btn-group">
                        <button type="button" class="btn btn-warning" onclick="GetOneStudentForUpdate(${student.id})">Update</button>
                        <button type="button" class="btn btn-danger" onclick="DeleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>`;

            })
        })
        .catch(error => {
            alert(error);
        });
};


// Student registration form

document.getElementById('studentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const formData = new FormData(this);
    const studentNumber = formData.get('no');

    fetch('https://localhost:7202/api/Students', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.text();
        })
        .then(studentNo => {
            if (studentNo != studentNumber) {
                alert(`As there was a student number ${studentNumber}, the student number was changed to ${studentNo}`);
            }
            else {
                alert('Student registered successfully!');
            }

            document.getElementById('studentForm').classList.remove('was-validated');
            bootstrap.Modal.getInstance(document.getElementById('registerStudentModal')).hide();
            document.getElementById('studentForm').reset();
            GetAllStudents();
        })
        .catch(error => {
            alert(error.message);
        })
});

// Student update form
function GetOneStudentForUpdate(id) {
    fetch(`https://localhost:7202/api/Students/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            console.log(response);
            return response.json();
        })
        .then(student => {
            console.log(student);
            document.getElementById('updateStudentId').value = student.id;
            document.getElementById('updateStudentNumber').value = student.no;
            document.getElementById('updateFirstName').value = student.firstName;
            document.getElementById('updateLastName').value = student.lastName;
            document.getElementById('updateClass').value = student.class;

            new bootstrap.Modal(document.getElementById('updateStudentModal')).show();
        })
        .catch(error => {
            alert(error.message);
        })
}

// Student update form submission
// Validate the form before submission

document.getElementById('updateStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const student = {
        id: document.getElementById('updateStudentId').value,
        no: document.getElementById('updateStudentNumber').value,
        firstName: document.getElementById('updateFirstName').value,
        lastName: document.getElementById('updateLastName').value,
        class: document.getElementById('updateClass').value,
    }

    fetch(`https://localhost:7202/api/Students/${student.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        alert('Student updated successfully!');
        bootstrap.Modal.getInstance(document.getElementById('updateStudentModal')).hide();
        GetAllStudents();
    })
        .catch(error => {
            alert(error.message);
        })
});

// Student delete confirmation

let studentToDeleteId = null;

function DeleteStudent(id) {
    studentToDeleteId = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();
};

document.getElementById('confirmDeleteButton').addEventListener('click', function () {
    if (studentToDeleteId === null) return;

    fetch(`https://localhost:7202/api/Students/${studentToDeleteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            alert('Student deleted successfully!');
            bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal')).hide();
            GetAllStudents();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem with your submission: ' + error.message);
        });
});
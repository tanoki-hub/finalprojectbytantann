// ===============================
// LOAD STUDENTS
// ===============================
let students = JSON.parse(localStorage.getItem("students")) || [];

// Only display table if it exists (prevents login page crash)
if (document.getElementById("studentTable")) {
    displayStudents();
}


// ===============================
// DISPLAY STUDENTS
// ===============================
function displayStudents(list = students) {

    let table = document.getElementById("studentTable");
    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; font-weight:bold; color:gray;">
                    No student found
                </td>
            </tr>
        `;
        return;
    }

    let loggedUser = JSON.parse(localStorage.getItem("studentAccount"));

    list.forEach((student) => {

        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.year}</td>
                <td>${student.age}</td>
                <td>
                    ${loggedUser && loggedUser.id === student.id 
                        ? `<button onclick="editStudentById('${student.id}')">Edit</button>` 
                        : ""}
                </td>
            </tr>
        `;
    });
}


// ===============================
// SEARCH
// ===============================
function searchStudent() {

    let searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    let searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue === "") {
        displayStudents();
        return;
    }

    let filtered = students.filter(student =>
        student.id.toLowerCase().includes(searchValue) ||
        student.name.toLowerCase().includes(searchValue)
    );

    displayStudents(filtered);
}


// ===============================
// EDIT
// ===============================
let editIndex = null;

function editStudentById(studentId) {

    let loggedUser = JSON.parse(localStorage.getItem("studentAccount"));

    if (!loggedUser || loggedUser.id !== studentId) {
        alert("You can only edit your own account!");
        return;
    }

    editIndex = students.findIndex(student => student.id === studentId);

    let student = students[editIndex];

    document.getElementById("editId").value = student.id;
    document.getElementById("editName").value = student.name;
    document.getElementById("editCourse").value = student.course;
    document.getElementById("editYear").value = student.year;
    document.getElementById("editAge").value = student.age;

    document.getElementById("editModal").style.display = "flex";
}


function saveEdit() {

    if (editIndex === null || editIndex < 0) return;

    let newId = document.getElementById("editId").value.trim();
    let newName = document.getElementById("editName").value;
    let newCourse = document.getElementById("editCourse").value;
    let newYear = document.getElementById("editYear").value;
    let newAge = document.getElementById("editAge").value;

    // Prevent duplicate ID
    let duplicate = students.some((student, index) => 
        student.id === newId && index !== editIndex
    );

    if (duplicate) {
        alert("Student ID already exists!");
        return;
    }

    // Update student
    students[editIndex].id = newId;
    students[editIndex].name = newName;
    students[editIndex].course = newCourse;
    students[editIndex].year = newYear;
    students[editIndex].age = newAge;

    localStorage.setItem("students", JSON.stringify(students));

    // Update logged-in account
    let loggedUser = JSON.parse(localStorage.getItem("studentAccount"));
    if (loggedUser) {
        loggedUser.id = newId;
        loggedUser.name = newName;
        loggedUser.course = newCourse;
        loggedUser.year = newYear;
        loggedUser.age = newAge;
        localStorage.setItem("studentAccount", JSON.stringify(loggedUser));
    }

    editIndex = null;

    closeModal();
    displayStudents();
}

function closeModal() {
    let modal = document.getElementById("editModal");
    if (modal) modal.style.display = "none";
}


// ===============================
// DELETE ACCOUNT
// ===============================
function openDeleteModal() {
    let modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "flex";
}

function closeDeleteModal() {
    let modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "none";
}

function confirmDelete() {

    let loggedUser = JSON.parse(localStorage.getItem("studentAccount"));
    if (!loggedUser) return;

    students = students.filter(student => student.id !== loggedUser.id);

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.removeItem("studentAccount");
    localStorage.removeItem("loggedIn");

    alert("Your account has been deleted.");

    window.location.href = "login.html";
}


// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}


// ===============================
// SMART SEARCH LISTENER (SAFE)
// ===============================
let searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchStudent();
        }
    });

    searchInput.addEventListener("input", function() {
        searchStudent();
    });
}

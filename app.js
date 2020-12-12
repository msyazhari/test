let students = [];
let counter;

if (localStorage.getItem('students') !== null) {
    students = JSON.parse(localStorage.getItem('students'));
}

class Student {

    constructor(studentCode, firstName, lastName) {
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.grades = [];
    }
}

function el(id) {
    return document.getElementById(id);
}

function showModal(msg) {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.bottom = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.background = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal p-16">
            <div class="card">
                <h1 class="card-title">Message</h1>
                <div class="card-body">
                    <div>${msg}</div>
                    <div class="flex justify-end mt-16">
                        <button class="button button-green" type="button" onclick="el('modal').remove()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function findStudent(studentCode) {
    for (const student of students) {
        if (student.studentCode === studentCode) {
            return student;
        }
    }
    return null;
}

function findStudentIndex(studentCode) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].studentCode === studentCode) {
            return i;
        }
    }
    return -1;
}

function create() {
    const studentCode = el('studentCode').value;
    const firstName = el('firstName').value;
    const lastName = el('lastName').value;
    if (findStudent(studentCode) === null) {
        const student = new Student(studentCode, firstName, lastName);
        students.push(student);
        updateStorage();
        refreshList();
        showModal('Student created successfully.');
    } else {
        showModal('Student already exists.');
    }
}

function del(studentCode) {
    const index = findStudentIndex(studentCode);
    if (index !== -1) {
        students.splice(index, 1);
        updateStorage();
        refreshList();
        showModal('Selected student successfully deleted.');
    }
}

function clr() {
    const container = el('insert');
    if (container !== null) {
        container.remove();
    }
}

function find(code) {
    clr();
    const student = findStudent(code);
    if (student === null) {
        showModal('Student is not exists.');
    } else {
        counter = 0;
        const container = document.createElement('div');
        container.id = 'insert';
        container.innerHTML = `
            <div class="mt-16">
                <span class="text-dark bold">Student Code:</span> ${student.studentCode}<br>
                <span class="text-dark bold">First Name:</span> ${student.firstName}<br>
                <span class="text-dark bold">Last Name:</span> ${student.lastName}
            </div>
            <div class="mt-16">
                <div class="text-dark bold">Grades:</div>
                <form id="save" onreset="find('${student.studentCode}')">
                    <div class="flex items-end">
                        <div id="inputs"></div>
                        <svg class="icon text-green ml-8" onclick="addGrade(++counter)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex justify-end mt-16">
                        <button class="button button-red" type="reset">Clear</button>
                        <button class="button button-green ml-8" type="submit">Save</button>
                    </div>
                </form>
            </div>
        `;
        el('record').appendChild(container);
        addGrade(++counter);
        el('save').addEventListener('submit', function (e) {
            const grades = Array.from(document.querySelectorAll('.grades')).map(function (element) {
                return element.value;
            });
            const units = Array.from(document.querySelectorAll('.units')).map(function (element) {
                return element.value;
            });
            for (let i = 0; i < grades.length; i++) {
                const g = parseFloat(grades[i]);
                const u = parseFloat(units[i]);
                if ((! isNaN(g)) && (! isNaN(u))) {
                    student.grades.push({grade: g, unit: u});
                    updateStorage();
                }
            }
            clr();
            showModal('Grades successfully recorded.');
            e.preventDefault();
        });
    }
}

function addGrade(number) {
    const row = document.createElement('div');
    row.innerHTML = `
        <label for="grade${number}">Grade #${number}</label>
        <input id="grade${number}" class="grades" type="number" min="0" max="20" required>
        <label class="align-r" for="unit${number}">Unit Count</label>
        <input id="unit${number}" class="units" type="number" min="1" max="3" required>
    `;
    el('inputs').append(row);
}

function refreshList() {
    if (students.length === 0) {
        el('list').innerHTML = '<div class="card-body">Empty</div>';
    } else {
        const list = el('list');
        list.innerHTML = `
            <div class="flex text-dark bold">
                <div class="w-1/5 p">Student Code</div>
                <div class="w-1/5 p border-l">First Name</div>
                <div class="w-1/5 p border-l">Last Name</div>
                <div class="w-2/5 p border-l">Actions</div>
            </div>
        `;
        students.forEach(function (student) {
            const item = document.createElement('div');
            item.className = 'flex items-center border-t';
            item.innerHTML = `
                <div class="w-1/5 p">${student.studentCode}</div>
                <div class="w-1/5 p">${student.firstName}</div>
                <div class="w-1/5 p">${student.lastName}</div>
                <div class="flex justify-end w-2/5">
                    <div class="mr-16">
                        <button class="button button-red" type="button" onclick="del('${student.studentCode}')">Delete</button>
                        <button class="button button-green ml-8" type="button" onclick="showGrades('${student.studentCode}')">Grades</button>
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
    }
}

function showGrades(code) {
    const student = findStudent(code);
    let body = `
        <div>
            <span class="text-dark bold">Student Code:</span> ${student.studentCode}<br>
            <span class="text-dark bold">First Name:</span> ${student.firstName}<br>
            <span class="text-dark bold">Last Name:</span> ${student.lastName}
        </div>
        <div class="mt-16">
            <div class="text-dark bold">Grades:</div>
    `;
    if (student.grades.length === 0) {
        body += '<span>Empty</span>'
    } else {
        let totalGrades = 0;
        let totalUnits = 0;
        student.grades.forEach(function (grade, index) {
            totalGrades += grade.grade * grade.unit;
            totalUnits += grade.unit;
            body += `<span class="text-dark bold">Grade #${index + 1}:</span> ${grade.grade} `;
            body += `<span class="text-dark bold">Unit:</span> ${grade.unit}<br>`;
        });
        body += `
            <div class="mt-8">
                <span class="text-dark bold">Average:</span> ${totalGrades / totalUnits}
            </div>
        `;
    }
    body += '</div>';
    showModal(body);
}

el('create').addEventListener('submit', function (e) {
    create();
    el('create').reset();
    e.preventDefault();
});

el('find').addEventListener('submit', function (e) {
    find(el('code').value);
    el('code').value = '';
    e.preventDefault();
});
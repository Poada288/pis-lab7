const groupmates = [
    {
        "name": "Анна",
        "surname": "Соколова",
        "group": "БСТ2356",
        "marks": [
            5,
            5,
            5
        ]
    },
    {
        "name": "Иван",
        "surname": "Петров",
        "group": "БСТ2355",
        "marks": [
            4,
            4,
            4
        ]
    },
    {
        "name": "Мария",
        "surname": "Орлова",
        "group": "БСТ2356",
        "marks": [
            5,
            4,
            5
        ]
    },
    {
        "name": "Артём",
        "surname": "Волков",
        "group": "БСТ2355",
        "marks": [
            3,
            3,
            4
        ]
    },
    {
        "name": "Елена",
        "surname": "Морозова",
        "group": "БСТ2354",
        "marks": [
            4,
            5,
            4
        ]
    },
    {
        "name": "Денис",
        "surname": "Лебедев",
        "group": "БСТ2354",
        "marks": [
            3,
            3,
            3
        ]
    }
];

function averageMark(student) {
    return student.marks.reduce((sum, mark) => sum + mark, 0) / student.marks.length;
}

function filterByGroup(students, group) {
    return students.filter(student => student.group === group.trim().toUpperCase());
}

function filterByAverage(students, threshold) {
    return students.filter(student => averageMark(student) > threshold);
}

function printStudents(students) {
    const widths = [15, 16, 12, 14, 14];
    const row = values => values.map((value, i) => String(value).padEnd(widths[i])).join(' ');
    const rows = students.map(student => row([
        student.name, student.surname, student.group,
        student.marks.join(', '), averageMark(student).toFixed(2)
    ]));
    console.log([row(['Имя', 'Фамилия', 'Группа', 'Оценки', 'Средний балл']), ...rows].join('\n'));
}

console.log(groupmates);
printStudents(groupmates);

const studentRows = document.querySelector('#student-rows');
const studentResult = document.querySelector('#student-result');

function showStudents(students) {
    studentRows.replaceChildren();
    for (const student of students) {
        const row = studentRows.insertRow();
        const values = [
            student.name, student.surname, student.group,
            student.marks.join(', '), averageMark(student).toFixed(2)
        ];
        for (const value of values) {
            row.insertCell().textContent = value;
        }
    }
    studentResult.textContent = students.length
        ? 'Найдено студентов: ' + students.length
        : 'Студенты не найдены';
}

document.querySelector('#group-filter').addEventListener('submit', event => {
    event.preventDefault();
    showStudents(filterByGroup(groupmates, document.querySelector('#student-group').value));
});

document.querySelector('#average-filter').addEventListener('submit', event => {
    event.preventDefault();
    const value = document.querySelector('#student-average').value.trim().replace(',', '.');
    const threshold = Number(value);
    if (!value || !Number.isFinite(threshold)) {
        studentRows.replaceChildren();
        studentResult.textContent = 'Введите число';
        return;
    }
    showStudents(filterByAverage(groupmates, threshold));
});

document.querySelector('#show-students').addEventListener('click', () => showStudents(groupmates));
showStudents(groupmates);

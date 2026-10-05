 
 
/* =========================================================
   UNIVERSITY AUTOMATIC TIMETABLE SYSTEM
   COMPLETE UPDATED JAVASCRIPT
========================================================= */
 
 
/* =========================================================
   FIREBASE CONNECTION
========================================================= */
 
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
 
 
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
 
 
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
 
 
const firebaseConfig = {
 
    apiKey:
        "AIzaSyDbaoycs6GwAsNLl_eOJO_BT6xpMl3GaZE",
 
    authDomain:
        "timetable-e823f.firebaseapp.com",
 
    projectId:
        "timetable-e823f",
 
    storageBucket:
        "timetable-e823f.firebasestorage.app",
 
    messagingSenderId:
        "162078880622",
 
    appId:
        "1:162078880622:web:701f4426ba744ea4a1477f",
 
    measurementId:
        "G-MGX56N6YTT"
 
};
 
 
/* =========================================================
   INITIALIZE FIREBASE
========================================================= */
 
const app =
    initializeApp(
        firebaseConfig
    );
 
 
const db =
    getFirestore(
        app
    );
 
 
const auth =
    getAuth(
        app
    );
 
 
/* =========================================================
   APPLICATION DATA
========================================================= */
 
let teachers = [];
 
let subjects = [];
 
let rooms = [];
 
let timetable = [];
 
 
/* =========================================================
   DAYS
========================================================= */
 
/*
   Monday to Friday has HIGH priority.
 
   Saturday is intentionally last so that it remains
   mostly free.
*/
 
const days = [
 
    "Monday",
 
    "Tuesday",
 
    "Wednesday",
 
    "Thursday",
 
    "Friday",
 
    "Saturday"
 
];
 
 
/* =========================================================
   YEAR / SEMESTER STRUCTURE
========================================================= */
 
const YEAR_SEMESTERS = {
 
 
    "2": [
        "3",
        "4"
    ],
 
    "3": [
        "5",
        "6"
    ],
 
    "4": [
        "7",
        "8"
    ]
 
};
 
 
 
/* =========================================================
   TIMETABLE TIME SLOTS
========================================================= */
 
const timeSlots = [
 
    {
        start: "09:00",
        end: "09:15",
        label: "09:00 AM - 09:15 AM",
        type: "meditation"
    },
 
    {
        start: "09:15",
        end: "10:15",
        label: "09:15 AM - 10:15 AM"
    },
 
    {
        start: "10:15",
        end: "11:15",
        label: "10:15 AM - 11:15 AM"
    },
 
    {
        start: "11:15",
        end: "11:30",
        label: "11:15 AM - 11:30 AM",
        type: "shortBreak"
    },
 
    {
        start: "11:30",
        end: "12:30",
        label: "11:30 AM - 12:30 PM"
    },
 
    {
        start: "12:30",
        end: "13:30",
        label: "12:30 PM - 01:30 PM"
    },
 
    {
        start: "13:30",
        end: "14:15",
        label: "01:30 PM - 02:15 PM",
        type: "lunch"
    },
 
    {
        start: "14:15",
        end: "15:15",
        label: "02:15 PM - 03:15 PM"
    },
 
    {
        start: "15:15",
        end: "16:15",
        label: "03:15 PM - 04:15 PM"
    }
 
];
 
 
/* =========================================================
   LECTURE WINDOWS
========================================================= */
 
const LECTURE_WINDOWS = [
 
    {
        start: "09:15",
        end: "10:15",
        label: "09:15 AM - 10:15 AM"
    },
 
    {
        start: "10:15",
        end: "11:15",
        label: "10:15 AM - 11:15 AM"
    },
 
    {
        start: "11:30",
        end: "12:30",
        label: "11:30 AM - 12:30 PM"
    },
 
    {
        start: "12:30",
        end: "13:30",
        label: "12:30 PM - 01:30 PM"
    },
 
    {
        start: "14:15",
        end: "15:15",
        label: "02:15 PM - 03:15 PM"
    },
 
    {
        start: "15:15",
        end: "16:15",
        label: "03:15 PM - 04:15 PM"
    }
 
];
 
 
/* =========================================================
   PRACTICAL WINDOWS
========================================================= */
 
const PRACTICAL_WINDOWS = [
 
    {
        start: "09:15",
        end: "11:15",
        label: "09:15 AM - 11:15 AM"
    },
 
    {
        start: "11:30",
        end: "13:30",
        label: "11:30 AM - 01:30 PM"
    },
 
    {
        start: "14:15",
        end: "16:15",
        label: "02:15 PM - 04:15 PM"
    }
 
];
 
 
/* =========================================================
   LOAD DATA FROM FIREBASE
========================================================= */
 
async function loadData() {
 
    try {
 
        const dataRef =
            doc(
                db,
                "timetableSystem",
                "mainData"
            );
 
 
        const dataSnapshot =
            await getDoc(
                dataRef
            );
 
 
        if (
            dataSnapshot.exists()
        ) {
 
            const data =
                dataSnapshot.data();
 
 
            teachers =
                data.teachers || [];
 
 
            subjects =
                data.subjects || [];

            subjects = subjects.map(subject => ({
                ...subject,
                batches: normalizeBatches(subject.batches)
            }));
 
 
            rooms =
                data.rooms || [];
 
 
            timetable =
                data.timetable || [];

            timetable = timetable.map(entry => ({
                ...entry,
                batch: String(entry.batch || "").trim().toUpperCase()
            }));
 
 
 
 
            console.log(
                "Data loaded successfully."
            );
 
        }
 
        else {
 
            teachers = [];
 
            subjects = [];
 
            rooms = [];
 
            timetable = [];
 
        }
 
    }
 
    catch (error) {
 
        console.error(
            "Error loading Firebase data:",
            error
        );
 
 
        alert(
            "Unable to load data from Firebase."
        );
 
    }
 
}
 
 
/* =========================================================
   SAVE DATA TO FIREBASE
========================================================= */
 
async function saveData() {
 
    try {
 
        const dataRef =
            doc(
                db,
                "timetableSystem",
                "mainData"
            );
 
 
        await setDoc(
 
            dataRef,
 
            {
 
                teachers:
                    teachers,
 
                subjects:
                    subjects,
 
                rooms:
                    rooms,
 
                timetable:
                    timetable
 
            }
 
        );
 
 
        console.log(
            "Data saved successfully."
        );
 
    }
 
    catch (error) {
 
        console.error(
            "Error saving Firebase data:",
            error
        );
 
 
        alert(
            "Unable to save data to Firebase."
        );
 
    }
 
}
 
 
/* =========================================================
   PAGE INITIALIZATION
========================================================= */
 
document.addEventListener(
 
    "DOMContentLoaded",
 
    function () {
 
 
        setupLogin();
 
        setupTeacherForm();
 
        setupSubjectForm();

        setupBatchManagement();
        setupBulkBatchAssignment();
 
        setupRoomForm();
 
        setupAssignmentForm();
 
        setupAssignmentTimeBySubject();
 
        setupNavigation();
 
        setupDropdownEvents();
 
        setupSemesterDisplayEvents();
 
        
 
 
 
        onAuthStateChanged(
 
            auth,
 
            async function (user) {
 
 
                if (user) {
 
 
                    const loginPage =
                        document.getElementById(
                            "loginPage"
                        );
 
 
                    const mainApplication =
                        document.getElementById(
                            "mainApplication"
                        );
 
 
                    if (loginPage) {
 
                        loginPage.hidden =
                            true;
 
                    }
 
 
                    if (mainApplication) {
 
                        mainApplication.hidden =
                            false;
 
                    }
 
 
                    const loginMessage =
                        document.getElementById(
                            "loginMessage"
                        );
 
 
                    if (loginMessage) {
 
                        loginMessage.innerText =
                            "";
 
                    }
 
 
                    await loadData();
 
 
                    populateAcademicYearDropdown();
 
                    populateTeacherDropdown();
 
                    populateAssignmentTeacherDropdown();
 
                    populateSubjectDropdown();
 
                    populateRoomDropdown();
 
                    setupRoomTypeEvent();
 
                    populateLabSubjectsDropdown();
 
                    displayTeachers();
 
                    displaySubjects();
 
                    displayRooms();
 
                    displayTimetable();
 
                    updateDashboard();
  
 
                    showSection(
                        "dashboardSection"
                    );
 
                }
 
 
                else {
 
 
                    const loginPage =
                        document.getElementById(
                            "loginPage"
                        );
 
 
                    const mainApplication =
                        document.getElementById(
                            "mainApplication"
                        );
 
 
                    if (loginPage) {
 
                        loginPage.hidden =
                            false;
 
                    }
 
 
                    if (mainApplication) {
 
                        mainApplication.hidden =
                            true;
 
                    }
 
 
                    teachers = [];
 
                    subjects = [];
 
                    rooms = [];
 
                    timetable = [];
 
                }
 
            }
 
        );
 
    }
 
);
 
 
/* =========================================================
   LOGIN
========================================================= */
 
function setupLogin() {
 
    const loginForm =
        document.getElementById(
            "loginForm"
        );
 
 
    if (!loginForm) {
 
        return;
 
    }
 
 
    loginForm.addEventListener(
 
        "submit",
 
        function (event) {
 
            event.preventDefault();
 
            login();
 
        }
 
    );
 
}
 
 
async function login() {
 
    const email =
        document.getElementById(
            "username"
        )
        .value
        .trim();
 
 
    const password =
        document.getElementById(
            "password"
        )
        .value;
 
 
    const message =
        document.getElementById(
            "loginMessage"
        );
 
 
    if (
        !email ||
        !password
    ) {
 
        message.innerText =
            "Please enter your email and password.";
 
        return;
 
    }
 
 
    message.innerText =
        "Signing in...";
 
 
    try {
 
        await signInWithEmailAndPassword(
 
            auth,
 
            email,
 
            password
 
        );
 
 
        message.innerText =
            "";
 
    }
 
    catch (error) {
 
        console.error(
            "Login error:",
            error
        );
 
 
        if (
 
            error.code ===
            "auth/invalid-credential" ||
 
            error.code ===
            "auth/wrong-password" ||
 
            error.code ===
            "auth/user-not-found"
 
        ) {
 
            message.innerText =
                "Invalid email or password.";
 
        }
 
 
        else if (
 
            error.code ===
            "auth/too-many-requests"
 
        ) {
 
            message.innerText =
                "Too many login attempts. Please try again later.";
 
        }
 
 
        else {
 
            message.innerText =
                "Login failed. Please try again.";
 
        }
 
    }
 
}
 
 
/* =========================================================
   LOGOUT
========================================================= */
 
async function logout() {
 
    try {
 
        await signOut(
            auth
        );
 
 
        const username =
            document.getElementById(
                "username"
            );
 
 
        const password =
            document.getElementById(
                "password"
            );
 
 
        const loginMessage =
            document.getElementById(
                "loginMessage"
            );
 
 
        if (username) {
 
            username.value =
                "";
 
        }
 
 
        if (password) {
 
            password.value =
                "";
 
        }
 
 
        if (loginMessage) {
 
            loginMessage.innerText =
                "";
 
        }
 
    }
 
    catch (error) {
 
        console.error(
            error
        );
 
 
        alert(
            "Unable to log out."
        );
 
    }
 
}
 
 
/* =========================================================
   NAVIGATION
========================================================= */
 
function setupNavigation() {
 
    addClickEvent(
 
        "dashboardButton",
 
        () =>
            showSection(
                "dashboardSection"
            )
 
    );
 
 
    addClickEvent(
 
        "teachersButton",
 
        () =>
            showSection(
                "teacherSection"
            )
 
    );
 
 
    addClickEvent(
 
        "subjectsButton",
 
        () =>
            showSection(
                "subjectSection"
            )
 
    );
 
 
    addClickEvent(
 
        "roomsButton",
 
        () =>
            showSection(
                "roomSection"
            )
 
    );
 
 
    addClickEvent(
 
        "timetableButton",
 
        () =>
            showSection(
                "timetableSection"
            )
 
    );
 
 
    addClickEvent(
 
        "resetButton",
 
        resetSystem
 
    );
 
 
    addClickEvent(
 
        "logoutButton",
 
        logout
 
    );
 
 
    addClickEvent(
 
        "generateButton",
 
        generateAutomaticTimetable
 
    );
 
 
    addClickEvent(
 
        "downloadButton",
 
        downloadTimetable
 
    );
 
 
    addClickEvent(
 
        "printButton",
 
        printTimetable
 
    );
 
}
 
 
function addClickEvent(
 
    id,
 
    callback
 
) {
 
    const element =
        document.getElementById(
            id
        );
 
 
    if (element) {
 
        element.addEventListener(
 
            "click",
 
            callback
 
        );
 
    }
 
}
 
 
function showSection(sectionId) {
 
    const sections = [
 
        "dashboardSection",
 
        "teacherSection",
 
        "subjectSection",
 
        "roomSection",
 
        "assignmentSection",
 
        "timetableSection"
 
    ];
 
 
    sections.forEach(
 
        id => {
 
            const section =
                document.getElementById(
                    id
                );
 
 
            if (section) {
 
                section.hidden =
                    id !== sectionId;
 
            }
 
        }
 
    );
 
 
    if (
        sectionId ===
        "subjectSection"
    ) {
 
        populateTeacherDropdown();
 
    }
 
 
    if (
        sectionId ===
        "roomSection"
    ) 
 
 
    if (
        sectionId ===
        "assignmentSection"
    ) {
 
        populateSubjectDropdown();
 
        populateAssignmentTeacherDropdown();
 
        populateRoomDropdown();
 
    }
 
 
    if (
        sectionId ===
        "timetableSection"
    ) {
 
        displayTimetable();
 
    }
 
}
 
 
/* =========================================================
   TEACHER MANAGEMENT
========================================================= */
 
function setupTeacherForm() {
 
    const form =
        document.getElementById(
            "teacherForm"
        );
 
 
    if (!form) {
 
        return;
 
    }
 
 
    form.addEventListener(
 
        "submit",
 
        function (event) {
 
            event.preventDefault();
 
            addTeacher();
 
        }
 
    );
 
}
 
 
async function addTeacher() {
 
    const id =
        document.getElementById(
            "teacherId"
        )
        .value
        .trim();
 
 
    const name =
        document.getElementById(
            "teacherName"
        )
        .value
        .trim();
 
 
    const email =
        document.getElementById(
            "teacherEmail"
        )
        .value
        .trim();
 
 
    const department =
        document.getElementById(
            "teacherDepartment"
        )
        .value
        .trim();
 
 
    if (
        !id ||
        !name
    ) {
 
        alert(
            "Please enter Teacher ID and Teacher Name."
        );
 
        return;
 
    }
 
 
    const duplicate =
        teachers.some(
 
            teacher =>
                String(
                    teacher.id
                )
                .toLowerCase() ===
 
                String(
                    id
                )
                .toLowerCase()
 
        );
 
 
    if (duplicate) {
 
        alert(
            "Teacher ID already exists."
        );
 
        return;
 
    }
 
 
    teachers.push({
 
        id:
            id,
 
        name:
            name,
 
        email:
            email,
 
        department:
            department
 
    });
 
 
    await saveData();
 
 
    displayTeachers();
 
    populateTeacherDropdown();
 
    populateAssignmentTeacherDropdown();
 
    updateDashboard();
 
 
    document
        .getElementById(
            "teacherForm"
        )
        .reset();
 
 
    alert(
        "Teacher added successfully."
    );
 
}
 
 
function displayTeachers() {
 
    const tbody =
        document.getElementById(
            "teacherTableBody"
        );
 
 
    if (!tbody) {
 
        return;
 
    }
 
 
    tbody.innerHTML =
        "";
 
 
    if (
        teachers.length === 0
    ) {
 
        tbody.innerHTML = `
 
            <tr>
 
                <td colspan="5">
 
                    No teachers registered.
 
                </td>
 
            </tr>
 
        `;
 
        return;
 
    }
 
 
    teachers.forEach(
 
        (teacher, index) => {
 
 
            const row =
                document.createElement(
                    "tr"
                );
 
 
            row.innerHTML = `
 
                <td>
                    ${escapeHTML(teacher.id)}
                </td>
 
                <td>
                    ${escapeHTML(teacher.name)}
                </td>
 
                <td>
                    ${escapeHTML(teacher.email || "-")}
                </td>
 
                <td>
                    ${escapeHTML(teacher.department || "-")}
                </td>
 
                <td>
 
                    <button
                        type="button"
                        class="delete-button"
                    >
                        Delete
                    </button>
 
                </td>
 
            `;
 
 
            row
                .querySelector(
                    ".delete-button"
                )
                .addEventListener(
 
                    "click",
 
                    function () {
 
                        deleteTeacher(
                            index
                        );
 
                    }
 
                );
 
 
            tbody.appendChild(
                row
            );
 
        }
 
    );
 
}
 
 
async function deleteTeacher(index) {
 
    const teacher =
        teachers[index];
 
 
    if (!teacher) {
 
        return;
 
    }
 
 
    if (
 
        !confirm(
 
            `Delete teacher "${teacher.name}"?`
 
        )
 
    ) {
 
        return;
 
    }
 
 
    subjects =
        subjects.filter(
 
            subject =>
                String(
                    subject.teacherId
                ) !==
                String(
                    teacher.id
                )
 
        );
 
 
    timetable =
        timetable.filter(
 
            entry =>
                String(
                    entry.teacherId
                ) !==
                String(
                    teacher.id
                )
 
        );
 
 
    teachers.splice(
        index,
        1
    );
 
 
    await saveData();
 
 
    displayTeachers();
 
    displaySubjects();
 
    displayTimetable();
 
    populateTeacherDropdown();
 
    populateAssignmentTeacherDropdown();
 
    populateSubjectDropdown();
 
    updateDashboard();
 
 
    alert(
        "Teacher deleted successfully."
    );
 
}
 
 
/* =========================================================
   TEACHER DROPDOWNS
========================================================= */
 
function populateTeacherDropdown() {
 
    const selects = [
        document.getElementById("subjectTeacher"),
        document.getElementById("customSubjectTeacher")
    ];
 
    selects.forEach(select => {
 
        if (!select) return;
 
        select.innerHTML =
            `<option value="">Select Faculty</option>`;
 
        teachers.forEach(teacher => {
 
            const option = document.createElement("option");
 
            option.value = teacher.id;
 
            option.textContent =
                `${teacher.id} - ${teacher.name}`;
 
            select.appendChild(option);
        });
    });
}
 
 
function populateAssignmentTeacherDropdown() {
 
    const select =
        document.getElementById(
            "assignmentTeacher"
        );
 
 
    if (!select) {
 
        return;
 
    }
 
 
    select.innerHTML =
        `
            <option value="">
                Select Teacher
            </option>
        `;
 
 
    teachers.forEach(
 
        teacher => {
 
            const option =
                document.createElement(
                    "option"
                );
 
 
            option.value =
                teacher.id;
 
 
            option.textContent =
                `${teacher.id} - ${teacher.name}`;
 
 
            select.appendChild(
                option
            );
 
        }
 
    );
 
}
 
 
/* =========================================================
   SUBJECT MANAGEMENT
========================================================= */
 
/*
 * SPPU SUBJECT DATABASE
 *
 * The current SPPU S.E. IT 2024-pattern syllabus is included
 * for Semesters 3 and 4.
 *
 * Semesters 1, 2, 5, 6, 7 and 8 are intentionally kept empty
 * here until their applicable SPPU syllabus/pattern is verified.
 * They can still be added through "Add Custom Subject".
 *
 * For the timetable generator:
 * - Theory weeklyClasses = number of lecture periods/blocks per week.
 * - Laboratory weeklyClasses = number of practical blocks per week.
 */
const SPPU_SUBJECTS = {
 
    
    // =========================================================
    // SECOND YEAR - SEMESTER 3
    // S.E. IT 2024 PATTERN
    // =========================================================
 
    "3": [
 
        {
            code: "PCC-201-ITT",
            shortName: "DSA",
            fullName: "Data Structures & Algorithms",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-202-ITT",
            shortName: "OOP",
            fullName: "Object Oriented Programming",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-203-ITT",
            shortName: "BCN",
            fullName: "Basics of Computer Network",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-204-ITT",
            shortName: "DSA Lab",
            fullName: "Data Structures & Algorithms Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-205-ITT",
            shortName: "OOP Lab",
            fullName: "Object Oriented Programming Lab",
            type: "Laboratory",
            weeklyClasses: 1
        },
 
        {
            code: "OE-I",
            shortName: "OE-I",
            fullName: "Open Elective-I",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "MDM-230-ITT",
            shortName: "DELD",
            fullName: "Digital Electronics and Logic Design",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "EEM-240-ITT",
            shortName: "PME",
            fullName: "Principles of Management & Entrepreneurship",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "VEC-250-ITT",
            shortName: "UHV",
            fullName: "Universal Human Values and Professional Ethics",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "CEF-260-ITT",
            shortName: "CEP",
            fullName: "Community Engagement Project",
            type: "Laboratory",
            weeklyClasses: 2
        }
    ],
 
 
    // =========================================================
    // SECOND YEAR - SEMESTER 4
    // S.E. IT 2024 PATTERN
    // =========================================================
 
    "4": [
 
        {
            code: "PCC-206-ITT",
            shortName: "DBMS",
            fullName: "Database Management System",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-207-ITT",
            shortName: "CG",
            fullName: "Computer Graphics",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-208-ITT",
            shortName: "P&S",
            fullName: "Probability & Statistics",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-209-ITT",
            shortName: "DBMS Lab",
            fullName: "Database Management System Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-210-ITT",
            shortName: "CG Lab",
            fullName: "Computer Graphics Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "OE-II",
            shortName: "OE-II",
            fullName: "Open Elective-II",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "MDM-231-ITT",
            shortName: "Processor Architecture",
            fullName: "Processor Architecture",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "VSE-270-ITT",
            shortName: "DMSM",
            fullName: "Digital Marketing and Social Media",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "AEC-281-ITT",
            shortName: "MIL",
            fullName: "Modern Indian Language (Marathi/Hindi)",
            type: "Theory",
            weeklyClasses: 1
        },
 
        {
            code: "EEM-241-ITT",
            shortName: "E-Commerce",
            fullName: "E-Commerce",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "VEC-251-ITT",
            shortName: "EVS",
            fullName: "Environmental Studies",
            type: "Theory",
            weeklyClasses: 2
        }
    ],
 
 
    // =========================================================
    // THIRD YEAR - SEMESTER 5
    // T.E. IT 2024 PATTERN
    // EFFECTIVE FROM A.Y. 2026-27
    // =========================================================
 
    "5": [
 
        {
            code: "PCC-301-IT",
            shortName: "OS",
            fullName: "Operating System",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-302-IT",
            shortName: "AI & ML",
            fullName: "Artificial Intelligence & Machine Learning",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-303-IT",
            shortName: "TOC",
            fullName: "Theory of Computation",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-304-IT",
            shortName: "OS Lab",
            fullName: "Operating System Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-305-IT",
            shortName: "AI & ML Lab",
            fullName: "Artificial Intelligence & Machine Learning Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PEC-321-IT",
            shortName: "PE-I",
            fullName: "Program Elective-I",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PEC-322-IT",
            shortName: "PE-I Lab",
            fullName: "Program Elective-I Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "MDM-331-IT",
            shortName: "IoT Product",
            fullName: "IoT Based Product Development",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "OLE-341-IT",
            shortName: "OE",
            fullName: "Open Elective",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "ELC-342-IT",
            shortName: "Seminar",
            fullName: "Technical Seminar",
            type: "Laboratory",
            weeklyClasses: 2
        }
    ],
 
 
    // =========================================================
    // THIRD YEAR - SEMESTER 6
    // T.E. IT 2024 PATTERN
    // =========================================================
 
    "6": [
 
        {
            code: "PCC-351-IT",
            shortName: "DSBDA",
            fullName: "Data Science & Big Data Analytics",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PCC-352-IT",
            shortName: "SEPM",
            fullName: "Software Engineering & Project Management",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-353-IT",
            shortName: "DSBDA Lab",
            fullName: "Data Science & Big Data Analytics Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PCC-354-IT",
            shortName: "SEPM Lab",
            fullName: "Software Engineering & Project Management Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "PEC-361-IT",
            shortName: "PE-II",
            fullName: "Program Elective-II",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PEC-362-IT",
            shortName: "PE-III",
            fullName: "Program Elective-III",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "PEC-363-IT",
            shortName: "PE-III Lab",
            fullName: "Program Elective-III Lab",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "MDM-371-IT",
            shortName: "Multimedia",
            fullName: "Multimedia & Animation",
            type: "Theory",
            weeklyClasses: 2
        },
 
        {
            code: "VSE-372-IT",
            shortName: "MERN",
            fullName: "Full Stack Development with MERN",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "ELC-381-IT",
            shortName: "Internship/OJT",
            fullName: "Internship / On Job Training",
            type: "Laboratory",
            weeklyClasses: 4
        }
    ],
 
 
    // =========================================================
    // FOURTH YEAR - SEMESTER 7
    // B.E. IT 2019 PATTERN
    // =========================================================
 
    "7": [
 
        {
            code: "414441",
            shortName: "ISR",
            fullName: "Information and Storage Retrieval",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414442",
            shortName: "SPM",
            fullName: "Software Project Management",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414443",
            shortName: "DL",
            fullName: "Deep Learning",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414444",
            shortName: "E-III (MC)",
            fullName: "Elective III (Mobile Computing)",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414445",
            shortName: "E-IV (DevOps)",
            fullName: "Elective IV",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414446",
            shortName: "LP-III",
            fullName: "Lab Practice III",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "414447",
            shortName: "LP-IV",
            fullName: "Lab Practice IV",
            type: "Laboratory",
            weeklyClasses: 2
        }
 
    ],
 
 
    // =========================================================
    // FOURTH YEAR - SEMESTER 8
    // B.E. IT 2019 PATTERN
    // =========================================================
 
    "8": [
 
        {
            code: "414450",
            shortName: "DS",
            fullName: "Distributed Systems",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414451",
            shortName: "Elective-V",
            fullName: "Elective-V",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414452",
            shortName: "Elective-VI",
            fullName: "Elective-VI",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414453",
            shortName: "S&E",
            fullName: "Startup and Entrepreneurship",
            type: "Theory",
            weeklyClasses: 3
        },
 
        {
            code: "414454",
            shortName: "LP-V",
            fullName: "Lab Practice V",
            type: "Laboratory",
            weeklyClasses: 2
        },
 
        {
            code: "414466",
            shortName: "LP-VI",
            fullName: "Lab Practice VI",
            type: "Laboratory",
            weeklyClasses: 2
        }
    ]
};

/* =========================================================
   PRACTICAL BATCH MANAGEMENT
   Supports batch labels such as A, B, C, D, E.
========================================================= */

function normalizeBatches(value) {
    if (Array.isArray(value)) {
        return value
            .map(item => String(item || "").trim().toUpperCase())
            .filter(Boolean);
    }
    return [];
}

function getSubjectBatches(subject) {
    return normalizeBatches(subject && subject.batches);
}

function renderBatchList(listId, batches) {
    const container = document.getElementById(listId);
    if (!container) return;

    container.innerHTML = "";
    const unique = [...new Set(normalizeBatches(batches))];

    unique.forEach(batch => {
        const chip = document.createElement("span");
        chip.className = "batch-chip";
        chip.innerHTML = `
            <span>Batch ${escapeHTML(batch)}</span>
            <button type="button" class="batch-remove" data-batch="${escapeHTML(batch)}" aria-label="Remove Batch ${escapeHTML(batch)}">×</button>
        `;
        chip.querySelector(".batch-remove").addEventListener("click", function () {
            const target = this.dataset.batch;
            const current = normalizeBatches(container.dataset.batches);
            container.dataset.batches = JSON.stringify(current.filter(item => item !== target));
            renderBatchList(listId, current.filter(item => item !== target));
        });
        container.appendChild(chip);
    });

    container.dataset.batches = JSON.stringify(unique);
}

function getBatchList(listId) {
    const container = document.getElementById(listId);
    if (!container) return [];
    try {
        return normalizeBatches(JSON.parse(container.dataset.batches || "[]"));
    } catch (error) {
        return [];
    }
}

function addBatchToList(selectId, listId) {
    const select = document.getElementById(selectId);
    if (!select || !select.value) return;

    const current = getBatchList(listId);
    const value = String(select.value).trim().toUpperCase();

    if (!current.includes(value)) {
        current.push(value);
        renderBatchList(listId, current);
    }

    select.value = "";
}

function resetBatchList(listId) {
    renderBatchList(listId, []);
}

function setupPracticalBatchVisibility(typeId, containerId) {
    const typeSelect = document.getElementById(typeId);
    const container = document.getElementById(containerId);
    if (!typeSelect || !container) return;

    const update = () => {
        const isLab = String(typeSelect.value || "").toLowerCase().includes("laboratory");
        container.hidden = !isLab;
        if (!isLab) {
            const listId = containerId === "subjectBatchContainer"
                ? "subjectBatchList"
                : "customBatchList";
            resetBatchList(listId);
        }
    };

    typeSelect.addEventListener("change", update);
    update();
}

function populateAssignmentBatchDropdown(subject) {
    const container = document.getElementById("assignmentBatchContainer");
    const select = document.getElementById("assignmentBatch");

    if (!container || !select) return;

    select.innerHTML = "";

    const isLab = subject &&
        String(subject.type || "").toLowerCase().includes("laboratory");

    if (!isLab) {
        container.hidden = true;
        select.innerHTML = `<option value="">No batch</option>`;
        return;
    }

    const batches = getSubjectBatches(subject);

    if (batches.length === 0) {
        container.hidden = true;
        select.innerHTML = `<option value="">No batch configured</option>`;
        return;
    }

    container.hidden = false;

    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Select Batch";
    select.appendChild(first);

    batches.forEach(batch => {
        const option = document.createElement("option");
        option.value = batch;
        option.textContent = `Batch ${batch}`;
        select.appendChild(option);
    });
}

function setupBatchManagement() {
    const subjectAdd = document.getElementById("addSubjectBatchBtn");
    const customAdd = document.getElementById("addCustomBatchBtn");

    if (subjectAdd) {
        subjectAdd.addEventListener("click", () =>
            addBatchToList("subjectBatchSelect", "subjectBatchList")
        );
    }

    if (customAdd) {
        customAdd.addEventListener("click", () =>
            addBatchToList("customBatchSelect", "customBatchList")
        );
    }

    setupPracticalBatchVisibility("subjectType", "subjectBatchContainer");
    setupPracticalBatchVisibility("customSubjectType", "customBatchContainer");

    const assignmentSubject = document.getElementById("assignmentSubject");
    if (assignmentSubject) {
        assignmentSubject.addEventListener("change", () => {
            const subject = subjects.find(item =>
                String(item.id) === String(assignmentSubject.value)
            );
            populateAssignmentBatchDropdown(subject);
        });
    }

    resetBatchList("subjectBatchList");
    resetBatchList("customBatchList");
    populateAssignmentBatchDropdown(null);
}

/* =========================================================
   SUBJECT FORM SETUP
========================================================= */
 
function setupSubjectForm() {
 
    const form = document.getElementById("subjectForm");
    const semesterSelect = document.getElementById("subjectSemester");
    const yearSelect = document.getElementById("subjectYear");
    const subjectSelect = document.getElementById("subjectSelect");
 
    const addCustomButton =
        document.getElementById("addCustomSubjectBtn");
 
    const cancelCustomButton =
        document.getElementById("cancelCustomSubjectBtn");
 
    const customForm =
        document.getElementById("customSubjectForm");
 
    if (!form) return;
 
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        addSubject();
    });
 
    if (semesterSelect) {
        semesterSelect.addEventListener("change", function() {
 
            syncSubjectYearWithSemester(
                "subjectSemester",
                "subjectYear"
            );
 
            populateSPPUSubjectDropdown();
        });
    }
 
    if (yearSelect) {
        yearSelect.addEventListener("change", function() {
            populateSPPUSubjectDropdown();
        });
    }
 
    if (subjectSelect) {
        subjectSelect.addEventListener("change", function() {
            fillSPPUSubjectDetails();
        });
    }
 
    if (addCustomButton) {
        addCustomButton.addEventListener("click", function() {
 
            const container =
                document.getElementById("customSubjectContainer");
 
            if (container) {
                container.hidden = false;
            }
        });
    }
 
    if (cancelCustomButton) {
        cancelCustomButton.addEventListener("click", function() {
 
            const container =
                document.getElementById("customSubjectContainer");
 
            if (container) {
                container.hidden = true;
            }
 
            if (customForm) {
                customForm.reset();
            }
        });
    }
 
    if (customForm) {
        customForm.addEventListener("submit", function(event) {
            event.preventDefault();
            addCustomSubject();
        });
    }
 
    populateSPPUSubjectDropdown();
}
 
 
/* =========================================================
   SEMESTER → YEAR
========================================================= */
 
function syncSubjectYearWithSemester(
    semesterId,
    yearId
) {
 
    const semester =
        document.getElementById(semesterId);
 
    const year =
        document.getElementById(yearId);
 
    if (!semester || !year || !semester.value) {
        return;
    }
 
    const semesterNumber =
        Number(semester.value);
 
    if (semesterNumber <= 2) {
        year.value = "1";
    }
    else if (semesterNumber <= 4) {
        year.value = "2";
    }
    else if (semesterNumber <= 6) {
        year.value = "3";
    }
    else {
        year.value = "4";
    }
}
 
 
/* =========================================================
   SPPU SUBJECT DROPDOWN
========================================================= */
 
function populateSPPUSubjectDropdown() {
 
    const semester =
        document.getElementById("subjectSemester");
 
    const year =
        document.getElementById("subjectYear");
 
    const select =
        document.getElementById("subjectSelect");
 
    const type =
        document.getElementById("subjectType");
 
    const weekly =
        document.getElementById("weeklyClasses");
 
    if (!semester || !year || !select) {
        return;
    }
 
    select.innerHTML =
        `<option value="">Select SPPU Subject</option>`;
 
    select.disabled = true;
 
    if (type) {
        type.innerHTML =
            `<option value="">Automatically selected</option>`;
        type.value = "";
        type.disabled = true;
    }
 
    if (weekly) {
        weekly.value = "";
        weekly.disabled = true;
    }
 
    if (!semester.value) {
        select.innerHTML =
            `<option value="">First select semester</option>`;
        return;
    }
 
    const expectedYear =
        semester.value === "1" || semester.value === "2"
            ? "1"
            : semester.value === "3" || semester.value === "4"
                ? "2"
                : semester.value === "5" || semester.value === "6"
                    ? "3"
                    : "4";
 
    if (year.value !== expectedYear) {
        year.value = expectedYear;
    }
 
    const list =
        SPPU_SUBJECTS[semester.value] || [];
 
    if (list.length === 0) {
 
        select.innerHTML =
            `<option value="">No verified SPPU subjects loaded for this semester</option>`;
 
        return;
    }
 
    list.forEach(subject => {
 
        const option =
            document.createElement("option");
 
        option.value =
            subject.code;
 
        option.textContent =
            `${subject.code} - ${subject.shortName} - ${subject.fullName}`;
 
        select.appendChild(option);
    });
 
    select.disabled = false;
}
 
 
/* =========================================================
   AUTOMATIC SUBJECT DETAILS
========================================================= */
 
function fillSPPUSubjectDetails() {
    const semester = document.getElementById("subjectSemester").value;
    const code = document.getElementById("subjectSelect").value;
    const type = document.getElementById("subjectType");
    const weekly = document.getElementById("weeklyClasses");
    const batchContainer = document.getElementById("subjectBatchContainer");

    if (!code) {
        if (batchContainer) batchContainer.hidden = true;
        resetBatchList("subjectBatchList");
        if (type) {
            type.innerHTML = `<option value="">Automatically selected</option>`;
            type.value = "";
            type.disabled = true;
        }
        if (weekly) {
            weekly.value = "";
            weekly.disabled = true;
        }
        return;
    }

    const subject = (SPPU_SUBJECTS[semester] || [])
        .find(item => item.code === code);

    if (!subject) return;

    if (type) {
        type.innerHTML = `<option value="${escapeHTML(subject.type)}">${escapeHTML(subject.type)}</option>`;
        type.value = subject.type;
        type.disabled = true;
    }

    if (weekly) {
        weekly.value = subject.weeklyClasses;
        weekly.disabled = true;
    }

    // The SPPU subject type is auto-filled and disabled, so its change event
    // does not fire. Explicitly show the batch manager for laboratory subjects.
    const isLabSubject = String(subject.type || "").toLowerCase().includes("laboratory");
    if (batchContainer) batchContainer.hidden = !isLabSubject;
    resetBatchList("subjectBatchList");
}


/* =========================================================
   ADD SPPU SUBJECT
========================================================= */
 
async function addSubject() {
 
    const academicYear =
        document.getElementById("academicYear").value;
 
    const year =
        document.getElementById("subjectYear").value;
 
    const semester =
        document.getElementById("subjectSemester").value;
 
    const code =
        document.getElementById("subjectSelect").value;
 
    const teacherId =
        document.getElementById("subjectTeacher").value;
 
    const subject =
        (SPPU_SUBJECTS[semester] || [])
            .find(item => item.code === code);
 
    if (!academicYear || !year || !semester || !code || !teacherId) {
        alert("Please select Academic Year, Year, Semester, Subject and Faculty.");
        return;
    }
 
    if (!subject) {
        alert("Please select a valid SPPU subject.");
        return;
    }
 
    const duplicate =
        subjects.some(item =>
            String(item.code || "") === String(subject.code) &&
            String(item.academicYear) === String(academicYear) &&
            String(item.year) === String(year) &&
            String(item.semester) === String(semester)
        );
 
    if (duplicate) {
        alert("This subject is already registered for this academic year and semester.");
        return;
    }
 
    subjects.push({
 
        id:
            "SUB-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 7),
 
        code:
            subject.code,
 
        shortName:
            subject.shortName,
 
        fullName:
            subject.fullName,
 
        name:
            subject.shortName,
 
        academicYear:
            academicYear,
 
        year:
            year,
 
        semester:
            semester,
 
        type:
            subject.type,
 
        teacherId:
            teacherId,
 
        weeklyClasses:
            Number(subject.weeklyClasses),

        batches:
            String(subject.type || "").toLowerCase().includes("laboratory")
                ? getBatchList("subjectBatchList")
                : [],

        source:
            "SPPU"
    });
 
    await saveData();
 
    displaySubjects();
    displayTimetable();
    populateSubjectDropdown();
    populateLabSubjectDropdown();
    updateDashboard();
 
    document.getElementById("subjectForm").reset();
 
    document.getElementById("subjectSelect").innerHTML =
        `<option value="">First select semester</option>`;
 
    document.getElementById("subjectSelect").disabled = true;
 
    document.getElementById("subjectType").innerHTML =
        `<option value="">Automatically selected</option>`;
 
    document.getElementById("subjectType").value = "";
    document.getElementById("subjectType").disabled = true;
 
    document.getElementById("weeklyClasses").value = "";
    document.getElementById("weeklyClasses").disabled = true;
 
    alert("SPPU subject added successfully.");
}
 
 
/* =========================================================
   ADD CUSTOM SUBJECT
========================================================= */
 
async function addCustomSubject() {
 
    const shortName =
        document.getElementById("customSubjectShortName")
            .value.trim().toUpperCase();
 
    const fullName =
        document.getElementById("customSubjectFullName")
            .value.trim();
 
    const academicYear =
        document.getElementById("customAcademicYear").value;
 
    const year =
        document.getElementById("customSubjectYear").value;
 
    const semester =
        document.getElementById("customSubjectSemester").value;
 
    const type =
        document.getElementById("customSubjectType").value;
 
    const teacherId =
        document.getElementById("customSubjectTeacher").value;
 
    const weeklyClasses =
        Number(
            document.getElementById("customWeeklyClasses").value
        );
 
    if (
        !shortName ||
        !fullName ||
        !academicYear ||
        !year ||
        !semester ||
        !type ||
        !teacherId
    ) {
        alert("Please fill all required custom subject details.");
        return;
    }
 
    if (
        !Number.isInteger(weeklyClasses) ||
        weeklyClasses < 1
    ) {
        alert("Lectures / Week must be at least 1.");
        return;
    }
 
    const duplicate =
        subjects.some(item =>
            String(item.shortName || item.name || "")
                .trim()
                .toUpperCase() === shortName &&
            String(item.academicYear) === String(academicYear) &&
            String(item.year) === String(year) &&
            String(item.semester) === String(semester)
        );
 
    if (duplicate) {
        alert("This subject is already registered for this academic year and semester.");
        return;
    }
 
    subjects.push({
 
        id:
            "CUSTOM-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 7),
 
        code:
            "CUSTOM-" + Date.now(),
 
        shortName:
            shortName,
 
        fullName:
            fullName,
 
        name:
            shortName,
 
        academicYear:
            academicYear,
 
        year:
            year,
 
        semester:
            semester,
 
        type:
            type,
 
        teacherId:
            teacherId,
 
        weeklyClasses:
            weeklyClasses,

        batches:
            String(type || "").toLowerCase().includes("laboratory")
                ? getBatchList("customBatchList")
                : [],

        source:
            "Custom"
    });
 
    await saveData();
 
    displaySubjects();
    displayTimetable();
    populateSubjectDropdown();
    updateDashboard();
 
    document.getElementById("customSubjectForm").reset();
 
    document.getElementById("customSubjectContainer").hidden = true;
 
    alert("Custom subject added successfully.");
}
 
 
/* =========================================================
   BULK PRACTICAL BATCH ASSIGNMENT
========================================================= */

function getLaboratorySubjects() {
    return subjects.filter(subject => String(subject.type || "").toLowerCase().includes("laboratory"));
}

function renderBulkBatchSubjects() {
    const container = document.getElementById("bulkBatchSubjects");
    if (!container) return;
    const labs = getLaboratorySubjects();
    container.innerHTML = "";
    if (labs.length === 0) {
        container.innerHTML = `<p class="empty-bulk-batch">No laboratory subjects registered yet.</p>`;
        return;
    }
    labs.forEach(subject => {
        const id = String(subject.id);
        const batches = getSubjectBatches(subject);
        const label = document.createElement("label");
        label.className = "bulk-subject-option";
        label.innerHTML = `
            <input type="checkbox" class="bulk-subject-checkbox" value="${escapeHTML(id)}">
            <span>
                <strong>${escapeHTML(subject.shortName || subject.name || subject.code || "Laboratory")}</strong>
                <small>${escapeHTML(subject.fullName || "")} · Year ${escapeHTML(subject.year || "-")} · Sem ${escapeHTML(subject.semester || "-")}</small>
                <span class="bulk-existing-batches">
                    ${batches.length ? batches.map(b => `<span>Batch ${escapeHTML(b)}</span>`).join("") : `<span>No batches yet</span>`}
                </span>
            </span>
        `;
        container.appendChild(label);
    });
}

async function addBatchesToSelectedSubjects() {
    const selectedSubjectIds = [...document.querySelectorAll(".bulk-subject-checkbox:checked")].map(input => String(input.value));
    const selectedBatches = [...document.querySelectorAll(".bulk-batch-option:checked")].map(input => String(input.value).trim().toUpperCase());
    const message = document.getElementById("bulkBatchMessage");
    if (selectedSubjectIds.length === 0) { if (message) message.textContent = "Please select at least one practical subject."; return; }
    if (selectedBatches.length === 0) { if (message) message.textContent = "Please select at least one batch."; return; }
    let changed = 0;
    subjects.forEach(subject => {
        if (!selectedSubjectIds.includes(String(subject.id))) return;
        const existing = getSubjectBatches(subject);
        const merged = [...new Set([...existing, ...selectedBatches])];
        if (merged.length !== existing.length) { subject.batches = merged; changed++; }
    });
    await saveData();
    displaySubjects(); displayTimetable(); populateSubjectDropdown(); populateLabSubjectDropdown(); updateDashboard(); renderBulkBatchSubjects();
    document.querySelectorAll(".bulk-batch-option").forEach(input => input.checked = false);
    document.querySelectorAll(".bulk-subject-checkbox").forEach(input => input.checked = false);
    if (message) message.textContent = changed > 0 ? `Successfully added Batch ${selectedBatches.join(", Batch ")} to ${changed} subject(s).` : "The selected batches are already assigned to all selected subjects.";
}

function setupBulkBatchAssignment() {
    const addButton = document.getElementById("addBulkBatchesBtn");
    const selectAllButton = document.getElementById("bulkSelectAllSubjectsBtn");
    const clearButton = document.getElementById("bulkClearSubjectsBtn");
    if (addButton) addButton.addEventListener("click", addBatchesToSelectedSubjects);
    if (selectAllButton) selectAllButton.addEventListener("click", () => document.querySelectorAll(".bulk-subject-checkbox").forEach(input => input.checked = true));
    if (clearButton) clearButton.addEventListener("click", () => { document.querySelectorAll(".bulk-subject-checkbox").forEach(input => input.checked = false); const message = document.getElementById("bulkBatchMessage"); if (message) message.textContent = ""; });
    renderBulkBatchSubjects();
}

/* =========================================================
   DISPLAY SUBJECTS
========================================================= */
 
function displaySubjects() {

    renderBulkBatchSubjects();
 
    const tbody =
        document.getElementById("subjectTableBody");
 
    if (!tbody) {
        return;
    }
 
    tbody.innerHTML = "";
 
    if (subjects.length === 0) {
 
        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    No subjects registered.
                </td>
            </tr>
        `;
 
        return;
    }
 
    subjects.forEach((subject, index) => {
 
        const teacher =
            teachers.find(
                item =>
                    String(item.id) ===
                    String(subject.teacherId)
            );
 
        const row =
            document.createElement("tr");
 
        const displayName =
            subject.shortName ||
            subject.name ||
            "-";
 
        const fullName =
            subject.fullName &&
            subject.fullName !== displayName
                ? `<br><small>${escapeHTML(subject.fullName)}</small>`
                : "";
 
        row.innerHTML = `
            <td>
                ${escapeHTML(displayName)}
                ${fullName}
            </td>
 
            <td>
                ${escapeHTML(subject.academicYear || "-")}
            </td>
 
            <td>
                Year ${escapeHTML(subject.year || "-")}
            </td>
 
            <td>
                Semester ${escapeHTML(subject.semester || "-")}
            </td>
 
            <td>
                ${escapeHTML(subject.type || "-")}
            </td>
 
            <td>
                ${
                    teacher
                        ? escapeHTML(teacher.name)
                        : "Teacher Not Found"
                }
            </td>
 
            <td>
                ${subject.weeklyClasses || "-"}
            </td>

            <td>
                ${getSubjectBatches(subject).length ? getSubjectBatches(subject).map(batch => `<span class="table-batch-badge">Batch ${escapeHTML(batch)}</span>`).join("") : "-"}
            </td>
 
            <td>
                ${escapeHTML(subject.source || "Custom")}
            </td>
 
            <td>
 
                <button
                    type="button"
                    class="edit-subject-button">
                    Edit
                </button>
 
                <button
                    type="button"
                    class="delete-button">
                    Delete
                </button>
 
            </td>
        `;
 
        row.querySelector(".edit-subject-button")
            .addEventListener("click", function() {
                editSubjectHours(index);
            });
 
        row.querySelector(".delete-button")
            .addEventListener("click", function() {
                deleteSubject(index);
            });
 
        tbody.appendChild(row);
    }
    );
}
 
async function editSubjectHours(index) {
 
    const subject = subjects[index];
 
    if (!subject) {
        return;
    }
 
    const newAcademicYear =
        prompt(
            "Enter Academic Year:",
            subject.academicYear || ""
        );
 
    if (newAcademicYear === null) {
        return;
    }
 
    const newYear =
        prompt(
            "Enter Year:",
            subject.year || ""
        );
 
    if (newYear === null) {
        return;
    }
 
    const newSemester =
        prompt(
            "Enter Semester:",
            subject.semester || ""
        );
 
    if (newSemester === null) {
        return;
    }
 
    const newHours =
        prompt(
            `Enter hours/lectures per week for ${
                subject.shortName || subject.name
            }:`,
            subject.weeklyClasses || 1
        );
 
    if (newHours === null) {
        return;
    }
 
    const hours =
        Number(newHours);
 
    if (
        !newAcademicYear.trim() ||
        !newYear.trim() ||
        !newSemester.trim()
    ) {
        alert(
            "Academic Year, Year and Semester cannot be empty."
        );
 
        return;
    }
 
    if (
        !Number.isInteger(hours) ||
        hours <= 0
    ) {
        alert(
            "Please enter a valid positive whole number for hours/lectures."
        );
 
        return;
    }
 
    const newTeacherId =
        prompt(
            "Enter Faculty ID:\n\n" +
            teachers
                .map(
                    teacher =>
                        `${teacher.id} - ${teacher.name}`
                )
                .join("\n"),
            subject.teacherId || ""
        );
 
    if (newTeacherId === null) {
        return;
    }
 
    const teacherExists =
        teachers.some(
            teacher =>
                String(teacher.id) ===
                String(newTeacherId.trim())
        );
 
    if (!teacherExists) {
        alert(
            "Invalid Faculty ID. Please enter an existing Faculty ID."
        );
 
        return;
    }
 
    subject.academicYear =
        newAcademicYear.trim();
 
    subject.year =
        newYear.trim();
 
    subject.semester =
        newSemester.trim();
 
    subject.weeklyClasses =
        hours;
 
    subject.teacherId =
        newTeacherId.trim();
 
    await saveData();
 
    displaySubjects();
 
    displayTimetable();
 
    populateSubjectDropdown();
 
    updateDashboard();
 
    alert(
        "Subject details updated successfully."
    );
}
/* =========================================================
   DELETE SUBJECT
========================================================= */
 
async function deleteSubject(index) {
 
    const subject =
        subjects[index];
 
    if (!subject) {
        return;
    }
 
    if (
        !confirm(
            `Delete subject "${subject.name || subject.shortName}"?`
        )
    ) {
        return;
    }
 
    subjects.splice(index, 1);
 
    timetable =
        timetable.filter(
            entry =>
                String(entry.subjectId) !==
                String(subject.id)
        );
 
    await saveData();
 
    displaySubjects();
    displayTimetable();
    populateSubjectDropdown();
    updateDashboard();
 
    alert("Subject deleted successfully.");
}
 
 
/* =========================================================
   SUBJECT DROPDOWN
========================================================= */
 
function populateSubjectDropdown() {
 
    const select =
        document.getElementById(
            "assignmentSubject"
        );
 
 
    const yearElement =
        document.getElementById(
            "assignmentYear"
        );
 
 
    const semesterElement =
        document.getElementById(
            "assignmentSemester"
        );
 
 
    if (
 
        !select ||
 
        !yearElement ||
 
        !semesterElement
 
    ) {
 
        return;
 
    }
 
 
    const year =
        yearElement.value;
 
 
    const semester =
        semesterElement.value;
 
 
    select.innerHTML =
        `
            <option value="">
                Select Subject
            </option>
        `;
 
 
    if (
        !year ||
        !semester
    ) {
 
        return;
 
    }
 
 
    const filteredSubjects =
        subjects.filter(
 
            subject =>
 
                String(
                    subject.year
                ) ===
                String(
                    year
                ) &&
 
                String(
                    subject.semester
                ) ===
                String(
                    semester
                )
 
        );
 
 
    if (
        filteredSubjects.length === 0
    ) {
 
        select.innerHTML =
            `
                <option value="">
                    No subjects available for this semester
                </option>
            `;
 
        return;
 
    }
 
 
    filteredSubjects.forEach(
 
        subject => {
 
            const option =
                document.createElement(
                    "option"
                );
 
 
            option.value =
                subject.id;
 
 
            option.textContent =
                subject.name;
 
 
            select.appendChild(
                option
            );
 
        }
 
    );
 
}
 
 
/* =========================================================
   ROOM MANAGEMENT
========================================================= */
 
function setupRoomForm() {
 
    const form =
        document.getElementById("roomForm");
 
    if (!form) {
        return;
    }
 
    form.addEventListener(
        "submit",
        function (event) {
 
            event.preventDefault();
 
            saveRoom();
 
        }
    );
 
    const cancelButton =
        document.getElementById(
            "cancelRoomEditButton"
        );
 
    if (cancelButton) {
 
        cancelButton.addEventListener(
            "click",
            function () {
 
                cancelRoomEdit();
 
            }
        );
 
    }
 
}
 
let editingRoomId = null;
 
 
function editRoom(roomId) {
 
    const room =
        rooms.find(
            item =>
                String(item.id) ===
                String(roomId)
        );
 
    if (!room) {
        return;
    }
 
    editingRoomId = room.id;
 
    document.getElementById(
        "roomNumber"
    ).value = room.number;
 
    document.getElementById(
        "roomType"
    ).value = room.type;
 
    document.getElementById(
        "roomCapacity"
    ).value = room.capacity;
 
 
    const labSubjectsElement =
        document.getElementById(
            "labSubjects"
        );
 
    if (labSubjectsElement) {
 
        Array.from(
            labSubjectsElement.options
        ).forEach(
            option => {
 
                option.selected =
                    Array.isArray(
                        room.labSubjects
                    ) &&
                    room.labSubjects.some(
                        subjectId =>
                            String(subjectId) ===
                            String(option.value)
                    );
 
            }
        );
 
    }
 
 
    document.getElementById(
        "roomType"
    ).disabled = true;
 
 
    const submitButton =
        document.getElementById(
            "roomSubmitButton"
        );
 
    if (submitButton) {
 
        submitButton.textContent =
            "Update Room";
 
    }
 
 
    const cancelButton =
        document.getElementById(
            "cancelRoomEditButton"
        );
 
    if (cancelButton) {
 
        cancelButton.style.display =
            "inline-block";
 
    }
 
 
    const labContainer =
        document.getElementById(
            "labSubjectsContainer"
        );
 
    if (labContainer) {
 
        labContainer.style.display =
            room.type === "Laboratory"
                ? "block"
                : "none";
 
    }
 
}
 
 
function cancelRoomEdit() {
 
    editingRoomId = null;
 
    const form =
        document.getElementById(
            "roomForm"
        );
 
    if (form) {
        form.reset();
    }
 
 
    const roomType =
        document.getElementById(
            "roomType"
        );
 
    if (roomType) {
 
        roomType.disabled = false;
 
    }
 
 
    const submitButton =
        document.getElementById(
            "roomSubmitButton"
        );
 
    if (submitButton) {
 
        submitButton.textContent =
            "Add Room";
 
    }
 
 
    const cancelButton =
        document.getElementById(
            "cancelRoomEditButton"
        );
 
    if (cancelButton) {
 
        cancelButton.style.display =
            "none";
 
    }
 
 
    const labContainer =
        document.getElementById(
            "labSubjectsContainer"
        );
 
    if (labContainer) {
 
        labContainer.style.display =
            "none";
 
    }
 
}
 
 
async function saveRoom() {
 
    if (editingRoomId) {
 
        await updateRoom();
 
    } else {
 
        await addRoom();
 
    }
 
}
 
 
async function updateRoom() {
 
    const room =
        rooms.find(
            item =>
                String(item.id) ===
                String(editingRoomId)
        );
 
    if (!room) {
        return;
    }
 
 
    const number =
        document.getElementById(
            "roomNumber"
        ).value.trim();
 
    const capacity =
        Number(
            document.getElementById(
                "roomCapacity"
            ).value
        );
 
 
    if (!number || !capacity) {
 
        alert(
            "Please enter room number and capacity."
        );
 
        return;
 
    }
 
 
    const duplicateRoom =
        rooms.some(
            item =>
 
                String(item.id) !==
                String(room.id)
 
                &&
 
                String(item.number)
                    .toLowerCase() ===
                String(number)
                    .toLowerCase()
        );
 
 
    if (duplicateRoom) {
 
        alert(
            "Another classroom or laboratory already has this room number."
        );
 
        return;
 
    }
 
 
    let labSubjects = [];
 
 
    if (
        String(room.type)
            .toLowerCase()
            .includes("laboratory")
    ) {
 
        const labSubjectsElement =
            document.getElementById(
                "labSubjects"
            );
 
        if (labSubjectsElement) {
 
            labSubjects =
                Array.from(
                    labSubjectsElement.selectedOptions
                ).map(
                    option =>
                        option.value
                );
 
        }
 
 
        if (labSubjects.length === 0) {
 
            alert(
                "Please select at least one practical subject that this laboratory can conduct."
            );
 
            return;
 
        }
 
    }
 
 
    room.number =
        number;
 
    room.capacity =
        capacity;
 
    room.labSubjects =
        labSubjects;
 
 
    await saveData();
 
 
    displayRooms();
 
    populateRoomDropdown();
 
    updateDashboard();
 
    cancelRoomEdit();
 
 
    alert(
        "Classroom/Laboratory updated successfully."
    );
 
}
 
 
async function addRoom() {
 
const number =
    document.getElementById("roomNumber").value.trim();
 
const type =
    document.getElementById("roomType").value;
 
const capacity =
    Number(
        document.getElementById("roomCapacity").value
    );
 
if (!number || !type || !capacity) {
 
    alert(
        "Please enter room number, type and capacity."
    );
 
    return;
}
 
const duplicateRoom =
    rooms.some(
        room =>
            String(room.number)
                .toLowerCase() ===
            String(number)
                .toLowerCase()
    );
 
if (duplicateRoom) {
 
    alert(
        "This classroom or laboratory is already registered."
    );
 
    return;
}
 
const labSubjectsElement =
    document.getElementById("labSubjects");
 
const labSubjects =
    type === "Laboratory" &&
    labSubjectsElement
        ? Array.from(
            labSubjectsElement.selectedOptions
        ).map(option => option.value)
        : [];
 
if (
    type === "Laboratory" &&
    labSubjects.length === 0
) {
 
    alert(
        "Please select at least one practical subject that this laboratory can conduct."
    );
 
    return;
}
 
rooms.push({
 
    id:
        "ROOM-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7),
 
    number:
        number,
 
    type:
        type,
 
    capacity:
        capacity,
 
    subjectId:
        null,
 
    labSubjects:
        labSubjects
 
});
 
await saveData();
 
displayRooms();
 
populateRoomDropdown();
 
updateDashboard();
 
document
    .getElementById("roomForm")
    .reset();
 
alert(
    "Classroom/Laboratory registered successfully."
);
 
 
}
 
function displayRooms() {
 
    const tbody =
        document.getElementById(
            "roomTableBody"
        );
 
 
    if (!tbody) {
 
        return;
 
    }
 
 
    tbody.innerHTML =
        "";
 
 
    if (
        rooms.length === 0
    ) {
 
        tbody.innerHTML = `
 
            <tr>
 
                <td colspan="5">
 
                    No classrooms or laboratories registered.
 
                </td>
 
            </tr>
 
        `;
 
        return;
 
    }
 
 
    rooms.forEach(
 
        (room, index) => {
 
 
            const subject =
                subjects.find(
 
                    subject =>
                        String(
                            subject.id
                        ) ===
                        String(
                            room.subjectId
                        )
 
                );
 
 
            const row =
                document.createElement(
                    "tr"
                );
 
 
            row.innerHTML = `
 
                <td>
                    ${escapeHTML(room.number)}
                </td>
 
                <td>
                    ${escapeHTML(room.type)}
                </td>
 
                <td>
                    ${room.capacity}
                </td>
 
                <td>
                    ${
                        Array.isArray(room.labSubjects) &&
                        room.labSubjects.length > 0
 
                            ?
 
                            room.labSubjects
                                .map(
                                    subjectId => {
 
                                        const labSubject =
                                            subjects.find(
                                                subject =>
                                                    String(
                                                        subject.id
                                                    ) ===
                                                    String(
                                                        subjectId
                                                    )
                                            );
 
                                        return labSubject
                                            ? escapeHTML(
                                                labSubject.shortName ||
                                                labSubject.name ||
                                                labSubject.code
                                            )
                                            : "";
                                    }
                                )
                                .filter(Boolean)
                                .join(", ")
 
                            :
 
                            (
                                String(room.type)
                                    .toLowerCase()
                                    .includes("laboratory")
 
                                    ?
 
                                    "No practicals selected"
 
                                    :
 
                                    "—"
                            )
                    }
                </td>
 
                <td>
 
                    <button
                        type="button"
                        class="edit-button"
                    >
                        Edit
                    </button>
 
                    <button
                        type="button"
                        class="delete-button"
                    >
                        Delete
                    </button>
 
                </td>
 
            `;
 
 
            row
                .querySelector(
                    ".edit-button"
                )
                .addEventListener(
 
                    "click",
 
                    function () {
 
                        editRoom(
                            room.id
                        );
 
                    }
 
                );
 
 
            row
                .querySelector(
                    ".delete-button"
                )
                .addEventListener(
 
                    "click",
 
                    function () {
 
                        deleteRoom(
                            index
                        );
 
                    }
 
                );
            
 
            tbody.appendChild(
                row
            );
 
        }
 
    );
 
}
 
 
async function deleteRoom(index) {
 
    const room =
        rooms[index];
 
 
    if (!room) {
 
        return;
 
    }
 
 
    const used =
    timetable.some(
        item =>
            String(item.roomId) ===
            String(room.id)
    );
 
    if (used) {
 
    const confirmDelete = confirm(
        `"${room.number}" is currently used in the timetable.\n\n` +
        "Deleting this room will also remove the timetable entries using this room.\n\n" +
        "Do you want to continue?"
    );
 
    if (!confirmDelete) {
        return;
    }
 
    timetable = timetable.filter(
        item =>
            String(item.roomId) !==
            String(room.id)
    );
}
 
 
    if (
 
        !confirm(
 
            `Delete "${room.number}"?`
 
        )
 
    ) {
 
        return;
 
    }
 
 
    rooms.splice(
        index,
        1
    );
 
 
    await saveData();
 
 
    displayRooms();
 
    populateRoomDropdown();
 
    updateDashboard();
 
 
    alert(
        "Room deleted successfully."
    );
 
}
 
 
 
 
/* =========================================================
   ASSIGNMENT ROOM DROPDOWN
========================================================= */
 
function populateRoomDropdown() {
 
    const select =
        document.getElementById(
            "assignmentRoom"
        );
 
 
    const subjectSelect =
        document.getElementById(
            "assignmentSubject"
        );
 
 
    if (
 
        !select ||
 
        !subjectSelect
 
    ) {
 
        return;
 
    }
 
 
    const subjectId =
        subjectSelect.value;
 
 
    select.innerHTML =
        `
            <option value="">
                Select Room
            </option>
        `;
 
 
    if (!subjectId) {
 
        return;
 
    }
 
 
    const availableRooms =
        rooms.filter(
 
            room =>
                String(
                    room.subjectId
                ) ===
                String(
                    subjectId
                )
 
        );
 
 
    if (
        availableRooms.length === 0
    ) {
 
        select.innerHTML =
            `
                <option value="">
                    No room assigned to this subject
                </option>
            `;
 
        return;
 
    }
 
 
    availableRooms.forEach(
 
        room => {
 
            const option =
                document.createElement(
                    "option"
                );
 
 
            option.value =
                room.id;
 
 
            option.textContent =
                `${room.number} (${room.type})`;
 
 
            select.appendChild(
                option
            );
 
        }
 
    );
 
 
    select.value =
        availableRooms[0].id;
 
}
 
 
function populateLabSubjectsDropdown() {
 
    const select =
        document.getElementById("labSubjects");
 
    if (!select) {
        return;
    }
 
    select.innerHTML = "";
 
    const laboratorySubjects =
        subjects.filter(subject =>
            String(subject.type)
                .toLowerCase()
                .includes("laboratory")
        );
 
    if (laboratorySubjects.length === 0) {
 
        select.innerHTML = `
            <option value="">
                No laboratory practicals registered
            </option>
        `;
 
        return;
    }
 
    laboratorySubjects.forEach(subject => {
 
        const option =
            document.createElement("option");
 
        option.value = subject.id;
 
        option.textContent =
            subject.shortName ||
            subject.name ||
            subject.code;
 
        select.appendChild(option);
    });
}
 
 
function setupRoomTypeEvent() {
 
    const roomType =
        document.getElementById("roomType");
 
    const labSubjectsContainer =
        document.getElementById(
            "labSubjectsContainer"
        );
 
    if (!roomType || !labSubjectsContainer) {
        return;
    }
 
    roomType.addEventListener("change", function() {
 
        if (roomType.value === "Laboratory") {
 
            labSubjectsContainer.style.display =
                "block";
 
            populateLabSubjectsDropdown();
 
        } else {
 
            labSubjectsContainer.style.display =
                "none";
 
            const labSubjects =
                document.getElementById("labSubjects");
 
            if (labSubjects) {
                labSubjects.value = "";
            }
 
        }
 
    });
}
 
 
/* =========================================================
   MANUAL ASSIGNMENT
========================================================= */
 
function setupAssignmentForm() {
 
    const form =
        document.getElementById(
            "assignmentForm"
        );
 
 
    if (!form) {
 
        return;
 
    }
 
 
    form.addEventListener(
 
        "submit",
 
        function (event) {
 
            event.preventDefault();
 
            addManualAssignment();
 
        }
 
    );
 
}
 
 
async function addManualAssignment() {
 
    const year =
        getElementValue(
            "assignmentYear"
        );
 
 
    const semester =
        getElementValue(
            "assignmentSemester"
        );
 
 
    const day =
        getElementValue(
            "assignmentDay"
        );
 
 
    const time =
        getElementValue(
            "assignmentTime"
        );
 
 
    const subjectId =
        getElementValue(
            "assignmentSubject"
        );
 
 
    const teacherId =
        getElementValue(
            "assignmentTeacher"
        );
 
 
    const roomId =
        getElementValue(
            "assignmentRoom"
        );

    const selectedBatch = getElementValue("assignmentBatch");
 
 
    if (
 
        !year ||
 
        !semester ||
 
        !day ||
 
        !time ||
 
        !subjectId ||
 
        !teacherId ||
 
        !roomId
 
    ) {
 
        showConflictMessage(
            "Please fill all assignment details."
        );
 
        return;
 
    }
 
 
    const subject =
        subjects.find(
 
            subject =>
                String(
                    subject.id
                ) ===
                String(
                    subjectId
                )
 
        );
 
 
    if (!subject) {
 
        showConflictMessage(
            "Please select a valid subject."
        );
 
        return;
 
    }
 
 
    if (
 
        String(
            subject.year
        ) !==
        String(
            year
        ) ||
 
        String(
            subject.semester
        ) !==
        String(
            semester
        )
 
    ) {
 
        showConflictMessage(
            "Please select a subject belonging to the selected year and semester."
        );
 
        return;
 
    }
 
 
    const isLaboratory =
        String(subject.type || "").toLowerCase().includes("laboratory");
    const subjectBatches = getSubjectBatches(subject);

    if (isLaboratory && subjectBatches.length > 0 && !subjectBatches.includes(selectedBatch)) {
        showConflictMessage("Please select a valid practical batch.");
        return;
    }

    const batch =
        isLaboratory
            ? (selectedBatch || subjectBatches[0] || "")
            : "";

    const duration =
        getTimeDuration(
            time
        );
 
 
    if (
 
        duration !==
        getSubjectDuration(
            subject
        )
 
    ) {
 
        showConflictMessage(
 
            subject.type ===
            "Laboratory"
 
                ?
 
                "A practical must occupy exactly 2 hours."
 
                :
 
                "A lecture must occupy exactly 1 hour."
 
        );
 
        return;
 
    }
 
 
    const conflict =
        checkConflict(
 
            {
 
                year,
 
                semester,
 
                day,
 
                time,
 
                teacherId,
 
                roomId}
 
        );
 
 
    if (conflict) {
 
        showConflictMessage(
            conflict
        );
 
        return;
 
    }
 
 
    addAssignmentEntry(
        subject, year, semester, day, time, teacherId, roomId, batch
    );
 
 
    await saveData();
 
 
    displayTimetable();
 
    updateDashboard();
  
 
    document
        .getElementById(
            "assignmentForm"
        )
        .reset();
 
 
    populateAssignmentTimeDropdown(
        null
    );
 
 
    showConflictMessage(
 
        "Class assigned successfully.",
 
        true
 
    );
 
}
 
 
/* =========================================================
   TIME HELPERS
========================================================= */
 
function timeToMinutes(value) {
 
    const parts =
        value
            .split(":")
            .map(Number);
 
 
    return (
        parts[0] * 60
    ) +
    parts[1];
 
}
 
 
function getTimeDuration(time) {
 
    const parts =
        time.split(
            "-"
        );
 
 
    return (
 
        timeToMinutes(
            parts[1]
        )
 
        -
 
        timeToMinutes(
            parts[0]
        )
 
    );
 
}
 
 
function timeRangeOverlaps(
 
    timeA,
 
    timeB
 
) {
 
    const [aStart, aEnd] =
        timeA
            .split("-")
            .map(
                timeToMinutes
            );
 
 
    const [bStart, bEnd] =
        timeB
            .split("-")
            .map(
                timeToMinutes
            );
 
 
    return (
 
        aStart < bEnd &&
 
        bStart < aEnd
 
    );
 
}
 
 
function getSubjectDuration(subject) {
 
    if (
 
        subject &&
        subject.type ===
        "Laboratory"
 
    ) {
 
        return 120;
 
    }
 
 
    return 60;
 
}
 
 
function getAvailableWindows(subject) {
 
    if (
 
        subject &&
        subject.type ===
        "Laboratory"
 
    ) {
 
        return PRACTICAL_WINDOWS;
 
    }
 
 
    return LECTURE_WINDOWS;
 
}
 
 
/* =========================================================
   ASSIGNMENT TIME DROPDOWN
========================================================= */
 
function populateAssignmentTimeDropdown(
    subject
) {
 
    const select =
        document.getElementById(
            "assignmentTime"
        );
 
 
    if (!select) {
 
        return;
 
    }
 
 
    select.innerHTML =
        "";
 
 
    const firstOption =
        document.createElement(
            "option"
        );
 
 
    firstOption.value =
        "";
 
 
    if (!subject) {
 
        firstOption.textContent =
            "Select a subject first";
 
    }
 
    else if (
 
        subject.type ===
        "Laboratory"
 
    ) {
 
        firstOption.textContent =
            "Select 2-hour practical time";
 
    }
 
    else {
 
        firstOption.textContent =
            "Select 1-hour lecture time";
 
    }
 
 
    select.appendChild(
        firstOption
    );
 
 
    if (!subject) {
 
        return;
 
    }
 
 
    getAvailableWindows(
        subject
    )
    .forEach(
 
        window => {
 
            const option =
                document.createElement(
                    "option"
                );
 
 
            option.value =
                `${window.start}-${window.end}`;
 
 
            option.textContent =
                window.label;
 
 
            select.appendChild(
                option
            );
 
        }
 
    );
 
}
 
 
function setupAssignmentTimeBySubject() {
 
    const select =
        document.getElementById(
            "assignmentSubject"
        );
 
 
    if (!select) {
 
        return;
 
    }
 
 
    select.addEventListener(
 
        "change",
 
        function () {
 
            const subject =
                subjects.find(
 
                    subject =>
                        String(
                            subject.id
                        ) ===
                        String(
                            this.value
                        )
 
                );
 
 
            populateAssignmentTimeDropdown(
                subject
            );
 
 
            populateRoomDropdown();
 
        }
 
    );
 
 
    populateAssignmentTimeDropdown(
        null
    );
 
}
 
 
/* =========================================================
   CONFLICT DETECTION
========================================================= */
 
 
function checkConflict(newEntry) {
    const selectedRoom = rooms.find(room => String(room.id) === String(newEntry.roomId));
    const newSubject = subjects.find(subject => String(subject.id) === String(newEntry.subjectId));
    const newIsLab = newSubject && String(newSubject.type).toLowerCase().includes("laboratory");
 
    for (const entry of timetable) {
        if (String(entry.day) !== String(newEntry.day) || !timeRangeOverlaps(entry.time, newEntry.time)) continue;
 
        const existingSubject = subjects.find(subject => String(subject.id) === String(entry.subjectId));
        const existingIsLab = existingSubject && String(existingSubject.type).toLowerCase().includes("laboratory");
        const existingRoom = rooms.find(room => String(room.id) === String(entry.roomId));
 
        if (selectedRoom && existingRoom && String(selectedRoom.number).trim().toLowerCase() === String(existingRoom.number).trim().toLowerCase()) {
            return "This room/laboratory is already occupied at this time.";
        }
        if (String(entry.teacherId) === String(newEntry.teacherId)) {
            return "Teacher is already assigned at this time.";
        }
        if (String(entry.year) === String(newEntry.year) && String(entry.semester) === String(newEntry.semester)) {
            const existingBatch = String(entry.batch || "").trim().toUpperCase();
            const newBatch = String(newEntry.batch || "").trim().toUpperCase();

            // Different practical batches can run in parallel, matching the
            // college timetable format. Theory/no-batch classes still block
            // the complete semester group.
            const bothAreBatched =
                newIsLab &&
                existingIsLab &&
                existingBatch &&
                newBatch;

            if (!bothAreBatched || existingBatch === newBatch) {
                return "This semester already has a class at this time.";
            }
        }
    }
    return null;
}
 
 
/* =========================================================
   ADD TIMETABLE ENTRY
========================================================= */
 
function addAssignmentEntry(subject, year, semester, day, time, teacherId, roomId, batch = "") {
    timetable.push({
        id: "TT-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9),
        year: String(year),
        semester: String(semester),
        day, time,
        subjectId: subject.id,
        teacherId,
        roomId,
        batch: String(batch || "").trim().toUpperCase()
    });
}
 
function getSuitableRooms(subject) {
 
    if (!subject) {
        return [];
    }
 
    const isLab =
        String(subject.type)
            .toLowerCase()
            .includes("laboratory");
 
    if (isLab) {
 
        return rooms.filter(room => {
 
            const isLaboratory =
                String(room.type)
                    .toLowerCase()
                    .includes("laboratory");
 
            if (!isLaboratory) {
                return false;
            }
 
            const allowedSubjects =
                Array.isArray(room.labSubjects)
                    ? room.labSubjects
                    : [];
 
            return allowedSubjects.some(
                subjectId =>
                    String(subjectId) ===
                    String(subject.id)
            );
 
        });
 
    }
 
    return rooms.filter(room =>
        String(room.type)
            .toLowerCase()
            .includes("classroom")
    );
}
 
/* =========================================================
   AUTOMATIC TIMETABLE GENERATOR
========================================================= */
 
async function generateAutomaticTimetable() {
 
 
    if (
        teachers.length === 0
    ) {
 
        alert(
            "Please add teachers first."
        );
 
        return;
 
    }
 
 
    if (
        subjects.length === 0
    ) {
 
        alert(
            "Please add subjects first."
        );
 
        return;
 
    }
 
 
    if (
        rooms.length === 0
    ) {
 
        alert(
            "Please add classrooms and laboratories first."
        );
 
        return;
 
    }
 
 
    const timetableAcademicYear =
        document.getElementById(
            "timetableAcademicYear"
        );
 
 
    const selectedAcademicYear =
 
        timetableAcademicYear
 
            ?
 
            timetableAcademicYear.value
 
            :
 
            "";
 
 
    /*
       If academic year is selected,
       generate only subjects from that year.
 
       If not selected,
       generate all registered subjects.
    */
 
    let subjectsToGenerate =
        [...subjects];
 
 
    if (
        selectedAcademicYear
    ) {
 
        subjectsToGenerate =
            subjectsToGenerate.filter(
 
                subject =>
                    String(
                        subject.academicYear
                    ) ===
                    String(
                        selectedAcademicYear
                    )
 
            );
 
    }
 
 
    if (
        subjectsToGenerate.length === 0
    ) {
 
        alert(
            "No subjects found for the selected academic year."
        );
 
        return;
 
    }
 
 
    /*
       Check rooms before deleting old timetable.
    */
 
    
 
    /*
       Clear old timetable before generation.
    */
 
    timetable =
        [];
 
 
    showGenerationMessage(
        "Generating complete timetable for all years and semesters..."
    );
 
 
    /*
       Separate practicals and theories.
 
       Practicals are scheduled first because
       they are harder to place.
    */
 
    const laboratorySubjects =
        subjectsToGenerate.filter(
 
            subject =>
                subject.type ===
                "Laboratory"
 
        );
 
 
    const theorySubjects =
        subjectsToGenerate.filter(
 
            subject =>
                subject.type !==
                "Laboratory"
 
        );
 
 
    /*
       Sort by weekly classes.
 
       Subjects requiring more classes
       are scheduled first.
    */
 
    laboratorySubjects.sort(
 
        (a, b) =>
 
            Number(
                b.weeklyClasses
            )
 
            -
 
            Number(
                a.weeklyClasses
            )
 
    );
 
 
    theorySubjects.sort(
 
        (a, b) =>
 
            Number(
                b.weeklyClasses
            )
 
            -
 
            Number(
                a.weeklyClasses
            )
 
    );
 
 
    const unscheduled =
        [];
 
 
    let totalEntries =
        0;
 
 
    /*
       STEP 1
 
       SCHEDULE ALL PRACTICALS
    */
 
    for (
        const subject
        of laboratorySubjects
    ) {
 
 
        const result =
            scheduleLaboratorySubject(
                subject
            );
 
 
        totalEntries +=
            result.scheduled;
 
 
        if (
            result.remaining > 0
        ) {
 
            unscheduled.push({
 
                subject:
                    subject.name,
 
                year:
                    subject.year,
 
                semester:
                    subject.semester,
 
                remaining:
                    result.remaining,
 
                type:
                    "Practical"
 
            });
 
        }
 
    }
 
 
    /*
       STEP 2
 
       SCHEDULE ALL THEORY SUBJECTS
    */
 
    for (
        const subject
        of theorySubjects
    ) {
 
 
        const result =
            scheduleTheorySubject(
                subject
            );
 
 
        totalEntries +=
            result.scheduled;
 
 
        if (
            result.remaining > 0
        ) {
 
            unscheduled.push({
 
                subject:
                    subject.name,
 
                year:
                    subject.year,
 
                semester:
                    subject.semester,
 
                remaining:
                    result.remaining,
 
                type:
                    "Lecture"
 
            });
 
        }
 
    }
 
 
    /*
       Save final timetable
    */
 
    await saveData();
 
 
    displayTimetable();
 
    updateDashboard();
 
 
    /*
       Validation message
    */
 
    if (
        unscheduled.length === 0
    ) {
 
        showGenerationMessage(
 
            `SUCCESS: Complete timetable generated successfully with ${totalEntries} timetable entries.`,
 
            true
 
        );
 
 
        alert(
 
            "Complete timetable generated successfully!\n\n" +
 
            `Total timetable entries: ${totalEntries}\n\n` +
 
            "All required lectures and practicals were scheduled."
 
        );
 
    }
 
 
    else {
 
        let message =
            `Timetable generated with ${totalEntries} entries.\n\n`;
 
 
        message +=
            "Some classes could not be completely scheduled:\n\n";
 
 
        unscheduled.forEach(
 
            item => {
 
                message +=
 
                    `• Year ${item.year} - Semester ${item.semester}\n` +
 
                    `  ${item.subject}\n` +
 
                    `  ${item.remaining} ${item.type}(s) remaining\n\n`;
 
            }
 
        );
 
 
        message +=
            "Try adding more rooms/labs or teachers.";
 
 
        showGenerationMessage(
            message,
            false
        );
 
 
        alert(
            message
        );
 
    }
 
}
 
 
/* =========================================================
   SCHEDULE THEORY SUBJECT
========================================================= */
 
function scheduleTheorySubject(
    subject
) {
 
 
    const required =
        Number(
            subject.weeklyClasses
        );
 
 
    let scheduled =
        0;
 
 
    /*
       Try to spread lectures across different days.
 
       This prevents all 3 DSA lectures
       from appearing on the same day.
    */
 
    const preferredDays =
        getBalancedDays(
            required
        );
 
 
    /*
       First attempt:
       Monday to Friday only.
    */
 
    for (
        const day
        of preferredDays
    ) {
 
 
        if (
            scheduled >= required
        ) {
 
            break;
 
        }
 
 
        const placed =
            placeTheoryOnDay(
 
                subject,
 
                day
 
            );
 
 
        if (placed) {
 
            scheduled++;
 
        }
 
    }
 
 
    /*
       Second attempt:
 
       Try other weekdays if required
       lectures are still missing.
    */
 
    if (
        scheduled < required
    ) {
 
        for (
            const day
            of days.slice(0, 5)
        ) {
 
 
            if (
                scheduled >= required
            ) {
 
                break;
 
            }
 
 
            /*
               Avoid placing the same subject
               twice on the same day unless necessary.
            */
 
            const alreadyPlaced =
                timetable.some(
 
                    entry =>
 
                        String(
                            entry.subjectId
                        ) ===
                        String(
                            subject.id
                        ) &&
 
                        String(
                            entry.day
                        ) ===
                        String(
                            day
                        )
 
                );
 
 
            if (
                alreadyPlaced
            ) {
 
                continue;
 
            }
 
 
            const placed =
                placeTheoryOnDay(
 
                    subject,
 
                    day
 
                );
 
 
            if (placed) {
 
                scheduled++;
 
            }
 
        }
 
    }
 
 
    /*
       Third attempt:
 
       Use remaining Monday-Friday slots,
       even if same subject appears twice.
    */
 
    if (
        scheduled < required
    ) {
 
        for (
            const day
            of days.slice(0, 5)
        ) {
 
 
            while (
                scheduled < required
            ) {
 
                const placed =
                    placeTheoryOnDay(
 
                        subject,
 
                        day
 
                    );
 
 
                if (!placed) {
 
                    break;
 
                }
 
 
                scheduled++;
 
            }
 
        }
 
    }
 
 
    /*
       Last attempt:
 
       Saturday only when necessary.
    */
 
    if (
        scheduled < required
    ) {
 
 
        while (
            scheduled < required
        ) {
 
            const placed =
                placeTheoryOnDay(
 
                    subject,
 
                    "Saturday"
 
                );
 
 
            if (!placed) {
 
                break;
 
            }
 
 
            scheduled++;
 
        }
 
    }
 
 
    return {
 
        scheduled:
            scheduled,
 
        remaining:
            required -
            scheduled
 
    };
 
}
 
 
/* =========================================================
   PLACE THEORY ON ONE DAY
========================================================= */
 
function placeTheoryOnDay(
 
    subject,
 
    day
 
) {
 
 
    const assignedRooms =
        getSuitableRooms(
            subject
        );
 
 
    if (
        assignedRooms.length === 0
    ) {
 
        return false;
 
    }
 
 
    /*
       Sort windows by timetable usage.
 
       Less-used slots are preferred.
    */
 
    const windows =
        [...LECTURE_WINDOWS]
        .sort(
 
            (a, b) =>
 
                getSlotUsage(
                    day,
                    `${a.start}-${a.end}`
                )
 
                -
 
                getSlotUsage(
                    day,
                    `${b.start}-${b.end}`
                )
 
        );
 
 
    for (
        const window
        of windows
    ) {
 
 
        const time =
            `${window.start}-${window.end}`;
 
 
        for (
            const room
            of assignedRooms
        ) {
 
 
            const newEntry = {
 
                year:
                    subject.year,
 
                semester:
                    subject.semester,
 
                day:
                    day,
 
                time:
                    time,
 
                subjectId:
                    subject.id,
 
                teacherId:
                    subject.teacherId,
 
                roomId:
                    room.id};
 
 
            const conflict =
                checkConflict(
                    newEntry
                );
 
 
            if (conflict) {
 
                continue;
 
            }
 
 
            addAssignmentEntry(
 
                subject,
 
                subject.year,
 
                subject.semester,
 
                day,
 
                time,
 
                subject.teacherId,
 
                room.id
 
            );
 
 
            return true;
 
        }
 
    }
 
 
    return false;
 
}
 
/* =========================================================
   SCHEDULE LABORATORY SUBJECT
========================================================= */
 
function scheduleLaboratorySubject(subject) {
    const requiredPerBatch = Number(subject.weeklyClasses) || 1;
    const batches = getSubjectBatches(subject);
    const batchList = batches.length ? batches : [""];
    let scheduled = 0;
    let requiredTotal = requiredPerBatch * batchList.length;

    batchList.forEach(batch => {
        for (let count = 0; count < requiredPerBatch; count++) {
            if (placeLaboratoryAutomatically(subject, batch)) {
                scheduled++;
            }
        }
    });

    return {
        scheduled,
        remaining: requiredTotal - scheduled
    };
}
 
 
 
/* =========================================================
   PLACE LABORATORY AUTOMATICALLY
========================================================= */
 
function placeLaboratoryAutomatically(subject, batch = "")
{
    const availableRooms = getSuitableRooms(subject);
    if (availableRooms.length === 0) {
        console.warn(`No laboratory is assigned to ${subject.name}.`);
        return false;
    }
    const orderedDays = getOrderedDaysForGeneration();
    const orderedWindows = [...PRACTICAL_WINDOWS].sort((a, b) => getSlotUsage(orderedDays[0], a.label) - getSlotUsage(orderedDays[0], b.label));
 
    for (const day of orderedDays) {
        for (const window of orderedWindows) {
            const time = `${window.start}-${window.end}`;
            for (const room of availableRooms) {
                const conflict = checkConflict({
                    subjectId: subject.id,
                    year: subject.year,
                    semester: subject.semester,
                    day, time,
                    teacherId: subject.teacherId,
                    roomId: room.id,
                    batch
                });
                if (!conflict) {
                    addAssignmentEntry(subject, subject.year, subject.semester, day, time, subject.teacherId, room.id, batch);
                    return true;
                }
            }
        }
    }
    console.warn(`Could not schedule practical for ${subject.name}.`);
    return false;
}
 
 
/* =========================================================
   GET SUBJECT ROOMS
========================================================= */
 
function getSubjectRooms(
    subject
) {
 
    return rooms.filter(
 
        room =>
            String(
                room.subjectId
            ) ===
            String(
                subject.id
            )
 
    );
 
}
 
 
/* =========================================================
   BALANCED DAYS
========================================================= */
 
function getBalancedDays(
    numberOfClasses
) {
 
    /*
       Priority is Monday-Friday.
    */
 
    const weekdayDays = [
 
        "Monday",
 
        "Tuesday",
 
        "Wednesday",
 
        "Thursday",
 
        "Friday"
 
    ];
 
 
    if (
        numberOfClasses <= 1
    ) {
 
        return [
            "Monday"
        ];
 
    }
 
 
    if (
        numberOfClasses === 2
    ) {
 
        return [
 
            "Monday",
 
            "Thursday"
 
        ];
 
    }
 
 
    if (
        numberOfClasses === 3
    ) {
 
        return [
 
            "Monday",
 
            "Wednesday",
 
            "Friday"
 
        ];
 
    }
 
 
    if (
        numberOfClasses === 4
    ) {
 
        return [
 
            "Monday",
 
            "Tuesday",
 
            "Thursday",
 
            "Friday"
 
        ];
 
    }
 
 
    return weekdayDays;
 
}
 
 
/* =========================================================
   ORDERED DAYS
========================================================= */
 
function getOrderedDaysForGeneration() {
 
    /*
       Count timetable usage for each day.
    */
 
    const weekdayUsage =
        days.slice(0, 5)
        .map(
 
            day => ({
 
                day:
                    day,
 
                usage:
                    timetable.filter(
 
                        entry =>
                            String(
                                entry.day
                            ) ===
                            String(
                                day
                            )
 
                    ).length
 
            })
 
        );
 
 
    weekdayUsage.sort(
 
        (a, b) =>
            a.usage -
            b.usage
 
    );
 
 
    return [
 
        ...weekdayUsage.map(
            item => item.day
        ),
 
        "Saturday"
 
    ];
 
}
 
 
/* =========================================================
   SLOT USAGE
========================================================= */
 
function getSlotUsage(
 
    day,
 
    time
 
) {
 
    return timetable.filter(
 
        entry =>
 
            String(
                entry.day
            ) ===
            String(
                day
            ) &&
 
            timeRangeOverlaps(
 
                entry.time,
 
                time
 
            )
 
    ).length;
 
}
 
 
/* =========================================================
   GENERATION MESSAGE
========================================================= */
 
function showGenerationMessage(
 
    message,
 
    success = false
 
) {
 
    const element =
        document.getElementById(
            "generationMessage"
        );
 
 
    if (!element) {
 
        return;
 
    }
 
 
    element.innerText =
        message;
 
 
    element.style.padding =
        "15px";
 
 
    element.style.marginTop =
        "15px";
 
 
    element.style.whiteSpace =
        "pre-line";
 
 
    if (success) {
 
        element.style.background =
            "#dcfce7";
 
 
        element.style.color =
            "#166534";
 
    }
 
    else {
 
        element.style.background =
            "#fef3c7";
 
 
        element.style.color =
            "#92400e";
 
    }
 
}
 
 
/* =========================================================
   DISPLAY TIMETABLE
========================================================= */
 
function setupSemesterDisplayEvents() {
 
    const semesterSelectors = [
 
        "secondYearSemester",
 
        "thirdYearSemester",
 
        "fourthYearSemester"
 
    ];
 
 
    semesterSelectors.forEach(
 
        id => {
 
            const select =
                document.getElementById(
                    id
                );
 
 
            if (!select) {
 
                return;
 
            }
 
 
            select.addEventListener(
 
                "change",
 
                displayTimetable
 
            );
 
        }
 
    );
 
}
 
 
function displayTimetable() {
 
 
    const secondSemester =
        getElementValue(
            "secondYearSemester",
            "3"
        );
 
 
    const thirdSemester =
        getElementValue(
            "thirdYearSemester",
            "5"
        );
 
 
    const fourthSemester =
        getElementValue(
            "fourthYearSemester",
            "7"
        );
 
 
    displayYearTimetable(
 
        "2",
 
        secondSemester,
 
        "secondYearTableBody"
 
    );
 
 
    displayYearTimetable(
 
        "3",
 
        thirdSemester,
 
        "thirdYearTableBody"
 
    );
 
 
    displayYearTimetable(
 
        "4",
 
        fourthSemester,
 
        "fourthYearTableBody"
 
    );
 
}
 
 
/* =========================================================
   DISPLAY ONE YEAR + SEMESTER
========================================================= */
 
function displayYearTimetable(
 
    year,
 
    semester,
 
    tableBodyId
 
) {
 
    const tbody =
        document.getElementById(
            tableBodyId
        );
 
 
    if (!tbody) {
 
        return;
 
    }
 
 
    tbody.innerHTML =
        "";
 
 
    const entries =
        timetable.filter(
 
            entry =>
 
                String(
                    entry.year
                ) ===
                String(
                    year
                ) &&
 
                String(
                    entry.semester
                ) ===
                String(
                    semester
                )
 
        );
 
 
    timeSlots.forEach(
 
        slot => {
 
 
            const row =
                document.createElement(
                    "tr"
                );
 
 
            const timeCell =
                document.createElement(
                    "td"
                );
 
 
            timeCell.innerText =
                slot.label;
 
 
            row.appendChild(
                timeCell
            );
 
 
            days.forEach(
 
                day => {
 
 
                    const cell =
                        document.createElement(
                            "td"
                        );
 
 
                    /*
                       Meditation
                    */
 
                    if (
 
                        slot.type ===
                        "meditation"
 
                    ) {
 
                        cell.innerText =
                            "Meditation";
 
 
                        cell.className =
                            "meditation-cell";
 
 
                        row.appendChild(
                            cell
                        );
 
                        return;
 
                    }
 
 
                    /*
                       Short Break
                    */
 
                    if (
 
                        slot.type ===
                        "shortBreak"
 
                    ) {
 
                        cell.innerText =
                            "Short Break";
 
 
                        cell.className =
                            "short-break";
 
 
                        row.appendChild(
                            cell
                        );
 
                        return;
 
                    }
 
 
                    /*
                       Lunch Break
                    */
 
                    if (
 
                        slot.type ===
                        "lunch"
 
                    ) {
 
                        cell.innerText =
                            "Lunch Break";
 
 
                        cell.className =
                            "lunch-break";
 
 
                        row.appendChild(
                            cell
                        );
 
                        return;
 
                    }
 
 
                    const slotTime =
                        `${slot.start}-${slot.end}`;
 
 
                    const matchingEntries =
                        entries.filter(
 
                            entry =>
 
                                String(
                                    entry.day
                                ) ===
                                String(
                                    day
                                ) &&
 
                                timeRangeOverlaps(
 
                                    entry.time,
 
                                    slotTime
 
                                )
 
                        );
 
 
                    /*
                       No class
                    */
 
                    if (
                        matchingEntries.length === 0
                    ) {
 
                        cell.innerHTML =
                            `
                                <span class="free-period">
                                    Free
                                </span>
                            `;
 
 
                        row.appendChild(
                            cell
                        );
 
                        return;
 
                    }
 
 
                    /*
                       Practical handling
                    */
 
                    const practicalEntries =
                        matchingEntries.filter(
 
                            entry => {
 
                                const subject =
                                    subjects.find(
 
                                        subject =>
                                            String(
                                                subject.id
                                            ) ===
                                            String(
                                                entry.subjectId
                                            )
 
                                    );
 
 
                                return (
 
                                    subject &&
 
                                    subject.type ===
                                    "Laboratory"
 
                                );
 
                            }
 
                        );
 
 
                    /* Practical handling */
 
                    if (
 
                        practicalEntries.length > 0
 
                    ) {
 
 
                        const practicalStartsHere =
                            practicalEntries.some(
 
                                entry =>
                                    entry.time
                                    .startsWith(
                                        slot.start
                                    )
 
                            );
 
 
                        if (
                            !practicalStartsHere
                        ) {
 
                            return;
 
                        }
 
 
                        cell.rowSpan =
                            2;
 
 
                        cell.className =
                            "practical-cell";
 
 
                        cell.innerHTML =
                            practicalEntries
                            .map(
 
                                entry =>
                                    createSubjectCell(
                                        entry
                                    )
 
                            )
                            .join(
                                "<hr>"
                            );
 
 
                        row.appendChild(
                            cell
                        );
 
                        return;
 
                    }
 
 
                    /*
                       Normal theory
                    */
 
                    const theoryEntry =
                        matchingEntries[0];
 
 
                    cell.innerHTML =
                        createSubjectCell(
                            theoryEntry
                        );
 
 
                    row.appendChild(
                        cell
                    );
 
                }
 
            );
 
 
            tbody.appendChild(
                row
            );
 
        }
 
    );
 
}
 
 
/* =========================================================
   CREATE SUBJECT CELL
========================================================= */
 
function createSubjectCell(item) {
    const subject = subjects.find(subject => String(subject.id) === String(item.subjectId));
    const teacher = teachers.find(teacher => String(teacher.id) === String(item.teacherId));
    const room = rooms.find(room => String(room.id) === String(item.roomId));
 
    if (!subject) return "";
 
    return `
        <div class="subject-cell">
            <strong>${escapeHTML(subject.name)}</strong>
            ${item.batch ? `<span class="timetable-batch">Batch ${escapeHTML(item.batch)}</span>` : ""}
            <br>
            Teacher: ${teacher ? escapeHTML(teacher.name) : "Unknown"}<br>
            Room/Lab: ${room ? escapeHTML(room.number) : "Unknown"}
        </div>
    `;
}
 
 
/* =========================================================
   DROPDOWN EVENTS
========================================================= */
 
function setupDropdownEvents() {
 
 
    const assignmentYear =
        document.getElementById(
            "assignmentYear"
        );
 
 
    if (assignmentYear) {
 
        assignmentYear.addEventListener(
 
            "change",
 
            populateSubjectDropdown
 
        );
 
    }
 
 
    const assignmentSemester =
        document.getElementById(
            "assignmentSemester"
        );
 
 
    if (assignmentSemester) {
 
        assignmentSemester.addEventListener(
 
            "change",
 
            populateSubjectDropdown
 
        );
 
    }
 
}
 
 
 
/* =========================================================
   CONFLICT MESSAGE
========================================================= */
 
function showConflictMessage(
 
    message,
 
    success = false
 
) {
 
    const element =
        document.getElementById(
            "conflictMessage"
        );
 
 
    if (!element) {
 
        return;
 
    }
 
 
    element.innerText =
        message;
 
 
    if (success) {
 
        element.style.background =
            "#dcfce7";
 
 
        element.style.color =
            "#166534";
 
    }
 
    else {
 
        element.style.background =
            "#fee2e2";
 
 
        element.style.color =
            "#991b1b";
 
    }
 
}
 
 
 
/* =========================================================
   PDF LIBRARY LOADER
   Loads jsPDF + AutoTable with CDN fallbacks.
========================================================= */
 
function loadPdfScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
 
        script.onload = () => resolve();
        script.onerror = () => {
            script.remove();
            reject(new Error("Failed to load: " + url));
        };
 
        document.head.appendChild(script);
    });
}
 
 
async function ensurePdfLibraries() {
 
    /* Load jsPDF if it is not already available. */
    if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
 
        const sources = [
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js",
            "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
            "https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js"
        ];
 
        for (const source of sources) {
            try {
                await loadPdfScript(source);
 
                if (
                    window.jspdf &&
                    typeof window.jspdf.jsPDF === "function"
                ) {
                    break;
                }
            } catch (error) {
                console.warn("jsPDF CDN failed:", source);
            }
        }
    }
 
 
    if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
        throw new Error("jsPDF could not be loaded.");
    }
 
 
    /* Check whether AutoTable is already attached. */
    let testPdf = new window.jspdf.jsPDF();
 
    if (typeof testPdf.autoTable !== "function") {
 
        const sources = [
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js",
            "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js",
            "https://unpkg.com/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js"
        ];
 
        for (const source of sources) {
            try {
                await loadPdfScript(source);
 
                testPdf = new window.jspdf.jsPDF();
 
                if (typeof testPdf.autoTable === "function") {
                    break;
                }
            } catch (error) {
                console.warn("AutoTable CDN failed:", source);
            }
        }
    }
 
 
    testPdf = new window.jspdf.jsPDF();
 
    if (typeof testPdf.autoTable !== "function") {
        throw new Error("jsPDF AutoTable could not be loaded.");
    }
}
 
/* =========================================================
   DOWNLOAD TIMETABLE AS PDF
   Second, Third and Fourth Year are exported on separate pages.
   The selected semester for each year is used.
========================================================= */
 
async function downloadTimetable() {
 
    if (timetable.length === 0) {
        alert("Please generate a timetable first.");
        return;
    }
 
    try {
 
        await ensurePdfLibraries();
 
        const { jsPDF } = window.jspdf;
 
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });
 
        const academicYearElement =
            document.getElementById(
                "timetableAcademicYear"
            );
 
        const academicYear =
            academicYearElement &&
            academicYearElement.selectedIndex >= 0
                ? academicYearElement.options[
                      academicYearElement.selectedIndex
                  ].text
                : "";
 
        const yearPages = [
            {
                year: "2",
                title: "Second Year",
                selector: "secondYearSemester",
                defaultSemester: "3"
            },
            {
                year: "3",
                title: "Third Year",
                selector: "thirdYearSemester",
                defaultSemester: "5"
            },
            {
                year: "4",
                title: "Fourth Year",
                selector: "fourthYearSemester",
                defaultSemester: "7"
            }
        ];
 
        yearPages.forEach(
            (yearPage, pageIndex) => {
 
                if (pageIndex > 0) {
                    pdf.addPage(
                        "a4",
                        "landscape"
                    );
                }
 
                const semester =
                    getElementValue(
                        yearPage.selector,
                        yearPage.defaultSemester
                    );
 
                /* ---------- HEADER ---------- */
 
                pdf.setTextColor(
                    16,
                    42,
                    67
                );
 
                pdf.setFont(
                    "helvetica",
                    "bold"
                );
 
                pdf.setFontSize(15);
 
                pdf.text(
                    "BHARATI VIDYAPEETH'S COLLEGE OF ENGINEERING FOR WOMEN, PUNE",
                    148.5,
                    13,
                    {
                        align: "center"
                    }
                );
 
                pdf.setFontSize(10);
 
                pdf.setTextColor(
                    30,
                    95,
                    136
                );
 
                pdf.text(
                    "AUTOMATIC TIMETABLE MANAGEMENT SYSTEM",
                    148.5,
                    19,
                    {
                        align: "center"
                    }
                );
 
                pdf.setFontSize(13);
 
                pdf.setTextColor(
                    16,
                    42,
                    67
                );
 
                pdf.text(
                    `${yearPage.title} - Semester ${semester}`,
                    148.5,
                    27,
                    {
                        align: "center"
                    }
                );
 
                if (
                    academicYear &&
                    academicYear !==
                        "Select Academic Year"
                ) {
 
                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );
 
                    pdf.setFontSize(8);
 
                    pdf.setTextColor(
                        90,
                        90,
                        90
                    );
 
                    pdf.text(
                        `Academic Year: ${academicYear}`,
                        148.5,
                        33,
                        {
                            align: "center"
                        }
                    );
                }
 
                /* ---------- FILTER DATA ---------- */
 
                const entries =
                    timetable.filter(
                        entry =>
                            String(entry.year) ===
                                String(yearPage.year) &&
                            String(entry.semester) ===
                                String(semester)
                    );
 
                const body = [];
 
                timeSlots.forEach(
                    slot => {
 
                        const row = [
                            slot.label
                        ];
 
                        days.forEach(
                            day => {
 
                                if (
                                    slot.type ===
                                    "meditation"
                                ) {
                                    row.push(
                                        "Meditation"
                                    );
                                    return;
                                }
 
                                if (
                                    slot.type ===
                                    "shortBreak"
                                ) {
                                    row.push(
                                        "Short Break"
                                    );
                                    return;
                                }
 
                                if (
                                    slot.type ===
                                    "lunch"
                                ) {
                                    row.push(
                                        "Lunch Break"
                                    );
                                    return;
                                }
 
                                const slotTime =
                                    `${slot.start}-${slot.end}`;
 
                                const matches =
                                    entries.filter(
                                        entry =>
                                            String(
                                                entry.day
                                            ) ===
                                                String(day) &&
                                            timeRangeOverlaps(
                                                entry.time,
                                                slotTime
                                            )
                                    );
 
                                if (
                                    matches.length ===
                                    0
                                ) {
                                    row.push(
                                        "Free"
                                    );
                                    return;
                                }
 
                                row.push(
                                    matches
                                        .map(
                                            entry => {
 
                                                const subject =
                                                    subjects.find(
                                                        s =>
                                                            String(
                                                                s.id
                                                            ) ===
                                                            String(
                                                                entry.subjectId
                                                            )
                                                    );
 
                                                const teacher =
                                                    teachers.find(
                                                        t =>
                                                            String(
                                                                t.id
                                                            ) ===
                                                            String(
                                                                entry.teacherId
                                                            )
                                                    );
 
                                                const room =
                                                    rooms.find(
                                                        r =>
                                                            String(
                                                                r.id
                                                            ) ===
                                                            String(
                                                                entry.roomId
                                                            )
                                                    );
 
                                                return [
                                                    subject
                                                        ? subject.name
                                                        : "Unknown Subject",
                                                    teacher
                                                        ? `Teacher: ${teacher.name}`
                                                        : "Teacher: Unknown",
                                                    room
                                                        ? `Room/Lab: ${room.number}`
                                                        : "Room/Lab: Unknown"
                                                ].join(
                                                    "\n"
                                                );
                                            }
                                        )
                                        .join(
                                            "\n\n"
                                        )
                                );
                            }
                        );
 
                        body.push(
                            row
                        );
                    }
                );
 
                /* ---------- TABLE ---------- */
 
                pdf.autoTable({
                    startY:
                        academicYear &&
                        academicYear !==
                            "Select Academic Year"
                            ? 39
                            : 34,
 
                    margin: {
                        left: 10,
                        right: 10,
                        bottom: 12
                    },
 
                    head: [
                        [
                            "Time",
                            ...days
                        ]
                    ],
 
                    body: body,
 
                    theme: "grid",
 
                    styles: {
                        font: "helvetica",
                        fontSize: 6.8,
                        cellPadding: 1.7,
                        overflow: "linebreak",
                        valign: "middle",
                        halign: "center",
                        lineWidth: 0.2,
                        minCellHeight: 11
                    },
 
                    headStyles: {
                        fontSize: 7.5,
                        fontStyle: "bold",
                        textColor: 255,
                        fillColor: [
                            16,
                            42,
                            67
                        ],
                        halign: "center",
                        valign: "middle"
                    },
 
                    columnStyles: {
                        0: {
                            cellWidth: 31,
                            fontStyle: "bold",
                            halign: "center"
                        }
                    },
 
                    didParseCell:
                        function (data) {
 
                            if (
                                data.section !==
                                "body"
                            ) {
                                return;
                            }
 
                            const value =
                                String(
                                    data.cell.raw ||
                                        ""
                                );
 
                            if (
                                value ===
                                "Free"
                            ) {
                                data.cell.styles.textColor =
                                    [
                                        125,
                                        125,
                                        125
                                    ];
                            }
 
                            if (
                                value ===
                                    "Meditation" ||
                                value ===
                                    "Short Break" ||
                                value ===
                                    "Lunch Break"
                            ) {
                                data.cell.styles.fontStyle =
                                    "bold";
 
                                data.cell.styles.fillColor =
                                    [
                                        245,
                                        247,
                                        250
                                    ];
                            }
                        }
                });
 
                /* ---------- FOOTER ---------- */
 
                const pageHeight =
                    pdf.internal.pageSize.getHeight();
 
                pdf.setFont(
                    "helvetica",
                    "normal"
                );
 
                pdf.setFontSize(7);
 
                pdf.setTextColor(
                    100,
                    100,
                    100
                );
 
                pdf.text(
                    `Page ${pageIndex + 1} of 3`,
                    148.5,
                    pageHeight - 6,
                    {
                        align: "center"
                    }
                );
            }
        );
 
        const safeAcademicYear =
            academicYear &&
            academicYear !==
                "Select Academic Year"
                ? academicYear
                      .replace(
                          /[^a-z0-9]+/gi,
                          "_"
                      )
                      .replace(
                          /^_+|_+$/g,
                          ""
                      )
                : "Academic_Year";
 
        pdf.save(
            `BVCOEW_Timetable_${safeAcademicYear}.pdf`
        );
 
    }
    catch (error) {
 
        console.error(
            "PDF download error:",
            error
        );
 
        alert(
            "Unable to create the PDF. Please generate the timetable again and try once more."
        );
    }
}
 
 
/* =========================================================
   PRINT TIMETABLE
========================================================= */
 
function printTimetable() {
 
    window.print();
 
}
 
 
/* =========================================================
   DASHBOARD
========================================================= */
 
function updateDashboard() {
 
    const teacherCount =
        document.getElementById(
            "teacherCount"
        );
 
 
    const subjectCount =
        document.getElementById(
            "subjectCount"
        );
 
 
    const classroomCount =
        document.getElementById(
            "classroomCount"
        );
 
 
    const laboratoryCount =
        document.getElementById(
            "laboratoryCount"
        );
 
 
    const timetableCount =
        document.getElementById(
            "timetableCount"
        );
 
 
    if (teacherCount) {
 
        teacherCount.innerText =
            teachers.length;
 
    }
 
 
    if (subjectCount) {
 
        subjectCount.innerText =
            subjects.length;
 
    }
 
 
    if (classroomCount) {
 
        classroomCount.innerText =
            rooms.filter(
 
                room =>
 
                    String(
                        room.type
                    )
                    .toLowerCase()
                    .includes(
                        "classroom"
                    )
 
            )
            .length;
 
    }
 
 
    if (laboratoryCount) {
 
        laboratoryCount.innerText =
            rooms.filter(
 
                room =>
 
                    String(
                        room.type
                    )
                    .toLowerCase()
                    .includes(
                        "laboratory"
                    )
 
            )
            .length;
 
    }
 
 
    if (timetableCount) {
 
        timetableCount.innerText =
            timetable.length;
 
    }
 
}
 
 
/* =========================================================
   RESET SYSTEM
========================================================= */
 
async function resetSystem() {
 
    const confirmReset =
        confirm(
 
            "Are you sure you want to reset the entire system?\n\n" +
 
            "This will delete all teachers, subjects, rooms and timetable data."
 
        );
 
 
    if (!confirmReset) {
 
        return;
 
    }
 
 
    try {
 
        teachers =
            [];
 
 
        subjects =
            [];
 
 
        rooms =
            [];
 
 
        timetable =
            [];
 
 
        await saveData();
 
 
        displayTeachers();
 
        displaySubjects();
 
        displayRooms();
 
        displayTimetable();
 
        updateDashboard();
 
 
        populateTeacherDropdown();
 
        populateAssignmentTeacherDropdown();
 
        populateSubjectDropdown();
 
        populateRoomDropdown();
 
 
        alert(
            "System has been reset successfully!"
        );
 
    }
 
    catch (error) {
 
        console.error(
            "Reset error:",
            error
        );
 
 
        alert(
            "Unable to reset the system."
        );
 
    }
 
}
 
 
/* =========================================================
   ACADEMIC YEAR DROPDOWN
========================================================= */
 
function populateAcademicYearDropdown() {
 
    const selects = [
        document.getElementById("academicYear"),
        document.getElementById("customAcademicYear"),
        document.getElementById("timetableAcademicYear")
    ];
 
    const currentYear =
        new Date().getFullYear();
 
    selects.forEach(select => {
 
        if (!select) {
            return;
        }
 
        const currentValue =
            select.value;
 
        select.innerHTML = `
            <option value="">
                Select Academic Year
            </option>
        `;
 
        for (
            let year = currentYear - 10;
            year <= currentYear + 10;
            year++
        ) {
 
            const option =
                document.createElement("option");
 
            option.value =
                `${year}-${year + 1}`;
 
            option.textContent =
                `${year}-${year + 1}`;
 
            select.appendChild(option);
        }
 
        if (currentValue) {
            select.value = currentValue;
        }
    });
}
 
 
/* =========================================================
   GET ELEMENT VALUE
========================================================= */
 
function getElementValue(
 
    id,
 
    defaultValue = ""
 
) {
 
    const element =
        document.getElementById(
            id
        );
 
 
    if (!element) {
 
        return defaultValue;
 
    }
 
 
    return (
        element.value ||
        defaultValue
    );
 
}
 
 
/* =========================================================
   SECURITY HELPER
========================================================= */
 
function escapeHTML(value) {
 
    return String(
        value
    )
 
    .replace(
        /&/g,
        "&amp;"
    )
 
    .replace(
        /</g,
        "&lt;"
    )
 
    .replace(
        />/g,
        "&gt;"
    )
 
    .replace(
        /"/g,
        "&quot;"
    )
 
    .replace(
        /'/g,
        "&#039;"
    );
 
}
 
 
 
/* =========================================================
   ENHANCED NATURAL-LANGUAGE TIMETABLE ASSISTANT
   NOTE:
   This is a flexible local command engine. It can understand
   many variations of timetable commands, but a browser-only
   JavaScript application cannot guarantee understanding of every
   possible human sentence without connecting to a real AI model.
========================================================= */
 
 
 
function updateAIAssistantVisibility() {
    const section = document.getElementById("aiAssistantSection");
    if (section) section.hidden = timetable.length === 0;
}
 
 
function showAICommandMessage(message, success = false) {
    const element = document.getElementById("aiCommandMessage");
    if (!element) return;
    element.innerText = message;
    element.className = "ai-command-message " + (success ? "success" : "error");
}
 
 
function clearAICommandMessage() {
    const element = document.getElementById("aiCommandMessage");
    if (element) {
        element.innerText = "";
        element.className = "ai-command-message";
    }
}
 
 
function normalizeAIText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[.,!?;:]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
 
 
function findAllSubjectsInAIText(text) {
    const normalized = normalizeAIText(text);
 
    return subjects.filter(subject => {
        const names = [subject.name, subject.shortName, subject.fullName]
            .filter(Boolean)
            .map(normalizeAIText);
 
        return names.some(name => name && normalized.includes(name));
    });
}
 
 
function findSubjectFromAIText(text) {
    return findAllSubjectsInAIText(text)[0] || null;
}
 
 
function findTeacherFromAIText(text) {
    const normalized = normalizeAIText(text);
 
    return teachers.find(teacher =>
        normalized.includes(normalizeAIText(teacher.name))
    ) || null;
}
 
 
function findRoomFromAIText(text) {
    const normalized = normalizeAIText(text);
 
    return rooms.find(room => {
        const values = [room.number, room.name, room.roomNumber]
            .filter(Boolean)
            .map(normalizeAIText);
 
        return values.some(value => value && normalized.includes(value));
    }) || null;
}
 
 
function parseAIWeekday(text) {
    const match = String(text || "").match(
        /\b(monday|tuesday|wednesday|thursday|friday|saturday)\b/i
    );
 
    if (!match) return null;
 
    return match[1].charAt(0).toUpperCase() +
        match[1].slice(1).toLowerCase();
}
 
 
function aiTimeTo24Hour(value) {
    const match = String(value || "").trim().match(
        /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i
    );
 
    if (!match) return null;
 
    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3] ? match[3].toLowerCase() : null;
 
    if (period === "pm" && hour !== 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;
    if (hour > 23 || Number(minute) > 59) return null;
 
    return String(hour).padStart(2, "0") + ":" + minute;
}
 
 
function parseAITimeRange(text) {
    const match = String(text || "").replace(/\s+/g, " ").match(
        /(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*(?:-|to)\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i
    );
 
    if (!match) return null;
 
    let endText = match[2];
 
    if (!/\b(am|pm)\b/i.test(endText) && /\b(am|pm)\b/i.test(match[1])) {
        const period = (match[1].match(/\b(am|pm)\b/i) || [])[1];
        endText += " " + period;
    }
 
    const start = aiTimeTo24Hour(match[1]);
    const end = aiTimeTo24Hour(endText);
 
    return start && end ? `${start}-${end}` : null;
}
 
 
function getAIWindowsForEntry(entry) {
    const subject = subjects.find(s => String(s.id) === String(entry.subjectId));
 
    if (subject && String(subject.type).toLowerCase().includes("lab")) {
        return PRACTICAL_WINDOWS || [];
    }
 
    return LECTURE_WINDOWS || [];
}
 
 
function isValidAIWindow(entry, time) {
    return getAIWindowsForEntry(entry).some(
        window => `${window.start}-${window.end}` === time
    );
}
 
 
function getAIEntryCandidates(subject, text) {
    let candidates = timetable.filter(
        entry => String(entry.subjectId) === String(subject.id)
    );
 
    const day = parseAIWeekday(text);
    if (day) candidates = candidates.filter(entry => entry.day === day);
 
    const time = parseAITimeRange(text);
    if (time) candidates = candidates.filter(entry => entry.time === time);
 
    return candidates;
}
 
 
function checkAIConflict(newEntry, excludedEntryIds = []) {
    const excluded = new Set(excludedEntryIds.map(String));
 
    for (const entry of timetable) {
        if (excluded.has(String(entry.id))) continue;
        if (String(entry.day) !== String(newEntry.day)) continue;
 
        if (!timeRangeOverlaps(entry.time, newEntry.time)) continue;
 
        if (String(entry.teacherId) === String(newEntry.teacherId)) {
            return "Teacher conflict at the requested time.";
        }
 
        if (String(entry.roomId) === String(newEntry.roomId)) {
            return "Room or laboratory conflict at the requested time.";
        }
 
        if (
            String(entry.year) === String(newEntry.year) &&
            String(entry.semester) === String(newEntry.semester)
        ) {
            return "Semester already has another class at the requested time.";
        }
    }
 
    return null;
}
 
 
async function saveAndRefreshAITimetable(message) {
    await saveData();
    displayTimetable();
    updateDashboard();
    updateAIAssistantVisibility();
    showAICommandMessage(message, true);
}
 
 
function getWeekdayFreeCandidates(entry, preferredDays = null) {
    const days = preferredDays || [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    ];
 
    const windows = getAIWindowsForEntry(entry);
    const candidates = [];
 
    for (const day of days) {
        for (const window of windows) {
            const time = `${window.start}-${window.end}`;
            const proposed = {...entry, day, time};
 
            if (!checkAIConflict(proposed, [entry.id])) {
                candidates.push({day, time});
            }
        }
    }
 
    return candidates;
}
 
 
function scoreAISlot(entry, slot) {
    const sameDayEntries = timetable.filter(item =>
        String(item.id) !== String(entry.id) && item.day === slot.day
    );
 
    let score = 0;
 
    // Prefer weekdays over Saturday.
    if (slot.day === "Saturday") score += 1000;
 
    // Prefer using existing teaching days and reducing isolated gaps.
    if (sameDayEntries.length === 0) score += 8;
 
    // Prefer moderately occupied days so free days remain available.
    score += Math.max(0, sameDayEntries.length - 4) * 3;
 
    return score;
}
 
 
function chooseBestAISlot(entry, slots) {
    return [...slots].sort(
        (a, b) => scoreAISlot(entry, a) - scoreAISlot(entry, b)
    )[0] || null;
}
 
 
async function optimizeWeekdaySchedule(mode = "mostly-free") {
    const saturdayEntries = timetable
        .filter(entry => entry.day === "Saturday")
        .sort((a, b) => String(a.time).localeCompare(String(b.time)));
 
    let moved = 0;
    let unable = 0;
 
    for (const entry of saturdayEntries) {
        const candidates = getWeekdayFreeCandidates(entry);
        const best = chooseBestAISlot(entry, candidates);
 
        if (!best) {
            unable++;
            continue;
        }
 
        entry.day = best.day;
        entry.time = best.time;
        moved++;
    }
 
    const saturdayLeft = timetable.filter(
        entry => entry.day === "Saturday"
    ).length;
 
    let message = `${moved} Saturday class${moved === 1 ? "" : "es"} moved to Monday-Friday.`;
 
    if (saturdayLeft === 0) {
        message += " Saturday is now completely free.";
    } else {
        message += ` ${saturdayLeft} Saturday class${saturdayLeft === 1 ? " remains" : "es remain"} because no conflict-free weekday slot was available.`;
    }
 
    if (unable > 0 && mode === "free") {
        message += " The system kept all required conflict rules active.";
    }
 
    await saveAndRefreshAITimetable(message);
}
 
 
async function balanceWeekSchedule() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let moved = 0;
 
    for (const entry of [...timetable]) {
        if (!days.includes(entry.day)) continue;
 
        const counts = Object.fromEntries(
            days.map(day => [day, timetable.filter(item => item.day === day).length])
        );
 
        const busiest = days.reduce((a, b) => counts[a] > counts[b] ? a : b);
        const quietest = days.reduce((a, b) => counts[a] < counts[b] ? a : b);
 
        if (entry.day !== busiest || busiest === quietest) continue;
 
        const candidates = getWeekdayFreeCandidates(entry, [quietest]);
        const best = chooseBestAISlot(entry, candidates);
 
        if (best) {
            entry.day = best.day;
            entry.time = best.time;
            moved++;
        }
    }
 
    await saveAndRefreshAITimetable(
        moved
            ? `Weekday workload balanced. ${moved} class${moved === 1 ? "" : "es"} moved to reduce crowding.`
            : "The timetable is already reasonably balanced, or no safe balancing move was available."
    );
}
 
 
async function reduceGapsInSchedule(targetSemester = null) {
    const entries = targetSemester
        ? timetable.filter(entry => String(entry.semester) === String(targetSemester))
        : [...timetable];
 
    let moved = 0;
 
    for (const entry of entries) {
        if (entry.day === "Saturday") continue;
 
        const candidates = getWeekdayFreeCandidates(entry);
        const current = {day: entry.day, time: entry.time};
 
        const better = candidates.filter(slot =>
            scoreAISlot(entry, slot) < scoreAISlot(entry, current)
        );
 
        const best = chooseBestAISlot(entry, better);
 
        if (best) {
            entry.day = best.day;
            entry.time = best.time;
            moved++;
        }
    }
 
    await saveAndRefreshAITimetable(
        moved
            ? `Reduced timetable gaps by safely repositioning ${moved} class${moved === 1 ? "" : "es"}.`
            : "No conflict-free move was found that would reduce timetable gaps."
    );
}
 
 
function extractSemesterFromAIText(text) {
    const match = String(text || "").match(
        /\b(?:semester|sem)\s*(\d+)\b/i
    );
    return match ? match[1] : null;
}

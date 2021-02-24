// Firebase configuration
var firebaseConfig = {
    apiKey: "YAIzaSyCKV3sM-lLAKaZ1XkokRftXSCRANReWQs",
    authDomain: "ninja-firestore-tut-74e56.firebaseapp.com",
    projectId: "ninja-firestore-tut-74e56",
    storageBucket: "ninja-firestore-tut-74e56.appspot.com",
    messagingSenderId: "303358274118",
    appId: "1:303358274118:web:b23cb98bd8f1df064cb847"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to database
const db = firebase.firestore();

db.settings({timestampsInSnapshots: true});

// Get reference to HTML Elements
const cafeList = document.getElementById('cafe-list');
const form = document.querySelector('#add-cafe-form');


// Create element and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    // Set a unique id coming from the id of the document in database
    li.setAttribute('data-id', doc.id);

    // Set data gotten from database
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    // Add data to the HTML Element
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // Deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();

        // Get the id of the cross clicked
        let id = e.target.parentElement.getAttribute('data-id');

        // query database to delete
        db.collection('cafes').doc(id).delete();
    });
}

// Get all documents in collection - where and orderBy methods are optional
// db.collection('cafes').orderBy('name').get()

// .then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });



// Saving data to database
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reference cafes collection to add document
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });

    form.name.value = "";
    form.city.value = "";
});

// Add real time listener to the data base.
// Create a reference to the collection and add the listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();

    // Loop through all changes array and take action according its type
    changes.forEach( change => {
        if (change.type === 'added') {
            renderCafe(change.doc);
        } else if (change.type === 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});

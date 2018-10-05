var config = {
  apiKey: "AIzaSyBDM9ekqHRZwj_ymA8byZo_3gKqQ6EOSDE",
  authDomain: "vaderconfetti.firebaseapp.com",
  databaseURL: "https://vaderconfetti.firebaseio.com",
  projectId: "vaderconfetti",
  storageBucket: "vaderconfetti.appspot.com",
  messagingSenderId: "653966580632"
};
firebase.initializeApp(config);
let database = firebase.database();
let tName = $("#name");
let tDestination = $("#destination");
let tStart = $("#start");
let tFrequency = $("#frequency");
let tableBody = $("#table-body");
$(document).ready(function() {
  receive();

  setInterval(function() {
    receive();
  }, 60 * 1000);

  //submit the form
  $("#train-form").submit(function(event) {
    event.preventDefault();
    database.ref().push({
      name: tName.val(),
      destination: tDestination.val(),
      first: tStart.val(),
      frequency: tFrequency.val()
    });
    this.reset();
  });
});

function receive() {
  tableBody.empty();
  database.ref().on("child_added", function(snapshot) {
    let tr = $("<tr>");
    let nameTH = $("<th>");
    let destinationTH = $("<th>");
    let frequencyTH = $("<th>");
    let nextTH = $("<th>");
    let awayTH = $("<th>");

    let initialTrain = snapshot.val().first;
    let now = moment().format("HH:mm");

    let initialConverted = moment(initialTrain, "HH:mm").subtract(1, "years");
    let diff = moment().diff(moment(initialConverted), "minutes");

    //time apart
    let apart = diff % snapshot.val().frequency;
    //minutes until train
    let minAway = snapshot.val().frequency - apart;
    let nextTrain = moment().add(minAway, "minutes");

    nameTH.text(snapshot.val().name);
    destinationTH.text(snapshot.val().destination);
    frequencyTH.text(snapshot.val().frequency);
    nextTH.text(moment(nextTrain).format("HH:mm"));
    awayTH.text(minAway);
    tr.append(nameTH);
    tr.append(destinationTH);
    tr.append(frequencyTH);
    tr.append(nextTH);
    tr.append(awayTH);
    tableBody.append(tr);
  });
}

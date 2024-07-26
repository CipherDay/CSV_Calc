var res;

function parseTimeString(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

function calculateTimeDifference(startTime, endTime) {
    const start = parseTimeString(startTime);
    const end = parseTimeString(endTime);

    // Create Date objects for today with the given hours and minutes
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start.hours, start.minutes);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), end.hours, end.minutes);

    // Calculate the difference in milliseconds
    const differenceInMillis = endDate - startDate;

    // Convert the difference to hours and minutes
    const differenceInMinutes = Math.floor(differenceInMillis / 60000);
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;

    return { hours, minutes };
}

function buildTableHead(header) {
    let mainTR = document.createElement("tr")
    for (const item of header) {
        let th = document.createElement("th")
        th.textContent = item
        mainTR.appendChild(th)
    }
    return mainTR
}
function buildTableBody(data) {
    console.log(data);
    const mainTable =document.createElement("table")
    mainTable.appendChild(buildTableHead(data.meta.fields))
    for (const item of data.data) {
        let tempTr = document.createElement("tr")
        for (const header of data.meta.fields) {
            let temptd = document.createElement("td")
            temptd.textContent = item[header]
            tempTr.appendChild(temptd)
        }
        mainTable.appendChild(tempTr)
    }
    return mainTable
}

function main(results){
    let tb = buildTableBody(results)
    document.getElementById("tableCont").appendChild(tb)
    const timeInSelector = document.getElementById("timeIn")
    for (const item of results.meta.fields) {
        let tempOpt = document.createElement("option")
        tempOpt.value = item
        tempOpt.textContent = item
        timeInSelector.appendChild(tempOpt)
    }
    const timeOutSelector = document.getElementById("timeOut")
    for (const item of results.meta.fields) {
        let tempOpt = document.createElement("option")
        tempOpt.value = item
        tempOpt.textContent = item
        timeOutSelector.appendChild(tempOpt)
    }
    res = results
}


document.getElementById('csvFileInput').addEventListener('change', function(event) {
    document.getElementById("tableCont").innerHTML = ""
    document.getElementById("timeOut").innerHTML = ""
    document.getElementById("timeIn").innerHTML = ""
    document.getElementById("result").textContent = `Your pay is 00DA`

    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: main
    });
});
document.getElementById("clacBtn").onclick = (e)=>{
    if(!res){
        return
    }
    let timInValue = document.getElementById("timeIn").value
    let timOutValue = document.getElementById("timeOut").value
    let rateValue = document.getElementById("rate").value
    let Total = 0;
    let sumH = 0;
    let sumM = 0;
    for (const item of res.data) {
        let TD = calculateTimeDifference(item[timInValue],item[timOutValue])
        sumH = sumH + TD.hours
        sumM = sumM +TD.minutes
    }
    Total = (sumH * rateValue) + ((sumM / 60)*rateValue) 
    document.getElementById("result").textContent = `Your pay is ${Total}DA`

}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }

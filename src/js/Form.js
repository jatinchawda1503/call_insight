const table = document.getElementById("dataTable");

class CSVHandler {
  processCSV(csv) {
    const csvData = [];
    const lines = csv.split("\n");
    const headers = lines[0].split(";");
    const expectedColumnCount = headers.length;
    const StaticColumnLength = 6; // The number of columns that are always present in the CSV

    // Check if the number of columns is equal to Static Column Length
    if (expectedColumnCount !== StaticColumnLength) {
      alert("The CSV file must have 6 columns.");
      table.style.display = "none";
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(";");
      const rowData = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j].trim()] = fields[j].trim();
      }
      csvData.push(rowData);
    }
    this.csvData = csvData;
    return csvData;
  }

  displayCSV(csvData) {
    table.style.display = "block";
    $("#dataTable").DataTable({
      dom: "frtip",
      data: csvData,
      columns: [
        { title: "calldate", data: "calldate" },
        { title: "duration", data: "duration" },
        { title: "disposition", data: "disposition" },
        { title: "src", data: "src" },
        { title: "dst", data: "dst" },
        { title: "dstchannel", data: "dstchannel" },
      ],
      destroy: true,
    });
  }
}

function sendCSVDataToBackend(csvData) {
  fetch("/api/v1/upload.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(csvData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Response from backend:", response);
      // Read the response body as text
      return response.text();
    })
    .then((text) => {
      // Parse the response body as JSON
      try {
        const data = JSON.parse(text);
        if (data.success) {
          // Display success message
          alert(data.message);
          // Create a button to go to the dashboard
          const ShowDashboardButton = document.getElementById("dashbordBtn");
          ShowDashboardButton.style.display = "block";
        } else {
          // Handle other cases if needed
          alert(data.message);
        }
        // Handle response from backend if needed
      } catch (error) {
        console.error("Error parsing response body as JSON:", error);
        alert("Error parsing response body as JSON. Please try again later.");

      }
    })
    .catch((error) => {
      console.error("Error sending data to backend:", error);
      alert("An error occurred while sending data to the server. Please try again later.");
    });
}

document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let fileInput = document.getElementById("csvFile");
    let formArea = document.getElementById("formArea");
    let file = fileInput.files[0];
    // Check if file is empty
    if (!file) {
      alert("Please select a file.");
      return;
    }
    // Check if file is CSV
    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    formArea.style.display = 'none';
    let reader = new FileReader();
    reader.onload = function (event) {
      let csv = event.target.result;
      const csvDisplay = new CSVHandler();
      const csvData = csvDisplay.processCSV(csv);
      csvDisplay.displayCSV(csvData);
      sendCSVDataToBackend(csvData);
    };
    reader.readAsText(file);
  });

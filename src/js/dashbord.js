var url = "/api/v1/fetch_table.php";

async function fetchAllData() {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

function call_volume_per_hour(callData) {
  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

  // Parse dates and add year, month, and day properties
  callData.forEach((d) => {
    d.time = parseDate(d.calldate);
    d.year = d.time.getFullYear();
    d.month = d.time.getMonth() + 1; // Month is zero-based, so add 1
    d.day = d.time.getDate();
  });

  // Group call data by hour
  const callsByHour = d3.group(callData, (d) => d3.timeHour.floor(d.time));

  // Calculate call volume
  const callVolume = Array.from(callsByHour, ([key, value]) => ({
    time: key,
    count: value.length,
  }));

  // Set up SVG dimensions based on container width
  const margin = { top: 20, right: 30, bottom: 70, left: 50 };
  const parentWidth = document.getElementById("callVols").offsetWidth;
  const width = parentWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Remove existing SVG if any
  d3.select("#callVols svg").remove();

  // Create SVG element
  const svg = d3
    .select("#callVols")
    .append("svg")
    .attr("width", parentWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(callVolume, (d) => d.time))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(callVolume, (d) => d.count)])
    .nice()
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d) => xScale(d.time))
    .y((d) => yScale(d.count));

  // Add line to SVG
  svg
    .append("path")
    .datum(callVolume)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickFormat(d3.timeFormat("%I:%M %p")) // Format time without PM suffix
        .ticks(d3.timeHour.every(1)) // Show ticks every hour
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-45)");

  // Add Y axis
  svg.append("g").call(d3.axisLeft(yScale));

  // Add X axis label
  svg
    .append("text")
    .attr("transform", `translate(${width / 2},${height + margin.top + 40})`)
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white fill-black")
    .text("Time");

  // Add Y axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white")
    .text("Call Volume");

  // Filter by year
  const filterByYear = (year) => {
    const filteredData = callData.filter((d) => d.year === year);
    updateChart(filteredData);
  };

  // Filter by month
  const filterByMonth = (month) => {
    const filteredData = callData.filter((d) => d.month === month);
    updateChart(filteredData);
  };

  // Filter by day
  const filterByDay = (day) => {
    const filteredData = callData.filter((d) => d.day === day);
    updateChart(filteredData);
  };

  // Update chart with filtered data
  const updateChart = (filteredData) => {
    // Update call volume data
    const filteredCallsByHour = d3.group(filteredData, (d) =>
      d3.timeHour.floor(d.time)
    );
    const filteredCallVolume = Array.from(
      filteredCallsByHour,
      ([key, value]) => ({
        time: key,
        count: value.length,
      })
    );

    // Update X scale domain
    xScale.domain(d3.extent(filteredCallVolume, (d) => d.time));

    // Update line
    svg.selectAll("path").datum(filteredCallVolume).attr("d", line);

    // Update X axis
    svg
      .select(".x-axis")
      .transition()
      .duration(500)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat(d3.timeFormat("%I:%M %p"))
          .ticks(d3.timeHour.every(1))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("class","dark:fill-white")
      .attr("transform", "rotate(-45)");
  };

  // Add year filter dropdown
  const years = Array.from(new Set(callData.map((d) => d.year)));
  d3.select("#yearFilter")
    .selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d)
    .on("change", function () {
      filterByYear(+this.value);
    });

  // Add month filter dropdown
  const months = Array.from(new Set(callData.map((d) => d.month)));
  d3.select("#monthFilter")
    .selectAll("option")
    .data(months)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d)
    .on("change", function () {
      filterByMonth(+this.value);
    });

  // Add day filter dropdown
  const days = Array.from(new Set(callData.map((d) => d.day)));
  d3.select("#dayFilter")
    .selectAll("option")
    .data(days)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d)
    .on("change", function () {
      filterByDay(+this.value);
    });
}

function disposition_count(data) {
  const dispositionCounts = d3.rollup(data, v => v.length, d => d.disposition);
  const dispositionData = Array.from(dispositionCounts, ([disposition, count]) => ({ disposition, count }));
  
  const width = document.getElementById("dispositionCount").offsetWidth;
  const height = 425;
  const radius = Math.min(width, height - 100) / 2;

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);  
  const pie = d3.pie().value((d) => d.count);
  pie.padAngle(0.066);
  const svg = d3
    .select("#dispositionCount")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const arcs = svg
    .selectAll("arc")
    .data(pie(dispositionData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colorScale(i));

  const legend = svg
    .selectAll(".legend")
    .data(pie(dispositionData))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${(i % 3) * 200 - width / 2},${Math.floor(i / 3) * 30 + height / 2 - 20})`);

  legend
    .append("rect")
    .attr("x", 9)
    .attr("width", 18)
    .attr("height", 18)
    .attr("class","dark:fill-white")
    .style("fill", (d, i) => colorScale(i));

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("class","dark:fill-white")
    .style("text-anchor", "start")
    .text((d) => d.data.disposition);
}

function top_callers_recipients(data, topN, filter) {
  // Filter callData based on the selected filter (Caller or Recipient)
  const filteredCallData = data.filter(d => d.dst !== '' && (filter === 'Caller' ? d.dst : d.src));
  
  // Count the occurrences of each caller/recipient
  const callerRecipientCounts = d3.rollup(filteredCallData, v => v.length, d => (filter === 'Caller' ? d.dst : d.src));

  // Sort the callers/recipients based on their counts
  const sortedCallerRecipientCounts = Array.from(callerRecipientCounts, ([callerRecipient, count]) => ({ callerRecipient, count }))
    .sort((a, b) => b.count - a.count);

  // Select the top N callers/recipients
  const topCallerRecipients = sortedCallerRecipientCounts.slice(0, topN);
  
  // Set up SVG dimensions
  const width = document.getElementById("topCallersRecipients").offsetWidth;
  const height = 425;
  const margin = { top: 20, right: 30, bottom: 80, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Remove existing SVG if any
  d3.select("#topCallersRecipients svg").remove();

  // Create SVG element
  const svg = d3.select("#topCallersRecipients")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3.scaleBand()
    .domain(topCallerRecipients.map(d => d.callerRecipient))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(topCallerRecipients, d => d.count)])
    .range([innerHeight, 0]);

  // Create bars
  chartGroup.selectAll(".bar")
    .data(topCallerRecipients)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.callerRecipient))
      .attr("y", d => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.count))
      .attr("fill", "steelblue");

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-45)");

  // Add y-axis
  chartGroup.append("g")
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  chartGroup.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.top + 50)
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white")
    .text("Caller/Recipient");

  // Add y-axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - innerHeight / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white")
    .text("Call Count");
}

function call_channels(data) {
  // Filter out entries with empty or unknown channels
  const filteredData = data.filter(d => d.dstchannel && d.dstchannel !== '');

  // Count the occurrences of each channel
  const channelCounts = d3.rollup(filteredData, v => v.length, d => {
    if (d.dstchannel.includes('SIP')) return 'SIP';
    else if (d.dstchannel.includes('Local')) return 'LOCAL';
    else return '';
  });

  // Convert rollup object to array of objects
  const channelData = Array.from(channelCounts, ([channel, count]) => ({ channel, count }));

  // Set up SVG dimensions
  const width = document.getElementById("callChannels").offsetWidth;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG element
  const svg = d3.select("#callChannels")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3.scaleBand()
    .domain(channelData.map(d => d.channel))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(channelData, d => d.count)])
    .nice()
    .range([innerHeight, 0]);

  // Create bars
  chartGroup.selectAll(".bar")
    .data(channelData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.channel))
      .attr("y", d => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.count))
      .attr("fill", d => d.channel === 'SIP' ? 'steelblue' : 'orange');

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-45)");

  // Add y-axis
  chartGroup.append("g")
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  chartGroup.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.top + 10)
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white")
    .text("Channel");

  // Add y-axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - innerHeight / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("class","dark:fill-white")
    .text("Call Count");
}

function displayViz(data) {
  call_volume_per_hour(data);
  disposition_count(data);
  call_channels(data);
  top_callers_recipients(data, 10, 'Caller'); // Initially set to 'Caller'

  // Add event listener to the filter dropdown menu
  document.getElementById("callerRecipientFilter").addEventListener("change", function() {
    const filter = this.value; // Define filter variable
    top_callers_recipients(data, 10, filter); // Update the chart based on the selected filter
  });
}

function displayStatistics(data) {
  const totalCalls = data.length;
  const averageCallDuration = d3.mean(data, (d) => d.duration);
  const minCallDuration = d3.min(data, (d) => d.duration);
  const maxCallDuration = d3.max(data, (d) => d.duration);
  const dispositionCounts = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.disposition
  );
  const dispositionData = Array.from(
    dispositionCounts,
    ([disposition, count]) => ({ disposition, count })
  );

  const filteredData = data.filter(d => d.dstchannel && d.dstchannel !== '');

  // Count the occurrences of each channel
  const channelCounts = d3.rollup(filteredData, v => v.length, d => {
    if (d.dstchannel.includes('SIP')) return 'SIP';
    else if (d.dstchannel.includes('Local')) return 'LOCAL';
    else return '';
  });

  // Convert rollup object to array of objects
  const channelData = Array.from(channelCounts, ([channel, count]) => ({ channel, count }));

  document.getElementById("totalCalls").innerText = totalCalls;
  document.getElementById("averageCallDuration").innerText =
    averageCallDuration.toFixed(2);
  document.getElementById("minCallDuration").innerText = minCallDuration;
  document.getElementById("maxCallDuration").innerText = maxCallDuration;
  document.getElementById("dispositionAnswered").innerText =
    dispositionData[0].count;
  document.getElementById("dispositionNotAnswered").innerText =
    dispositionData[1].count;
  document.getElementById("dispositionFailed").innerText =
    dispositionData[2].count;
  document.getElementById("channelSIP").innerText =
    channelData[0].count;
  document.getElementById("channelLOCAL").innerText =
    channelData[1].count;
}

function getTables() {
  var dashbordTable = $("#dashbordTable");
  dashbordTable.DataTable({
    ajax: url,
    processing: true,
    serverSide: true,
    columns: [
      { title: "calldate", data: "calldate" },
      { title: "duration", data: "duration" },
      { title: "disposition", data: "disposition" },
      { title: "src", data: "src" },
      { title: "dst", data: "dst" },
      { title: "dstchannel", data: "dstchannel" },
    ],
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  getTables();
  await fetchAllData()
    .then((response) => {
      displayStatistics(response.data);
      displayViz(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

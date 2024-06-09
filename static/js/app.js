// Set up URL for data
 const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
 // Fetch the JSON data
 d3.json(url).then((data) => {
 // Use the fetched data in the functions
 buildMetadata(data);
 });

// Set up variables and get data from JSON for charts 
let samples;
let meta_data;

// Fetch the JSON data and initialize the dropdown menu, metadata, and charts
d3.json(url).then(function(data) {
    // Select the dropdown menu
    let selector = d3.select("#selDataset");
    // Get metadata and sample data
    meta_data = data.metadata;
    samples = data.samples;
    // Populate the dropdown menu with sample IDs
    data.names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });
    // Display the metadata and initial charts for the first sample
    metaData(meta_data[0]);
    hbarChart(samples[0]);
    bubbleChart(samples[0]);
});

// Function to handle change in dropdown selection
function optionChanged(value) {
    // Find the selected sample data and demographic info
    const selectedId = samples.find((item) => item.id === value);
    const demographicInfo = meta_data.find((item) => item.id == value);

    // Insert Demographic Data
    metaData(demographicInfo);

    // Update Bar Chart
    hbarChart(selectedId);

    // Update Bubble Chart
    bubbleChart(selectedId);
}

// Function to display metadata
function metaData(demographicInfo) {
    // Select the demographic info panel
    let demoSelect = d3.select("#sample-metadata");

    // Display the demographic info
    demoSelect.html(
        `id: ${demographicInfo.id} <br> 
        ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} <br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} <br>
        wfreq: ${demographicInfo.wfreq}`
    );
}

// Function to create the horizontal bar chart
function hbarChart(selectedId) {
    // Prepare data for the bar chart
    let x_axis = selectedId.sample_values.slice(0, 10).reverse();
    let y_axis = selectedId.otu_ids
        .slice(0, 10)
        .reverse()
        .map((item) => `OTU ${item}`);
    let text = selectedId.otu_labels.slice(0, 10).reverse();

    // Create the bar chart trace
    let barChart = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
        marker: {
          color: 'purple'
        }
    };

    let chart = [barChart];

    // Define the layout of the bar chart
    let layout = {
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100,
        },
        height: 500,
        width: 600,
       
    };

    // Plot the bar chart
    Plotly.newPlot("bar", chart, layout);
}

// Function to create the bubble chart
function bubbleChart(selectedId) {
    // Prepare data for the bubble chart
    let x_axis = selectedId.otu_ids;
    let y_axis = selectedId.sample_values;
    let marker_size = selectedId.sample_values;
    let color = selectedId.otu_ids;
    let text = selectedId.otu_labels;

    // Create the bubble chart trace
    let bubble = {
        x: x_axis,
        y: y_axis,
        text: text,
        mode: "markers",
        marker: {
            color: color,
            colorscale: "Electric",
            size: marker_size,
        },
        type: "scatter",
    };

    let chart = [bubble];

    // Define the layout of the bubble chart
    let layout = {
        xaxis: {
            title: { text: "OTU ID" },
        },
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", chart, layout);
}
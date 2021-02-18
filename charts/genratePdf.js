    let htmlSTR= `<!DOCTYPE HTML>
    <html>
    <head>
    <script>
    window.onload = function() {
    
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: false,
        animationEnabled: false,
        title: {
            text: "Desktop Browser Market Share in 2016"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: [
                { y: 51.08, label: "Chrome" },
                { y: 27.34, label: "Internet Explorer" },
                { y: 10.62, label: "Firefox" },
                { y: 5.02, label: "Microsoft Edge" },
                { y: 4.07, label: "Safari" },
                { y: 1.22, label: "Opera" },
                { y: 0.44, label: "Others" }
            ]
        }]
    });
    chart.render();
    
    }
    </script>
    </head>
    <body>
    <div id="chartContainer" style="height: 300px; width: 100%;"></div>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
    </body>
    </html>`
    const Promise = require('bluebird');
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data =  pdf.createAsync(htmlSTR, { "height": "10.5in","width": "14.5in", filename: `./charts/abc1.pdf` })


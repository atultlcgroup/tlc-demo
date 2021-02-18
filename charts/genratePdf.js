    let htmlSTR= `<html>
    <head>
      <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
      <script type="text/javascript">
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Work',     11],
            ['Eat',      2],
            ['Commute',  2],
            ['Watch TV', 2],
            ['Sleep',    7]
          ]);
  
          var options = {
            title: 'My Daily Activities',
            is3D: true,
          };
  
          var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
          chart.draw(data, options);
        }
      </script>
    </head>
    <body>
      <div id="piechart_2d" style="width: 900px; height: 500px;"></div>
    </body>
  </html>`
    const Promise = require('bluebird');
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data =  pdf.createAsync(htmlSTR, { "height": "10.5in","width": "14.5in", filename: `./charts/abc2.pdf` })


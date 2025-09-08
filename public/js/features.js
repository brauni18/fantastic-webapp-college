let map;
  let isExpanded = false;
  let userPlacedPin = null;
  

  function initMap() {
    map = new Microsoft.Maps.Map(document.getElementById('map'), {
      credentials: 'YOUR_BING_MAPS_KEY', 
      showDashboard: false,
      showMapTypeSelector: false
    });
    
    var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {
      title: 'You Are Here',
      subTitle: 'Our government spies are currently tracking you.'
    });
    
    const mapElement = document.getElementById('map');
    
    function toggleMap() {
      isExpanded = !isExpanded;
      mapElement.classList.toggle('expanded', isExpanded);
      setTimeout(() => {
        Microsoft.Maps.Events.invoke(map, 'resize');
      }, 100);
    }
    map.entities.push(pushpin);
    function addPinAtLocation(location) {
      if (userPlacedPin) {
        map.entities.remove(userPlacedPin);
      }
      
      userPlacedPin = new Microsoft.Maps.Pushpin(location, {
        title: 'Pishpun',
        subTitle: `^ ${location.latitude.toFixed(3)} > ${location.longitude.toFixed(3)}`,
        icon: '/images/pishpun.png'
      });
      
      map.entities.push(userPlacedPin);
      savePinToDatabase(location.latitude, location.longitude);
    }

    document.addEventListener('click', function(e) {
      if (isExpanded !== mapElement.contains(e.target)) {
        toggleMap();
      }
    });

    Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
      if (isExpanded) {
        var clickedLocation = e.location;
        addPinAtLocation(clickedLocation);
      }
    });
  }

  async function savePinToDatabase(latitude, longitude) {
    try {
      const response = await fetch('/api/users/save-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude
        })
      });
      
      if (response.ok) {
        console.log('pishpun');
      } else {
        console.error('pishpun fail');
      }
    } catch (error) {
      console.error('pishpun error', error);
    }
  }

  
// ===== D3.js CHARTS =====
class StatisticsCharts {
  constructor() {
    this.initCharts();
    this.loadData();
  }

  async loadData() {
    console.log('loading charts');
    try {
      const postsResponse = await fetch('/statistics/posts-per-day');
      const usersResponse = await fetch('/statistics/users-online-per-day');
      
      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error(`error/posts${postsResponse.status}, Users ${usersResponse.status}`);
      }
      
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();
      this.updatePostsChart(postsData.postsPerDay);
      this.updateUsersChart(usersData.usersOnlinePerDay);
    } catch (error) {
      console.error('Error on charts', error);
      const mockData = {
        postsPerDay: [
          {date: '9/2', count: 3}, {date: '9/3', count: 7}, {date: '9/4', count: 2},
          {date: '9/5', count: 9}, {date: '9/6', count: 4}, {date: '9/7', count: 6}, {date: '9/8', count: 8}
        ],
        usersOnlinePerDay: [
          {date: '9/2', count: 12}, {date: '9/3', count: 18}, {date: '9/4', count: 8},
          {date: '9/5', count: 22}, {date: '9/6', count: 15}, {date: '9/7', count: 19}, {date: '9/8', count: 25}
        ]
      };
      this.updatePostsChart(mockData.postsPerDay);
      this.updateUsersChart(mockData.usersOnlinePerDay);
    }
  }

  initCharts() {
    const margin = {top: 20, right: 15, bottom: 30, left: 30};
    const width = 180 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    this.usersChart = d3.select("#users-online-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    this.usersChart.append("text")
      .attr("x", width / 2).attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px").style("font-weight", "bold")
      .text("Users Online Per Day");

    // Posts chart  
    this.postsChart = d3.select("#posts-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    this.postsChart.append("text")
      .attr("x", width / 2).attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px").style("font-weight", "bold")
      .text("Posts Per Day");
  }

  updateUsersChart(data) {
    const margin = {top: 20, right: 15, bottom: 30, left: 30};
    const width = 180 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    this.usersChart.selectAll(".bar, .axis").remove();
    const x = d3.scaleBand().domain(data.map(d => d.date)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .nice()
      .range([height, 0]);
    this.usersChart.selectAll(".bar").data(data).enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date)).attr("width", x.bandwidth())
      .attr("y", d => y(d.count)).attr("height", d => height - y(d.count))
      .attr("fill", "#6597f2");
    this.usersChart.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    this.usersChart.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(3).tickFormat(d => d % 5 === 0 ? d : ""));
  }

  updatePostsChart(data) {
    const margin = {top: 20, right: 15, bottom: 30, left: 30};
    const width = 180 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    this.postsChart.selectAll(".bar, .axis").remove();
    const x = d3.scaleBand().domain(data.map(d => d.date)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .nice()
      .range([height, 0]);
    this.postsChart.selectAll(".bar").data(data).enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date)).attr("width", x.bandwidth())
      .attr("y", d => y(d.count)).attr("height", d => height - y(d.count))
      .attr("fill", "#00c46a");
    this.postsChart.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    this.postsChart.append("g")
      .attr("class", "axis") 
      .call(d3.axisLeft(y).ticks(3).tickFormat(d => d % 5 === 0 ? d : ""));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new StatisticsCharts();
});
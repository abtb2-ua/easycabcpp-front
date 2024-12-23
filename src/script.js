let currentTab = 0
let tabs = document.getElementsByClassName('tab');
let themeColors = ['#84b6f4', 'rgb(221, 221, 61)', '#e79eff']


function moveNext() {
  tabs[currentTab].classList.remove('show');
  currentTab++;
  tabs[currentTab].classList.remove('hidden-bottom');
}

function movePrevious() {
  tabs[currentTab].classList.add('hidden-bottom');
  currentTab--;
  tabs[currentTab].classList.add('show');
}

function select(n) {
  document.getElementById('selector').style.setProperty('--i', n)
  document.querySelector('body').style.setProperty('--theme-clr', themeColors[n]);
  items = document.getElementsByClassName('item');

  for (item of items) {
    item.classList.remove('selected');
  }

  setTimeout(() => {
    items[n].classList.add('selected');
  }, 50);

  // if (n > 0) {
  //   document.getElementById('map-container').classList.remove('show');
  // } else {
  //   let mapContainer = document.getElementById('map-container');
  //   if (!mapContainer.classList.contains('show')) {
  //     mapContainer.classList.add('show');
  //   }
  // }
  let i = 0;
  while (currentTab > n && i < 10) {
    movePrevious();
    i++;
  }

  while (currentTab < n && i < 10) {
    console.log('currentTab:', i);
    moveNext();
    i++;
  }
}

function foo() {
  console.log('map:');
}

const map = document.getElementById('map')

for (let i = 0; i < 20; i++) {
  let row = document.createElement('div')
  row.classList.add('row')

  for (let j = 0; j < 20; j++) {
    let span = document.createElement('span')
    let cell = document.createElement('div');
    cell.classList.add('cell');
    if (j + i == 10) {
      cell.classList.add('taxi');
      span.innerHTML = '!88m'
    }
    if (j + i == 12) {
      cell.classList.add('location');
      span.innerHTML = '!88m'
    }
    if (j + i == 14) {
      cell.classList.add('customer');
      span.innerHTML = '!88m'
    }

    if (j + i == 16) {
      cell.classList.add('taxiStopped');
      span.innerHTML = '!88m'
    }
    row.appendChild(cell);
    // cell.style.setProperty("--x", i);
    // cell.style.setProperty("--y", j);
    // map.appendChild(cell);
    cell.appendChild(span)
  }

  map.appendChild(row);
}

select(1);
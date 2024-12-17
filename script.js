const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const totalWorkingDaysElement = document.getElementById('totalWorkingDays');
const totalSelectedDaysElement = document.getElementById('totalSelectedDays');
const percentageElement = document.getElementById('percentage');

let currentDate = new Date(); // Keep track of the current month
let officeDays = JSON.parse(localStorage.getItem('officeDays')) || {};

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${currentDate.toLocaleString('default', {
    month: 'long',
  })} ${year}`;

  calendar.innerHTML = '';

  let workingDaysCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateId = `${year}-${month + 1}-${day}`;
    const date = new Date(year, month, day);
    const isWorkingDay = date.getDay() >= 1 && date.getDay() <= 5; // Monday to Friday
    if (isWorkingDay) workingDaysCount++;

    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.textContent = day;

    // Highlight office days
    if (officeDays[dateId]) {
      dayElement.classList.add('office-day');
    }

    dayElement.addEventListener('click', () => toggleOfficeDay(dateId, dayElement));
    calendar.appendChild(dayElement);
  }

  updateSummary(workingDaysCount);
}

function toggleOfficeDay(dateId, element) {
  if (officeDays[dateId]) {
    delete officeDays[dateId];
    element.classList.remove('office-day');
  } else {
    officeDays[dateId] = true;
    element.classList.add('office-day');
  }
  saveOfficeDays();
  renderCalendar();
}

function saveOfficeDays() {
  localStorage.setItem('officeDays', JSON.stringify(officeDays));
}

function updateSummary(workingDaysCount) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Count selected office days
  const selectedDays = Object.keys(officeDays).filter((dateId) => {
    const [y, m, d] = dateId.split('-').map(Number);
    return y === year && m - 1 === month;
  }).length;

  const percentage = workingDaysCount
    ? ((selectedDays / workingDaysCount) * 100).toFixed(2)
    : 0;

  // Update DOM
  totalWorkingDaysElement.textContent = workingDaysCount;
  totalSelectedDaysElement.textContent = selectedDays;
  percentageElement.textContent = `${percentage}%`;
}

// Navigate to the previous month
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

// Navigate to the next month
nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

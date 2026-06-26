import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    axios.get('/api/events').then(res => setEvents(res.data)).catch(console.error);
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const dayEvents = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => new Date(e.date).toISOString().slice(0,10) === dateStr);
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="bg-gray-700 px-3 py-1 rounded">&lt;</button>
          <span className="text-lg font-bold px-4">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="bg-gray-700 px-3 py-1 rounded">&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-sm text-gray-400 py-2">{d}</div>
        ))}
        {Array.from({length: firstDay}).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({length: daysInMonth}).map((_, i) => {
          const day = i + 1;
          const dayEvts = dayEvents(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          const isSelected = selectedDate === day;
          return (
            <div key={day} onClick={() => setSelectedDate(day)}
              className={`min-h-24 p-1 rounded cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isToday ? 'bg-blue-900' : 'bg-gray-800'} hover:bg-gray-700`}>
              <span className="text-sm">{day}</span>
              {dayEvts.slice(0, 2).map(e => (
                <Link key={e._id} to={`/events/${e.name}`} className="block text-xs bg-blue-600 rounded px-1 truncate mt-1">
                  {e.name}
                </Link>
              ))}
              {dayEvts.length > 2 && <span className="text-xs text-gray-400">+{dayEvts.length - 2} more</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

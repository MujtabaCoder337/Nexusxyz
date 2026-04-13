import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  id: number;
  date: Date;
  title: string;
  with: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

const MeetingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 1, date: new Date(2026, 3, 5), title: 'Startup Pitch', with: 'John Investor', status: 'Pending' },
    { id: 2, date: new Date(2026, 3, 7), title: 'Funding Discussion', with: 'Sarah VC', status: 'Accepted' },
  ]);
  const [newSlot, setNewSlot] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [meetingRequest, setMeetingRequest] = useState({ title: '', with: '', date: '' });

  const addAvailabilitySlot = () => {
    if (newSlot) {
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setNewSlot('');
    }
  };

  const removeSlot = (index: number) => {
    const updated = [...availabilitySlots];
    updated.splice(index, 1);
    setAvailabilitySlots(updated);
  };

  const sendMeetingRequest = () => {
    if (meetingRequest.title && meetingRequest.with && meetingRequest.date) {
      const newMeeting: Meeting = {
        id: meetings.length + 1,
        date: new Date(meetingRequest.date),
        title: meetingRequest.title,
        with: meetingRequest.with,
        status: 'Pending'
      };
      setMeetings([...meetings, newMeeting]);
      setMeetingRequest({ title: '', with: '', date: '' });
      setShowRequestForm(false);
      alert('Meeting request sent!');
    } else {
      alert('Please fill all fields');
    }
  };

  const updateMeetingStatus = (id: number, status: 'Accepted' | 'Declined') => {
    const updated = meetings.map(meeting => 
      meeting.id === id ? { ...meeting, status } : meeting
    );
    setMeetings(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Meeting Scheduler</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Calendar</h3>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
          <p className="mt-2 text-sm text-gray-600">
            Selected Date: {selectedDate instanceof Date ? selectedDate.toDateString() : 'None'}
          </p>
        </div>

        {/* Availability Slots */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">My Availability Slots</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="e.g., Mon 10 AM - 12 PM"
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              onClick={addAvailabilitySlot}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {availabilitySlots.length === 0 ? (
            <p className="text-gray-500">No slots added</p>
          ) : (
            <ul className="space-y-1">
              {availabilitySlots.map((slot, idx) => (
                <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{slot}</span>
                  <button onClick={() => removeSlot(idx)} className="text-red-500 text-sm">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Meeting Requests Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Meeting Requests</h3>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Meeting Request
          </button>
        </div>

        {showRequestForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Send Meeting Request</h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Meeting Title"
                value={meetingRequest.title}
                onChange={(e) => setMeetingRequest({...meetingRequest, title: e.target.value})}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="With (Name)"
                value={meetingRequest.with}
                onChange={(e) => setMeetingRequest({...meetingRequest, with: e.target.value})}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="date"
                value={meetingRequest.date}
                onChange={(e) => setMeetingRequest({...meetingRequest, date: e.target.value})}
                className="w-full border rounded px-2 py-1"
              />
              <div className="flex gap-2">
                <button onClick={sendMeetingRequest} className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
                <button onClick={() => setShowRequestForm(false)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Meetings List */}
        <div className="space-y-2">
          {meetings.length === 0 ? (
            <p className="text-gray-500">No meetings</p>
          ) : (
            meetings.map(meeting => (
              <div key={meeting.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-gray-600">With: {meeting.with}</p>
                  <p className="text-sm text-gray-500">{meeting.date.toDateString()}</p>
                </div>
                <div>
                  {meeting.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => updateMeetingStatus(meeting.id, 'Accepted')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Accept</button>
                      <button onClick={() => updateMeetingStatus(meeting.id, 'Declined')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Decline</button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${
                      meeting.status === 'Accepted' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {meeting.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingCalendar;
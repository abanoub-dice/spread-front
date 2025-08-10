import CalendarPage from '~/pages/protected/calendar-page/CalendarPage';

export function meta() {
  return [
    { title: "Calendar - Spread" },
    { name: "description", content: "View and manage your social media content calendar with Spread's intuitive calendar interface" },
  ];
}

export default function CalendarView() {
  return <CalendarPage />;
}

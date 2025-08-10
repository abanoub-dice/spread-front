import CalendarPage from "~/pages/protected/calendar-page/CalendarPage";

export function meta() {
  return [
    { title: "Client Dashboard - Spread" },
    { name: "description", content: "Manage your social media content and track your posts with Spread's client dashboard" },
  ];
}

export default function ClientHome() {
  return <CalendarPage />;
}

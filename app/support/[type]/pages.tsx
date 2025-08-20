import { notFound } from 'next/navigation';
import BugReportPage from '../BugReportPage';
import GeneralTicketPage from '../GeneralTicketPage';
import ReportCheaterPage from '../ReportCheaterPage';
import StaffApplicationPage from '../StaffApplicationPage';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function SupportTypePage({ params }: PageProps) {
  const { type } = await params;

  switch (type) {
    case 'bug-report':
      return <BugReportPage />;
    case 'general-ticket':
      return <GeneralTicketPage />;
    case 'report-cheater':
      return <ReportCheaterPage />;
    case 'staff-application':
      return <StaffApplicationPage />;
    default:
      notFound();
  }
}

export function generateStaticParams() {
  return [
    { type: 'bug-report' },
    { type: 'general-ticket' },
    { type: 'report-cheater' },
    { type: 'staff-application' },
  ];
}
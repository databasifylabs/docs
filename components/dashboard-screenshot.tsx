import Image from 'next/image';
import dashboardDark from '@/assets/dashboard-dark.png';
import dashboardLight from '@/assets/dashboard-light.png';

const screenshotClassName = 'rounded-xl border w-full h-auto';

export function DashboardScreenshot() {
  return (
    <>
      <Image
        src={dashboardLight}
        alt="The Databasify dashboard"
        className={`${screenshotClassName} dark:hidden`}
        priority
      />
      <Image
        src={dashboardDark}
        alt="The Databasify dashboard"
        className={`${screenshotClassName} hidden dark:block`}
        priority
      />
    </>
  );
}

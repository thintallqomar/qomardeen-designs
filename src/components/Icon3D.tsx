/**
 * 3D Glossy Glass Icon component
 * Maps icon names to generated 3D PNG assets
 */

// Icon imports
import briefcaseIcon from '@/assets/icons/briefcase.png';
import graduationCapIcon from '@/assets/icons/graduation-cap.png';
import mapPinIcon from '@/assets/icons/map-pin.png';
import smartphoneIcon from '@/assets/icons/smartphone.png';
import layersIcon from '@/assets/icons/layers.png';
import usersIcon from '@/assets/icons/users.png';
import paletteIcon from '@/assets/icons/palette.png';
import lightbulbIcon from '@/assets/icons/lightbulb.png';
import targetIcon from '@/assets/icons/target.png';
import layoutIcon from '@/assets/icons/layout.png';
import databaseIcon from '@/assets/icons/database.png';
import workflowIcon from '@/assets/icons/workflow.png';
import serverIcon from '@/assets/icons/server.png';
import compassIcon from '@/assets/icons/compass.png';
import brainIcon from '@/assets/icons/brain.png';
import sparklesIcon from '@/assets/icons/sparkles.png';
import mailIcon from '@/assets/icons/mail.png';
import checkCircleIcon from '@/assets/icons/check-circle.png';
import trendingUpIcon from '@/assets/icons/trending-up.png';
import refreshCwIcon from '@/assets/icons/refresh-cw.png';
import globeIcon from '@/assets/icons/globe.png';
import sendIcon from '@/assets/icons/send.png';
import zapIcon from '@/assets/icons/zap.png';
import rocketIcon from '@/assets/icons/rocket.png';
import codeIcon from '@/assets/icons/code.png';
import clockIcon from '@/assets/icons/clock.png';
import shieldIcon from '@/assets/icons/shield.png';
import linkedinIcon from '@/assets/icons/linkedin.png';
import phoneIcon from '@/assets/icons/phone.png';
import calendarIcon from '@/assets/icons/calendar.png';
import messageSquareIcon from '@/assets/icons/message-square.png';
import cpuIcon from '@/assets/icons/cpu.png';
import monitorSmartphoneIcon from '@/assets/icons/monitor-smartphone.png';
import boxIcon from '@/assets/icons/box.png';
import circuitBoardIcon from '@/assets/icons/circuit-board.png';
import userIcon from '@/assets/icons/user.png';

const iconMap: Record<string, string> = {
  briefcase: briefcaseIcon,
  'graduation-cap': graduationCapIcon,
  'map-pin': mapPinIcon,
  smartphone: smartphoneIcon,
  layers: layersIcon,
  users: usersIcon,
  palette: paletteIcon,
  lightbulb: lightbulbIcon,
  target: targetIcon,
  layout: layoutIcon,
  database: databaseIcon,
  workflow: workflowIcon,
  server: serverIcon,
  compass: compassIcon,
  brain: brainIcon,
  sparkles: sparklesIcon,
  mail: mailIcon,
  'check-circle': checkCircleIcon,
  'trending-up': trendingUpIcon,
  'refresh-cw': refreshCwIcon,
  globe: globeIcon,
  send: sendIcon,
  zap: zapIcon,
  rocket: rocketIcon,
  code: codeIcon,
  clock: clockIcon,
  shield: shieldIcon,
  linkedin: linkedinIcon,
  phone: phoneIcon,
  calendar: calendarIcon,
  'message-square': messageSquareIcon,
  cpu: cpuIcon,
  'monitor-smartphone': monitorSmartphoneIcon,
  box: boxIcon,
  'circuit-board': circuitBoardIcon,
  user: userIcon,
  // Aliases
  'bar-chart': targetIcon, // reuse
  'code2': codeIcon,
  'check': checkCircleIcon,
};

interface Icon3DProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon3D = ({ name, size = 24, className = '' }: Icon3DProps) => {
  const src = iconMap[name];
  
  if (!src) {
    // Fallback for unmapped icons
    return <div className={`inline-flex ${className}`} style={{ width: size, height: size }} />;
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`inline-block object-contain ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
};

export default Icon3D;
export { iconMap };

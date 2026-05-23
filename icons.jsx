// Lightweight stroked icons (1.6 stroke), aligned to a 24px grid.
// Pass size/color via props. Keep these simple — geometric shapes only.

const Ico = ({ d, size = 22, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const IconHome     = (p) => <Ico {...p} d={<><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>} />;
const IconWallet   = (p) => <Ico {...p} d={<><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12.5h3"/><path d="M3 9h14a2 2 0 012 2"/></>} />;
const IconDoc      = (p) => <Ico {...p} d={<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/></>} />;
const IconUsers    = (p) => <Ico {...p} d={<><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3 3-4.6 5.5-4.6S14 16 14.5 19"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c2 .1 3.7 1.5 4.5 4"/></>} />;
const IconGear     = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 12a7.4 7.4 0 00-.1-1.4l2-1.5-2-3.4-2.4.9a7.5 7.5 0 00-2.5-1.4L14 3h-4l-.4 2.2a7.5 7.5 0 00-2.5 1.4L4.7 5.7l-2 3.4 2 1.5a7.4 7.4 0 000 2.8l-2 1.5 2 3.4 2.4-.9a7.5 7.5 0 002.5 1.4L10 21h4l.4-2.2a7.5 7.5 0 002.5-1.4l2.4.9 2-3.4-2-1.5c.1-.5.1-.9.1-1.4z"/></>} />;
const IconPlus     = (p) => <Ico {...p} sw={2} d={<><path d="M12 5v14M5 12h14"/></>} />;
const IconBack     = (p) => <Ico {...p} d={<><path d="M15 5l-7 7 7 7"/></>} />;
const IconChevron  = (p) => <Ico {...p} d={<><path d="M9 6l6 6-6 6"/></>} />;
const IconMore     = (p) => <Ico {...p} d={<><circle cx="5"  cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></>} />;
const IconShare    = (p) => <Ico {...p} d={<><path d="M12 4v12"/><path d="M8 8l4-4 4 4"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/></>} />;
const IconQR       = (p) => <Ico {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 18v3h3M21 21h-1"/></>} />;
const IconPin      = (p) => <Ico {...p} d={<><path d="M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="8" r="2.5"/></>} />;
const IconClock    = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />;
const IconCloud    = (p) => <Ico {...p} d={<><path d="M7 17h10a4 4 0 100-8 6 6 0 00-11.6 1.5A3.5 3.5 0 007 17z"/></>} />;
const IconUpload   = (p) => <Ico {...p} d={<><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 18v2h16v-2"/></>} />;
const IconImg      = (p) => <Ico {...p} d={<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M4 18l5-5 4 4 3-3 4 4"/></>} />;
const IconPdf      = (p) => <Ico {...p} d={<><path d="M7 3h8l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12v6"/><path d="M10 12h2a1.5 1.5 0 010 3h-2"/></>} />;
const IconSearch   = (p) => <Ico {...p} d={<><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></>} />;
const IconFilter   = (p) => <Ico {...p} d={<><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></>} />;
const IconSwap     = (p) => <Ico {...p} d={<><path d="M4 7h13l-3-3"/><path d="M20 17H7l3 3"/></>} />;
const IconEdit     = (p) => <Ico {...p} d={<><path d="M5 19l3-.6L19 7.4 16.6 5 5.6 16zM14.5 7l2.5 2.5"/></>} />;
const IconTrash    = (p) => <Ico {...p} d={<><path d="M5 7h14"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/></>} />;
const IconCheck    = (p) => <Ico {...p} sw={2} d={<><path d="M5 12l4 4 10-10"/></>} />;
const IconLink     = (p) => <Ico {...p} d={<><path d="M10 14a4 4 0 005.6 0l3-3a4 4 0 10-5.6-5.6l-1 1"/><path d="M14 10a4 4 0 00-5.6 0l-3 3a4 4 0 005.6 5.6l1-1"/></>} />;
const IconBell     = (p) => <Ico {...p} d={<><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 10-9 0v4z"/><path d="M10 20a2 2 0 004 0"/></>} />;
const IconArchive  = (p) => <Ico {...p} d={<><rect x="3" y="5" width="18" height="4" rx="1"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/></>} />;
const IconSun      = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></>} />;
const IconCompass  = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M9 15l1.5-4.5L15 9l-1.5 4.5z" fill="currentColor"/></>} />;
const IconSparkle  = (p) => <Ico {...p} d={<><path d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z"/></>} />;
const IconCamera   = (p) => <Ico {...p} d={<><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.5"/></>} />;
const IconClose    = (p) => <Ico {...p} sw={2} d={<><path d="M6 6l12 12M18 6L6 18"/></>} />;

Object.assign(window, {
  IconHome, IconWallet, IconDoc, IconUsers, IconGear,
  IconPlus, IconBack, IconChevron, IconMore, IconShare, IconQR,
  IconPin, IconClock, IconCloud, IconUpload, IconImg, IconPdf,
  IconSearch, IconFilter, IconSwap, IconEdit, IconTrash, IconCheck,
  IconLink, IconBell, IconArchive, IconSun, IconCompass, IconSparkle,
  IconCamera, IconClose,
});

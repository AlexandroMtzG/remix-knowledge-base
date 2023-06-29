import type { SideBarItem } from "./SidebarItem";

export const AdminSidebar = (): SideBarItem[] => [
  {
    title: "",
    path: "",
    items: [
      {
        title: "Dashboard",
        path: `/admin`,
        exact: true,
        icon: `<svg className={className} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 172 172" fill="currentColor"> <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" // style="mix-blend-mode: normal" > <path d="M0,172v-172h172v172z" fill="none" /> <g fill="currentColor"> <path d="M86,11.46667c-1.4986,0.0001 -2.93759,0.58695 -4.00886,1.6349l-62.54036,51.15208c-0.07223,0.05431 -0.14317,0.11031 -0.21276,0.16797l-0.21276,0.17917v0.0112c-1.16235,1.08285 -1.82332,2.59943 -1.82526,4.18802c0,3.16643 2.5669,5.73333 5.73333,5.73333h5.73333v63.06667c0,6.33533 5.13133,11.46667 11.46667,11.46667h91.73333c6.33533,0 11.46667,-5.13133 11.46667,-11.46667v-63.06667h5.73333c3.16643,0 5.73333,-2.5669 5.73333,-5.73333c0.00117,-1.59249 -0.66006,-3.11372 -1.82526,-4.19922l-0.08958,-0.06719c-0.12577,-0.11399 -0.25654,-0.22235 -0.39193,-0.32474l-9.15989,-7.49141v-22.31745c0,-3.1648 -2.56853,-5.73333 -5.73333,-5.73333h-5.73333c-3.1648,0 -5.73333,2.56853 -5.73333,5.73333v8.25286l-36.24766,-29.65208c-1.0562,-0.98184 -2.44361,-1.52961 -3.88567,-1.53411zM103.2,86h22.93333v45.86667h-22.93333z" /> </g> </g> </svg>`,
      },
    ],
  },
  {
    title: "Manage",
    path: "",
    items: [
      {
        title: "Knowledge Base",
        path: `/admin/knowledge-base`,
        icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50"> <path d="M 13 2 C 10.792969 2 9 3.792969 9 6 L 9 44.3125 L 9.03125 44.3125 C 9.195313 46.363281 10.910156 48 13 48 L 42 48 L 42 46 L 13 46 C 11.882813 46 11 45.117188 11 44 C 11 42.882813 11.882813 42 13 42 L 42 42 L 42 40 L 13 40 C 11.898438 40 11 39.101563 11 38 C 11 36.898438 11.898438 36 13 36 L 42 36 L 42 2 Z M 16 8 L 35 8 C 35.550781 8 36 8.449219 36 9 L 36 12 C 36 12.550781 35.550781 13 35 13 L 16 13 C 15.449219 13 15 12.550781 15 12 L 15 9 C 15 8.449219 15.449219 8 16 8 Z"></path> </svg>',
      },
    ],
  },
];

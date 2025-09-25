import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as FaIcon from "react-icons/fa";
import * as MdIcon from "react-icons/md";
import * as SiIcon from "react-icons/si";

import { VscTypeHierarchySub } from "react-icons/vsc";
import { BiFoodMenu } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";

import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { FiSlack } from "react-icons/fi";
import { TbReport, TbReportSearch, TbTransferIn } from "react-icons/tb";
import { BiStore } from "react-icons/bi";

import {
  MdPendingActions,
  MdOutlinePlace,
  MdAutoAwesomeMotion,
  MdOutlineSettingsAccessibility,
  MdOutlineWebhook,
} from "react-icons/md";
import { GiResize } from "react-icons/gi";
import { SiMaterialdesignicons } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa";
import { CgUserList } from "react-icons/cg";
import { IoCartOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { RiScissorsCutFill } from "react-icons/ri";

const previousMenuUrl = process.env.REACT_APP_PREVIOUS_MENU_URL;
export const customerSidebar = [
  {
    title: "Receipt",
    icon: <MdIcon.MdOutlineSummarize />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Customer Job Work",
        icon: <MdOutlineSettingsAccessibility />,
        subNav: [
          {
            title: "Parts",
            icon: <AiIcons.AiOutlinePartition />,
            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Parts/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Parts/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Parts/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Parts/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
          {
            title: "Units",
            icon: <AiIcons.AiOutlineDeploymentUnit />,
            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Units/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Units/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Units/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/Units/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
          {
            title: "Sheets and Others",
            icon: <MdIcon.MdOutlineOtherHouses />,

            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/CustomerJobWork/SheetsAndOthers/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/SheetsAndOthers/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/SheetsAndOthers/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/CustomerJobWork/SheetsAndOthers/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
        ],
      },
      {
        title: "Purchase",
        icon: <BiIcons.BiPurchaseTag />,
        subNav: [
          {
            title: "Parts",

            icon: <AiIcons.AiOutlinePartition />,

            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/Purchase/Parts/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/Purchase/Parts/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/Purchase/Parts/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/Purchase/Parts/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
          {
            title: "Units",
            icon: <AiIcons.AiOutlineDeploymentUnit />,
            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/Purchase/Units/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/Purchase/Units/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/Purchase/Units/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/Purchase/Units/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
          {
            title: "Others",
            icon: <MdIcon.MdOutlineOtherHouses />,

            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/Purchase/Others/New",
                icon: <MdOutlineWebhook />,
              },
              {
                title: "Draft RV List",
                path: "/MaterialManagement/Receipt/Purchase/Others/DraftRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Open RV List",
                path: "/MaterialManagement/Receipt/Purchase/Others/OpenRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
              {
                title: "Closed RV List",
                path: "/MaterialManagement/Receipt/Purchase/Others/ClosedRVList",
                icon: <AiIcons.AiOutlineArrowRight />,
              },
            ],
          },
          {
            title: "Gas",
            icon: <BiIcons.BiGasPump />,
            subNav: [
              {
                title: "New",
                path: "/MaterialManagement/Receipt/Purchase/Gas/New",
                icon: <MdOutlineWebhook />,
              },
            ],
          },
        ],
      },
      {
        title: "Branch Transfer",
        path: "/MaterialManagement/Receipt/BranchTransfer",
        icon: <AiIcons.AiOutlineBranches />,
      },
    ],
  },
  {
    title: "Return",
    icon: <SiIcon.SiMaterialdesignicons />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Customer Job Work",
        icon: <MdOutlineSettingsAccessibility />,
        subNav: [
          {
            title: "New",
            path: "/MaterialManagement/Return/CustomerJobWork/New",
            icon: <MdOutlineWebhook />,
          },
          {
            title: "Pending Dispatch List",
            path: "/MaterialManagement/Return/CustomerJobWork/PendingDispatchList",
            icon: <FaBusinessTime />,
          },
          {
            title: "Customer IV List",
            path: "/MaterialManagement/Return/CustomerJobWork/CustomerIVList",
            icon: <CgUserList />,
          },
          {
            title: "Sales IV List",
            path: "/MaterialManagement/Return/CustomerJobWork/SalesIVList",
            icon: <IoCartOutline />,
          },
          {
            title: "Cancelled",
            path: "/MaterialManagement/Return/CustomerJobWork/Cancelled",
            icon: <ImCancelCircle />,
          },
        ],
      },
    ],
  },
  {
    title: "Shop Floor Issue",
    icon: <AiOutlineDeploymentUnit />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Service",
        icon: <MdIcon.MdMiscellaneousServices />,
        subNav: [
          {
            title: "Parts",
            path: "/MaterialManagement/ShopFloorIssue/Service/Parts",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Units",
            path: "/MaterialManagement/ShopFloorIssue/Service/Units",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
        ],
      },
      {
        title: "ProfileCutting",
        path: "/MaterialManagement/ShopFloorIssue/ProfileCutting",
        icon: <BiIcons.BiCut />,
      },
      {
        title: "IV List Service",
        icon: <MdIcon.MdMiscellaneousServices />,
        subNav: [
          {
            title: "Issued",
            path: "/MaterialManagement/ShopFloorIssue/IVListService/Issued",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Closed",
            path: "/MaterialManagement/ShopFloorIssue/IVListService/Closed",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
        ],
      },
      {
        title: "IV List Profile Cutting",
        icon: <RiScissorsCutFill />,
        subNav: [
          {
            title: "Current",
            path: "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/Current",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Closed",
            path: "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/Closed",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
        ],
      },
    ],
  },
  {
    title: "Shop Floor Returns",
    icon: <FiSlack />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Pending IV List",
        path: "/MaterialManagement/ShopFloorReturns/PendingList",
        icon: <MdPendingActions />,
      },
    ],
  },
  {
    title: "Reports",
    icon: <TbReport />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Customer",
        icon: <AiIcons.AiFillCustomerService />,
        subNav: [
          {
            title: "Stock Report",
            path: "/MaterialManagement/Reports/Customer/StockList",
            icon: <MdIcon.MdOutlineSummarize />,
          },
          {
            title: "Parts Reports",
            path: "/MaterialManagement/Reports/Customer/PartList",

            icon: <MdIcon.MdOutlineSummarize />,
          },
        ],
      },
      {
        title: "Daily Report",
        path: "/MaterialManagement/Reports/DailyReports",
        icon: <TbReportSearch />,
      },
      {
        title: " Monthly Report",
        path: "/MaterialManagement/Reports/MonthlyReports",
        icon: <MdIcon.MdOutlineSummarize />,
      },
    ],
  },
  {
    title: "Store Management",
    icon: <BiStore />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Resize Sheets        ",
        path: "/MaterialManagement/StoreManagement/ResizeSheets",
        icon: <GiResize />,
      },
      {
        title: "Move Store",
        icon: <TbTransferIn />,
        subNav: [
          {
            title: "Customer",
            path: "/MaterialManagement/StoreManagement/MoveStore/Customer",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Change Location",
            path: "/MaterialManagement/StoreManagement/MoveStore/ChangeLocation",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "All",
            path: "/MaterialManagement/StoreManagement/MoveStore/All",

            icon: <AiIcons.AiOutlineArrowRight />,
          },
        ],
      },
      {
        title: " Location List",
        path: "/MaterialManagement/StoreManagement/LocationList",
        icon: <MdOutlinePlace />,
      },
      {
        title: " Stock",
        icon: <SiMaterialdesignicons />,
        subNav: [
          {
            title: "Stock List",
            path: "/MaterialManagement/StoreManagement/Stock/StockList",
            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Stock Arrival",
            path: "/MaterialManagement/StoreManagement/Stock/StockArrival",

            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Stock Dispatch",
            path: "/MaterialManagement/StoreManagement/Stock/StockDispatch",

            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Stock Ledger",
            path: "/MaterialManagement/StoreManagement/Stock/StockLedger",

            icon: <AiIcons.AiOutlineArrowRight />,
          },
          {
            title: "Opening Stock",
            path: "/MaterialManagement/StoreManagement/Stock/OpeningStock",

            icon: <AiIcons.AiOutlineArrowRight />,
          },
        ],
      },
      {
        title: "Location Stock",
        path: "/MaterialManagement/StoreManagement/LocationStock",
        icon: <MdAutoAwesomeMotion />,
      },
    ],
  },
  {
    title: "Previous Menu",
    path: previousMenuUrl,
    icon: <MdIcon.MdPreview />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
];

export const adminSidebar = [
  {
    title: "Access",
    icon: <MdIcon.MdOutlineSecurity />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Menu Roles",
        path: "/admin/menuRoles",
        icon: <AiIcons.AiOutlineMenuFold />,
      },
    ],
  },

  {
    title: "Users",
    icon: <FaIcon.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Roles",
        path: "/admin/roles",
        icon: <VscTypeHierarchySub />,
      },
      {
        title: "Menus",
        path: "/admin/menus",
        icon: <BiFoodMenu />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <HiUsers />,
      },
    ],
  },
];

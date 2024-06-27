import {ClickAwayListener, Dropdown, Menu, MenuButton, MenuItem} from "@mui/base";
import {useState} from "react";

export const SORT_BY_OPTIONS = {
  "NEWEST": 0,
  "OLDEST": 1,
  "NAME_A_Z": 2,
  "NAME_Z_A": 3
}

const getSortByOption = (op: number) => {
  switch (op) {
    case SORT_BY_OPTIONS.NEWEST:
      return "Newest";
    case SORT_BY_OPTIONS.OLDEST:
      return "Oldest";
    case SORT_BY_OPTIONS.NAME_A_Z:
      return "Name A to Z";
    case SORT_BY_OPTIONS.NAME_Z_A:
      return "Name Z to A";
    default:
      return "Newest";
  }
}

type SortByDropdownProps = {
  sortBy: number,
  setSortBy: (val: number) => void,
  className?: string
}

export default function SortByDropdown({sortBy, setSortBy, className}: SortByDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  }

  const onSelectOption = (option: number) => {
    setSortBy(option);
    closeMenu();
  }

  return (
    <div className={`flex font-light ${className}`}>
      <p>Sort by</p>
      <Dropdown
        open={open}
      >
        <ClickAwayListener onClickAway={closeMenu}>
          <div>
            <MenuButton
              className={"cursor-pointer"}
              // @ts-ignore
              onClick={toggle}
            >
              <p
                id={"sort-by-dropdown"}
                className={"ml-1.5 text-blue-600"}
              >
                {getSortByOption(sortBy)}
                <i className={`fa-solid fa-angle-${open ? "up" : "down"} text-xs ml-0.5`}/>
              </p>
            </MenuButton>
            <Menu
              className={"bg-gray-200 rounded-lg py-2 z-50"}
            >
              {Object.keys(SORT_BY_OPTIONS).map((key) => (
                <MenuItem
                  className={"font-light hover:bg-blue-400 w-full pl-2.5 pr-4 py-1 cursor-pointer"}
                  key={SORT_BY_OPTIONS[key as keyof typeof SORT_BY_OPTIONS]}
                  value={SORT_BY_OPTIONS[key as keyof typeof SORT_BY_OPTIONS]}
                  onClick={() => onSelectOption(SORT_BY_OPTIONS[key as keyof typeof SORT_BY_OPTIONS])}
                >
                  {getSortByOption(SORT_BY_OPTIONS[key as keyof typeof SORT_BY_OPTIONS])}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </ClickAwayListener>
      </Dropdown>
    </div>
  )
}
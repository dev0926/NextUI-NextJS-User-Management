"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";

import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { User } from "@/config/types";
import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "../icons";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "firstName",
  "lastName",
  "phoneNumber",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FRIST NAME", uid: "firstName", sortable: true },
  { name: "LAST NAME", uid: "lastName", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE NUMBER", uid: "phoneNumber", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "REGISTERED", uid: "registered", sortable: true },
  { name: "ADMIN NOTES", uid: "adminNotes" },
  { name: "ACTIONS", uid: "actions" },
];

export default function UserTable() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("a");
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const hasSearchFilter = Boolean(filterValue);

  let list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await fetch(
        cursor ||
          `http://127.0.0.1:50000/users?offset=0&limit=10&filter=${filterValue}`,
        {
          signal,
        }
      );
      let json = await res.json();

      setHasMore(json.next !== null);

      setTotalUsers(json.count);

      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions Dropdown">
                <DropdownItem aria-label="view">View</DropdownItem>
                <DropdownItem aria-label="edit">Edit</DropdownItem>
                <DropdownItem aria-label="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalUsers} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            {list.items.length} Loaded
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, hasSearchFilter, list]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with infinite pagination"
      baseRef={scrollerRef}
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={
        hasMore ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[650px]",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader columns={columns}>
        {/* <TableColumn key="id">Id</TableColumn>
        <TableColumn key="firstName">First Name</TableColumn>
        <TableColumn key="lastName">Last Name</TableColumn>
        <TableColumn key="phoneNumber">Phone Number</TableColumn>
        <TableColumn key="actions">Actions</TableColumn> */}
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={Object(list.items)}
        loadingContent={<Spinner color="white" />}
      >
        {(item: User) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

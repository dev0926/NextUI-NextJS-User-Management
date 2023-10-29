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
  SortDescriptor,
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
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE NUMBER", uid: "phoneNumber", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "REGISTERED", uid: "registered", sortable: true },
  { name: "ADMIN NOTES", uid: "adminNotes" },
  { name: "ACTIONS", uid: "actions" },
];

export default function UserTable() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  let list = useAsyncList({
    initialSortDescriptor: {
      column: "id",
      direction: "ascending",
    },
    async load({ signal, cursor, filterText, sortDescriptor }) {
      if (cursor) {
        setIsLoading(false);
      }

      let url = new URL(
        `http://127.0.0.1:50000/users?offset=0&limit=20&filter=${filterText}`
      );

      if (sortDescriptor) {
        url.searchParams.append("sort_key", String(sortDescriptor.column));
        url.searchParams.append(
          "sort_direction",
          String(sortDescriptor.direction)
        );
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await fetch(cursor || url, {
        signal,
      });
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

  const onClear = React.useCallback(() => {
    list.setFilterText("");
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by keyword..."
            startContent={<SearchIcon />}
            value={list.filterText}
            onClear={() => onClear()}
            onValueChange={list.setFilterText}
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
                closeOnSelect={true}
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
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => {}}
            >
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
  }, [visibleColumns, list]);

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
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        base: "max-h-[650px]",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
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

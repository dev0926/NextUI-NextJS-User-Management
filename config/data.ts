export const columns = [
  { name: "ID", uid: "id", sortable: true, showable: true, editable: false },
  {
    name: "FRIST NAME",
    uid: "firstName",
    sortable: true,
    showable: true,
    editable: true,
  },
  {
    name: "LAST NAME",
    uid: "lastName",
    sortable: true,
    showable: true,
    editable: true,
  },
  {
    name: "EMAIL",
    uid: "email",
    sortable: true,
    showable: true,
    editable: true,
  },
  {
    name: "PHONE NUMBER",
    uid: "phoneNumber",
    sortable: true,
    showable: true,
    editable: true,
  },
  {
    name: "ADDRESS",
    uid: "address",
    sortable: true,
    showable: true,
    editable: true,
  },
  {
    name: "REGISTERED",
    uid: "registered",
    sortable: true,
    showable: true,
    editable: false,
  },
  {
    name: "ADMIN NOTES",
    uid: "adminNotes",
    sortable: false,
    showable: true,
    editable: true,
  },
  {
    name: "ACTIONS",
    uid: "actions",
    sortable: false,
    showable: false,
    editable: false,
  },
];

export const INITIAL_DESKTOP_VISIBLE_COLUMNS = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "actions",
];

export const INITIAL_MOBILE_VISIBLE_COLUMNS = [
  "id",
  "firstName",
  "lastName",
  "actions",
];

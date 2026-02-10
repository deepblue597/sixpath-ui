import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const cols: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "age", headerName: "Age", type: "number", width: 90 },
];

const columns = cols.map((col) => ({
  ...col,
  renderCell: (params: GridRenderCellParams) =>
    params.value == null ? (
      <em style={{ color: "red" }}>No data</em>
    ) : (
      params.value
    ),
}));
const paginationModel = { page: 0, pageSize: 5 };

const handleClick = (row: object) => {
  console.log(row);
};

function Table() {
  const [selectedRow, setSelectedRow] = useState<object | null>(null);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Table view
      </Typography>
      <Paper style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(params) => {
            const row = params.row; /// Access the clicked row data
            setSelectedRow(row);
            handleClick(row);
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
      {selectedRow && (
        <Fragment>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            Selected Row Details:
          </Typography>
          <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
        </Fragment>
      )}
    </>
  );
}

export default Table;

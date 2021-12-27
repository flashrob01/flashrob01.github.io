import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import tw from "twin.macro";
import { GlobalFilter } from "./globalFilter";
import API from './API';

const Table = tw.table`
  table-fixed
  text-base
  text-gray-900
`;

const TableHead = tw.thead`
  p-2
`;

const TableRow = tw.tr`
border
border-green-500
`;

const TableHeader = tw.th`
border
border-green-500
p-2
`;

const TableBody = tw.tbody`
`;

const TableData = tw.td`
border
border-green-500
p-5
`;

const Button = tw.button`
  pl-4
  pr-4
  pt-2
  pb-2
  text-black
  rounded-md
  bg-green-300
  hover:bg-green-200
  transition-colors
`;

export function DT_Buy_Offers(props) {

  axios.get(API+ "/buy_offers");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await axios
      .get(API+ "/buy_offers")
      .catch((err) => console.log(err));

    if (response) {
      const products = response.data;

      console.log("Products: ", products);
      setProducts(products);
    }
  };

  

  const columns = useMemo(
    () => [
      {
        Header: "industry",
        accessor: "industry",
      },
      {
        Header: "offer_type",
        accessor: "offer_type",
      },
      {
        Header: "offer_details",
        accessor: "offer_details",
      },
      {
        Header: "qualifications",
        accessor: "qualifications",
      },
      {
        Header: "industry",
        accessor: "industry",
      },
      {
        Header: "price",
        accessor: "price",
      },
      {
        Header: "buy_offer_id",
        accessor: "buy_offer_id",
      },
      {
        Header: "user_id",
        accessor: "user_id",
      },
    ],
    []
  );

  const productsData = useMemo(() => [...products], [products]);

  const productsColumns = useMemo(
    () =>
      products[0]
        ? Object.keys(products[0])
            .filter((key) => key !== "rating")
            .map((key) => {
              if (key === "image")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }) => <img src={value} />,
                  maxWidth: 70,
                };

              return { Header: key, accessor: key };
            })
        : [],
    [products]
  );

//  const tableHooks = (hooks) => {
//    hooks.visibleColumns.push((columns) => [
//      ...columns,
//      {
//        id: "Edit",
  //      Header: "Edit",
 //       Cell: ({ row }) => (
 //         <Button onClick={() => alert("Editing: " + row.values.price)}>
 //           Edit
 //         </Button>
 //       ),
 //     },
 //   ]);
 // };

  const tableInstance = useTable(
    {
      columns: productsColumns,
      data: productsData,
    },
    useGlobalFilter,
 //   tableHooks,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  useEffect(() => {
    fetchProducts();
  }, []);

  const isEven = (idx) => idx % 2 === 0;

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      />
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHeader
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);

            return (
              <TableRow
                {...row.getRowProps()}
                className={isEven(idx) ? "bg-green-400 bg-opacity-30" : ""}
              >
                {row.cells.map((cell, idx) => (
                  <TableData {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableData>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
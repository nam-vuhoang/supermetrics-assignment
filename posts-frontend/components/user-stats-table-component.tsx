import { Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import Link from 'next/link';
import React from 'react';
import { Frequency } from '../models/frequency';
import { User } from '../models/user';
import { MomentUtils } from '../utils/moment-utils';
import { Utils } from '../utils/utils';

/**
 * Render statistics table for all users.
 */
export default function UserStatsTableComponent({
  users,
}: {
  users: User[];
}): JSX.Element {
  //
  // Add basic columns
  //
  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: 'User Name',
      width: 200,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Link
          href={`/dashboard/${encodeURIComponent(params.row.userId)}`}
          shallow
        >
          
          <Typography color="primary">{params.row.userName}</Typography>
        </Link>
      ),
    },
    addNumberCellRender(
      {
        field: 'totalCount',
        headerName: 'Total count',
        valueGetter: (params) => (params.row as User).stats.totalCount,
        width: 100,
      },
      'max',
      Utils.getArrayMax(users.map((u) => u.stats.totalCount))
    ),
  ];

  //
  // Add frequency columns
  //
  const frequencies = users.map((u) => u.stats.frequencies).flat();
  const months = MomentUtils.createMonthlyArrayFromNumberArray(
    frequencies.map((f) => f.month)
  );
  const monthlyHighestValueMap = findMonthlyHighestValues(frequencies);

  for (let month of months) {
    const monthValue = month.valueOf();
    columns.push(
      addNumberCellRender(
        {
          field: `frequencies_${monthValue}`,
          headerName: month.format('MM/YY'),
          width: 80,
          valueGetter(params: GridValueGetterParams<Frequency[]>) {
            return (params.row as User).stats.frequencies?.find(
              (f: Frequency) => f.month === monthValue
            )?.count;
          },
        },
        'max',
        monthlyHighestValueMap.get(monthValue) || 0
      )
    );
  }

  //
  // Add length columns
  //
  columns.push(
    addNumberCellRender(
      {
        field: 'minLength',
        headerName: 'Min length',
        width: 90,
        valueGetter: (params) => params.row.stats.minLength,
      },
      'min',
      Utils.getArrayMin(users.map((u) => u.stats.minLength))
    ),
    addNumberCellRender(
      {
        field: 'medianLength',
        headerName: 'Med. length',
        valueGetter: (params) => (params.row as User).stats.medianLength,
        width: 90,
      },
      'max',
      Utils.getArrayMax(users.map((u) => u.stats.medianLength))
    ),
    addNumberCellRender(
      {
        field: 'stats.maxLength',
        headerName: 'Max length',
        valueGetter: (params) => (params.row as User).stats.maxLength,
        width: 90,
      },
      'max',
      Utils.getArrayMax(users.map((u) => u.stats.maxLength))
    )
  );

  return (
    <div style={{ height: 650, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row.userId}
        rows={users}
        columns={columns}
        pageSize={10}
        autoPageSize
        initialState={{
          sorting: {
            sortModel: [{ field: 'userName', sort: 'asc' }],
          },
        }}
      />
    </div>
  );
}

/**
 * Create the list of highest values for each month.
 * @param frequencies
 * @returns Key-value map: month=>value
 */
function findMonthlyHighestValues(
  frequencies: Frequency[]
): Map<number, number> {
  const highestValueMap = new Map<number, number>();

  for (let f of frequencies) {
    const currentMonthHighestValue = highestValueMap.get(f.month) || 0;
    if (currentMonthHighestValue < f.count) {
      highestValueMap.set(f.month, f.count);
    }
  }

  return highestValueMap;
}

/**
 * Add a render for number cells in the grid column
 * with the possibilities to highlight extreme (max or min) values.
 * @param gridColDef
 * @param extremeValue
 * @param highlightType
 * @returns
 */
function addNumberCellRender(
  gridColDef: GridColDef,
  highlightType?: 'max' | 'min',
  extremeValue?: number
): GridColDef {
  gridColDef.renderCell = (params: GridRenderCellParams<number>) => {
    const { value } = params;
    if (value === undefined) {
      return '-';
    } else if (
      extremeValue === undefined ||
      (highlightType === 'max' && value < extremeValue) ||
      (highlightType === 'min' && value > extremeValue)
    ) {
      return value;
    } else {
      return <Typography color="primary">{extremeValue}</Typography>;
    }
  };
  return gridColDef;
}

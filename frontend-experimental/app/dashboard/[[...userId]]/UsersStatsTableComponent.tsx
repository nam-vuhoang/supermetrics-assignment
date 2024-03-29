'use client';

import { Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import Link from 'next/link';
import { Frequency } from '../../../models/frequency';
import { User } from '../../../models/user';
import { MomentUtils } from '../../../utils/moment-utils';
import { Utils } from '../../../utils/utils';

function findMonthlyRecords(frequencies: Frequency[]): Map<number, number> {
  const recordMap = new Map<number, number>();

  for (let f of frequencies) {
    const currentMonthRecord = recordMap.get(f.month) || 0;
    if (currentMonthRecord < f.count) {
      recordMap.set(f.month, f.count);
    }
  }

  return recordMap;
}

function addHighlightRecordCellRender(
  gridColDef: GridColDef,
  record: number,
  highlightMax: boolean
): GridColDef {
  gridColDef.renderCell = (params: GridRenderCellParams<number>) => {
    const { value } = params;
    if (value === undefined) {
      return '-';
    } else if ((highlightMax && value < record) || value > record) {
      return value;
    } else {
      return <Typography color="primary">{record}</Typography>;
    }
  };
  return gridColDef;
}

export function UserStatsTableComponent({ users }: { users: User[] }) {
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
    addHighlightRecordCellRender(
      {
        field: 'totalCount',
        headerName: 'Total count',
        valueGetter: (params) => (params.row as User).stats.totalCount,
        width: 100,
      },
      Utils.getArrayMax(users.map((u) => u.stats.totalCount)),
      true
    ),
  ];

  //
  // Add frequency columns
  //
  const frequencies = users.map((u) => u.stats.frequencies).flat();
  const months = MomentUtils.createMonthlyArray(
    frequencies.map((f) => f.month)
  );
  const monthlyRecords = findMonthlyRecords(frequencies);

  for (let month of months) {
    const monthValue = month.valueOf();
    columns.push(
      addHighlightRecordCellRender(
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
        monthlyRecords.get(monthValue) || 0,
        true
      )
    );
  }

  //
  // Add length columns
  //
  columns.push(
    addHighlightRecordCellRender(
      {
        field: 'minLength',
        headerName: 'Min length',
        width: 90,
        valueGetter: (params) => params.row.stats.minLength,
      },
      Utils.getArrayMin(users.map((u) => u.stats.minLength)),
      false
    ),
    addHighlightRecordCellRender(
      {
        field: 'averageLength',
        headerName: 'Av. length',
        valueGetter: (params) => (params.row as User).stats.averageLength,
        width: 90,
      },
      Utils.getArrayMax(users.map((u) => u.stats.averageLength)),
      true
    ),
    addHighlightRecordCellRender(
      {
        field: 'stats.maxLength',
        headerName: 'Max length',
        valueGetter: (params) => (params.row as User).stats.maxLength,
        width: 90,
      },
      Utils.getArrayMax(users.map((u) => u.stats.maxLength)),
      true
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

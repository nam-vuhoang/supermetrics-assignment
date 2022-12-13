import { Link } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import moment from 'moment';
import { Component, ReactNode } from 'react';
import { Frequency } from '../models/frequency';
import { UserStats } from '../models/user-stats';

export class UserStatsTableView extends Component<{ stats: UserStats[] }> {
  private findMonths(stats: UserStats[]): moment.Moment[] {
    let first: number = 0;
    let last: number = 0;

    for (let s of stats) {
      for (let f of s.frequencies) {
        if (first === 0 || first > f.month) {
          first = f.month;
        }

        if (last === 0 || last < f.month) {
          last = f.month;
        }
      }
    }

    const months: moment.Moment[] = [];    
    for (let month = moment(first); !month.isAfter(last); month = month.add(1, 'month')) {
      months.push(month.clone());
    }

    return months;
  }

  render(): ReactNode {
    const { stats } = this.props;

    const columns: GridColDef[] = [
      // { field: 'userId', headerName: 'ID', width: 150 },
      {
        field: 'userName',
        headerName: 'User Name',
        width: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Link href={`/?userId=${params.row.userId}`}>{params.value}</Link>
        ),
      },
      { field: 'totalCount', headerName: 'Total count', width: 100 },
      { field: 'minLength', headerName: 'Min length', width: 90 },
      {
        field: 'averageLength',
        headerName: 'Av. length',
        width: 90,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          Math.round(params.value),
      },
      { field: 'maxLength', headerName: 'Max length', width: 90 },
    ];

    const months = this.findMonths(stats);
    
    for (let month of months) {
      console.log(month.format('MM/YYYY'));
      const m = month.valueOf();
      columns.push({
        field: 'frequencies_' + m,
        headerName: month.format('MM/YY'),
        width: 80,
        valueGetter(params: GridValueGetterParams<Frequency[]>) {
          return params.row.frequencies?.find((f: Frequency) => f.month === m)?.count || 0;
        },
      });
    }

    return (
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.userId}
          rows={stats}
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
}

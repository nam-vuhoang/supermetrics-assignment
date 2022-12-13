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

export class UserStatsView extends Component<{ stats: UserStats[] }> {
  private findMonths(stats: UserStats[]): {
    firstMonth: moment.Moment;
    lastMonth: moment.Moment;
  } {
    let firstMonth: number = 0;
    let lastMonth: number = 0;

    for (let s of stats) {
      for (let f of s.frequencies) {
        if (firstMonth === 0 || firstMonth > f.month) {
          firstMonth = f.month;
        }

        if (lastMonth === 0 || lastMonth < f.month) {
          lastMonth = f.month;
        }
      }
    }

    return { firstMonth: moment(firstMonth), lastMonth: moment(lastMonth) };
  }

  render(): ReactNode {
    const { stats } = this.props;

    const columns: GridColDef[] = [
      // { field: 'userId', headerName: 'ID', width: 150 },
      {
        field: 'userName',
        headerName: 'User Name',
        width: 300,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Link href={`/?userId=${params.row.userId}`}>{params.value}</Link>
        ),
      },
      { field: 'totalCount', headerName: 'Number of posts', width: 150 },
      {
        field: 'averageLength',
        headerName: 'Average post length',
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          Math.round(params.value),
      },
      { field: 'maxLength', headerName: 'Maximum post length', width: 150 },
    ];

    const { firstMonth, lastMonth } = this.findMonths(stats);
    const months: number[] = [];
    
    for (let month = firstMonth.clone(); !month.isAfter(lastMonth); month = month.add(1, 'month')) {
      months.push(month.valueOf());
    }
    console.error(months);

    columns.push({
      field: 'frequencies',
      headerName: `Frequencies (${firstMonth.format('MMM YYYY')}-${lastMonth.format('MMM YYYY')})`,
      width: 300,
      valueGetter(params: GridValueGetterParams<Frequency[]>) {
        return `[${months.map(m => params.value?.find(f => f.month === m)?.count || 0)}]`;
      },
    });


    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.userId}
          rows={stats}
          columns={columns}
          pageSize={25}
        />
      </div>
    );
  }
}

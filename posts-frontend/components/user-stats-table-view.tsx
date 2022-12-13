import { Link, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import moment, { Moment } from 'moment';
import { Component, ReactNode } from 'react';
import { Frequency } from '../models/frequency';
import { UserStats } from '../models/user-stats';
import { getArrayMax, getArrayMin } from '../utils/utils';

export class UserStatsTableView extends Component<{ stats: UserStats[] }> {
  private findMonths(stats: UserStats[]): Moment[] {
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

    const months: Moment[] = [];
    for (
      let month = moment(firstMonth);
      !month.isAfter(lastMonth);
      month = month.add(1, 'month')
    ) {
      months.push(month.clone());
    }

    return months;
  }

  private findMonthlyRecords(stats: UserStats[]): Map<number, number> {
    const recordMap = new Map<number, number>();
    for (let s of stats) {
      for (let f of s.frequencies) {
        const currentRecord = recordMap.get(f.month) || 0;
        if (currentRecord < f.count) {
          recordMap.set(f.month, f.count);
        }
      }
    }

    return recordMap;
  }

  private addHighlightRecordCellRender(
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

  render(): ReactNode {
    const { stats } = this.props;

    const columns: GridColDef[] = [
      {
        field: 'userName',
        headerName: 'User Name',
        width: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Link href={`/?userId=${params.row.userId}`}>{params.value}</Link>
        ),
      },
    ];

    columns.push(
      this.addHighlightRecordCellRender(
        {
          field: 'totalCount',
          headerName: 'Total count',
          width: 100,
        },
        getArrayMax(stats.map((s) => s.totalCount)),
        true
      )
    );

    columns.push(
      this.addHighlightRecordCellRender(
        { field: 'minLength', headerName: 'Min length', width: 90 },
        getArrayMin(stats.map((s) => s.minLength)),
        false
      )
    );

    columns.push(
      this.addHighlightRecordCellRender(
        {
          field: 'averageLength',
          headerName: 'Av. length',
          width: 90,
        },
        getArrayMax(stats.map((s) => s.averageLength)),
        true
      )
    );

    columns.push(
      this.addHighlightRecordCellRender(
        { field: 'maxLength', headerName: 'Max length', width: 90 },
        getArrayMax(stats.map((s) => s.maxLength)),
        true
      )
    );

    const months = this.findMonths(stats);
    const monthlyRecords = this.findMonthlyRecords(stats);

    for (let month of months) {
      const monthValue = month.valueOf();
      columns.push(
        this.addHighlightRecordCellRender(
          {
            field: `frequencies_${monthValue}`,
            headerName: month.format('MM/YY'),
            width: 80,
            valueGetter(params: GridValueGetterParams<Frequency[]>) {
              return (
                params.row.frequencies?.find(
                  (f: Frequency) => f.month === monthValue
                )?.count
              );
            },
          },
          monthlyRecords.get(monthValue) || 0,
          true
        )
      );
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

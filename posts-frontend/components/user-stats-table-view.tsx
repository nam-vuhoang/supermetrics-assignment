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
import { MomentUtils } from '../utils/moment-utils';
import { getArrayMax, getArrayMin } from '../utils/utils';

export class UserStatsTableView extends Component<{ stats: UserStats[] }> {
  private findMonthlyRecords(frequencies: Frequency[]): Map<number, number> {
    const recordMap = new Map<number, number>();

    for (let f of frequencies) {
      const currentMonthRecord = recordMap.get(f.month) || 0;
      if (currentMonthRecord < f.count) {
        recordMap.set(f.month, f.count);
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

    //
    // Add basic columns
    //
    const columns: GridColDef[] = [
      {
        field: 'userName',
        headerName: 'User Name',
        width: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Link href={`dashboard/${encodeURIComponent(params.row.userId)}`}>
            {params.value}
          </Link>
        ),
      },
      this.addHighlightRecordCellRender(
        {
          field: 'totalCount',
          headerName: 'Total count',
          width: 100,
        },
        getArrayMax(stats.map((s) => s.totalCount)),
        true
      ),
    ];

    //
    // Add frequency columns
    //
    const frequencies = stats.map((s) => s.frequencies).flat();
    const months = MomentUtils.createMonthlyArray(
      frequencies.map((f) => f.month)
    );
    const monthlyRecords = this.findMonthlyRecords(frequencies);

    for (let month of months) {
      const monthValue = month.valueOf();
      columns.push(
        this.addHighlightRecordCellRender(
          {
            field: `frequencies_${monthValue}`,
            headerName: month.format('MM/YY'),
            width: 80,
            valueGetter(params: GridValueGetterParams<Frequency[]>) {
              return params.row.frequencies?.find(
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
      this.addHighlightRecordCellRender(
        { field: 'minLength', headerName: 'Min length', width: 90 },
        getArrayMin(stats.map((s) => s.minLength)),
        false
      ),
      this.addHighlightRecordCellRender(
        {
          field: 'averageLength',
          headerName: 'Av. length',
          width: 90,
        },
        getArrayMax(stats.map((s) => s.averageLength)),
        true
      ),
      this.addHighlightRecordCellRender(
        { field: 'maxLength', headerName: 'Max length', width: 90 },
        getArrayMax(stats.map((s) => s.maxLength)),
        true
      )
    );

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

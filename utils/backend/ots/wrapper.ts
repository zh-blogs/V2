/**
 * 封装常用的 OTS 操作
 */

import { start } from 'repl';
import TableStore, { CellValue } from 'tablestore';

type QuickPutParams = {
    tableName: string;
    primaryKeys: string[];
    data: {
      [key: string]: TableStore.CellValue;
    };
    returnContent?: TableStore.ReturnContent;
}

type QuickDeleteParams = {
 tableName: string;
    primaryKeys: string[];
    data: {
      [key: string]: TableStore.CellValue;
    };
}

export class OtsClient extends TableStore.Client {
  constructor(
    params: Partial<{
      accessKeyId: string;
      secretAccessKey: string;
      accessKeySecret: string;
      stsToken: string;
      securityToken: string;
      logger: unknown;
      endpoint: string;
      httpOptions: {
        timeout: number;
        maxSockets: number;
      };
      maxRetries: number;
      instancename: string;
      computeChecksums: boolean;
    }>
  ) {
    super(params);
  }

  static row2Object<T>(row: TableStore.Row): T {
    const obj: { [key: string]: any } = {};
    for (const column of row.primaryKey || []) {
      obj[column.name] = column.value;
    }
    for (const column of row.attributes || []) {
      obj[column.columnName] = column.columnValue;
    }

    return obj as T;
  }

    
  /** query */
  async getRangeAll<T>(params: TableStore.GetRangeParams) {
    const result: T[] = [];

    do {
      const resp = await this.getRange(params);
      result.push(...resp.rows.map((item) => OtsClient.row2Object<T>(item)));

      if (!!resp.nextStartPrimaryKey) {
        params = {
          ...params,
          inclusiveStartPrimaryKey: resp.nextStartPrimaryKey.map(
            ({ name, value }) => ({ [name]: value })
          ),
        };
      } else {
        break;
      }

      resp.rows[0].primaryKey;
    } while (true);

    return result;
  }

  async quickQueryRows<T>(params: {
    tableName: string;
    primaryKeys: string[];
    data: {
      [key: string]:
        | undefined
        | TableStore.CellValue
        | [TableStore.CellValue, TableStore.CellValue];
    };
    columnsToGet?: string[];
  }) {
    const { tableName, primaryKeys, data, columnsToGet } = params;

    const startPrimary: TableStore.PrimaryKeyInput = [];
    const endPrimary: TableStore.PrimaryKeyInput = [];
    for (const primaryKey of primaryKeys) {
      const value = data?.[primaryKey];

      if (typeof value === 'undefined') {
        startPrimary.push({ [primaryKey]: TableStore.INF_MIN });
        endPrimary.push({ [primaryKey]: TableStore.INF_MAX });
      } else if (Array.isArray(value)) {
        startPrimary.push({ [primaryKey]: value[0] });
        endPrimary.push({ [primaryKey]: value[1] });
      } else {
        startPrimary.push({ [primaryKey]: value });
        endPrimary.push({ [primaryKey]: value });
      }
    }

    let condition: TableStore.CompositeCondition | undefined =
      new TableStore.CompositeCondition(TableStore.LogicalOperator.AND);
    for (const [key, value] of Object.entries(params.data)) {
      if (primaryKeys.indexOf(key) === -1) {
        condition?.addSubCondition(
          new TableStore.SingleColumnCondition(
            key,
            value as TableStore.CellValue,
            TableStore.ComparatorType.EQUAL
          )
        );
      }
    }
    if (!condition?.sub_conditions?.length) {
      condition = undefined;
    }

    return await this.getRangeAll<T>({
      tableName,
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: startPrimary,
      exclusiveEndPrimaryKey: endPrimary,
      limit: 50,
      columnsToGet,
      maxVersions: 1,
      columnFilter: condition,
    });
  }

  async quickQueryRow<T>(params: {
    tableName: string;
    primaryKeys: string[];
    data: {
      [key: string]:
        | undefined
        | TableStore.CellValue
        | [TableStore.CellValue, TableStore.CellValue];
    };
    columnsToGet?: string[];
  }) {
    const result = await this.quickQueryRows<T>(params);

    return result?.[0];
  }

  /** write */
  static quickPutParamsParse(params: QuickPutParams) {
    const { tableName, primaryKeys, data, returnContent= { returnType: TableStore.ReturnType.NONE } } = params;

    return {
      tableName,
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
        null
      ),
      primaryKey: primaryKeys.map((key) => ({ [key]: data[key] })),
      attributeColumns: [
        ...Object.entries(data).filter(([key]) => primaryKeys.indexOf(key) === -1).map(([key, value]) => ({
          [key]: value,
        }))
      ],
      returnContent,
    };
  }
    
  async quickPutRow(params: QuickPutParams) {
    return await this.putRow(OtsClient.quickPutParamsParse(params));
  }
    
  /** delete */

  static quickDeleteParamsParse(params: QuickDeleteParams) { 
    const { tableName, primaryKeys, data } = params;

    return {
      tableName,
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
        null
      ),
      primaryKey: primaryKeys.map((key) => ({ [key]: data[key] })),
    };
  }

    
  async quickDeleteRow(params: QuickDeleteParams) {
    return this.deleteRow(OtsClient.quickDeleteParamsParse(params));
  }


  async batchQuickDeleteRows(params: QuickDeleteParams[]) {
    const arr = params.map(OtsClient.quickDeleteParamsParse);
    const tableMap: {
          [key: string]: {
              tableName: string, rows: {
                  type: "DELETE";
                  condition: TableStore.Condition;
                  primaryKey: TableStore.PrimaryKeyInput;
              }[]
          }
      } = {};
      
    for (const item of arr) { 
      if (!tableMap[item.tableName]) {
        tableMap[item.tableName] = {
          tableName: item.tableName,
          rows: [],
        };
      }

      tableMap[item.tableName].rows.push({
        type: "DELETE",
        condition: item.condition,
        primaryKey: item.primaryKey
      });
    }
      
      
    return this.batchWriteRow({
      tables: Object.values(tableMap)
    });
  }
}

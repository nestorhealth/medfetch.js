"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  CellClassParams,
  SelectionChangedEvent,
  ITooltipParams,
  IRowNode,
  ColDef as AgGridColDef,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { TableManager } from "../lib/tableManager";
import { TransactionManager } from "../lib/transactionManager";
import { call } from "@/lib/utils";
import { Dialect, Kysely } from "kysely";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTableProps {
  dialect: Dialect;
  resource: string;
  rowData: any[];
  onCellEdit: (rowId: any, col: string, newValue: any) => void;
  onError?: (error: string | null) => void;
  onSelectionChange?: (selectedRows: any[]) => void;
}

interface BulkEditState {
  isEditing: boolean;
  selectedRows: IRowNode[];
  pendingChanges: Map<string, Map<string, any>>;
  errors: Map<string, string>;
}

interface CustomColDef extends AgGridColDef {
  field: string;
}

const AGGridTable: React.FC<AGGridTableProps> = ({
  dialect,
  resource,
  rowData,
  onCellEdit,
  onError,
  onSelectionChange,
}) => {
  const [columnDefs, setColumnDefs] = useState<CustomColDef[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bulkEditState, setBulkEditState] = useState<BulkEditState>({
    isEditing: false,
    selectedRows: [],
    pendingChanges: new Map(),
    errors: new Map(),
  });

  const db = useMemo(() => {
    return new Kysely({
      dialect,
    });
  }, [dialect]);
  const tableManager = useRef(new TableManager(db));
  const transactionManager = useRef(new TransactionManager(db));

  useEffect(() => {
    if (!db) return;
    call(async () => {
      try {
        toast.success(
          `We have ${rowData.length} rows passed into the AgGrid component`,
        );
        const cols = await tableManager.current.getTableSchema(resource);
        const newColumnDefs: CustomColDef[] = cols.map((c) => ({
          field: c.name,
          headerName: c.name,
          editable: c.name !== "rowid",
          type: getColumnType(c.type),
          cellEditor: getCellEditor(c.type),
          cellEditorParams: getCellEditorParams(c.type),
          valueFormatter: getValueFormatter(c.type),
          valueParser: getValueParser(c.type),
          cellStyle: (params: CellClassParams) => {
            const colDef = params.colDef as CustomColDef;
            if (colDef.field === "rowid") return { backgroundColor: "#f5f5f5" };
            const rowId =
              params.data.rowid?.toString() || params.data.id?.toString();
            if (rowId && bulkEditState.pendingChanges.has(rowId)) {
              const colChanges = bulkEditState.pendingChanges.get(rowId);
              if (colChanges?.has(colDef.field))
                return { backgroundColor: "#fff3cd" };
            }
            if (rowId && bulkEditState.errors.has(`${rowId}_${colDef.field}`))
              return { backgroundColor: "#f8d7da" };
            return null;
          },
          tooltipValueGetter: (params: ITooltipParams) => {
            const colDef = params.colDef as CustomColDef;
            const rowId =
              params.data.rowid?.toString() || params.data.id?.toString();
            if (rowId && bulkEditState.errors.has(`${rowId}_${colDef.field}`))
              return bulkEditState.errors.get(`${rowId}_${colDef.field}`);
            return null;
          },
        }));
        setColumnDefs(newColumnDefs);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        onError?.(errorMessage);
      }
    });
  }, [
    db,
    resource,
    bulkEditState.pendingChanges,
    bulkEditState.errors,
    rowData.length,
    onError,
  ]);

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("rowData", rowData);
  }, [rowData, gridApi]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes = event.api.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      setBulkEditState((prev) => ({
        ...prev,
        selectedRows: selectedNodes,
      }));
      onSelectionChange?.(selectedData);
    },
    [onSelectionChange],
  );

  const onCellValueChanged = useCallback(
    async (event: CellValueChangedEvent) => {
      if (!event.colDef.field) return;
      setIsEditing(true);
      setError(null);
      try {
        await tableManager.current.validateData(resource, {
          [event.colDef.field]: event.newValue,
        });
        await transactionManager.current.executeInTransaction(
          async () => {
            const { data, colDef, newValue } = event;
            const rowId = data.rowid?.toString() || data.id?.toString();
            if (rowId && colDef.field) {
              await onCellEdit(rowId, colDef.field, newValue);
            }
          },
          {
            onError: (err) => {
              const errorMessage = err.message;
              setError(errorMessage);
              onError?.(errorMessage);
              gridApi?.refreshCells({ force: true });
            },
            onRollback: () => {
              gridApi?.refreshCells({ force: true });
            },
          },
        );
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        onError?.(errorMessage);
        gridApi?.refreshCells({ force: true });
      } finally {
        setIsEditing(false);
      }
    },
    [gridApi, onCellEdit, resource],
  );

  const handleBulkEdit = useCallback(
    async (field: string, value: any) => {
      if (!gridApi || bulkEditState.selectedRows.length === 0) return;
      setBulkEditState((prev) => ({
        ...prev,
        isEditing: true,
        errors: new Map(),
      }));
      try {
        const validationPromises = bulkEditState.selectedRows.map(
          async (node) => {
            const rowId =
              node.data.rowid?.toString() || node.data.id?.toString();
            if (!rowId) return;
            try {
              await tableManager.current.validateData(resource, {
                [field]: value,
              });
              setBulkEditState((prev) => {
                const newPendingChanges = new Map(prev.pendingChanges);
                const rowChanges = newPendingChanges.get(rowId) || new Map();
                rowChanges.set(field, value);
                newPendingChanges.set(rowId, rowChanges);
                return { ...prev, pendingChanges: newPendingChanges };
              });
            } catch (err) {
              const error = err as Error;
              setBulkEditState((prev) => {
                const newErrors = new Map(prev.errors);
                newErrors.set(`${rowId}_${field}`, error.message);
                return { ...prev, errors: newErrors };
              });
            }
          },
        );
        await Promise.all(validationPromises);
        if (bulkEditState.errors.size === 0) {
          await transactionManager.current.executeInTransaction(
            async () => {
              for (const [rowId, changes] of bulkEditState.pendingChanges) {
                for (const [f, v] of changes) {
                  await onCellEdit(rowId, f, v);
                }
              }
            },
            {
              onError: (err) => {
                const errorMessage = err.message;
                setError(errorMessage);
                onError?.(errorMessage);
                gridApi.refreshCells({ force: true });
              },
              onRollback: () => {
                gridApi.refreshCells({ force: true });
              },
            },
          );
          setBulkEditState((prev) => ({
            ...prev,
            pendingChanges: new Map(),
            errors: new Map(),
          }));
        }
      } finally {
        setBulkEditState((prev) => ({ ...prev, isEditing: false }));
      }
    },
    [
      gridApi,
      bulkEditState.selectedRows,
      bulkEditState.pendingChanges,
      resource,
      onCellEdit,
    ],
  );

  const handleBulkEditCancel = useCallback(() => {
    setBulkEditState((prev) => ({
      ...prev,
      pendingChanges: new Map(),
      errors: new Map(),
    }));
    gridApi?.refreshCells({ force: true });
  }, [gridApi]);

  useEffect(() => {
    const handleResize = () => {
      gridApi?.sizeColumnsToFit();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {error && (
        <div
          style={{
            padding: "8px",
            marginBottom: "8px",
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "4px",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}
      {bulkEditState.selectedRows.length > 0 && (
        <div
          style={{
            padding: "8px",
            marginBottom: "8px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {bulkEditState.selectedRows.length} rows selected
          </span>
          {bulkEditState.pendingChanges.size > 0 && (
            <>
              <button
                onClick={handleBulkEditCancel}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel Changes
              </button>
              <button
                onClick={() => {
                  for (const [rowId, changes] of bulkEditState.pendingChanges) {
                    for (const [field, value] of changes) {
                      handleBulkEdit(field, value);
                    }
                  }
                }}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Apply Changes
              </button>
            </>
          )}
        </div>
      )}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          opacity: isEditing || bulkEditState.isEditing ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <AgGridReact
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            filter: true,
            sortable: true,
            resizable: true,
            minWidth: 100,
            editable: true,
            cellClass: "editable-cell",
          }}
          getRowId={(params) =>
            params.data.id?.toString() || params.data.id?.toString()
          }
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          onSelectionChanged={onSelectionChanged}
          rowSelection="multiple"
          enableCellTextSelection
          ensureDomOrder
          suppressRowClickSelection
          stopEditingWhenCellsLoseFocus
          undoRedoCellEditing
          undoRedoCellEditingLimit={20}
          suppressModelUpdateAfterUpdateTransaction
        />
      </div>
    </div>
  );
};

function getColumnType(sqlType: string): string {
  switch (sqlType.toUpperCase()) {
    case "INTEGER":
      return "numericColumn";
    case "REAL":
      return "numericColumn";
    case "BOOLEAN":
      return "booleanColumn";
    case "DATE":
      return "dateColumn";
    default:
      return "textColumn";
  }
}

function getCellEditor(sqlType: string): string | undefined {
  switch (sqlType.toUpperCase()) {
    case "BOOLEAN":
      return "agSelectCellEditor";
    case "DATE":
      return "agDatePickerCellEditor";
    default:
      return undefined;
  }
}

function getCellEditorParams(sqlType: string): any {
  switch (sqlType.toUpperCase()) {
    case "BOOLEAN":
      return { values: [true, false] };
    case "DATE":
      return { browserDatePicker: true };
    default:
      return undefined;
  }
}

function getValueFormatter(
  sqlType: string,
): ((params: any) => string) | undefined {
  switch (sqlType.toUpperCase()) {
    case "DATE":
      return (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "";
    case "BOOLEAN":
      return (params) => (params.value ? "Yes" : "No");
    default:
      return undefined;
  }
}

function getValueParser(sqlType: string): ((params: any) => any) | undefined {
  switch (sqlType.toUpperCase()) {
    case "DATE":
      return (params) => {
        if (!params.newValue) return null;
        const date = new Date(params.newValue);
        return date.toISOString().split("T")[0];
      };
    case "BOOLEAN":
      return (params) => {
        if (typeof params.newValue === "string")
          return params.newValue.toLowerCase() === "yes";
        return params.newValue;
      };
    default:
      return undefined;
  }
}

export default AGGridTable;

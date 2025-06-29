"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  ColDef as AgGridColDef
} from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { TableManager } from "../utils/tableManager";
import { TransactionManager } from "../utils/transactionManager";
import { useMedDB } from "@/lib/client";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTableProps {
  resource: string;
  rowData: any[];
  onCellEdit: (rowId: any, col: string, newValue: any) => void;
  onError?: (error: string | null) => void;
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

const AGGridTable: React.FC<AGGridTableProps> = ({ resource, rowData, onCellEdit, onError }) => {
  const db = useMedDB();
  const [columnDefs, setColumnDefs] = useState<CustomColDef[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bulkEditState, setBulkEditState] = useState<BulkEditState>({
    isEditing: false,
    selectedRows: [],
    pendingChanges: new Map(),
    errors: new Map()
  });

  const tableManager = useRef(new TableManager(db));
  const transactionManager = useRef(new TransactionManager(db));

  // Load and validate schema
  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const cols = await tableManager.current.getTableSchema("patients");
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
            if (colDef.field === 'rowid') {
              return { backgroundColor: '#f5f5f5' };
            }
            // Highlight cells with pending changes
            const rowId = params.data.rowid?.toString() || params.data.id?.toString();
            if (rowId && bulkEditState.pendingChanges.has(rowId)) {
              const colChanges = bulkEditState.pendingChanges.get(rowId);
              if (colChanges?.has(colDef.field)) {
                return { backgroundColor: '#fff3cd' };
              }
            }
            // Highlight cells with errors
            if (rowId && bulkEditState.errors.has(`${rowId}_${colDef.field}`)) {
              return { backgroundColor: '#f8d7da' };
            }
            return null;
          },
          tooltipValueGetter: (params: ITooltipParams) => {
            const colDef = params.colDef as CustomColDef;
            const rowId = params.data.rowid?.toString() || params.data.id?.toString();
            if (rowId && bulkEditState.errors.has(`${rowId}_${colDef.field}`)) {
              return bulkEditState.errors.get(`${rowId}_${colDef.field}`);
            }
            return null;
          }
        }));
        setColumnDefs(newColumnDefs);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        onError?.(errorMessage);
      }
    })();
  }, [db, resource, bulkEditState.pendingChanges, bulkEditState.errors]);

  // Force grid refresh when rowData changes
  useEffect(() => {
    if (gridApi) {
      console.log('Refreshing grid with new data:', rowData);
      // Use setGridOption to update row data
      gridApi.setGridOption('rowData', rowData);
    }
  }, [rowData, gridApi]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    setBulkEditState(prev => ({
      ...prev,
      selectedRows: event.api.getSelectedNodes()
    }));
  }, []);

  const onCellValueChanged = useCallback(async (event: CellValueChangedEvent) => {
    if (!event.colDef.field) return;

    setIsEditing(true);
    setError(null);

    try {
      // Validate the new value before proceeding
      await tableManager.current.validateData(resource, {
        [event.colDef.field]: event.newValue
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
            // Refresh the grid to show the original value
            gridApi?.refreshCells({ force: true });
          },
          onRollback: () => {
            // Refresh the grid to show the original value
            gridApi?.refreshCells({ force: true });
          }
        }
      );
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      onError?.(errorMessage);
      gridApi?.refreshCells({ force: true });
    } finally {
      setIsEditing(false);
    }
  }, [gridApi, onCellEdit, resource]);

  const handleBulkEdit = useCallback(async (field: string, value: any) => {
    if (!gridApi || bulkEditState.selectedRows.length === 0) return;

    setBulkEditState(prev => ({
      ...prev,
      isEditing: true,
      errors: new Map()
    }));

    try {
      // Validate all changes first
      const validationPromises = bulkEditState.selectedRows.map(async (node) => {
        const rowId = node.data.rowid?.toString() || node.data.id?.toString();
        if (!rowId) return;

        try {
          await tableManager.current.validateData(resource, {
            [field]: value
          });

          // Store the pending change
          setBulkEditState(prev => {
            const newPendingChanges = new Map(prev.pendingChanges);
            const rowChanges = newPendingChanges.get(rowId) || new Map();
            rowChanges.set(field, value);
            newPendingChanges.set(rowId, rowChanges);
            return {
              ...prev,
              pendingChanges: newPendingChanges
            };
          });
        } catch (err) {
          const error = err as Error;
          setBulkEditState(prev => {
            const newErrors = new Map(prev.errors);
            newErrors.set(`${rowId}_${field}`, error.message);
            return {
              ...prev,
              errors: newErrors
            };
          });
        }
      });

      await Promise.all(validationPromises);

      // If there are no errors, apply all changes in a transaction
      if (bulkEditState.errors.size === 0) {
        await transactionManager.current.executeInTransaction(
          async () => {
            for (const [rowId, changes] of Array.from(bulkEditState.pendingChanges)) {
              for (const [field, value] of Array.from(changes)) {
                await onCellEdit(rowId, field, value);
              }
            }
          },
          {
            onError: (err) => {
              const errorMessage = err.message;
              setError(errorMessage);
              onError?.(errorMessage);
              // Refresh the grid to show the original values
              gridApi.refreshCells({ force: true });
            },
            onRollback: () => {
              // Refresh the grid to show the original values
              gridApi.refreshCells({ force: true });
            }
          }
        );

        // Clear pending changes after successful commit
        setBulkEditState(prev => ({
          ...prev,
          pendingChanges: new Map(),
          errors: new Map()
        }));
      }
    } finally {
      setBulkEditState(prev => ({
        ...prev,
        isEditing: false
      }));
    }
  }, [gridApi, bulkEditState.selectedRows, bulkEditState.pendingChanges, resource, onCellEdit]);

  const handleBulkEditCancel = useCallback(() => {
    setBulkEditState(prev => ({
      ...prev,
      pendingChanges: new Map(),
      errors: new Map()
    }));
    gridApi?.refreshCells({ force: true });
  }, [gridApi]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      gridApi?.sizeColumnsToFit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridApi]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {error && (
        <div style={{ 
          padding: "8px", 
          marginBottom: "8px", 
          backgroundColor: "#fee2e2", 
          border: "1px solid #ef4444",
          borderRadius: "4px",
          color: "#991b1b"
        }}>
          {error}
        </div>
      )}
      {bulkEditState.selectedRows.length > 0 && (
        <div style={{
          padding: "8px",
          marginBottom: "8px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
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
                  cursor: "pointer"
                }}
              >
                Cancel Changes
              </button>
              <button
                onClick={() => {
                  // Apply all pending changes
                  for (const [rowId, changes] of Array.from(bulkEditState.pendingChanges)) {
                    for (const [field, value] of Array.from(changes)) {
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
                  cursor: "pointer"
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
          transition: "opacity 0.2s"
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
            cellClass: 'editable-cell'
          }}
          getRowId={(params) => params.data.patient_id?.toString() || params.data.procedure_id?.toString()}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          onSelectionChanged={onSelectionChanged}
          rowSelection="multiple"
          enableCellTextSelection={true}
          ensureDomOrder={true}
          suppressRowClickSelection={true}
          stopEditingWhenCellsLoseFocus={true}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          suppressModelUpdateAfterUpdateTransaction={true}
        />
      </div>
    </div>
  );
};

// Helper functions for column configuration
function getColumnType(sqlType: string): string {
  switch (sqlType.toUpperCase()) {
    case 'INTEGER':
      return 'numericColumn';
    case 'REAL':
      return 'numericColumn';
    case 'BOOLEAN':
      return 'booleanColumn';
    case 'DATE':
      return 'dateColumn';
    default:
      return 'textColumn';
  }
}

function getCellEditor(sqlType: string): string | undefined {
  switch (sqlType.toUpperCase()) {
    case 'BOOLEAN':
      return 'agSelectCellEditor';
    case 'DATE':
      return 'agDatePickerCellEditor';
    default:
      return undefined;
  }
}

function getCellEditorParams(sqlType: string): any {
  switch (sqlType.toUpperCase()) {
    case 'BOOLEAN':
      return {
        values: [true, false]
      };
    case 'DATE':
      return {
        browserDatePicker: true
      };
    default:
      return undefined;
  }
}

function getValueFormatter(sqlType: string): ((params: any) => string) | undefined {
  switch (sqlType.toUpperCase()) {
    case 'DATE':
      return (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString();
      };
    case 'BOOLEAN':
      return (params) => params.value ? 'Yes' : 'No';
    default:
      return undefined;
  }
}

function getValueParser(sqlType: string): ((params: any) => any) | undefined {
  switch (sqlType.toUpperCase()) {
    case 'DATE':
      return (params) => {
        if (!params.newValue) return null;
        const date = new Date(params.newValue);
        return date.toISOString().split('T')[0];
      };
    case 'BOOLEAN':
      return (params) => {
        if (typeof params.newValue === 'string') {
          return params.newValue.toLowerCase() === 'yes';
        }
        return params.newValue;
      };
    default:
      return undefined;
  }
}

export default AGGridTable; 
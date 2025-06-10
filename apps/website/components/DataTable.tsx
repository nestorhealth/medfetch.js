import { Table, Callout } from "nextra/components";

export function DataTable<TData extends Record<string, any>>({
  data,
  columns,
  isPending,
}: {
  data?: TData[];
  columns: (keyof TData & string)[];
  isPending: boolean;
}) {
  return (
    <Table className="min-w-full w-full table-auto">
      <thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={col}>{col}</Table.Th>
          ))}
        </Table.Tr>
      </thead>
      <tbody>
        {isPending ? (
          <Table.Tr>
            <Table.Td
              colSpan={columns.length}
              className="text-center py-4 text-muted-foreground"
            >
              Loading...
            </Table.Td>
          </Table.Tr>
        ) : !data || data.length === 0 ? (
          <Table.Tr>
            <Table.Td
              colSpan={columns.length}
              className="text-center py-4 text-muted-foreground"
            >
              <Callout type="info">No result yet: hit the Run button!</Callout>
            </Table.Td>
          </Table.Tr>
        ) : (
          data.map((row, idx) => (
            <Table.Tr key={idx}>
              {columns.map((col) => (
                <Table.Td key={col} className="px-2 py-1 border-b">
                  {row[col] ?? <span className="text-muted-foreground">—</span>}
                </Table.Td>
              ))}
            </Table.Tr>
          ))
        )}
      </tbody>
    </Table>
  );
}


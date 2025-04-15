"use client";

import { Callout, Table } from "nextra/components";
import { Row1 } from "./RunExampleWrapper";

export function DataTable({
    data,
    isPending,
}: {
    data?: Row1[];
    isPending: boolean;
}) {
    return (
        <Table className="flex-1">
            <thead>
                <Table.Tr>
                    <Table.Th>id</Table.Th>
                    <Table.Th>name</Table.Th>
                    <Table.Th>birth_date</Table.Th>
                </Table.Tr>
            </thead>
            <tbody>
                {isPending ? (
                    <Table.Tr>
                        <Table.Td
                            colSpan={3}
                            className="text-center py-4 text-muted-foreground"
                        >
                            Loading...
                        </Table.Td>
                    </Table.Tr>
                ) : !data || data.length === 0 ? (
                    <Table.Tr>
                        <Table.Td
                            colSpan={3}
                            className="text-center py-4 text-muted-foreground"
                        >
                            <Callout type="info">
                                No result yet: hit the Run button!
                            </Callout>
                        </Table.Td>
                    </Table.Tr>
                ) : (
                    data.map((row, idx) => (
                        <Table.Tr key={idx}>
                            <Table.Td className="px-2 py-1 border-b">
                                {row.id}
                            </Table.Td>
                            <Table.Td className="px-2 py-1 border-b">
                                {row.name}
                            </Table.Td>
                            <Table.Td className="px-2 py-1 border-b">
                                {row.birth_date}
                            </Table.Td>
                        </Table.Tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}

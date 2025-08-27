import {
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
} from "@tanstack/react-table";

export function useTable<D>({
	data,
	columns,
}: { data: Array<D>; columns: Array<ColumnDef<D, any>> }) {
	return useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
	});
}

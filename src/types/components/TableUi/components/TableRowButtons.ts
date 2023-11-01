export type TTableRowButtonsProps = {
    onEdit: (rowIndex: number) => void;
    onDelete: (rowIndex: number) => void;
    rowIndex: number;
}

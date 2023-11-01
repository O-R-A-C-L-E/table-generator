import {ComponentProps, FC, ReactNode} from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TColumnBodyTemplate = ReactNode | ((rowData:any, rowIndex: number) => ReactNode);
export interface IColumnProps extends ComponentProps<'th'> {
    field?:string;
    header?:string;
    body?: TColumnBodyTemplate
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Column:FC<IColumnProps> = ({header, body, field, className, ...rest}) => {
    return <th data-field={field || ''} className={`b-table__cell b-table__head__cell ${className || ''}`} {...rest}>{header}</th>
};

export default Column;

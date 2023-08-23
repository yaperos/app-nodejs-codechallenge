import { TextField } from "@mui/material";
import React from "react";
import { HeaderText } from ".";
import { IPermissionTypes } from "../../types/permissionTypes/PermissionTypes";

type SelectTypesProps = {
  typesPermission: IPermissionTypes[] | undefined;
  typePermit: number;
  setTypePermit: (typePermit: number) => void;
};
const SelectTypes: React.FC<SelectTypesProps> = ({
  typesPermission,
  typePermit,
  setTypePermit,
}) => {
  return (
    <TextField
      fullWidth
      style={{ width: 200 }}
      size="small"
      id="outlined-select-currency-native"
      select
      onChange={(e) => setTypePermit(Number(e.target.value))}
      label={
        <HeaderText fontFamily="Montserrat-Regular" label="Tipo de Permiso" />
      }
      defaultValue={typePermit}
      SelectProps={{
        native: true,
      }}
    >
      <option value={0}>-- seleccionar</option>
      {typesPermission?.map((option) => (
        <option key={option.id} value={option.id}>
          {option.description}
        </option>
      ))}
    </TextField>
  );
};

export default SelectTypes;

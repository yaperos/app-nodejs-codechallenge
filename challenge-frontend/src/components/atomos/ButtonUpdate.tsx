import { Button, CircularProgress } from "@mui/material";
import React from "react";

type UpdateButtonProps = {
  isLoading: boolean;
  updatePermission: () => void;
  label: string;
};
const ButtonUpdate: React.FC<UpdateButtonProps> = ({
  isLoading,
  updatePermission,
  label,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={updatePermission}
      style={{ fontSize: 11 }}
    >
      {isLoading ? (
        <>
          <CircularProgress size={20} color="inherit" />
          &nbsp;&nbsp;&nbsp;Procesando . .
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default ButtonUpdate;
